-- Allow admins to view all profiles
-- This is necessary for the admin feedback list to show user names

CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'email') IN ('leptoledo@hotmail.com', 'admin@financex.com')
);
