-- Add foreign key reference to auth.users for reviews
ALTER TABLE reviews
DROP CONSTRAINT IF EXISTS reviews_user_id_fkey,
ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Create policy to allow joining with auth.users
CREATE POLICY "Allow joining with auth.users"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Update any existing reviews to ensure data consistency
DELETE FROM reviews
WHERE user_id NOT IN (SELECT id FROM auth.users);