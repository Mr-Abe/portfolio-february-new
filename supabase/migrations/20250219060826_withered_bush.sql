/*
  # Contact Submissions System

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `created_at` (timestamptz, default: now())
      - `status` (text, default: 'unread')

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policies for:
      - Admin users can read all submissions
      - Admin users can update submission status
      - Admin users can delete submissions
      - Authenticated users can create submissions
*/

DO $$
BEGIN
  PERFORM auth.create_user(
    email := 'blogadmin@abeslegacy.com',
    password := '',
    email_confirmed := true,
    phone := NULL,
    app_metadata := '{"provider": "email", "role": "admin"}'::jsonb,
    user_metadata := '{"role": "admin"}'::jsonb
  );
EXCEPTION WHEN OTHERS THEN
  -- If the admin user already exists or another error occurs,
  -- a notice will be raised and the migration will continue.
  RAISE NOTICE 'Admin user creation skipped or failed: %', SQLERRM;
END $$;


-- Create enum for submission status
CREATE TYPE submission_status AS ENUM ('unread', 'read', 'archived');

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status submission_status DEFAULT 'unread'
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to read all submissions
CREATE POLICY "Admin users can read all submissions"
ON contact_submissions
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    'blogadmin@abeslegacy.com' -- Replace with actual admin email
  )
);

-- Create policy for admin users to update submissions
CREATE POLICY "Admin users can update submissions"
ON contact_submissions
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    'blogadmin@abeslegacy.com' -- Replace with actual admin email
  )
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    'blogadmin@abeslegacy.com' -- Replace with actual admin email
  )
);

-- Create policy for admin users to delete submissions
CREATE POLICY "Admin users can delete submissions"
ON contact_submissions
FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    'blogadmin@abeslegacy.com' -- Replace with actual admin email
  )
);

-- Create policy for authenticated users to create submissions
CREATE POLICY "Authenticated users can create submissions"
ON contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (true);