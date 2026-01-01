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



SET default_table_access_method = heap;

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
    status text DEFAULT 'pending'::text NOT NULL
);


--
-- Name: demo_requests demo_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);


--
-- Name: idx_demo_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_created_at ON public.demo_requests USING btree (created_at DESC);


--
-- Name: idx_demo_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_demo_requests_status ON public.demo_requests USING btree (status);


--
-- Name: demo_requests Anyone can submit demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit demo requests" ON public.demo_requests FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: demo_requests Authenticated users can view demo requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view demo requests" ON public.demo_requests FOR SELECT TO authenticated USING (true);


--
-- Name: demo_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;