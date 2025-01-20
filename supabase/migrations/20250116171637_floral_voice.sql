/*
  # Fix messages table schema

  1. Changes
    - Drop and recreate messages table with proper foreign key relationship
    - Add RLS policies for messages
    - Add indexes for better performance

  2. Security
    - Enable RLS on messages table
    - Add policies for authenticated users to read and create messages
*/

-- Drop existing messages table if it exists
DROP TABLE IF EXISTS public.messages;

-- Create messages table with proper foreign key relationship
CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text NOT NULL,
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Add index for better query performance
CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);
CREATE INDEX messages_sender_id_idx ON public.messages(sender_id);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Messages are viewable by authenticated users"
    ON public.messages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert messages"
    ON public.messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);