-- Supabase schema proposal for FinanceFlow
-- Supports multi-user PDF ingestion, validation, and analytics.

create extension if not exists "pgcrypto";

-- User profiles (ties to auth.users in Supabase)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Financial accounts owned by a user
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  institution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists accounts_user_id_idx
  on public.accounts(user_id);

-- PDF uploads stored in Supabase Storage
create table if not exists public.statement_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  storage_bucket text not null,
  storage_path text not null,
  original_filename text,
  status text not null default 'uploaded', -- uploaded | processing | ready_for_review | imported | failed
  error_message text,
  uploaded_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists statement_uploads_user_id_idx
  on public.statement_uploads(user_id);

-- Processing runs for an upload (OpenAI-backed extraction)
create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.statement_uploads(id) on delete cascade,
  extractor_version text not null,
  status text not null default 'queued', -- queued | running | succeeded | failed
  started_at timestamptz,
  finished_at timestamptz,
  error_message text
);

create index if not exists processing_jobs_upload_id_idx
  on public.processing_jobs(upload_id);

-- Request/response log for OpenAI processing (optional but useful for validation audits)
create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.processing_jobs(id) on delete cascade,
  model text not null,
  prompt text not null,
  response text,
  tokens_prompt integer,
  tokens_completion integer,
  request_metadata jsonb,
  response_metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_request_logs_job_id_idx
  on public.ai_request_logs(job_id);

-- Parsed rows pending review (quick validation table)
create table if not exists public.transaction_drafts (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.statement_uploads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  date timestamptz not null,
  description text not null,
  merchant text,
  amount numeric(12,2) not null,
  currency text not null default 'MXN',
  type text not null, -- debit | credit | investment | transfer, etc.
  category text,
  statement text,
  confidence integer,
  created_at timestamptz not null default now()
);

create index if not exists transaction_drafts_upload_id_idx
  on public.transaction_drafts(upload_id);

-- Final transactions after confirmation/import
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  date timestamptz not null,
  description text not null,
  merchant text,
  amount numeric(12,2) not null,
  currency text not null default 'MXN',
  type text not null,
  category text,
  statement text,
  confidence integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx
  on public.transactions(user_id);

create index if not exists transactions_account_id_idx
  on public.transactions(account_id);

create index if not exists transactions_date_idx
  on public.transactions(date);

-- Optional categories per user for analytics and classification
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null, -- expense | income | investment | transfer
  created_at timestamptz not null default now()
);

create unique index if not exists categories_user_name_unique
  on public.categories(user_id, name);

-- Minimal RLS suggestions (optional, enable if using Supabase auth)
-- alter table public.profiles enable row level security;
-- create policy "profiles self access" on public.profiles
--   for all using (auth.uid() = id) with check (auth.uid() = id);
--
-- alter table public.accounts enable row level security;
-- create policy "accounts owner access" on public.accounts
--   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
--
-- alter table public.statement_uploads enable row level security;
-- create policy "uploads owner access" on public.statement_uploads
--   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
--
-- alter table public.transaction_drafts enable row level security;
-- create policy "drafts owner access" on public.transaction_drafts
--   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
--
-- alter table public.transactions enable row level security;
-- create policy "transactions owner access" on public.transactions
--   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
--
-- alter table public.categories enable row level security;
-- create policy "categories owner access" on public.categories
--   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
