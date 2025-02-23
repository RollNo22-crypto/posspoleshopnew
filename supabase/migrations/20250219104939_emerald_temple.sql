/*
  # Fix admin authentication

  1. Changes
    - Removes any existing admin users to avoid conflicts
    - Creates a new admin user with proper role and metadata
    - Sets up correct authentication identities
    - Ensures all required fields are properly set

  2. Security
    - Uses secure password hashing
    - Sets proper admin role and permissions
*/

-- First, clean up any existing admin users to avoid conflicts
DO $$
BEGIN
  -- Delete existing admin identities and users
  DELETE FROM auth.identities 
  WHERE provider_id IN ('admin@posspole.com', 'superadmin@posspole.com');
  
  DELETE FROM auth.users 
  WHERE email IN ('admin@posspole.com', 'superadmin@posspole.com');
END $$;

-- Create new admin user with proper setup
DO $$
DECLARE
  new_admin_uid UUID;
BEGIN
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
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'superadmin@posspole.com',
    crypt('superadmin123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
    '{"full_name": "Super Admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_admin_uid;

  -- Create identity for admin
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_admin_uid,
    'superadmin@posspole.com',
    format('{"sub": "%s", "email": "superadmin@posspole.com"}', new_admin_uid)::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  -- Ensure admin role is set in metadata
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE id = new_admin_uid;
END $$;