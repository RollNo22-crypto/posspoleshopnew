-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "view_own_confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "create_own_confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "update_own_confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "admin_manage_confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Users can view their own order confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Users can create their own order confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Users can update their own order confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Admins can manage all order confirmations" ON order_confirmations;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies with unique names
CREATE POLICY "order_confirmation_select"
  ON order_confirmations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rfq_requests
      WHERE rfq_requests.id = order_confirmations.rfq_request_id
      AND rfq_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "order_confirmation_insert"
  ON order_confirmations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rfq_requests
      WHERE rfq_requests.id = rfq_request_id
      AND rfq_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "order_confirmation_update"
  ON order_confirmations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rfq_requests
      WHERE rfq_requests.id = order_confirmations.rfq_request_id
      AND rfq_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "order_confirmation_admin"
  ON order_confirmations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');