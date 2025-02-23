-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "products_read_policy" ON products;
  DROP POLICY IF EXISTS "products_admin_policy" ON products;
  DROP POLICY IF EXISTS "products_insert_policy" ON products;
  DROP POLICY IF EXISTS "products_update_policy" ON products;
  DROP POLICY IF EXISTS "products_delete_policy" ON products;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy for public read access
CREATE POLICY "products_read_policy"
ON products
FOR SELECT
TO authenticated, anon
USING (true);

-- Create a policy for admin operations
CREATE POLICY "products_admin_policy"
ON products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'superadmin@posspole.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'superadmin@posspole.com'
  )
);

-- Grant necessary permissions
GRANT SELECT ON products TO anon;
GRANT ALL ON products TO authenticated;