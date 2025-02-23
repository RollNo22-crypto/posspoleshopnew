-- Drop existing foreign key constraints if they exist
ALTER TABLE rfq_requests 
DROP CONSTRAINT IF EXISTS rfq_requests_order_confirmation_id_fkey;

ALTER TABLE order_confirmations
DROP CONSTRAINT IF EXISTS order_confirmations_rfq_request_id_fkey;

-- Recreate the constraints in the correct order
ALTER TABLE order_confirmations
ADD CONSTRAINT order_confirmations_rfq_request_id_fkey 
FOREIGN KEY (rfq_request_id) 
REFERENCES rfq_requests(id)
ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rfq_requests_id ON rfq_requests(id);
CREATE INDEX IF NOT EXISTS idx_order_confirmations_rfq_request_id ON order_confirmations(rfq_request_id);