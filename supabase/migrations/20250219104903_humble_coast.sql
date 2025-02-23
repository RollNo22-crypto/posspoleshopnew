/*
  # Create admin user with proper identity

  1. Changes
    - Creates a new admin user with superadmin credentials
    - Sets up proper identity without generated columns
    - Ensures all required fields are populated correctly

  2. Security
    - Uses secure password hashing
    - Sets proper role and metadata
*/

-- Create a new admin user with different credentials
DO $$
DECLARE
  new_admin_uid UUID;
BEGIN
  -- Insert new admin user with different email
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
    'superadmin@posspole.com',
    crypt('superadmin123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
    '{"full_name": "Super Admin"}'::jsonb,
    now(),
    now()
  )
  RETURNING id INTO new_admin_uid;

  -- Create identity for new admin with proper provider_id
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
END $$;