/*
  # Add Sample Users

  1. New Data
    - Add diverse sample users across departments
    - Include realistic profiles with varied interests and backgrounds
    - Add profile pictures and bios
*/

-- Insert sample users for Computer Science
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'alex.chen@mail.uc.edu', 
    '{"firstName": "Alex", "lastName": "Chen", "department": "Computer Science", "phone": "5135550101"}'),
  ('22222222-2222-2222-2222-222222222222', 'sarah.patel@mail.uc.edu',
    '{"firstName": "Sarah", "lastName": "Patel", "department": "Computer Science", "phone": "5135550102"}'),
  ('33333333-3333-3333-3333-333333333333', 'michael.rodriguez@mail.uc.edu',
    '{"firstName": "Michael", "lastName": "Rodriguez", "department": "Computer Science", "phone": "5135550103"}');

-- Insert sample users for Data Science
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'emma.wilson@mail.uc.edu',
    '{"firstName": "Emma", "lastName": "Wilson", "department": "Data Science", "phone": "5135550104"}'),
  ('55555555-5555-5555-5555-555555555555', 'david.kim@mail.uc.edu',
    '{"firstName": "David", "lastName": "Kim", "department": "Data Science", "phone": "5135550105"}');

-- Insert sample users for Digital Arts
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('66666666-6666-6666-6666-666666666666', 'olivia.zhang@mail.uc.edu',
    '{"firstName": "Olivia", "lastName": "Zhang", "department": "Digital Arts", "phone": "5135550106"}'),
  ('77777777-7777-7777-7777-777777777777', 'james.garcia@mail.uc.edu',
    '{"firstName": "James", "lastName": "Garcia", "department": "Digital Arts", "phone": "5135550107"}');

-- Insert sample users for Environmental Engineering
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('88888888-8888-8888-8888-888888888888', 'sophia.brown@mail.uc.edu',
    '{"firstName": "Sophia", "lastName": "Brown", "department": "Environmental Engineering", "phone": "5135550108"}'),
  ('99999999-9999-9999-9999-999999999999', 'ethan.nguyen@mail.uc.edu',
    '{"firstName": "Ethan", "lastName": "Nguyen", "department": "Environmental Engineering", "phone": "5135550109"}');

-- Insert sample users for Information Technology
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ava.martinez@mail.uc.edu',
    '{"firstName": "Ava", "lastName": "Martinez", "department": "Information Technology", "phone": "5135550110"}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'noah.lee@mail.uc.edu',
    '{"firstName": "Noah", "lastName": "Lee", "department": "Information Technology", "phone": "5135550111"}');

-- Insert sample users for Mechanical Engineering
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'isabella.taylor@mail.uc.edu',
    '{"firstName": "Isabella", "lastName": "Taylor", "department": "Mechanical Engineering", "phone": "5135550112"}'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'william.anderson@mail.uc.edu',
    '{"firstName": "William", "lastName": "Anderson", "department": "Mechanical Engineering", "phone": "5135550113"}');

-- Insert sample users for Psychology
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'mia.jackson@mail.uc.edu',
    '{"firstName": "Mia", "lastName": "Jackson", "department": "Psychology", "phone": "5135550114"}'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'lucas.white@mail.uc.edu',
    '{"firstName": "Lucas", "lastName": "White", "department": "Psychology", "phone": "5135550115"}');

