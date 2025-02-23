-- Make user_id nullable in user_details table
ALTER TABLE user_details
ALTER COLUMN user_id DROP NOT NULL;

-- Add email column to user_details if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_details'
    AND column_name = 'email'
  ) THEN
    ALTER TABLE user_details ADD COLUMN email text;
  END IF;
END $$;

-- Add user_details column to rfq_requests if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rfq_requests'
    AND column_name = 'user_details'
  ) THEN
    ALTER TABLE rfq_requests ADD COLUMN user_details jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Make user_id nullable in rfq_requests table
ALTER TABLE rfq_requests
ALTER COLUMN user_id DROP NOT NULL;

-- Ensure RLS is disabled for all tables to allow anonymous access
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_confirmations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
BEGIN
  -- Drop all policies from all tables
  DROP POLICY IF EXISTS "products_read_policy" ON products;
  DROP POLICY IF EXISTS "products_admin_policy" ON products;
  DROP POLICY IF EXISTS "rfq_requests_select_policy" ON rfq_requests;
  DROP POLICY IF EXISTS "rfq_requests_insert_policy" ON rfq_requests;
  DROP POLICY IF EXISTS "rfq_requests_update_policy" ON rfq_requests;
  DROP POLICY IF EXISTS "order_confirmations_select" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmations_insert" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmations_update" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmations_admin" ON order_confirmations;
  DROP POLICY IF EXISTS "user_details_read_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_write_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_modify_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_admin_policy" ON user_details;
  DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
  DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;