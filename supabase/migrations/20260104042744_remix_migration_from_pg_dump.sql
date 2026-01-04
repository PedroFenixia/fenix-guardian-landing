CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: check_demo_request_rate_limit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_demo_request_rate_limit() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: check_edge_function_rate_limit(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_edge_function_rate_limit(p_ip_address text, p_function_name text, p_max_requests integer DEFAULT 20, p_window_hours integer DEFAULT 1) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: get_analytics_summary(timestamp with time zone, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_summary(p_start_date timestamp with time zone DEFAULT (now() - '30 days'::interval), p_end_date timestamp with time zone DEFAULT now()) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: get_page_visit_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_page_visit_stats() RETURNS TABLE(page_path text, visit_count integer, first_visit_at timestamp with time zone, last_visit_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: track_detailed_visit(text, text, text, text, text, text, text, text, text, integer, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.track_detailed_visit(p_session_id text, p_page_path text, p_referrer text DEFAULT NULL::text, p_utm_source text DEFAULT NULL::text, p_utm_medium text DEFAULT NULL::text, p_utm_campaign text DEFAULT NULL::text, p_utm_term text DEFAULT NULL::text, p_utm_content text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text, p_screen_width integer DEFAULT NULL::integer, p_screen_height integer DEFAULT NULL::integer, p_language text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: track_page_exit(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.track_page_exit(p_visit_id uuid, p_time_on_page integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    UPDATE public.page_visit_details
    SET is_exit = true,
        time_on_page = p_time_on_page,
        exited_at = now()
    WHERE id = p_visit_id;
END;
$$;


--
-- Name: track_page_visit(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.track_page_visit(p_page_path text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


SET default_table_access_method = heap;

--
-- Name: demo_request_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_request_limits (
    ip_address text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now()
);


--
-- Name: demo_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    company text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    CONSTRAINT company_length CHECK ((length(company) <= 200)),
    CONSTRAINT email_format CHECK ((email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'::text)),
    CONSTRAINT email_length CHECK (((length(email) <= 255) AND (length(email) > 0))),
    CONSTRAINT message_length CHECK (((length(message) <= 2000) AND (length(message) > 0))),
    CONSTRAINT name_length CHECK (((length(name) <= 100) AND (length(name) > 0)))
);


--
-- Name: edge_function_rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edge_function_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip_address text NOT NULL,
    function_name text NOT NULL,
    request_count integer DEFAULT 1 NOT NULL,
    window_start timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: page_visit_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_visit_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    page_path text NOT NULL,
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_term text,
    utm_content text,
    user_agent text,
    screen_width integer,
    screen_height integer,
    language text,
    is_exit boolean DEFAULT false,
    time_on_page integer,
    visited_at timestamp with time zone DEFAULT now() NOT NULL,
    exited_at timestamp with time zone
);


--
-- Name: page_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_path text NOT NULL,
    visit_count integer DEFAULT 0 NOT NULL,
    first_visit_at timestamp with time zone DEFAULT now() NOT NULL,
    last_visit_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: demo_request_limits demo_request_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_request_limits
    ADD CONSTRAINT demo_request_limits_pkey PRIMARY KEY (ip_address);


--
-- Name: demo_requests demo_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);


--
-- Name: edge_function_rate_limits edge_function_rate_limits_ip_address_function_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edge_function_rate_limits
    ADD CONSTRAINT edge_function_rate_limits_ip_address_function_name_key UNIQUE (ip_address, function_name);


--
-- Name: edge_function_rate_limits edge_function_rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edge_function_rate_limits
    ADD CONSTRAINT edge_function_rate_limits_pkey PRIMARY KEY (id);


--
-- Name: page_visit_details page_visit_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visit_details
    ADD CONSTRAINT page_visit_details_pkey PRIMARY KEY (id);


--
-- Name: page_visits page_visits_page_path_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visits
    ADD CONSTRAINT page_visits_page_path_key UNIQUE (page_path);


--
-- Name: page_visits page_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visits
    ADD CONSTRAINT page_visits_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_demo_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_created_at ON public.demo_requests USING btree (created_at DESC);


--
-- Name: idx_demo_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_status ON public.demo_requests USING btree (status);


--
-- Name: idx_page_visit_details_page; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_visit_details_page ON public.page_visit_details USING btree (page_path);


--
-- Name: idx_page_visit_details_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_visit_details_session ON public.page_visit_details USING btree (session_id);


--
-- Name: idx_page_visit_details_utm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_visit_details_utm ON public.page_visit_details USING btree (utm_source, utm_medium, utm_campaign);


--
-- Name: idx_page_visit_details_visited; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_visit_details_visited ON public.page_visit_details USING btree (visited_at DESC);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Deny anonymous access to user_roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Deny anonymous access to user_roles" ON public.user_roles FOR SELECT TO anon USING (false);


--
-- Name: edge_function_rate_limits No direct access to edge rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No direct access to edge rate limits" ON public.edge_function_rate_limits AS RESTRICTIVE USING (false) WITH CHECK (false);


--
-- Name: page_visit_details No direct access to page_visit_details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No direct access to page_visit_details" ON public.page_visit_details USING (false) WITH CHECK (false);


--
-- Name: page_visits No direct access to page_visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No direct access to page_visits" ON public.page_visits USING (false) WITH CHECK (false);


--
-- Name: demo_request_limits No direct access to rate limit table; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No direct access to rate limit table" ON public.demo_request_limits TO authenticated, anon USING (false) WITH CHECK (false);


--
-- Name: demo_requests Only admins can delete demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can delete demo requests" ON public.demo_requests FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_requests Only admins can update demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can update demo requests" ON public.demo_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_requests Only admins can view demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can view demo requests" ON public.demo_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: demo_requests Rate limited demo request submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Rate limited demo request submissions" ON public.demo_requests FOR INSERT TO authenticated, anon WITH CHECK (public.check_demo_request_rate_limit());


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: demo_request_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_request_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: edge_function_rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.edge_function_rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: page_visit_details; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_visit_details ENABLE ROW LEVEL SECURITY;

--
-- Name: page_visits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;