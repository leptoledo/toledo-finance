-- Add Stop Loss and Take Profit to trades
ALTER TABLE trades ADD COLUMN IF NOT EXISTS stop_loss DECIMAL(12, 2);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS take_profit DECIMAL(12, 2);

-- Create table for Trading Settings (Account Balance)
CREATE TABLE IF NOT EXISTS trading_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    initial_balance DECIMAL(12, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Trading Settings
ALTER TABLE trading_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'trading_settings' AND policyname = 'Users can manage their own trading settings'
    ) THEN
        CREATE POLICY "Users can manage their own trading settings" ON trading_settings
            FOR ALL USING (auth.uid() = user_id);
    END IF;
END
$$;
