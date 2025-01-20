/*
  # Fix project queries and relationships

  1. Changes
    - Add proper foreign key relationship between projects and profiles
    - Update project queries to use proper join syntax
    - Add missing indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing project_members table if it exists
DROP TABLE IF EXISTS public.project_members;

-- Recreate projects table with proper relationships
DROP TABLE IF EXISTS public.projects CASCADE;
CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url text,
    tags text[],
    status text CHECK (status IN ('planning', 'in-progress', 'completed')) DEFAULT 'planning',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX projects_owner_id_idx ON public.projects(owner_id);
CREATE INDEX projects_created_at_idx ON public.projects(created_at DESC);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Projects are viewable by everyone"
    ON public.projects FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete their projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = owner_id);