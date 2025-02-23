/*
  # Fix Order Confirmations Table and Policies

  1. Changes
    - Drops all existing policies to avoid conflicts
    - Recreates the order_confirmations table with proper structure
    - Adds download tracking columns
    - Creates new policies with unique names
    - Adds triggers for timestamp handling

  2. Security
    - Enables RLS
    - Adds policies for user and admin access
    - Ensures users can only access their own confirmations
*/

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
  DROP POLICY IF EXISTS "order_confirmation_select" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmation_insert" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmation_update" ON order_confirmations;
  DROP POLICY IF EXISTS "order_confirmation_admin" ON order_confirmations;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Drop and recreate the table
DROP TABLE IF EXISTS order_confirmations;

CREATE TABLE order_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_request_id uuid REFERENCES rfq_requests NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL DEFAULT 0,
  shipping_details jsonb DEFAULT '{}'::jsonb,
  payment_details jsonb DEFAULT '{}'::jsonb,
  downloaded boolean DEFAULT false,
  download_timestamp timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Enable RLS
ALTER TABLE order_confirmations ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "confirmation_view_own"
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

CREATE POLICY "confirmation_create_own"
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

CREATE POLICY "confirmation_update_own"
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

CREATE POLICY "confirmation_admin_all"
  ON order_confirmations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_confirmation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_confirmation_timestamp
  BEFORE UPDATE ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION handle_confirmation_updated_at();

-- Create function to handle download tracking
CREATE OR REPLACE FUNCTION track_confirmation_download()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.downloaded = true AND OLD.downloaded = false THEN
    NEW.download_timestamp = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for download tracking
CREATE TRIGGER track_confirmation_download
  BEFORE UPDATE OF downloaded ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION track_confirmation_download();