create or replace function public.get_website_visit_trend()
returns jsonb
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  with local_today as (
    select (now() at time zone 'Asia/Manila')::date as today
  ),
  days as (
    select generate_series(
      (local_today.today - 29)::timestamp,
      local_today.today::timestamp,
      interval '1 day'
    )::date as visit_date
    from local_today
  ),
  daily_visits as (
    select
      (created_at at time zone 'Asia/Manila')::date as visit_date,
      count(*) as visits
    from public.website_analytics_events
    where event_type = 'page_view'
      and created_at >= (
        (select today - 29 from local_today)::timestamp
        at time zone 'Asia/Manila'
      )
    group by 1
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'date', to_char(days.visit_date, 'YYYY-MM-DD'),
        'visits', coalesce(daily_visits.visits, 0)
      )
      order by days.visit_date
    ),
    '[]'::jsonb
  )
  from days
  left join daily_visits using (visit_date);
$$;

revoke all on function public.get_website_visit_trend() from public, anon, authenticated;
grant execute on function public.get_website_visit_trend() to service_role;

notify pgrst, 'reload schema';