-- Update profiles with additional information
UPDATE public.profiles
SET 
  bio = CASE 
    WHEN email LIKE '%chen%' THEN 'Full-stack developer passionate about AI and machine learning. Working on innovative projects to solve real-world problems.'
    WHEN email LIKE '%patel%' THEN 'Software engineer specializing in cloud architecture and distributed systems. Love to mentor and contribute to open source.'
    WHEN email LIKE '%rodriguez%' THEN 'Mobile app developer with a focus on AR/VR experiences. Building the future of immersive technology.'
    WHEN email LIKE '%wilson%' THEN 'Data scientist exploring the intersection of AI and healthcare. Research assistant in the UC Analytics Lab.'
    WHEN email LIKE '%kim%' THEN 'Machine learning engineer working on predictive analytics and NLP. Interested in ethical AI development.'
    WHEN email LIKE '%zhang%' THEN 'Digital artist and UI/UX designer. Creating immersive experiences through interactive design.'
    WHEN email LIKE '%garcia%' THEN '3D animator and motion graphics designer. Passionate about storytelling through visual media.'
    WHEN email LIKE '%brown%' THEN 'Environmental engineer focused on sustainable urban development. Research in renewable energy systems.'
    WHEN email LIKE '%nguyen%' THEN 'Working on green infrastructure projects and water conservation technologies.'
    WHEN email LIKE '%martinez%' THEN 'IT specialist with expertise in cybersecurity and network architecture.'
    WHEN email LIKE '%lee%' THEN 'Cloud infrastructure engineer. Building scalable and secure systems.'
    WHEN email LIKE '%taylor%' THEN 'Mechanical engineer specializing in robotics and automation.'
    WHEN email LIKE '%anderson%' THEN 'Research assistant in advanced manufacturing. Working on 3D printing technologies.'
    WHEN email LIKE '%jackson%' THEN 'Psychology researcher studying human-computer interaction and digital wellness.'
    WHEN email LIKE '%white%' THEN 'Clinical psychology focus with interest in technology''s impact on mental health.'
    ELSE bio
  END,
  interests = CASE 
    WHEN email LIKE '%chen%' THEN ARRAY['AI', 'Machine Learning', 'Web Development', 'Cloud Computing']
    WHEN email LIKE '%patel%' THEN ARRAY['Distributed Systems', 'DevOps', 'System Architecture', 'Mentoring']
    WHEN email LIKE '%rodriguez%' THEN ARRAY['Mobile Development', 'AR/VR', 'iOS', 'Android']
    WHEN email LIKE '%wilson%' THEN ARRAY['Data Science', 'Healthcare Analytics', 'Python', 'R']
    WHEN email LIKE '%kim%' THEN ARRAY['Machine Learning', 'NLP', 'Ethics in AI', 'Big Data']
    WHEN email LIKE '%zhang%' THEN ARRAY['UI Design', 'Digital Art', 'Motion Graphics', 'User Experience']
    WHEN email LIKE '%garcia%' THEN ARRAY['3D Animation', 'Visual Effects', 'Storytelling', 'Character Design']
    WHEN email LIKE '%brown%' THEN ARRAY['Sustainable Design', 'Renewable Energy', 'Urban Planning', 'Green Building']
    WHEN email LIKE '%nguyen%' THEN ARRAY['Water Conservation', 'Environmental Impact', 'Sustainability', 'Green Tech']
    WHEN email LIKE '%martinez%' THEN ARRAY['Cybersecurity', 'Network Security', 'Cloud Computing', 'IT Infrastructure']
    WHEN email LIKE '%lee%' THEN ARRAY['Cloud Architecture', 'DevOps', 'Security', 'Automation']
    WHEN email LIKE '%taylor%' THEN ARRAY['Robotics', 'Automation', 'CAD', 'Control Systems']
    WHEN email LIKE '%anderson%' THEN ARRAY['3D Printing', 'Manufacturing', 'Product Design', 'Materials Science']
    WHEN email LIKE '%jackson%' THEN ARRAY['HCI', 'Digital Psychology', 'UX Research', 'Behavioral Science']
    WHEN email LIKE '%white%' THEN ARRAY['Clinical Psychology', 'Digital Therapy', 'Mental Health Tech', 'Research']
    ELSE interests
  END,
  avatar_url = CASE 
    WHEN email LIKE '%chen%' THEN 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'
    WHEN email LIKE '%patel%' THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    WHEN email LIKE '%rodriguez%' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    WHEN email LIKE '%wilson%' THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    WHEN email LIKE '%kim%' THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    WHEN email LIKE '%zhang%' THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    WHEN email LIKE '%garcia%' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    WHEN email LIKE '%brown%' THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    WHEN email LIKE '%nguyen%' THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    ELSE avatar_url
  END
WHERE email LIKE '%@mail.uc.edu';