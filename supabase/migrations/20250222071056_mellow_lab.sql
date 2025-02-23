-- Add user_details column to rfq_requests table
ALTER TABLE rfq_requests
ADD COLUMN user_details jsonb DEFAULT '{}'::jsonb;

-- Update RLS policies for rfq_requests
DROP POLICY IF EXISTS "rfq_requests_select_policy" ON rfq_requests;
DROP POLICY IF EXISTS "rfq_requests_insert_policy" ON rfq_requests;
DROP POLICY IF EXISTS "rfq_requests_update_policy" ON rfq_requests;

-- Create new policies
CREATE POLICY "rfq_requests_select_policy"
ON rfq_requests
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "rfq_requests_insert_policy"
ON rfq_requests
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "rfq_requests_update_policy"
ON rfq_requests
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');