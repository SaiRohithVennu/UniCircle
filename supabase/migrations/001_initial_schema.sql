  -- Enable RLS
  alter table auth.users enable row level security;
  
  -- Profiles table
  create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text not null unique,
    name text not null,
    department text not null,
    avatar_url text,
    bio text,
    interests text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
  
  -- Projects table
  create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    owner_id uuid references public.profiles(id) on delete cascade not null,
    image_url text,
    tags text[],
    status text check (status in ('planning', 'in-progress', 'completed')) default 'planning',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
  
  -- Project members junction table
  create table public.project_members (
    project_id uuid references public.projects(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete cascade,
    role text check (role in ('owner', 'member')) default 'member',
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (project_id, user_id)
  );
  
  -- RLS Policies
  
  -- Profiles policies
  create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);
  
  create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);
  
  create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);
  
  -- Projects policies
  create policy "Projects are viewable by everyone"
    on public.projects for select
    using (true);
  
  create policy "Authenticated users can create projects"
    on public.projects for insert
    with check (auth.uid() = owner_id);
  
  create policy "Project owners can update their projects"
    on public.projects for update
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);
  
  create policy "Project owners can delete their projects"
    on public.projects for delete
    using (auth.uid() = owner_id);
  
  -- Project members policies
  create policy "Project members are viewable by everyone"
    on public.project_members for select
    using (true);
  
  create policy "Project owners can manage members"
    on public.project_members for all
    using (
      auth.uid() in (
        select owner_id from public.projects
        where id = project_members.project_id
      )
    );
  
  create policy "Users can join projects"
    on public.project_members for insert
    with check (auth.uid() = user_id);
  
  -- Functions and triggers
  create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer set search_path = public
  as $$
  begin
    insert into public.profiles (id, email, name, department)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'department'
    );
    return new;
  end;
  $$;
  
  -- Trigger for new user creation
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  
  -- Update timestamps trigger
  create or replace function public.handle_updated_at()
  returns trigger
  language plpgsql
  as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$;
  
  create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.handle_updated_at();
  
  create trigger handle_projects_updated_at
    before update on public.projects
    for each row execute procedure public.handle_updated_at();