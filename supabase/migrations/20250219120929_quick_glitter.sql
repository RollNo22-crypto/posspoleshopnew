-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "products_read_policy" ON products;
  DROP POLICY IF EXISTS "products_insert_policy" ON products;
  DROP POLICY IF EXISTS "products_update_policy" ON products;
  DROP POLICY IF EXISTS "products_delete_policy" ON products;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies for products table
CREATE POLICY "products_read_policy"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "products_admin_policy"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;