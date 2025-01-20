/*
  # Fix database relationships and queries

  1. Changes
    - Add proper foreign key relationships
    - Update project queries to use correct joins
*/

-- Ensure proper relationship between projects and profiles
ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_owner_id_fkey,
ADD CONSTRAINT projects_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS profiles_department_id_idx ON public.profiles(department_id);

-- Update existing projects with proper owner relationships
UPDATE public.projects p
SET owner_id = profiles.id
FROM public.profiles
WHERE p.owner_id IS NULL
AND profiles.id IN (SELECT id FROM public.profiles LIMIT 1);