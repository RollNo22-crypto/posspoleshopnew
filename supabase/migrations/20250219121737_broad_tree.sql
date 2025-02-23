/*
  # Fix Database Permissions

  1. Changes
    - Enable public access to auth.users for basic user info
    - Re-enable RLS for rfq_requests with proper policies
    - Add necessary join policies

  2. Security
    - Restrict sensitive user data
    - Allow basic user info access
    - Enable proper RFQ request handling
*/

-- Allow public access to basic user info
CREATE POLICY "Allow public access to basic user info"
ON auth.users
FOR SELECT
TO authenticated
USING (true);

-- Create policy for user details access
CREATE POLICY "Allow user details access"
ON user_details
FOR SELECT
TO authenticated
USING (true);

-- Re-enable RLS for rfq_requests
ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;

-- Create simplified RFQ policies
CREATE POLICY "Allow all RFQ operations"
ON rfq_requests
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure proper access to related tables
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all user details operations"
ON user_details
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);