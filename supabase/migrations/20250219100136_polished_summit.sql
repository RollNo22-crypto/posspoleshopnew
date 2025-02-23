/*
  # Storage Configuration for Product Images

  1. Storage Setup
    - Create product images bucket
    - Configure public access
    - Set up storage policies for authenticated users
*/

-- Create storage bucket for product images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'product-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('product-images', 'product-images', true);
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Public Access" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update own images" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects';
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner);