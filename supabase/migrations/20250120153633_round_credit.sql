/*
  # Add Companies and Job Postings

  1. New Tables
    - `companies`
      - Company profiles and information
    - `job_postings`
      - Job opportunities posted by companies
    - `company_followers`
      - Track company followers and roles

  2. Security
    - Enable RLS on all tables
    - Add policies for viewing and managing data
*/

-- Companies table
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    logo_url text,
    website text,
    industry text,
    size text,
    location text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Job postings table
CREATE TABLE public.job_postings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirements text[],
    type text NOT NULL, -- full-time, part-time, internship
    location text NOT NULL,
    salary_range text,
    skills_required text[],
    created_at timestamptz DEFAULT now() NOT NULL,
    expires_at timestamptz NOT NULL,
    status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft'))
);

-- Company followers junction table with role
CREATE TABLE public.company_followers (
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (company_id, user_id)
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_followers ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Companies are viewable by everyone"
    ON public.companies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create companies"
    ON public.companies FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Company owners can update their company"
    ON public.companies FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.company_followers 
        WHERE company_id = companies.id 
        AND user_id = auth.uid() 
        AND role = 'owner'
    ));

-- Job postings policies
CREATE POLICY "Job postings are viewable by everyone"
    ON public.job_postings FOR SELECT
    USING (true);

CREATE POLICY "Company owners can manage job postings"
    ON public.job_postings FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.company_followers 
        WHERE company_id = job_postings.company_id 
        AND user_id = auth.uid() 
        AND role = 'owner'
    ));

-- Company followers policies
CREATE POLICY "Company followers are viewable by everyone"
    ON public.company_followers FOR SELECT
    USING (true);

CREATE POLICY "Users can follow/unfollow companies"
    ON public.company_followers FOR ALL
    USING (auth.uid() = user_id);

-- Insert sample companies
INSERT INTO public.companies (name, description, industry, size, location) VALUES
('TechStart Labs', 'Innovative software development company', 'Technology', '50-100', 'Cincinnati, OH'),
('EcoSolutions', 'Sustainable energy solutions provider', 'Environmental', '100-500', 'Cincinnati, OH'),
('HealthTech Inc', 'Healthcare technology solutions', 'Healthcare', '500+', 'Cincinnati, OH'),
('DataMinds', 'Data analytics and AI solutions', 'Technology', '10-50', 'Cincinnati, OH'),
('DesignCraft', 'Creative design agency', 'Design', '10-50', 'Cincinnati, OH');

-- Create initial company owners
INSERT INTO public.company_followers (company_id, user_id, role)
SELECT 
    c.id as company_id,
    p.id as user_id,
    'owner' as role
FROM public.companies c
CROSS JOIN (
    SELECT id FROM public.profiles LIMIT 1
) p;

-- Insert sample job postings
INSERT INTO public.job_postings (
    company_id,
    title,
    description,
    requirements,
    type,
    location,
    salary_range,
    skills_required,
    expires_at
)
SELECT 
    id as company_id,
    'Software Engineer Intern',
    'Join our team as a software engineer intern and work on cutting-edge projects',
    ARRAY['Currently enrolled in Computer Science or related field', 'Strong programming fundamentals', 'Team player'],
    'internship',
    'Cincinnati, OH',
    '$20-25/hour',
    ARRAY['JavaScript', 'React', 'Node.js'],
    now() + interval '30 days'
FROM public.companies
WHERE name = 'TechStart Labs';

INSERT INTO public.job_postings (
    company_id,
    title,
    description,
    requirements,
    type,
    location,
    salary_range,
    skills_required,
    expires_at
)
SELECT 
    id as company_id,
    'UX/UI Designer',
    'Create beautiful and intuitive user experiences for our clients',
    ARRAY['Bachelor''s in Design or related field', 'Portfolio of work', '2+ years experience'],
    'full-time',
    'Cincinnati, OH',
    '$60,000-80,000/year',
    ARRAY['Figma', 'Adobe Creative Suite', 'User Research'],
    now() + interval '30 days'
FROM public.companies
WHERE name = 'DesignCraft';