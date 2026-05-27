-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  package_id TEXT NOT NULL,
  network TEXT NOT NULL,
  duration TEXT NOT NULL,
  app_type TEXT NOT NULL,
  device_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  config_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user_plans table
CREATE TABLE IF NOT EXISTS user_plans (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  network TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  app_type TEXT NOT NULL,
  device_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  speed TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  config_url TEXT,
  file_extension TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create config_servers table
CREATE TABLE IF NOT EXISTS config_servers (
  id TEXT PRIMARY KEY,
  server_name TEXT NOT NULL,
  network TEXT NOT NULL,
  app_type TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indices for better query performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_device_id ON orders(device_id);
CREATE INDEX idx_user_plans_order_id ON user_plans(order_id);
CREATE INDEX idx_user_plans_status ON user_plans(status);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_config_servers_status ON config_servers(status);
CREATE INDEX idx_config_servers_network ON config_servers(network);
