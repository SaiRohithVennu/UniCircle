/*
  # Add Universities Support

  1. Changes
    - Create universities table
    - Add university_id to profiles
    - Add sample universities
    - Update trigger function
  
  2. Security
    - Enable RLS on universities table
    - Add policies for viewing universities
*/

-- Create universities table
CREATE TABLE public.universities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    domain text NOT NULL UNIQUE,
    logo_url text,
    location text,
    description text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Add university_id to profiles
ALTER TABLE public.profiles
ADD COLUMN university_id uuid REFERENCES public.universities(id);

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Universities are viewable by everyone"
    ON public.universities FOR SELECT
    USING (true);

-- Insert universities
INSERT INTO public.universities (name, domain, logo_url, location, description) VALUES
('University of Cincinnati', 'mail.uc.edu', 'https://i.postimg.cc/8PRCMW45/output-onlinepngtools-1.png', 'Cincinnati, OH', 'A public research university with a rich history of innovation'),
('Ohio State University', 'osu.edu', 'https://brand.osu.edu/downloads/jpg/block-o-logo.jpg', 'Columbus, OH', 'One of America''s largest and most comprehensive universities'),
('Miami University', 'miamioh.edu', 'https://miamioh.edu/_files/images/athletics/2019/miami-athletics-primary.png', 'Oxford, OH', 'A public university with a focus on undergraduate teaching'),
('Xavier University', 'xavier.edu', 'https://www.xavier.edu/marketing-communications/brand-guidelines/images/brand-logos/primary-athletic-logo.png', 'Cincinnati, OH', 'A private Jesuit university known for academic excellence'),
('Northern Kentucky University', 'nku.edu', 'https://www.nku.edu/content/dam/brand-assets/images/logos/NKU_Primary_RBG.png', 'Highland Heights, KY', 'A growing metropolitan university');

-- Update existing UC profiles with university_id
UPDATE public.profiles p
SET university_id = u.id
FROM public.universities u
WHERE u.domain = 'mail.uc.edu';

-- Update the handle_new_user function to handle university assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    matching_university_id uuid;
    matching_department_id uuid;
BEGIN
    -- Get university_id based on email domain
    SELECT id INTO matching_university_id
    FROM public.universities
    WHERE new.email LIKE '%@' || domain;

    -- Get department_id based on department name
    SELECT id INTO matching_department_id
    FROM public.departments
    WHERE name = new.raw_user_meta_data->>'department';

    IF matching_university_id IS NULL THEN
        RAISE EXCEPTION 'Invalid university email domain';
    END IF;

    IF matching_department_id IS NULL THEN
        RAISE EXCEPTION 'Invalid department';
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        phone,
        department,
        department_id,
        university_id
    )
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'firstName',
        new.raw_user_meta_data->>'lastName',
        new.raw_user_meta_data->>'phone',
        new.raw_user_meta_data->>'department',
        matching_department_id,
        matching_university_id
    );
    RETURN new;
END;
$$;