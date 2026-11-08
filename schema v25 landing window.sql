-- Trend Electro: персональний таймер лендінгу. Кожен відвідувач отримує своє вікно (скільки годин вказано в адмінці),
-- знижка діє тільки в цей час і реально закінчується на сервері. Можна запускати повторно.
create table if not exists public.landing_visits (
  slug text not null, vid text not null, started_at timestamptz not null default now(),
  primary key (slug, vid)
);
alter table public.landing_visits enable row level security;

create or replace function public.landing_window(p_slug text, p_vid text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare th jsonb; disc numeric; win numeric; st timestamptz; ex timestamptz; ends_ timestamptz;
        cd text; lft int;
begin
  select theme into th from public.landings where slug = p_slug and active;
  if th is null then return null; end if;
  disc := coalesce(nullif(th->>'disc','')::numeric, 0);
  win  := coalesce(nullif(th->>'win','')::numeric, 0);
  if disc <= 0 or win <= 0 then return null; end if;
  if p_vid is null or length(p_vid) < 8 or length(p_vid) > 64 then return null; end if;

  insert into public.landing_visits (slug, vid) values (p_slug, p_vid) on conflict do nothing;
  select started_at into st from public.landing_visits where slug = p_slug and vid = p_vid;
  ex := st + make_interval(secs => win * 3600);
  if coalesce(th->>'endsIso', '') <> '' then
    ends_ := (th->>'endsIso')::timestamptz;
    ex := least(ex, ends_);
  end if;
  lft := greatest(0, floor(extract(epoch from (ex - now())))::int);
  cd := 'LND-' || upper(p_slug) || '-' || upper(substr(md5(p_vid || p_slug), 1, 6));

  if lft > 0 then
    insert into public.promo_codes (code, percent, uses_left, expires_at, active, title, client_id, show_all)
    values (cd, disc, null, ex, true, 'Лендінг (персональна): ' || p_slug, null, false)
    on conflict (code) do update set percent = excluded.percent, expires_at = excluded.expires_at, active = true;
  end if;
  if random() < 0.02 then
    delete from public.promo_codes where code like 'LND-%-%' and expires_at < now() - interval '7 days';
  end if;
  return jsonb_build_object('code', case when lft > 0 then cd else null end, 'left', lft, 'pct', disc);
end $$;
revoke all on function public.landing_window(text, text) from public;
grant execute on function public.landing_window(text, text) to anon, authenticated;
