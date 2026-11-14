-- v41: подарункові посилання на картки + сповіщення адміну (адмінка + Telegram)
-- Безпечно запускати повторно.

create table if not exists public.gift_links(
  code text primary key,
  tier text not null check (tier in ('silver','gold','platinum','vip')),
  note text,
  created_at timestamptz not null default now(),
  used_by uuid references public.profiles(id) on delete set null,
  used_at timestamptz,
  activated_at timestamptz,
  active boolean not null default true
);
alter table public.gift_links enable row level security;
drop policy if exists gift_links_admin on public.gift_links;
create policy gift_links_admin on public.gift_links for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.admin_notes(
  id bigserial primary key,
  kind text not null,
  title text not null,
  body text,
  user_id uuid references public.profiles(id) on delete set null,
  ref text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
alter table public.admin_notes enable row level security;
drop policy if exists admin_notes_admin on public.admin_notes;
create policy admin_notes_admin on public.admin_notes for all using (public.is_admin()) with check (public.is_admin());

-- що бачить людина, яка відкрила посилання (без доступу до списку кодів)
create or replace function public.gift_info(p_code text)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object('tier', tier, 'used', used_by is not null, 'mine', used_by is not null and used_by = auth.uid())
  from public.gift_links where code = upper(trim(p_code)) and active
$$;

-- внутрішня: прив'язати подарунок до клієнта, сповістити адміна
create or replace function public.gift_attach(p_uid uuid, p_code text)
returns text language plpgsql security definer set search_path to 'public' as $$
declare g public.gift_links; pr public.profiles; tok text; cid text; txt text;
  tn jsonb := '{"silver":"Silver 5%","gold":"Gold 10%","platinum":"Platinum 15%","vip":"VIP 20%"}';
begin
  if p_uid is null or coalesce(trim(p_code), '') = '' then return 'invalid'; end if;
  select * into g from public.gift_links where code = upper(trim(p_code)) and active for update;
  if not found then return 'invalid'; end if;
  if g.used_by is not null then return case when g.used_by = p_uid then 'already' else 'used' end; end if;
  update public.gift_links set used_by = p_uid, used_at = now() where code = g.code;
  select * into pr from public.profiles where id = p_uid;
  insert into public.admin_notes(kind, title, body, user_id, ref)
  values ('gift', '🎁 Подарунок отримано: ' || (tn->>g.tier),
          coalesce(nullif(pr.full_name, ''), 'Без імені') || coalesce(' · ' || nullif(pr.phone, ''), '') || coalesce(' · ' || nullif(g.note, ''), ''),
          p_uid, g.code);
  select value into tok from public.app_secrets where name = 'telegram_bot_token';
  select value into cid from public.app_secrets where name = 'telegram_chat_id';
  if tok is not null and cid is not null then
    begin
      txt := '🎁 Клієнт забрав подарунок: ' || (tn->>g.tier)
          || E'\n' || coalesce(nullif(pr.full_name, ''), 'Без імені') || coalesce(', ' || nullif(pr.phone, ''), '')
          || coalesce(E'\nКому дарували: ' || nullif(g.note, ''), '')
          || E'\nКод: ' || g.code
          || E'\n\nАктивуйте картку: https://trendelectro.com.ua/admin.html#gifts';
      perform net.http_post(
        url := 'https://api.telegram.org/bot' || tok || '/sendMessage',
        headers := '{"Content-Type":"application/json"}'::jsonb,
        body := jsonb_build_object('chat_id', cid, 'text', left(txt, 3900)));
    exception when others then null;  -- Telegram ніколи не блокує реєстрацію
    end;
  end if;
  return 'ok';
end $$;
revoke all on function public.gift_attach(uuid, text) from public, anon, authenticated;

-- клієнт, який уже має акаунт, забирає подарунок
create or replace function public.claim_gift(p_code text)
returns text language plpgsql security definer set search_path to 'public' as $$
begin
  if auth.uid() is null then return 'login'; end if;
  return public.gift_attach(auth.uid(), p_code);
end $$;
revoke all on function public.claim_gift(text) from public, anon;
grant execute on function public.claim_gift(text) to authenticated;

-- адмін активує подаровану картку
create or replace function public.admin_activate_gift(p_code text)
returns void language plpgsql security definer set search_path to 'public' as $$
declare g public.gift_links;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select * into g from public.gift_links where code = p_code;
  if not found or g.used_by is null then raise exception 'Подарунок ще ніхто не забрав'; end if;
  perform public.admin_set_card_gift(g.used_by, g.tier);
  update public.gift_links set activated_at = now() where code = p_code;
  update public.admin_notes set read_at = coalesce(read_at, now()) where ref = p_code;
end $$;
revoke all on function public.admin_activate_gift(text) from public, anon;
grant execute on function public.admin_activate_gift(text) to authenticated;
grant execute on function public.gift_info(text) to anon, authenticated;

-- реєстрація за подарунковим посиланням
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path to 'public' as $function$
declare b date;
begin
  begin b := nullif(new.raw_user_meta_data->>'birthday','')::date; exception when others then b := null; end;
  if b is not null and (b > current_date or b < date '1900-01-01') then b := null; end if;
  insert into public.profiles (id, full_name, phone, card_number, birthday)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone',
          'TE-' || nextval('card_seq'), b);
  if coalesce(new.raw_user_meta_data->>'gift', '') <> '' then
    begin perform public.gift_attach(new.id, new.raw_user_meta_data->>'gift');
    exception when others then null; end;
  end if;
  return new;
end $function$;
