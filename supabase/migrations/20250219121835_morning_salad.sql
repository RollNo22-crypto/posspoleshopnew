/*
  # Comprehensive Permission Fix

  1. Changes
    - Reset and properly configure all necessary RLS policies
    - Enable proper access to auth.users
    - Set up correct permissions for all related tables
    - Ensure proper join access between tables

  2. Security
    - Maintain security while allowing necessary operations
    - Enable proper access patterns for checkout flow
*/

-- First, clean up any existing policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow public access to basic user info" ON auth.users;
  DROP POLICY IF EXISTS "Allow user details access" ON user_details;
  DROP POLICY IF EXISTS "Allow all RFQ operations" ON rfq_requests;
  DROP POLICY IF EXISTS "Allow all user details operations" ON user_details;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS on necessary tables
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for auth.users access
CREATE POLICY "auth_users_policy"
ON auth.users
FOR SELECT
TO authenticated
USING (true);

-- Create policies for user_details
CREATE POLICY "user_details_select_policy"
ON user_details
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "user_details_insert_policy"
ON user_details
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_details_update_policy"
ON user_details
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Create policies for rfq_requests
CREATE POLICY "rfq_requests_select_policy"
ON rfq_requests
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "rfq_requests_insert_policy"
ON rfq_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "rfq_requests_update_policy"
ON rfq_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_details TO authenticated;
GRANT SELECT, INSERT, UPDATE ON rfq_requests TO authenticated;

-- Ensure proper access to related tables
ALTER TABLE order_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_confirmations_policy"
ON order_confirmations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);