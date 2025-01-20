/*
  # Fix departments data structure and add sample data

  1. Changes
    - Add departments table
    - Add department_id to profiles
    - Add sample departments
    - Update existing profiles

  2. Security
    - Enable RLS on departments table
    - Add policies for viewing departments
*/

-- Create departments table
CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Add policy for viewing departments
CREATE POLICY "Departments are viewable by everyone"
    ON public.departments FOR SELECT
    USING (true);

-- Add department_id to profiles
ALTER TABLE public.profiles
ADD COLUMN department_id uuid REFERENCES public.departments(id);

-- Insert departments
INSERT INTO public.departments (name, description) VALUES
    ('Computer Science', 'Study of computation, automation, and information'),
    ('Data Science', 'Interdisciplinary field focusing on data analysis and insights'),
    ('Digital Arts', 'Digital media creation and interactive design'),
    ('Environmental Engineering', 'Engineering solutions for environmental challenges'),
    ('Information Technology', 'Management and implementation of computer systems'),
    ('Mechanical Engineering', 'Design and manufacturing of mechanical systems'),
    ('Psychology', 'Study of mind and behavior');

-- Update existing profiles with department_id
UPDATE public.profiles
SET department_id = departments.id
FROM public.departments
WHERE profiles.department = departments.name;