/*
  # Fix Cart Permissions

  1. Changes
    - Add RLS policies for users table access
    - Add RLS policies for rfq_requests table
    - Fix permission issues for cart submission

  2. Security
    - Enable RLS on tables
    - Add policies for authenticated users
    - Add policies for admin access
*/

-- Create policy to allow users to read their own user data
CREATE POLICY "Users can read own data"
ON auth.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy to allow users to read other users' basic info
CREATE POLICY "Users can read basic info"
ON auth.users
FOR SELECT
TO authenticated
USING (true);

-- Update RFQ requests policies
DROP POLICY IF EXISTS "Users can view their own RFQ requests" ON rfq_requests;
DROP POLICY IF EXISTS "Users can create RFQ requests" ON rfq_requests;
DROP POLICY IF EXISTS "Admins can view all RFQ requests" ON rfq_requests;
DROP POLICY IF EXISTS "Admins can update RFQ requests" ON rfq_requests;

-- Create new RFQ policies
CREATE POLICY "rfq_select_policy"
ON rfq_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "rfq_insert_policy"
ON rfq_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "rfq_update_policy"
ON rfq_requests
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "rfq_delete_policy"
ON rfq_requests
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Ensure RLS is enabled
ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;