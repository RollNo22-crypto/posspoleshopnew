/*
  # Admin User Setup

  1. New Features
    - Create admin user with specified credentials
    - Set up proper role and permissions

  2. Security
    - Secure password hashing
    - Proper role assignment
*/

-- Create admin user if not exists
DO $$
DECLARE
  admin_uid UUID;
  admin_email TEXT := 'kiran@posspole.com';
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_uid
  FROM auth.users
  WHERE email = admin_email;

  -- If admin doesn't exist, create one
  IF admin_uid IS NULL THEN
    INSERT INTO auth.users (
      id,
      email,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin,
      role,
      email_confirmed_at,
      encrypted_password,
      aud,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_email,
      '{}',
      '{"provider": "email", "providers": ["email"], "role": "admin"}',
      false,
      'admin',
      now(),
      crypt('kiran123', gen_salt('bf')),
      'authenticated',
      now(),
      now()
    )
    RETURNING id INTO admin_uid;

    -- Create identity for admin
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      email,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      gen_random_uuid(),
      admin_uid,
      admin_email,
      format('{"sub": "%s", "email": "%s"}', admin_uid, admin_email)::jsonb,
      'email',
      admin_email,
      now(),
      now(),
      now()
    );
  END IF;
END $$;