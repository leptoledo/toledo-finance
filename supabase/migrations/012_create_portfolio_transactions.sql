-- Create portfolio_transactions table
CREATE TABLE IF NOT EXISTS portfolio_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'dividend', 'split')), 
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  fees NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_portfolio_transactions_portfolio_id ON portfolio_transactions(portfolio_id);
CREATE INDEX idx_portfolio_transactions_user_id ON portfolio_transactions(user_id);
CREATE INDEX idx_portfolio_transactions_ticker ON portfolio_transactions(ticker);

-- Enable RLS
ALTER TABLE portfolio_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own portfolio transactions" ON portfolio_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio transactions" ON portfolio_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio transactions" ON portfolio_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio transactions" ON portfolio_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_portfolio_transactions_updated_at
  BEFORE UPDATE ON portfolio_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
