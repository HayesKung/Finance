create table if not exists fin_bank_receipt (
  id text primary key,
  idempotency_key text not null unique,
  bank_ref text not null unique,
  receivable_id text not null,
  amount_cents integer not null check (amount_cents > 0),
  expected_cents integer not null check (expected_cents >= amount_cents),
  actor text not null,
  created_at timestamptz not null default now()
);

create index if not exists fin_bank_receipt_receivable_idx on fin_bank_receipt (receivable_id);

create table if not exists fin_provider_nonce (
  nonce text primary key,
  received_at timestamptz not null default now()
);
