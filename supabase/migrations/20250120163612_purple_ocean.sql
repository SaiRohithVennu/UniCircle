-- Update profiles with department_id based on department name
UPDATE public.profiles p
SET department_id = d.id
FROM public.departments d
WHERE p.department = d.name;

-- Add NOT NULL constraint to department_id
ALTER TABLE public.profiles
ALTER COLUMN department_id SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS profiles_department_id_idx 
ON public.profiles(department_id);

-- Verify department counts (for debugging)
SELECT d.name, COUNT(p.id) as student_count
FROM public.departments d
LEFT JOIN public.profiles p ON d.id = p.department_id
GROUP BY d.name
ORDER BY d.name;