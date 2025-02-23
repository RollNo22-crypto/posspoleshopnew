-- Disable RLS for all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_confirmations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
BEGIN
  -- Products policies
  DROP POLICY IF EXISTS "products_read_policy" ON products;
  DROP POLICY IF EXISTS "products_admin_policy" ON products;

  -- RFQ requests policies
  DROP POLICY IF EXISTS "rfq_requests_select_policy" ON rfq_requests;
  DROP POLICY IF EXISTS "rfq_requests_insert_policy" ON rfq_requests;
  DROP POLICY IF EXISTS "rfq_requests_update_policy" ON rfq_requests;

  -- Order confirmations policies
  DROP POLICY IF EXISTS "order_confirmations_select" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmations_insert" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmations_update" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmations_admin" ON order_confirmations;

  -- User details policies
  DROP POLICY IF EXISTS "user_details_read_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_write_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_modify_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_admin_policy" ON user_details;

  -- Reviews policies
  DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
  DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;