-- Apply once in the Supabase SQL editor. Additive; does not touch local progress.
create table public.profiles(id uuid primary key references auth.users on delete cascade,display_name text not null check(display_name ~ '^[A-Za-z0-9 _-]{3,24}$' and display_name !~* '(admin|moderator|fuck|shit|nazi)'),bests jsonb not null default '{}',created_at timestamptz default now());
create table public.typing_sessions(id bigint generated always as identity primary key,user_id uuid not null references auth.users on delete cascade,local_id text not null,data jsonb not null check(octet_length(data::text)<60000),verified boolean not null default false,created_at timestamptz default now(),unique(user_id,local_id));
create table public.lesson_progress(user_id uuid references auth.users on delete cascade,lesson int check(lesson between 0 and 7),completed boolean not null default true,primary key(user_id,lesson));
create table public.story_progress(user_id uuid references auth.users on delete cascade,story_id text check(length(story_id)<=40),data jsonb not null check(octet_length(data::text)<60000),primary key(user_id,story_id));
create table public.achievements(user_id uuid references auth.users on delete cascade,badge text not null,verified boolean not null default false,created_at timestamptz default now(),primary key(user_id,badge));
create table public.multiplayer_rooms(id uuid primary key,code text not null,status text not null check(status in ('finished','cancelled')),created_at timestamptz default now());
create table public.multiplayer_matches(id uuid primary key,room_id uuid references public.multiplayer_rooms(id),winner_id uuid references auth.users on delete set null,created_at timestamptz default now());
create table public.match_participants(match_id uuid references public.multiplayer_matches on delete cascade,user_id uuid references auth.users on delete cascade,wpm numeric check(wpm between 0 and 500),accuracy numeric check(accuracy between 0 and 100),distance numeric check(distance between 0 and 1500),created_at timestamptz default now(),primary key(match_id,user_id));
create table public.leaderboard_entries(match_id uuid references public.multiplayer_matches on delete cascade,user_id uuid references auth.users on delete cascade,wpm numeric check(wpm between 0 and 500),won boolean not null,created_at timestamptz default now(),primary key(match_id,user_id));
create index typing_sessions_user on public.typing_sessions(user_id,created_at desc);
create index participants_user on public.match_participants(user_id,created_at desc);
create index leaderboard_date on public.leaderboard_entries(created_at desc,user_id);
alter table public.profiles enable row level security;
create policy profile_read on public.profiles for select to authenticated using(id=auth.uid());
create policy profile_insert on public.profiles for insert to authenticated with check(id=auth.uid());
create policy profile_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
do $$ declare t text;begin foreach t in array array['typing_sessions','lesson_progress','story_progress','achievements'] loop execute format('alter table public.%I enable row level security',t);execute format('create policy own_read on public.%I for select to authenticated using(user_id=auth.uid())',t);end loop;end $$;
create policy session_write on public.typing_sessions for insert to authenticated with check(user_id=auth.uid() and verified=false);
create policy session_update on public.typing_sessions for update to authenticated using(user_id=auth.uid() and not verified) with check(user_id=auth.uid() and not verified);
create policy lesson_write on public.lesson_progress for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy story_write on public.story_progress for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy badge_write on public.achievements for insert to authenticated with check(user_id=auth.uid() and verified=false and badge in ('first-test','wpm-30','wpm-50','accuracy-98','academy','story'));
create policy badge_update on public.achievements for update to authenticated using(user_id=auth.uid() and not verified) with check(user_id=auth.uid() and not verified and badge in ('first-test','wpm-30','wpm-50','accuracy-98','academy','story'));
alter table public.multiplayer_rooms enable row level security;
alter table public.multiplayer_matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.leaderboard_entries enable row level security;
create policy participant_read on public.match_participants for select to authenticated using(user_id=auth.uid());
create policy match_read on public.multiplayer_matches for select to authenticated using(exists(select 1 from public.match_participants p where p.match_id=id and p.user_id=auth.uid()));
-- No browser write policies for rooms, matches, participants or verified rankings.
create function public.record_race(match_id uuid,room_code text,winner_id uuid,participants jsonb) returns void language plpgsql security definer set search_path=public as $$
declare p jsonb;uid uuid;total int;wins int;
begin
 if jsonb_array_length(participants)<>2 then raise exception 'Two participants required';end if;
 if (select count(distinct x->>'user_id') from jsonb_array_elements(participants) x)<>2 then raise exception 'Duplicate player';end if;
 if winner_id is not null and not exists(select 1 from jsonb_array_elements(participants) x where (x->>'user_id')::uuid=winner_id) then raise exception 'Invalid winner';end if;
 insert into multiplayer_rooms(id,code,status) values(match_id,room_code,'finished');
 insert into multiplayer_matches(id,room_id,winner_id) values(match_id,match_id,winner_id);
 for p in select * from jsonb_array_elements(participants) loop
 uid=(p->>'user_id')::uuid;
 insert into match_participants(match_id,user_id,wpm,accuracy,distance) values(match_id,uid,(p->>'wpm')::numeric,(p->>'accuracy')::numeric,least(1400,(p->>'distance')::numeric));
 insert into leaderboard_entries(match_id,user_id,wpm,won) values(match_id,uid,(p->>'wpm')::numeric,coalesce(uid=winner_id,false));
 select count(*),count(*) filter(where won) into total,wins from leaderboard_entries where user_id=uid;
 if wins>0 then insert into achievements(user_id,badge,verified) values(uid,'first-win',true) on conflict do nothing;end if;
 if total>=10 then insert into achievements(user_id,badge,verified) values(uid,'ten-races',true) on conflict do nothing;end if;
 end loop;
end $$;
revoke all on function public.record_race(uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.record_race(uuid,text,uuid,jsonb) to service_role;
create function public.race_leaderboard(weekly boolean default false,sort_by text default 'wins') returns table(user_id uuid,display_name text,wins bigint,played bigint,best_wpm numeric,rating bigint) language sql stable security definer set search_path=public as $$
 select l.user_id,coalesce(p.display_name,'Player'),count(*) filter(where won),count(*),round(max(l.wpm)),greatest(0,1000+20*(count(*) filter(where won))-10*(count(*) filter(where not won))) from leaderboard_entries l left join profiles p on p.id=l.user_id where not weekly or l.created_at>=date_trunc('week',now()) group by l.user_id,p.display_name order by case when sort_by='wpm' then max(l.wpm) when sort_by='rating' then greatest(0,1000+20*(count(*) filter(where won))-10*(count(*) filter(where not won))) else count(*) filter(where won) end desc,l.user_id limit 50;
$$;
revoke all on function public.race_leaderboard(boolean,text) from public;
grant execute on function public.race_leaderboard(boolean,text) to anon,authenticated;

 grant select,insert,update on public.profiles,public.typing_sessions,public.lesson_progress,public.story_progress,public.achievements to authenticated;
 grant select on public.multiplayer_matches,public.match_participants to authenticated;
 grant usage,select on all sequences in schema public to authenticated;
