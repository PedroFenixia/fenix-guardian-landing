-- Create detailed visit tracking table
CREATE TABLE public.page_visit_details (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    language TEXT,
    is_exit BOOLEAN DEFAULT false,
    time_on_page INTEGER, -- seconds spent on page
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    exited_at TIMESTAMP WITH TIME ZONE
);

-- Create index for common queries
CREATE INDEX idx_page_visit_details_session ON public.page_visit_details(session_id);
CREATE INDEX idx_page_visit_details_page ON public.page_visit_details(page_path);
CREATE INDEX idx_page_visit_details_visited ON public.page_visit_details(visited_at DESC);
CREATE INDEX idx_page_visit_details_utm ON public.page_visit_details(utm_source, utm_medium, utm_campaign);

-- Enable Row Level Security
ALTER TABLE public.page_visit_details ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy - no direct access (only via function)
CREATE POLICY "No direct access to page_visit_details"
ON public.page_visit_details
FOR ALL
USING (false)
WITH CHECK (false);

-- Function to track detailed page visit
CREATE OR REPLACE FUNCTION public.track_detailed_visit(
    p_session_id TEXT,
    p_page_path TEXT,
    p_referrer TEXT DEFAULT NULL,
    p_utm_source TEXT DEFAULT NULL,
    p_utm_medium TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_utm_term TEXT DEFAULT NULL,
    p_utm_content TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_screen_width INTEGER DEFAULT NULL,
    p_screen_height INTEGER DEFAULT NULL,
    p_language TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.page_visit_details (
        session_id, page_path, referrer,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        user_agent, screen_width, screen_height, language
    )
    VALUES (
        p_session_id, p_page_path, p_referrer,
        p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content,
        p_user_agent, p_screen_width, p_screen_height, p_language
    )
    RETURNING id INTO new_id;
    
    -- Also update the simple counter
    PERFORM public.track_page_visit(p_page_path);
    
    RETURN new_id;
END;
$$;

-- Function to mark exit and time on page
CREATE OR REPLACE FUNCTION public.track_page_exit(
    p_visit_id UUID,
    p_time_on_page INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.page_visit_details
    SET is_exit = true,
        time_on_page = p_time_on_page,
        exited_at = now()
    WHERE id = p_visit_id;
END;
$$;

-- Function to get analytics summary (admins only)
CREATE OR REPLACE FUNCTION public.get_analytics_summary(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT now() - interval '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Only allow admins
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    SELECT jsonb_build_object(
        'total_visits', (
            SELECT COUNT(*) FROM page_visit_details 
            WHERE visited_at BETWEEN p_start_date AND p_end_date
        ),
        'unique_sessions', (
            SELECT COUNT(DISTINCT session_id) FROM page_visit_details 
            WHERE visited_at BETWEEN p_start_date AND p_end_date
        ),
        'avg_time_on_page', (
            SELECT COALESCE(AVG(time_on_page), 0)::INTEGER FROM page_visit_details 
            WHERE visited_at BETWEEN p_start_date AND p_end_date AND time_on_page IS NOT NULL
        ),
        'top_pages', (
            SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
                SELECT page_path, COUNT(*) as visits
                FROM page_visit_details 
                WHERE visited_at BETWEEN p_start_date AND p_end_date
                GROUP BY page_path ORDER BY visits DESC LIMIT 10
            ) t
        ),
        'top_referrers', (
            SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
                SELECT referrer, COUNT(*) as visits
                FROM page_visit_details 
                WHERE visited_at BETWEEN p_start_date AND p_end_date AND referrer IS NOT NULL AND referrer != ''
                GROUP BY referrer ORDER BY visits DESC LIMIT 10
            ) t
        ),
        'utm_sources', (
            SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
                SELECT utm_source, COUNT(*) as visits
                FROM page_visit_details 
                WHERE visited_at BETWEEN p_start_date AND p_end_date AND utm_source IS NOT NULL
                GROUP BY utm_source ORDER BY visits DESC LIMIT 10
            ) t
        ),
        'utm_campaigns', (
            SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
                SELECT utm_campaign, COUNT(*) as visits
                FROM page_visit_details 
                WHERE visited_at BETWEEN p_start_date AND p_end_date AND utm_campaign IS NOT NULL
                GROUP BY utm_campaign ORDER BY visits DESC LIMIT 10
            ) t
        ),
        'exit_pages', (
            SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
                SELECT page_path, COUNT(*) as exits
                FROM page_visit_details 
                WHERE visited_at BETWEEN p_start_date AND p_end_date AND is_exit = true
                GROUP BY page_path ORDER BY exits DESC LIMIT 10
            ) t
        ),
        'visits_by_day', (
            SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
                SELECT DATE(visited_at) as date, COUNT(*) as visits
                FROM page_visit_details 
                WHERE visited_at BETWEEN p_start_date AND p_end_date
                GROUP BY DATE(visited_at) ORDER BY date DESC LIMIT 30
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$;