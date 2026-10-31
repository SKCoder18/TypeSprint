-- Server-only durable room state. No user emails or passwords are stored here.
create table if not exists public.live_race_state (
 id boolean primary key default true check(id),
 revision bigint not null default 0,
 state jsonb
);
alter table public.live_race_state enable row level security;
revoke all on public.live_race_state from public,anon,authenticated;
grant select,update on public.live_race_state to service_role;
insert into public.live_race_state(id) values(true) on conflict do nothing;
