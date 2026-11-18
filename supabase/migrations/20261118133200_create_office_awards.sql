create table if not exists public.office_awards (
  id uuid primary key default gen_random_uuid(),
  year integer not null check (year between 1900 and 2200),
  category text not null,
  name text not null,
  region text not null default '',
  class_rating text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists office_awards_active_year_idx
  on public.office_awards (is_active, year desc);

create unique index if not exists office_awards_year_category_name_idx
  on public.office_awards (year, category, name);

alter table public.office_awards enable row level security;

insert into public.office_awards
  (year, category, name, region, class_rating)
values
  (2024, 'Special Awards', 'Gawad Kalasag 2023 - DRRM', 'National', 'Bronze Awardee'),
  (2024, 'Special Awards', 'Resculympics 2024 - DRRM Olympics', 'Regional', 'Champion'),
  (2023, 'Special Awards', 'Iloilo Rescue Team Alpha', 'VI', 'SA-GK'),
  (2022, 'Special Awards', 'Provincial EROI Team', 'Local', 'Recognition')
on conflict (year, category, name) do nothing;
