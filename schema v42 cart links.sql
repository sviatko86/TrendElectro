-- Кошики за посиланням (виконано в Supabase 16.11.2026)
create table if not exists public.cart_links(
  code text primary key, items jsonb not null, promo text, note text,
  created_at timestamptz not null default now(), expires_at timestamptz,
  active boolean not null default true, opened_at timestamptz, opens int not null default 0, done_at timestamptz);
alter table public.cart_links enable row level security;
drop policy if exists cart_links_admin on public.cart_links;
create policy cart_links_admin on public.cart_links for all using (public.is_admin()) with check (public.is_admin());
create or replace function public.cart_get(p_code text) returns jsonb language plpgsql security definer set search_path to 'public' as $f$
declare r public.cart_links;
begin
  select * into r from public.cart_links where code = upper(trim(p_code)) and active and (expires_at is null or expires_at > now());
  if not found then return null; end if;
  update public.cart_links set opened_at = coalesce(opened_at, now()), opens = opens + 1 where code = r.code;
  return jsonb_build_object('items', r.items, 'promo', r.promo, 'note', r.note, 'done', r.done_at is not null);
end $f$;
grant execute on function public.cart_get(text) to anon, authenticated;
create or replace function public.cart_done(p_code text) returns void language sql security definer set search_path to 'public' as $f$
  update public.cart_links set done_at = now() where code = upper(trim(p_code)) and done_at is null and active;
$f$;
grant execute on function public.cart_done(text) to anon, authenticated;
