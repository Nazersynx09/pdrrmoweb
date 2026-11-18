alter table public.office_awards
  add column if not exists scan_url text;
