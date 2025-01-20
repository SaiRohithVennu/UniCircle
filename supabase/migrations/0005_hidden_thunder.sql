/*
  # Fix user registration schema and trigger

  1. Changes
    - Add phone column to profiles table
    - Update trigger to properly handle user metadata
    - Add NOT NULL constraints to required fields

  2. Security
    - Maintain existing RLS policies
*/

-- Add phone column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone text;
  END IF;
END $$;

-- Update profiles table constraints
ALTER TABLE public.profiles
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL,
ALTER COLUMN phone SET NOT NULL;

-- Update trigger function to properly handle metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    department,
    phone
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;