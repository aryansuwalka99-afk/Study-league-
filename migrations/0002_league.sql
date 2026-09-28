-- Desk League: members, teams, and daily study / cam / score logs.
-- Shared among signed-in viewers; mutations are authorized in server functions.

create table if not exists profiles (
  user_id      text primary key,
  display_name text not null,
  role         text not null default 'participant',
  created_at   timestamptz not null default now(),
  constraint profiles_role_chk check (role in ('admin', 'participant'))
);

create table if not exists teams (
  id         serial primary key,
  name       text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists teams_name_lower_idx on teams (lower(name));

create table if not exists members (
  id           serial primary key,
  user_id      text unique,
  display_name text not null,
  team_id      integer references teams (id) on delete set null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists members_team_id_idx on members (team_id);
create index if not exists members_active_idx on members (is_active);

create table if not exists daily_logs (
  id             serial primary key,
  member_id      integer not null references members (id) on delete cascade,
  log_date       date not null,
  study_minutes  integer not null default 0,
  cam_minutes    integer not null default 0,
  score          numeric(10, 2) not null default 0,
  notes          text,
  updated_by     text,
  updated_at     timestamptz not null default now(),
  constraint daily_logs_minutes_chk check (study_minutes >= 0 and cam_minutes >= 0),
  constraint daily_logs_score_chk check (score >= 0),
  constraint daily_logs_member_date_uq unique (member_id, log_date)
);

create index if not exists daily_logs_date_idx on daily_logs (log_date);
create index if not exists daily_logs_member_idx on daily_logs (member_id);
