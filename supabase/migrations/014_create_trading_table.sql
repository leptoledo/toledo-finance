-- Create trades table for Day Trading control
CREATE TABLE trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  asset_symbol TEXT NOT NULL, -- Ex: WINJ24, PETR4, WDO
  operation_type TEXT NOT NULL CHECK (operation_type IN ('LONG', 'SHORT')), -- Compra (Long) ou Venda (Short)
  quantity DECIMAL(12, 2) NOT NULL,
  entry_price DECIMAL(12, 2) NOT NULL,
  exit_price DECIMAL(12, 2), -- Pode ser nulo se o trade estiver aberto
  entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED')) DEFAULT 'OPEN',
  result DECIMAL(12, 2), -- Valor financeiro do resultado
  strategy TEXT, -- Ex: Setup 9.1, Pivot, VWAP
  screenshot_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_entry_date ON trades(entry_date);
CREATE INDEX idx_trades_status ON trades(status);

-- RLS Policies
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
