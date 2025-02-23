/*
  # Order Confirmation Schema

  1. New Tables
    - `order_confirmations`
      - Stores order confirmation details
      - Links to RFQ requests
      - Includes user contact information
    - `user_details`
      - Stores user contact information
      - Used for both RFQ and order processing

  2. Security
    - Enable RLS on new tables
    - Add policies for user access
    - Add policies for admin access
*/

-- Create user_details table
CREATE TABLE IF NOT EXISTS user_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create order_confirmations table
CREATE TABLE IF NOT EXISTS order_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_request_id uuid REFERENCES rfq_requests NOT NULL,
  user_details_id uuid REFERENCES user_details NOT NULL,
  confirmation_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL,
  payment_terms text,
  delivery_terms text,
  special_instructions text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Enable RLS
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_confirmations ENABLE ROW LEVEL SECURITY;

-- Policies for user_details
CREATE POLICY "Users can view their own details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own details"
  ON user_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own details"
  ON user_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for order_confirmations
CREATE POLICY "Users can view their own order confirmations"
  ON order_confirmations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rfq_requests
    WHERE rfq_requests.id = order_confirmations.rfq_request_id
    AND rfq_requests.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all order confirmations"
  ON order_confirmations
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_details
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON order_confirmations
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Function to generate confirmation number
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  random_str TEXT;
BEGIN
  -- Generate a random string of 6 characters
  SELECT string_agg(substr('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', ceil(random() * 36)::integer, 1), '')
  INTO random_str
  FROM generate_series(1, 6);
  
  -- Combine with timestamp for uniqueness
  result := 'POS-' || to_char(now(), 'YYMMDD') || '-' || random_str;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;