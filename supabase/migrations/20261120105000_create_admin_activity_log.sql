create table if not exists public.admin_activity (
  id uuid primary key default gen_random_uuid(),
  action text not null check (action in ('created', 'updated', 'deleted')),
  entity_type text not null,
  entity_id text not null,
  item_label text not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_created_at_idx
  on public.admin_activity (created_at desc);

alter table public.admin_activity enable row level security;
revoke all on public.admin_activity from anon, authenticated;
grant select on public.admin_activity to service_role;

create or replace function public.log_admin_content_activity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  changed_row jsonb;
  activity_action text;
  activity_entity_type text;
begin
  if tg_op = 'DELETE' then
    changed_row := to_jsonb(old);
  else
    changed_row := to_jsonb(new);
  end if;

  if tg_op = 'UPDATE' and to_jsonb(new) is not distinct from to_jsonb(old) then
    return new;
  end if;

  activity_action := case tg_op
    when 'INSERT' then 'created'
    when 'UPDATE' then 'updated'
    when 'DELETE' then 'deleted'
  end;
  activity_entity_type := case tg_table_name
    when 'news' then 'News article'
    when 'advisories' then 'Advisory'
    when 'hazard_maps' then 'Hazard map'
    when 'resources' then 'Resource'
    when 'issuances' then 'Issuance'
    when 'carousel_slides' then 'Carousel slide'
    when 'office_awards' then 'Award'
    else tg_table_name
  end;

  insert into public.admin_activity (
    action,
    entity_type,
    entity_id,
    item_label
  )
  values (
    activity_action,
    activity_entity_type,
    coalesce(changed_row ->> 'id', 'unknown'),
    coalesce(
      nullif(btrim(changed_row ->> 'title'), ''),
      nullif(btrim(changed_row ->> 'name'), ''),
      nullif(btrim(changed_row ->> 'number'), ''),
      'Untitled item'
    )
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.log_admin_content_activity() from public, anon, authenticated;

drop trigger if exists news_admin_activity on public.news;
create trigger news_admin_activity
after insert or update or delete on public.news
for each row execute function public.log_admin_content_activity();

drop trigger if exists advisories_admin_activity on public.advisories;
create trigger advisories_admin_activity
after insert or update or delete on public.advisories
for each row execute function public.log_admin_content_activity();

drop trigger if exists hazard_maps_admin_activity on public.hazard_maps;
create trigger hazard_maps_admin_activity
after insert or update or delete on public.hazard_maps
for each row execute function public.log_admin_content_activity();

drop trigger if exists resources_admin_activity on public.resources;
create trigger resources_admin_activity
after insert or update or delete on public.resources
for each row execute function public.log_admin_content_activity();

drop trigger if exists issuances_admin_activity on public.issuances;
create trigger issuances_admin_activity
after insert or update or delete on public.issuances
for each row execute function public.log_admin_content_activity();

drop trigger if exists carousel_slides_admin_activity on public.carousel_slides;
create trigger carousel_slides_admin_activity
after insert or update or delete on public.carousel_slides
for each row execute function public.log_admin_content_activity();

drop trigger if exists office_awards_admin_activity on public.office_awards;
create trigger office_awards_admin_activity
after insert or update or delete on public.office_awards
for each row execute function public.log_admin_content_activity();

notify pgrst, 'reload schema';
