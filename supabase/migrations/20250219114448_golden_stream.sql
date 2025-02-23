/*
  # Order Confirmation Download Migration

  1. Changes
    - Add download tracking to order_confirmations
    - Track download status and timestamp
    - Ensure one-time download functionality

  2. Security
    - Maintain existing RLS policies
    - Add download-specific constraints
*/

-- Add download tracking columns to order_confirmations
ALTER TABLE order_confirmations
ADD COLUMN IF NOT EXISTS downloaded boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS download_timestamp timestamptz;

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
CREATE TRIGGER track_confirmation_download_trigger
  BEFORE UPDATE OF downloaded ON order_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION track_confirmation_download();

-- Update RLS policies to handle download restrictions
CREATE POLICY "Users can download their confirmation once"
  ON order_confirmations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rfq_requests
      WHERE rfq_requests.id = order_confirmations.rfq_request_id
      AND rfq_requests.user_id = auth.uid()
    )
    AND NOT downloaded
  )
  WITH CHECK (
    downloaded = true
  );