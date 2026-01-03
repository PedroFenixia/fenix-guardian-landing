-- Add CHECK constraints to demo_requests table for defense-in-depth
ALTER TABLE public.demo_requests 
  ADD CONSTRAINT name_length CHECK (length(name) <= 100 AND length(name) > 0),
  ADD CONSTRAINT email_length CHECK (length(email) <= 255 AND length(email) > 0),
  ADD CONSTRAINT email_format CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  ADD CONSTRAINT company_length CHECK (length(company) <= 200),
  ADD CONSTRAINT message_length CHECK (length(message) <= 2000 AND length(message) > 0);

-- Add explicit deny policy for anonymous users on user_roles
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);