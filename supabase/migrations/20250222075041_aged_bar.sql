-- Drop existing foreign key constraints if they exist
ALTER TABLE order_confirmations 
DROP CONSTRAINT IF EXISTS order_confirmations_rfq_request_id_fkey;

-- Modify order_confirmations table structure
ALTER TABLE order_confirmations
ALTER COLUMN rfq_request_id DROP NOT NULL;

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_confirmations'
    AND column_name = 'status'
  ) THEN
    ALTER TABLE order_confirmations ADD COLUMN status text DEFAULT 'pending';
  END IF;
END $$;

-- Add shipping_details column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_confirmations'
    AND column_name = 'shipping_details'
  ) THEN
    ALTER TABLE order_confirmations ADD COLUMN shipping_details jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add payment_details column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_confirmations'
    AND column_name = 'payment_details'
  ) THEN
    ALTER TABLE order_confirmations ADD COLUMN payment_details jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add confirmation_number column if it doesn't exist
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

-- Create or replace function to generate confirmation number
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

-- Ensure RLS is disabled for order_confirmations
ALTER TABLE order_confirmations DISABLE ROW LEVEL SECURITY;