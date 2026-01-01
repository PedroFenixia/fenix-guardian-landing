-- Add admin-only UPDATE policy for demo_requests
CREATE POLICY "Only admins can update demo requests"
ON public.demo_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin-only DELETE policy for demo_requests
CREATE POLICY "Only admins can delete demo requests"
ON public.demo_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));