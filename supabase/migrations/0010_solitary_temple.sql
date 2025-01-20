/*
  # Add Information Technology department

  1. Changes
    - Add Information Technology department if not exists
    - Update any profiles with IT department
*/

-- Add Information Technology department if it doesn't exist
INSERT INTO public.departments (name, description)
VALUES (
  'Information Technology',
  'Study and implementation of computing technology, networks, and information systems'
)
ON CONFLICT (name) DO NOTHING;

-- Update any profiles with IT department
UPDATE public.profiles
SET department_id = departments.id
FROM public.departments
WHERE profiles.department = 'Information Technology'
AND departments.name = 'Information Technology';