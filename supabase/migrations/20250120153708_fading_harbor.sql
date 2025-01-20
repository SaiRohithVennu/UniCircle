/*
  # Add Feed System

  1. New Tables
    - `feed_items`
      - Social feed posts and activity
    - `feed_likes`
      - Track likes on feed items
    - `feed_comments`
      - Comments on feed items

  2. Security
    - Enable RLS on all tables
    - Add policies for viewing and managing content
*/

-- Feed items table
CREATE TABLE public.feed_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    image_url text,
    type text NOT NULL CHECK (type IN ('post', 'project', 'job', 'announcement')),
    reference_id uuid, -- For linking to projects, jobs, etc.
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Feed likes table
CREATE TABLE public.feed_likes (
    feed_item_id uuid REFERENCES public.feed_items(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (feed_item_id, user_id)
);

-- Feed comments table
CREATE TABLE public.feed_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_item_id uuid REFERENCES public.feed_items(id) ON DELETE CASCADE NOT NULL,
    author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

-- Feed items policies
CREATE POLICY "Feed items are viewable by everyone"
    ON public.feed_items FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create feed items"
    ON public.feed_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their feed items"
    ON public.feed_items FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their feed items"
    ON public.feed_items FOR DELETE
    USING (auth.uid() = author_id);

-- Feed likes policies
CREATE POLICY "Feed likes are viewable by everyone"
    ON public.feed_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like/unlike feed items"
    ON public.feed_likes FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Feed comments policies
CREATE POLICY "Feed comments are viewable by everyone"
    ON public.feed_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON public.feed_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their comments"
    ON public.feed_comments FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
    ON public.feed_comments FOR DELETE
    USING (auth.uid() = author_id);

-- Insert sample feed items
INSERT INTO public.feed_items (
    author_id,
    content,
    type
)
SELECT 
    id as author_id,
    'Excited to join the UniCircle community! Looking forward to connecting with fellow students and working on innovative projects.',
    'post'
FROM public.profiles
LIMIT 1;

-- Create function to automatically create feed items for new projects
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.feed_items (
        author_id,
        content,
        type,
        reference_id
    ) VALUES (
        NEW.owner_id,
        'Started a new project: ' || NEW.name || chr(10) || NEW.description,
        'project',
        NEW.id
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new projects
CREATE TRIGGER on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_project();

-- Create function to automatically create feed items for new job postings
CREATE OR REPLACE FUNCTION public.handle_new_job_posting()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_name text;
BEGIN
    -- Get company name
    SELECT name INTO company_name
    FROM public.companies
    WHERE id = NEW.company_id;

    -- Create feed item
    INSERT INTO public.feed_items (
        author_id,
        content,
        type,
        reference_id
    )
    SELECT
        cf.user_id,
        'New job opportunity at ' || company_name || ': ' || NEW.title || chr(10) || NEW.description,
        'job',
        NEW.id
    FROM public.company_followers cf
    WHERE cf.company_id = NEW.company_id AND cf.role = 'owner'
    LIMIT 1;

    RETURN NEW;
END;
$$;

-- Create trigger for new job postings
CREATE TRIGGER on_job_posting_created
    AFTER INSERT ON public.job_postings
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_job_posting();