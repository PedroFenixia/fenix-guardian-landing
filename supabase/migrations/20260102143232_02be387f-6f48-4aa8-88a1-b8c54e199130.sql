-- Create a rate limit table for edge functions (chat assistant)
CREATE TABLE public.edge_function_rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address text NOT NULL,
    function_name text NOT NULL,
    request_count integer NOT NULL DEFAULT 1,
    window_start timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(ip_address, function_name)
);

-- Enable RLS
ALTER TABLE public.edge_function_rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct access - only through SECURITY DEFINER function
CREATE POLICY "No direct access to edge rate limits"
ON public.edge_function_rate_limits
AS RESTRICTIVE
FOR ALL
USING (false)
WITH CHECK (false);

-- Create a SECURITY DEFINER function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_edge_function_rate_limit(
    p_ip_address text,
    p_function_name text,
    p_max_requests integer DEFAULT 20,
    p_window_hours integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count integer;
    window_start_time timestamp with time zone;
    window_duration interval;
BEGIN
    window_duration := (p_window_hours || ' hours')::interval;
    
    -- Get current rate limit record
    SELECT request_count, window_start 
    INTO current_count, window_start_time
    FROM public.edge_function_rate_limits
    WHERE ip_address = p_ip_address AND function_name = p_function_name;
    
    -- If no record or window expired, reset
    IF current_count IS NULL OR window_start_time < NOW() - window_duration THEN
        INSERT INTO public.edge_function_rate_limits (ip_address, function_name, request_count, window_start)
        VALUES (p_ip_address, p_function_name, 1, NOW())
        ON CONFLICT (ip_address, function_name) 
        DO UPDATE SET request_count = 1, window_start = NOW();
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', p_max_requests - 1,
            'reset_in_seconds', EXTRACT(EPOCH FROM window_duration)::integer
        );
    END IF;
    
    -- Check if limit exceeded
    IF current_count >= p_max_requests THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'remaining', 0,
            'reset_in_seconds', EXTRACT(EPOCH FROM (window_start_time + window_duration - NOW()))::integer
        );
    END IF;
    
    -- Increment counter
    UPDATE public.edge_function_rate_limits
    SET request_count = request_count + 1
    WHERE ip_address = p_ip_address AND function_name = p_function_name;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'remaining', p_max_requests - current_count - 1,
        'reset_in_seconds', EXTRACT(EPOCH FROM (window_start_time + window_duration - NOW()))::integer
    );
END;
$$;

-- Grant execute permission for anon role (needed for public edge functions)
GRANT EXECUTE ON FUNCTION public.check_edge_function_rate_limit(text, text, integer, integer) TO anon;