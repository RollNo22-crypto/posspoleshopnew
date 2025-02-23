/*
  # Update reviews table and rating calculation

  1. Changes
    - Adds updated_at column to reviews table if it doesn't exist
    - Updates the product rating calculation function for more precise ratings
    - Recreates the trigger for product rating updates

  2. Improvements
    - More precise rating calculation using numeric(3,2)
    - Better handling of INSERT/UPDATE/DELETE operations
    - Proper NULL handling in calculations
*/

-- Add updated_at to reviews if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'reviews' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE reviews ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_product_rating_trigger ON reviews;
DROP FUNCTION IF EXISTS update_product_rating();

-- Create or replace the function with more precise rating calculation
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