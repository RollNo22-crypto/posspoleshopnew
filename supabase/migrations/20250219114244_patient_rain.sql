/*
  # Fix Order Confirmation Migration

  1. Changes
    - Drop existing triggers and functions with CASCADE
    - Create new functions for confirmation number generation and timestamp handling
    - Add triggers for automatic updates

  2. Security
    - Maintain existing RLS policies
    - Ensure data consistency
*/

-- Drop existing triggers and functions with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS set_confirmation_number_trigger ON order_confirmations;
DROP TRIGGER IF EXISTS set_order_confirmation_timestamp ON order_confirmations;
DROP FUNCTION IF EXISTS generate_confirmation_number() CASCADE;
DROP FUNCTION IF EXISTS set_confirmation_number() CASCADE;
DROP FUNCTION IF EXISTS handle_order_confirmation_updated_at() CASCADE;

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

-- Create function to generate confirmation number
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate a unique confirmation number using RFQ request ID
  NEW.confirmation_number := 'POS-' || substring(NEW.rfq_request_id::text, 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confirmation number generation
CREATE TRIGGER set_confirmation_number_trigger
  BEFORE INSERT ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION generate_confirmation_number();