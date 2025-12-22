ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS benchmark text DEFAULT 'IBOV',
ADD COLUMN IF NOT EXISTS risk_free_rate numeric DEFAULT 10,
ADD COLUMN IF NOT EXISTS auto_adjust boolean DEFAULT true;
