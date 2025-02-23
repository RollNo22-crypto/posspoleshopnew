/*
  # Create Admin User

  1. Changes
    - Clean up existing admin user
    - Create new admin user with proper role and permissions
    - Set up identity with correct provider configuration

  2. Security
    - Secure password hashing
    - Proper role assignment
*/

-- First, clean up any existing admin user
DO $$
DECLARE
  existing_admin_id UUID;
BEGIN
  -- Find and delete existing admin user
  SELECT id INTO existing_admin_id
  FROM auth.users
  WHERE email = 'kiran@posspole.com';
  
  IF existing_admin_id IS NOT NULL THEN
    DELETE FROM auth.identities WHERE user_id = existing_admin_id;
    DELETE FROM auth.users WHERE id = existing_admin_id;
  END IF;
END $$;

-- Create new admin user
DO $$
DECLARE
  new_admin_id UUID;
BEGIN
  -- Insert new admin user
  INSERT INTO auth.users (
    id,
    raw_user_meta_data,
    raw_app_meta_data,
    is_super_admin,
    role,
    encrypted_password,
    aud,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    jsonb_build_object('full_name', 'Admin User'),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email'],
      'role', 'admin'
    ),
    false,
    'admin',
    crypt('kiran123', gen_salt('bf')),
    'authenticated',
    now(),
    now()
  )
  RETURNING id INTO new_admin_id;

  -- Create identity for admin
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    created_at,
    updated_at,
    last_sign_in_at
  ) VALUES (
    gen_random_uuid(),
    new_admin_id,
    'kiran@posspole.com',
    jsonb_build_object(
      'sub', new_admin_id,
      'email', 'kiran@posspole.com'
    ),
    'email',
    now(),
    now(),
    now()
  );
END $$;