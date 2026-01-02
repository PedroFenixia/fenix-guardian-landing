-- Add explicit admin-only write policies for assets storage bucket (defense in depth)
CREATE POLICY "Only admins can upload assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assets' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can update assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'assets' AND
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'assets' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admins can delete assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'assets' AND
  public.has_role(auth.uid(), 'admin')
);

-- Create rate limiting table for demo requests
CREATE TABLE IF NOT EXISTS public.demo_request_limits (
  ip_address TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limit table (but allow public access for the function)
ALTER TABLE public.demo_request_limits ENABLE ROW LEVEL SECURITY;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_demo_request_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_ip TEXT;
  current_count INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get client IP from request headers (set by PostgREST)
  BEGIN
    client_ip := current_setting('request.headers', true)::json->>'x-forwarded-for';
  EXCEPTION WHEN OTHERS THEN
    client_ip := NULL;
  END;
  
  -- If no IP, allow (shouldn't happen in production)
  IF client_ip IS NULL OR client_ip = '' THEN
    RETURN TRUE;
  END IF;
  
  -- Check current rate limit
  SELECT request_count, window_start 
  INTO current_count, window_start_time
  FROM public.demo_request_limits
  WHERE ip_address = client_ip;
  
  -- If no record or window expired (1 hour), reset
  IF current_count IS NULL OR window_start_time < NOW() - INTERVAL '1 hour' THEN
    INSERT INTO public.demo_request_limits (ip_address, request_count, window_start)
    VALUES (client_ip, 1, NOW())
    ON CONFLICT (ip_address) 
    DO UPDATE SET request_count = 1, window_start = NOW();
    RETURN TRUE;
  END IF;
  
  -- Check if limit exceeded (10 per hour)
  IF current_count >= 10 THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE public.demo_request_limits
  SET request_count = request_count + 1
  WHERE ip_address = client_ip;
  
  RETURN TRUE;
END;
$$;

-- Drop old policy and create rate-limited version
DROP POLICY IF EXISTS "Anyone can submit demo requests" ON public.demo_requests;

CREATE POLICY "Rate limited demo request submissions"
ON public.demo_requests
FOR INSERT
TO authenticated, anon
WITH CHECK (public.check_demo_request_rate_limit());