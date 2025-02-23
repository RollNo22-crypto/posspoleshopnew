/*
  # Fix Reviews and User Details Relationship

  1. Changes
    - Add user_details reference to reviews table
    - Update reviews policies to handle user details access
    - Add trigger to maintain user details consistency

  2. Security
    - Maintain RLS policies for reviews
    - Add policies for accessing user details
*/

-- Add user_details_id to reviews if it doesn't exist
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS user_details_id uuid REFERENCES user_details(id);

-- Update existing reviews to link with user_details
UPDATE reviews r
SET user_details_id = ud.id
FROM user_details ud
WHERE r.user_id = ud.user_id
AND r.user_details_id IS NULL;

-- Create function to handle user details linking
CREATE OR REPLACE FUNCTION link_review_to_user_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Get or create user_details for the review
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
DROP TRIGGER IF EXISTS link_review_to_user_details_trigger ON reviews;
CREATE TRIGGER link_review_to_user_details_trigger
BEFORE INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION link_review_to_user_details();

-- Update policies to include user details access
CREATE POLICY "Allow reading user details for reviews"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (true);