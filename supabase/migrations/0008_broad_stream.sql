/*
  # Fix project relationships and add sample data

  1. Changes
    - Add foreign key relationship between projects and profiles
    - Add sample projects for testing

  2. Security
    - Maintain existing RLS policies
*/

-- Ensure proper relationship between projects and profiles
ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_owner_id_fkey,
ADD CONSTRAINT projects_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Insert sample projects
INSERT INTO public.projects (name, description, owner_id, tags, status)
SELECT 
  'AI Study Assistant',
  'An intelligent assistant helping students organize their study schedules and track progress.',
  profiles.id,
  ARRAY['AI', 'Education'],
  'in-progress'
FROM public.profiles
LIMIT 1;

INSERT INTO public.projects (name, description, owner_id, tags, status)
SELECT 
  'Campus Navigation App',
  'Mobile app for easy navigation around UC campus with real-time updates.',
  profiles.id,
  ARRAY['Mobile', 'Maps'],
  'planning'
FROM public.profiles
LIMIT 1;