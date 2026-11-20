create table if not exists public.pdrmo_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) > 0),
  video_url text not null,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists pdrmo_videos_active_created_at_idx
  on public.pdrmo_videos (is_active, created_at desc);

alter table public.pdrmo_videos enable row level security;
revoke all on public.pdrmo_videos from anon, authenticated;
grant all on public.pdrmo_videos to service_role;
