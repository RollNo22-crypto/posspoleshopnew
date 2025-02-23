/*
  # Fix Reviews and User Details Relationship

  1. Changes
    - Add foreign key relationship between reviews and user_details
    - Update reviews query to use auth.users instead of user_details
    - Add policies for reviews table

  2. Security
    - Enable RLS on reviews table
    - Add policies for viewing and managing reviews
*/

-- First, ensure reviews table has correct structure
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Create new policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_product_rating_trigger ON reviews;
DROP FUNCTION IF EXISTS update_product_rating();

-- Create or replace function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- For INSERT/UPDATE operations
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- Update the product's rating and review count
    UPDATE products
    SET 
      rating = (
        SELECT COALESCE(AVG(rating)::numeric(3,2), 0)
        FROM reviews
        WHERE product_id = NEW.product_id
      ),
      reviews_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = NEW.product_id
      )
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  -- For DELETE operations
  ELSIF (TG_OP = 'DELETE') THEN
    -- Update the product's rating and review count
    UPDATE products
    SET 
      rating = (
        SELECT COALESCE(AVG(rating)::numeric(3,2), 0)
        FROM reviews
        WHERE product_id = OLD.product_id
      ),
      reviews_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = OLD.product_id
      )
    WHERE id = OLD.product_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger for updating product rating
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();