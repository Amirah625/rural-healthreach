ALTER TABLE public.profiles
  ADD COLUMN preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'yo', 'ha', 'fr', 'ar', 'tw')),
  ADD COLUMN theme text NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  ADD COLUMN avatar_path text;

CREATE POLICY "Users can view their own profile avatars"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'profile-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "Users can upload their own profile avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "Users can replace their own profile avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  )
  WITH CHECK (
    bucket_id = 'profile-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

CREATE POLICY "Users can remove their own profile avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );