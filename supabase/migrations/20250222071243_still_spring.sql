-- Drop existing policies
DROP POLICY IF EXISTS "confirmation_view_policy" ON order_confirmations;
DROP POLICY IF EXISTS "confirmation_insert_policy" ON order_confirmations;
DROP POLICY IF EXISTS "confirmation_update_policy" ON order_confirmations;
DROP POLICY IF EXISTS "confirmation_admin_policy" ON order_confirmations;

-- Create new policies that allow anonymous access
CREATE POLICY "order_confirmations_select"
ON order_confirmations
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "order_confirmations_insert"
ON order_confirmations
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "order_confirmations_update"
ON order_confirmations
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "order_confirmations_admin"
ON order_confirmations
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');