-- Update or create admin user
DO $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Try to find existing admin user
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = 'admin@posspole.com';

  -- If admin exists, update their credentials
  IF admin_uid IS NOT NULL THEN
    -- Update the existing admin user
    UPDATE auth.users
    SET 
      role = 'admin',
      encrypted_password = crypt('admin123', gen_salt('bf')),
      email_confirmed_at = now(),
      last_sign_in_at = now(),
      raw_app_meta_data = '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      raw_user_meta_data = '{"full_name": "Admin User"}'::jsonb,
      updated_at = now()
    WHERE id = admin_uid;

    -- Update the identity data
    UPDATE auth.identities
    SET 
      identity_data = format('{"sub": "%s", "email": "admin@posspole.com"}', admin_uid)::jsonb,
      updated_at = now()
    WHERE user_id = admin_uid;

  -- If admin doesn't exist, create a new one
  ELSE
    -- Insert new admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'admin',
      'admin@posspole.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      '{"full_name": "Admin User"}'::jsonb,
      now(),
      now()
    )
    RETURNING id INTO admin_uid;

    -- Create identity for new admin
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_uid,
      format('{"sub": "%s", "email": "admin@posspole.com"}', admin_uid)::jsonb,
      'email',
      now(),
      now(),
      now()
    );
  END IF;
END $$;