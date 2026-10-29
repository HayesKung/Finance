create table if not exists fin_contract (
  customer_token text primary key,
  staff_token text not null unique,
  payload text not null,
  updated_at timestamptz not null default now()
);

create table if not exists fin_channel (
  id text primary key,
  app_id text not null default '',
  merchant_id text not null default '',
  secret text not null default '',
  updated_at timestamptz not null default now()
);
