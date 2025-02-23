-- First, drop all existing policies for user_details
DO $$
BEGIN
  DROP POLICY IF EXISTS "user_details_select_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_insert_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_update_policy" ON user_details;
  DROP POLICY IF EXISTS "user_details_delete_policy" ON user_details;
  DROP POLICY IF EXISTS "Allow reading user details for rfq" ON user_details;
  DROP POLICY IF EXISTS "Allow user details access" ON user_details;
  DROP POLICY IF EXISTS "Allow reading user details for reviews" ON user_details;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies with unique names
CREATE POLICY "user_details_read_policy"
ON user_details
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "user_details_write_policy"
ON user_details
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "user_details_modify_policy"
ON user_details
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "user_details_admin_policy"
ON user_details
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Ensure RLS is enabled
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;