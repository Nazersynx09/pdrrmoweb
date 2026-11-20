alter table public.hazard_maps
  drop constraint if exists hazard_maps_type_check;

alter table public.hazard_maps
  add constraint hazard_maps_type_check
  check (
    type in (
      'flood',
      'landslide',
      'liquefaction',
      'earthquake',
      'storm_surge',
      'tsunami'
    )
  );
