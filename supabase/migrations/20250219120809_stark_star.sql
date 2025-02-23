-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view products" ON products;
  DROP POLICY IF EXISTS "Only admins can modify products" ON products;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies for products table
CREATE POLICY "products_read_policy"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "products_insert_policy"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "products_update_policy"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "products_delete_policy"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;