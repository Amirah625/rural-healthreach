import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  user_id: string;
  full_name: string;
  phone: string | null;
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
    .select("user_id, full_name, phone, created_at, updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function loadProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, phone, created_at, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}