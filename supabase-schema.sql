-- ============================================================
-- NETCO VPN Platform — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- Orders table: tracks every purchase attempt
CREATE TABLE IF NOT EXISTS orders (
  id                 TEXT            PRIMARY KEY,
  package_id         TEXT            NOT NULL,
  network            TEXT            NOT NULL,
  duration           TEXT            NOT NULL,
  app_type           TEXT            NOT NULL,
  device_id          TEXT            NOT NULL,
  phone              TEXT            NOT NULL,
  amount             NUMERIC(10, 2)  NOT NULL,
  status             TEXT            NOT NULL DEFAULT 'pending',
  payment_reference  TEXT,
  config_url         TEXT,
  created_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User plans table: active VPN configurations per device
CREATE TABLE IF NOT EXISTS user_plans (
  id              TEXT        PRIMARY KEY,
  order_id        TEXT        NOT NULL,
  network         TEXT        NOT NULL,
  plan_name       TEXT        NOT NULL,
  plan_type       TEXT        NOT NULL,
  duration        TEXT        NOT NULL,
  app_type        TEXT        NOT NULL,
  device_id       TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  speed           TEXT,
  expiry_date     TIMESTAMPTZ NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'active',
  config_url      TEXT,
  file_extension  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Config servers table: uploaded VPN config files
CREATE TABLE IF NOT EXISTS config_servers (
  id             TEXT        PRIMARY KEY,
  server_name    TEXT        NOT NULL,
  network        TEXT        NOT NULL,
  app_type       TEXT        NOT NULL,
  plan_type      TEXT        NOT NULL,
  duration       TEXT        NOT NULL,
  filename       TEXT        NOT NULL,
  original_name  TEXT        NOT NULL,
  file_size      INTEGER,
  status         TEXT        NOT NULL DEFAULT 'active',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER config_servers_updated_at
  BEFORE UPDATE ON config_servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contact messages table: customer support enquiries
CREATE TABLE IF NOT EXISTS contact_messages (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Useful indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_phone        ON orders (phone);
CREATE INDEX IF NOT EXISTS idx_orders_device_id    ON orders (device_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders (status);
CREATE INDEX IF NOT EXISTS idx_user_plans_phone     ON user_plans (phone);
CREATE INDEX IF NOT EXISTS idx_user_plans_device_id ON user_plans (device_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_status    ON user_plans (status);
