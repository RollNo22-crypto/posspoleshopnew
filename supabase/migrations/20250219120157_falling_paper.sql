-- Add user_id to rfq_requests if it doesn't exist
ALTER TABLE rfq_requests
ADD COLUMN IF NOT EXISTS user_details_id uuid REFERENCES user_details(id);

-- Update existing rfq_requests to link with user_details
UPDATE rfq_requests r
SET user_details_id = ud.id
FROM user_details ud
WHERE r.user_id = ud.user_id
AND r.user_details_id IS NULL;

-- Create function to handle user details linking for new RFQ requests
CREATE OR REPLACE FUNCTION link_rfq_to_user_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Get or create user_details for the RFQ request
  INSERT INTO user_details (user_id, full_name, email)
  SELECT 
    NEW.user_id,
    COALESCE(
      (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = NEW.user_id),
      'Anonymous'
    ),
    (SELECT email FROM auth.users WHERE id = NEW.user_id)
  ON CONFLICT (user_id) DO UPDATE
  SET updated_at = now()
  RETURNING id INTO NEW.user_details_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for linking user details
DROP TRIGGER IF EXISTS link_rfq_to_user_details_trigger ON rfq_requests;
CREATE TRIGGER link_rfq_to_user_details_trigger
BEFORE INSERT ON rfq_requests
FOR EACH ROW
EXECUTE FUNCTION link_rfq_to_user_details();

-- Update policies to include user details access
CREATE POLICY "Allow reading user details for rfq"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (true);