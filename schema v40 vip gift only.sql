-- Trend Electro: картка VIP 20% лише у подарунок (автоматично не нараховується). Можна запускати повторно.
update public.settings
set value = jsonb_set(value, '{tiers}',
  (select jsonb_agg(case when t->>'k' = 'vip' then jsonb_build_object('k','vip','p',20,'f',0) else t end)
   from jsonb_array_elements(value->'tiers') t))
where key = 'loyalty' and value ? 'tiers';

create or replace function public.loy_recalc(p_uid uuid) returns void
language plpgsql security definer set search_path = public as $$
declare sp numeric; t jsonb; k text := 'silver'; pc numeric := 5; g text;
begin
  if p_uid is null then return; end if;
  select coalesce(sum(total), 0) into sp from public.orders where user_id = p_uid and status = 'done';
  select sp + coalesce(loyalty_adj, 0), card_gift into sp, g from public.profiles where id = p_uid;
  if sp is null then return; end if;
  for t in select * from jsonb_array_elements(public.loy_cfg()->'tiers') where value->>'k' <> 'vip' order by (value->>'f')::numeric loop
    if (t->>'f')::numeric <= sp then k := t->>'k'; pc := (t->>'p')::numeric; end if;
  end loop;
  if g is not null then
    for t in select * from jsonb_array_elements(public.loy_cfg()->'tiers') where value->>'k' = g loop
      if (t->>'p')::numeric > pc then k := t->>'k'; pc := (t->>'p')::numeric; end if;
    end loop;
  end if;
  update public.profiles set loyalty_spent = sp, card_tier = k, card_pct = pc where id = p_uid;
end $$;
revoke all on function public.loy_recalc(uuid) from public, anon, authenticated;

select public.loy_recalc(id) from public.profiles;
