-- Create table for demo requests
CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert demo requests (public form)
CREATE POLICY "Anyone can submit demo requests"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view demo requests (for admin review)
CREATE POLICY "Authenticated users can view demo requests"
ON public.demo_requests
FOR SELECT
TO authenticated
USING (true);

-- Add index for faster queries by status and date
CREATE INDEX idx_demo_requests_status ON public.demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON public.demo_requests(created_at DESC);