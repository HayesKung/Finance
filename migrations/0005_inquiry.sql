create table if not exists fin_inquiry (
  id text primary key,
  ref text not null unique,
  created_at timestamptz not null default now(),
  locale text not null,
  company text not null,
  contact_name text not null,
  contact text not null,
  market text not null default '',
  need text not null,
  currency text not null default '',
  note text not null default '',
  consent_at timestamptz not null,
  status text not null default '待处理'
);
