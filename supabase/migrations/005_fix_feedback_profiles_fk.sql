-- Change feedback.user_id to reference profiles(id) instead of auth.users(id)
-- This allows us to join with the profiles table in Supabase queries

DO $$ 
BEGIN
  -- Drop the existing constraint if it exists (referencing auth.users)
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'feedback_user_id_fkey' 
    AND table_name = 'feedback'
  ) THEN
    ALTER TABLE feedback DROP CONSTRAINT feedback_user_id_fkey;
  END IF;

  -- Add the new constraint referencing profiles
  ALTER TABLE feedback
  ADD CONSTRAINT feedback_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;
END $$;
