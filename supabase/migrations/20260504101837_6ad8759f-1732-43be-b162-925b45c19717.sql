-- Create public bucket for listing images (hotels, activities, flights)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Listing images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Only admins can upload/update/delete
CREATE POLICY "Admins can upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update listing images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'listing-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete listing images"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-images' AND public.has_role(auth.uid(), 'admin'::app_role));