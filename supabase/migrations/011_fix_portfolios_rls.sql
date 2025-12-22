-- Ensure RLS is enabled
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (or we can use DO block, but dropping is cleaner if we re-define)
DROP POLICY IF EXISTS "Users can delete their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON portfolios;

-- Re-create Delete Policy
CREATE POLICY "Users can delete their own portfolios"
ON portfolios
FOR DELETE
USING (auth.uid() = user_id);

-- Re-create Update Policy (just in case)
CREATE POLICY "Users can update their own portfolios"
ON portfolios
FOR UPDATE
USING (auth.uid() = user_id);
