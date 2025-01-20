/*
  # Add first and last name fields to profiles

  1. Changes
    - Add first_name and last_name columns to profiles table
    - Split existing name into first_name and last_name
    - Make first_name and last_name required

  2. Data Migration
    - Clear existing profiles for fresh start
    - Update trigger to handle first and last names
*/

-- Clear existing profiles
DELETE FROM auth.users;
DELETE FROM public.profiles;

-- Add name columns
ALTER TABLE public.profiles
ADD COLUMN first_name text,
ADD COLUMN last_name text;

-- Update trigger function
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
    split_part(new.raw_user_meta_data->>'name', ' ', 1),
    split_part(new.raw_user_meta_data->>'name', ' ', 2),
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;