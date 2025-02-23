/*
  # Admin Policies Setup
  
  This migration ensures proper admin policies are in place for the products and RFQ requests tables.
  No user creation is performed since the admin user already exists.

  1. Security
    - Adds admin-specific policies for products table
    - Adds admin-specific policies for RFQ requests table
*/

-- Ensure admin policies are in place
DO $$
BEGIN
  -- Products table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Only admins can modify products'
  ) THEN
    CREATE POLICY "Only admins can modify products"
      ON products
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;

  -- RFQ requests table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'rfq_requests' AND policyname = 'Admins can manage all RFQ requests'
  ) THEN
    CREATE POLICY "Admins can manage all RFQ requests"
      ON rfq_requests
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;