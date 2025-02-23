/*
  # Fix Order Confirmations Migration

  1. Changes
    - Drop existing function before recreating
    - Create order confirmations table
    - Add RLS policies
    - Add confirmation number generation
    - Add timestamp handling

  2. Security
    - Enable RLS
    - Add policies for users and admins
*/

-- Drop existing functions and triggers first
DROP TRIGGER IF EXISTS set_confirmation_number ON order_confirmations;
DROP TRIGGER IF EXISTS set_order_confirmation_timestamp ON order_confirmations;
DROP FUNCTION IF EXISTS generate_confirmation_number();
DROP FUNCTION IF EXISTS handle_order_confirmation_updated_at();

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

-- Create order_confirmations table if not exists
CREATE TABLE IF NOT EXISTS order_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_number text UNIQUE NOT NULL DEFAULT '',
  rfq_request_id uuid REFERENCES rfq_requests NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL DEFAULT 0,
  shipping_details jsonb,
  payment_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Enable RLS
ALTER TABLE order_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies for order_confirmations
CREATE POLICY "Users can view their own order confirmations"
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

CREATE POLICY "Users can create their own order confirmations"
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

CREATE POLICY "Users can update their own order confirmations"
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

CREATE POLICY "Admins can manage all order confirmations"
  ON order_confirmations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to generate confirmation number
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate a unique confirmation number
  NEW.confirmation_number := 'POS-' || to_char(now(), 'YYYYMMDD') || '-' || 
    substring(encode(gen_random_bytes(4), 'hex') from 1 for 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confirmation number generation
CREATE TRIGGER set_confirmation_number
  BEFORE INSERT ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION generate_confirmation_number();

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