import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import {
  isLanguageCode,
  isThemePreference,
  type LanguageCode,
  type ThemePreference,
} from "@/lib/i18n";

export interface UserProfile {
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar_path: string | null;
  avatar_url: string | null;
  preferred_language: LanguageCode;
  theme: ThemePreference;
  created_at: string;
  updated_at: string;
}

function metadataString(user: User, key: string): string | undefined {
  const value = user.user_metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function profileDefaults(user: User) {
  return {
    fullName:
      metadataString(user, "full_name") ??
      metadataString(user, "name") ??
      user.email?.split("@")[0] ??
      "RuralReach member",
    phone: metadataString(user, "phone") ?? null,
  };
}

export function firstNameFor(user: User, profile?: UserProfile | null): string {
  const fullName = profile?.full_name?.trim() || profileDefaults(user).fullName;
  return fullName.split(/\s+/)[0] || "there";
}

export async function saveProfile(
  user: User,
  fullName = profileDefaults(user).fullName,
  phone = profileDefaults(user).phone,
) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      user_id: user.id,
      full_name: fullName.trim(),
      phone: phone?.trim() || null,
    })
    .select("user_id, full_name, phone, avatar_path, preferred_language, theme, created_at, updated_at")
    .single();

  if (error) throw error;
  return withAvatarUrl(data);
}

export async function loadProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, phone, avatar_path, preferred_language, theme, created_at, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? withAvatarUrl(data) : null;
}

type ProfileRow = {
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar_path: string | null;
  preferred_language: string;
  theme: string;
  created_at: string;
  updated_at: string;
};

async function withAvatarUrl(row: ProfileRow): Promise<UserProfile> {
  let avatarUrl: string | null = null;
  if (row.avatar_path) {
    const result = await supabase.storage
      .from("profile-avatars")
      .createSignedUrl(row.avatar_path, 60 * 60);
    avatarUrl = result.data?.signedUrl ?? null;
  }

  return {
    ...row,
    avatar_url: avatarUrl,
    preferred_language: isLanguageCode(row.preferred_language) ? row.preferred_language : "en",
    theme: isThemePreference(row.theme) ? row.theme : "system",
  };
}

export async function updateProfileSettings(
  userId: string,
  values: { preferred_language?: LanguageCode; theme?: ThemePreference },
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("user_id", userId)
    .select("user_id, full_name, phone, avatar_path, preferred_language, theme, created_at, updated_at")
    .single();

  if (error) throw error;
  return withAvatarUrl(data);
}

export async function uploadProfileAvatar(userId: string, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("profile-avatars")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("user_id", userId)
    .select("user_id, full_name, phone, avatar_path, preferred_language, theme, created_at, updated_at")
    .single();

  if (error) {
    await supabase.storage.from("profile-avatars").remove([path]);
    throw error;
  }

  return withAvatarUrl(data);
}

export async function removeProfileAvatar(userId: string, avatarPath: string | null) {
  if (avatarPath) {
    const { error: removeError } = await supabase.storage
      .from("profile-avatars")
      .remove([avatarPath]);
    if (removeError) throw removeError;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_path: null })
    .eq("user_id", userId)
    .select("user_id, full_name, phone, avatar_path, preferred_language, theme, created_at, updated_at")
    .single();

  if (error) throw error;
  return withAvatarUrl(data);
}