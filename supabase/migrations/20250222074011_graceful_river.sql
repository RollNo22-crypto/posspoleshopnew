-- Add order_confirmation_id to rfq_requests if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rfq_requests'
    AND column_name = 'order_confirmation_id'
  ) THEN
    ALTER TABLE rfq_requests ADD COLUMN order_confirmation_id uuid REFERENCES order_confirmations(id);
  END IF;
END $$;

-- Add confirmation_number to order_confirmations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_confirmations'
    AND column_name = 'confirmation_number'
  ) THEN
    ALTER TABLE order_confirmations ADD COLUMN confirmation_number text UNIQUE;
  END IF;
END $$;

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
DROP TRIGGER IF EXISTS set_confirmation_number ON order_confirmations;
CREATE TRIGGER set_confirmation_number
  BEFORE INSERT ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION generate_confirmation_number();