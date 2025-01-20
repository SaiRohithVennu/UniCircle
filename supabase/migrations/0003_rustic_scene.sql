/*
  # Seed Projects Data

  1. New Data
    - Adds sample projects with realistic data
    - Links projects to existing profiles
    - Adds tags and status information

  2. Notes
    - Projects are created with different statuses to show variety
    - Each project has relevant tags for discoverability
    - Projects are linked to department-specific topics
*/

-- Insert sample projects
INSERT INTO public.projects (name, description, owner_id, image_url, tags, status)
SELECT
  'AI-Powered Study Assistant',
  'Building an intelligent assistant that helps students organize their study schedules, track progress, and improve learning efficiency through personalized recommendations.',
  id,
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  ARRAY['AI', 'Education', 'Machine Learning'],
  'in-progress'
FROM public.profiles
WHERE department = 'Computer Science'
LIMIT 1;

INSERT INTO public.projects (name, description, owner_id, image_url, tags, status)
SELECT
  'Sustainable Campus Initiative',
  'Developing innovative solutions for campus sustainability, including smart waste management systems and energy consumption optimization using IoT sensors.',
  id,
  'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa',
  ARRAY['Sustainability', 'IoT', 'Environmental'],
  'planning'
FROM public.profiles
WHERE department = 'Environmental Engineering'
LIMIT 1;

INSERT INTO public.projects (name, description, owner_id, image_url, tags, status)
SELECT
  'Smart Campus Navigation',
  'Creating an interactive campus map with real-time updates on classroom availability, event locations, and accessibility features for students with disabilities.',
  id,
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  ARRAY['Mobile App', 'Accessibility', 'UX Design'],
  'completed'
FROM public.profiles
WHERE department = 'Information Technology'
LIMIT 1;

INSERT INTO public.projects (name, description, owner_id, image_url, tags, status)
SELECT
  'Student Mental Health Platform',
  'Building a confidential platform connecting students with mental health resources, peer support groups, and wellness tracking tools.',
  id,
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
  ARRAY['Healthcare', 'Mental Health', 'Web Development'],
  'in-progress'
FROM public.profiles
WHERE department = 'Psychology'
LIMIT 1;

INSERT INTO public.projects (name, description, owner_id, image_url, tags, status)
SELECT
  'Autonomous Delivery Robots',
  'Developing a fleet of small autonomous robots for campus deliveries, focusing on food, mail, and small package transportation.',
  id,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  ARRAY['Robotics', 'AI', 'Automation'],
  'planning'
FROM public.profiles
WHERE department = 'Mechanical Engineering'
LIMIT 1;

INSERT INTO public.projects (name, description, owner_id, image_url, tags, status)
SELECT
  'Virtual Art Gallery',
  'Creating an immersive virtual reality space to showcase student artwork and host virtual exhibitions accessible from anywhere.',
  id,
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
  ARRAY['VR', 'Art', 'Digital Media'],
  'in-progress'
FROM public.profiles
WHERE department = 'Digital Arts'
LIMIT 1;