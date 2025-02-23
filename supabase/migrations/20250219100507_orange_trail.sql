/*
  # Update admin user credentials

  1. Changes
    - Update admin email to kiran@posspole.com
    - Update admin password to kiran123
*/

DO $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Get the existing admin user
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = 'admin@posspole.com';

  -- Update the admin user credentials
  IF admin_uid IS NOT NULL THEN
    -- Update email and password
    UPDATE auth.users
    SET 
      email = 'kiran@posspole.com',
      encrypted_password = crypt('kiran123', gen_salt('bf')),
      updated_at = now()
    WHERE id = admin_uid;

    -- Update identity data
    UPDATE auth.identities
    SET 
      identity_data = format('{"sub": "%s", "email": "kiran@posspole.com"}', admin_uid)::jsonb,
      updated_at = now()
    WHERE user_id = admin_uid;
  END IF;
END $$;