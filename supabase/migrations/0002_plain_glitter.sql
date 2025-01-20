/*
  # Add Messages Table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text)
      - `sender_id` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for authenticated users to read all messages
    - Add policy for users to create their own messages
*/

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

alter table public.messages enable row level security;

create policy "Messages are viewable by authenticated users"
  on public.messages for select
  to authenticated
  using (true);

create policy "Authenticated users can insert messages"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = sender_id);