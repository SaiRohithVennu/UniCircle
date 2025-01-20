/*
  # Fix signup flow and user metadata handling

  1. Changes
    - Drop and recreate profiles table with correct schema
    - Update trigger function to properly handle user metadata
    - Add proper constraints and defaults

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null unique,
    first_name text not null,
    last_name text not null,
    phone text not null,
    department text not null,
    avatar_url text,
    bio text,
    interests text[],
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create new trigger function
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
        phone,
        department
    )
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'firstName',
        new.raw_user_meta_data->>'lastName',
        new.raw_user_meta_data->>'phone',
        new.raw_user_meta_data->>'department'
    );
    RETURN new;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();