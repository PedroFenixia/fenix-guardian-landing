-- Create public bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to brand assets
CREATE POLICY "Public can view brand assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'brand-assets');

-- Allow authenticated users to upload brand assets
CREATE POLICY "Authenticated users can upload brand assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');