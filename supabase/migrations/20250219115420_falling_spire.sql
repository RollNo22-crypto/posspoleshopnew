/*
  # Fix Order Confirmations Table and Policies

  1. Changes
    - Drops existing policies to avoid conflicts
    - Creates order_confirmations table with proper structure
    - Adds policies for user and admin access
    - Adds triggers for timestamps and confirmation numbers

  2. Security
    - Enables RLS
    - Ensures users can only access their own confirmations
    - Provides admin access to all confirmations
*/

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own order confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Users can create their own order confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Users can update their own order confirmations" ON order_confirmations;
  DROP POLICY IF EXISTS "Admins can manage all order confirmations" ON order_confirmations;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Drop existing triggers first
DROP TRIGGER IF EXISTS set_confirmation_number ON order_confirmations;
DROP TRIGGER IF EXISTS set_order_confirmation_timestamp ON order_confirmations;

-- Drop existing functions
DROP FUNCTION IF EXISTS generate_confirmation_number() CASCADE;
DROP FUNCTION IF EXISTS handle_order_confirmation_updated_at() CASCADE;

-- Create order_confirmations table if not exists
CREATE TABLE IF NOT EXISTS order_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_request_id uuid REFERENCES rfq_requests NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL DEFAULT 0,
  shipping_details jsonb DEFAULT '{}'::jsonb,
  payment_details jsonb DEFAULT '{}'::jsonb,
  confirmation_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Enable RLS
ALTER TABLE order_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies with new names to avoid conflicts
CREATE POLICY "confirmation_view_policy"
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

CREATE POLICY "confirmation_insert_policy"
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

CREATE POLICY "confirmation_update_policy"
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

CREATE POLICY "confirmation_admin_policy"
  ON order_confirmations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_order_confirmation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_order_confirmation_timestamp
  BEFORE UPDATE ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_confirmation_updated_at();

-- Create function to generate confirmation number based on RFQ request ID
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.confirmation_number := 'POS-' || substring(NEW.rfq_request_id::text, 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confirmation number generation
CREATE TRIGGER set_confirmation_number
  BEFORE INSERT ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION generate_confirmation_number();