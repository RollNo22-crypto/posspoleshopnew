-- Drop existing tables and recreate them with proper structure
DROP TABLE IF EXISTS order_confirmations CASCADE;
DROP TABLE IF EXISTS rfq_requests CASCADE;

-- Create RFQ requests table
CREATE TABLE rfq_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  products jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  user_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected', 'completed'))
);

-- Create order confirmations table
CREATE TABLE order_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_request_id uuid REFERENCES rfq_requests(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL DEFAULT 0,
  shipping_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  payment_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  confirmation_number text UNIQUE,
  downloaded boolean DEFAULT false,
  download_timestamp timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Create indexes for better performance
CREATE INDEX idx_rfq_requests_user_id ON rfq_requests(user_id);
CREATE INDEX idx_rfq_requests_status ON rfq_requests(status);
CREATE INDEX idx_order_confirmations_rfq_request_id ON order_confirmations(rfq_request_id);
CREATE INDEX idx_order_confirmations_status ON order_confirmations(status);
CREATE INDEX idx_order_confirmations_confirmation_number ON order_confirmations(confirmation_number);

-- Create function to generate confirmation number
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TRIGGER AS $$
BEGIN
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
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_rfq_timestamp
  BEFORE UPDATE ON rfq_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_confirmation_timestamp
  BEFORE UPDATE ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to sync status between RFQ and order confirmation
CREATE OR REPLACE FUNCTION sync_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
    -- Map RFQ status to order confirmation status
    CASE NEW.status
      WHEN 'approved' THEN
        UPDATE order_confirmations 
        SET status = 'confirmed' 
        WHERE rfq_request_id = NEW.id;
      WHEN 'rejected' THEN
        UPDATE order_confirmations 
        SET status = 'cancelled' 
        WHERE rfq_request_id = NEW.id;
      WHEN 'completed' THEN
        UPDATE order_confirmations 
        SET status = 'completed' 
        WHERE rfq_request_id = NEW.id;
      WHEN 'pending' THEN
        UPDATE order_confirmations 
        SET status = 'pending' 
        WHERE rfq_request_id = NEW.id;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status synchronization
CREATE TRIGGER sync_order_status_trigger
  AFTER UPDATE ON rfq_requests
  FOR EACH ROW
  EXECUTE FUNCTION sync_order_status();

-- Disable RLS for all tables to allow anonymous access
ALTER TABLE rfq_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_confirmations DISABLE ROW LEVEL SECURITY;