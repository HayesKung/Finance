alter table fin_contract add column if not exists expires_at timestamptz;
alter table fin_contract add column if not exists revoked_at timestamptz;

update fin_contract
set expires_at = updated_at + interval '14 days'
where expires_at is null;

create table if not exists fin_audit (
  id bigserial primary key,
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  resource_hash text not null default '',
  ok boolean not null
);

create table if not exists fin_rate (
  bucket text primary key,
  hits integer not null,
  window_start timestamptz not null
);

create table if not exists fin_desk (
  id text primary key,
  version integer not null,
  body text not null,
  updated_at timestamptz not null default now()
);

create table if not exists fin_idem (
  key text primary key,
  created_at timestamptz not null default now()
);
