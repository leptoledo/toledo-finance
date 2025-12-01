-- Allow admins to view all feedbacks
-- We use auth.jwt() ->> 'email' to check the user's email directly from the token

CREATE POLICY "Admins can view all feedbacks" ON feedback
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email') IN ('leptoledo@hotmail.com', 'admin@financex.com')
);
