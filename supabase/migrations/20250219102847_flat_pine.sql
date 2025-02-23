/*
  # Update admin credentials
  
  1. Changes
    - Updates existing admin user credentials
    - Does not attempt to create new user
  
  2. Notes
    - Only updates if user exists
    - Maintains existing user ID and relationships
*/

DO $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Get the existing admin user
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = 'admin@posspole.com';

  -- Update the existing admin user if found
  IF admin_uid IS NOT NULL THEN
    -- Update password
    UPDATE auth.users
    SET 
      encrypted_password = crypt('admin123', gen_salt('bf')),
      updated_at = now(),
      raw_app_meta_data = 
        CASE 
          WHEN raw_app_meta_data->>'role' IS NULL 
          THEN jsonb_set(
            COALESCE(raw_app_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
          )
          ELSE raw_app_meta_data
        END
    WHERE id = admin_uid;
  END IF;
END $$;