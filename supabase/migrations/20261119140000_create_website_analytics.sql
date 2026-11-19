create table if not exists public.website_analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view', 'file_download')),
  page_path text not null check (
    page_path like '/%'
    and page_path not like '//%'
    and position('?' in page_path) = 0
    and position('#' in page_path) = 0
  ),
  target_path text check (
    target_path is null
    or (
      length(target_path) <= 1024
      and position('?' in target_path) = 0
      and position('#' in target_path) = 0
    )
  ),
  referrer_domain text check (
    referrer_domain is null
    or length(referrer_domain) <= 253
  ),
  device_category text check (
    device_category is null
    or device_category in ('mobile', 'tablet', 'desktop')
  ),
  created_at timestamptz not null default now(),
  check (
    (event_type = 'page_view' and target_path is null)
    or (event_type = 'file_download' and target_path is not null)
  )
);

create index if not exists website_analytics_events_created_at_idx
  on public.website_analytics_events (created_at desc);

create index if not exists website_analytics_events_type_created_at_idx
  on public.website_analytics_events (event_type, created_at desc);

alter table public.website_analytics_events enable row level security;
revoke all on public.website_analytics_events from anon, authenticated;
grant all on public.website_analytics_events to service_role;

create or replace function public.get_website_analytics(p_since timestamptz)
returns jsonb
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  with recent_events as (
    select event_type, page_path, target_path, referrer_domain, device_category
    from public.website_analytics_events
    where created_at >= p_since
  ),
  page_views as (
    select page_path, referrer_domain, device_category
    from recent_events
    where event_type = 'page_view'
  ),
  page_totals as (
    select page_path, count(*) as views
    from page_views
    group by page_path
    order by views desc, page_path
    limit 5
  ),
  referrer_totals as (
    select coalesce(nullif(referrer_domain, ''), 'Direct') as source, count(*) as views
    from page_views
    group by source
    order by views desc, source
    limit 5
  ),
  device_totals as (
    select device_category as category, count(*) as views
    from page_views
    where device_category is not null
    group by device_category
    order by views desc, category
  ),
  download_totals as (
    select target_path, count(*) as downloads
    from recent_events
    where event_type = 'file_download'
    group by target_path
    order by downloads desc, target_path
    limit 5
  )
  select jsonb_build_object(
    'pageViews', (select count(*) from page_views),
    'topPages', coalesce(
      (select jsonb_agg(jsonb_build_object('path', page_path, 'views', views) order by views desc, page_path) from page_totals),
      '[]'::jsonb
    ),
    'referrers', coalesce(
      (select jsonb_agg(jsonb_build_object('source', source, 'views', views) order by views desc, source) from referrer_totals),
      '[]'::jsonb
    ),
    'devices', coalesce(
      (select jsonb_agg(jsonb_build_object('category', category, 'views', views) order by views desc, category) from device_totals),
      '[]'::jsonb
    ),
    'downloads', coalesce(
      (select jsonb_agg(jsonb_build_object('targetPath', target_path, 'downloads', downloads) order by downloads desc, target_path) from download_totals),
      '[]'::jsonb
    )
  );
$$;

revoke all on function public.get_website_analytics(timestamptz) from public, anon, authenticated;
grant execute on function public.get_website_analytics(timestamptz) to service_role;
