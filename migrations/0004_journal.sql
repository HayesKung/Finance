create table if not exists fin_journal (
  id text primary key,
  idempotency_key text not null unique,
  period text not null default '',
  memo text not null default '',
  body text not null,
  reverses_id text,
  created_at timestamptz not null default now()
);

create table if not exists fin_period (
  period text primary key,
  locked_at timestamptz not null default now()
);
