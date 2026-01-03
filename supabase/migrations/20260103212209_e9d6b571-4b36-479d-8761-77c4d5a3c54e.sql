-- Create table to track page visits
CREATE TABLE public.page_visits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    visit_count INTEGER NOT NULL DEFAULT 0,
    first_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(page_path)
);

-- Enable Row Level Security
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy - no direct access (only via function)
CREATE POLICY "No direct access to page_visits"
ON public.page_visits
FOR ALL
USING (false)
WITH CHECK (false);

-- Create function to increment visit count (SECURITY DEFINER to bypass RLS)
CREATE OR REPLACE FUNCTION public.track_page_visit(p_page_path TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Upsert: increment if exists, insert if not
    INSERT INTO public.page_visits (page_path, visit_count, first_visit_at, last_visit_at)
    VALUES (p_page_path, 1, now(), now())
    ON CONFLICT (page_path)
    DO UPDATE SET 
        visit_count = page_visits.visit_count + 1,
        last_visit_at = now()
    RETURNING jsonb_build_object(
        'page_path', page_path,
        'visit_count', visit_count,
        'last_visit_at', last_visit_at
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Create function to get visit stats (for admins only)
CREATE OR REPLACE FUNCTION public.get_page_visit_stats()
RETURNS TABLE (
    page_path TEXT,
    visit_count INTEGER,
    first_visit_at TIMESTAMP WITH TIME ZONE,
    last_visit_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow admins to view stats
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    RETURN QUERY
    SELECT pv.page_path, pv.visit_count, pv.first_visit_at, pv.last_visit_at
    FROM public.page_visits pv
    ORDER BY pv.visit_count DESC;
END;
$$;