-- Add is_default column to categories table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'categories'
        AND column_name = 'is_default'
    ) THEN
        ALTER TABLE categories ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Update RLS policy to allow viewing default categories
DROP POLICY IF EXISTS "Users can view their own categories or defaults" ON categories;
CREATE POLICY "Users can view their own categories or defaults" ON categories
  FOR SELECT USING (auth.uid() = user_id OR is_default = TRUE);
