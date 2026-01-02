-- The demo_request_limits table is intentionally accessed only via the SECURITY DEFINER function
-- Add a dummy policy to satisfy the linter (the table doesn't need direct access)
CREATE POLICY "No direct access to rate limit table"
ON public.demo_request_limits
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);