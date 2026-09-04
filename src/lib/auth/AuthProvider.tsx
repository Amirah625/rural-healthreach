import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import {
  loadProfile,
  removeProfileAvatar,
  type UserProfile,
  updateProfileSettings,
  uploadProfileAvatar,
} from "@/lib/auth";
import {
  isLanguageCode,
  isThemePreference,
  translate,
  type LanguageCode,
  type ThemePreference,
  type TranslationKey,
} from "@/lib/i18n";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  language: LanguageCode;
  theme: ThemePreference;
  updateSettings: (values: { preferred_language?: LanguageCode; theme?: ThemePreference }) => Promise<void>;
  setAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  t: (key: TranslationKey) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ruralreach.language");
    return isLanguageCode(saved) ? saved : "en";
  });
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system";
    const saved = window.localStorage.getItem("ruralreach.theme");
    return isThemePreference(saved) ? saved : "system";
  });

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }

    try {
      const nextProfile = await loadProfile(user.id);
      setProfile(nextProfile);
      return nextProfile;
    } catch {
      setProfile(null);
      return null;
    }
  }, [user]);

  const applyTheme = useCallback((nextTheme: ThemePreference) => {
    if (typeof document === "undefined") return;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    document.documentElement.classList.toggle("dark", nextTheme === "dark" || (nextTheme === "system" && prefersDark));
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const updateSettings = useCallback(async (values: { preferred_language?: LanguageCode; theme?: ThemePreference }) => {
    if (!user) return;
    const nextLanguage = values.preferred_language ?? language;
    const nextTheme = values.theme ?? theme;
    const nextProfile = await updateProfileSettings(user.id, values);
    setProfile(nextProfile);
    setLanguage(nextProfile.preferred_language);
    setTheme(nextProfile.theme);
    window.localStorage.setItem("ruralreach.language", nextLanguage);
    window.localStorage.setItem("ruralreach.theme", nextTheme);
  }, [language, theme, user]);

  const setAvatar = useCallback(async (file: File) => {
    if (!user) return;
    const nextProfile = await uploadProfileAvatar(user.id, file);
    setProfile(nextProfile);
  }, [user]);

  const removeAvatar = useCallback(async () => {
    if (!user) return;
    const nextProfile = await removeProfileAvatar(user.id, profile?.avatar_path ?? null);
    setProfile(nextProfile);
  }, [profile?.avatar_path, user]);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
      if (data.user) {
        try {
          const nextProfile = await loadProfile(data.user.id);
          setProfile(nextProfile);
          if (nextProfile) {
            setLanguage(nextProfile.preferred_language);
            setTheme(nextProfile.theme);
          }
        } catch {
          setProfile(null);
        }
      }
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        queryClient.invalidateQueries();
        void Promise.resolve().then(async () => {
          try {
            const nextProfile = await loadProfile(nextUser.id);
            if (mounted) {
              setProfile(nextProfile);
              if (nextProfile) {
                setLanguage(nextProfile.preferred_language);
                setTheme(nextProfile.theme);
              }
            }
          } catch {
            if (mounted) setProfile(null);
          }
        });
      } else {
        setProfile(null);
      }

      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, router]);

  useEffect(() => {
    applyTheme(theme);
    if (typeof window === "undefined") return;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const handleChange = () => {
      if (theme === "system") applyTheme("system");
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, [applyTheme, theme]);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      refreshProfile,
      language,
      theme,
      updateSettings,
      setAvatar,
      removeAvatar,
      t: (key: TranslationKey) => translate(language, key),
    }),
    [language, loading, profile, refreshProfile, removeAvatar, setAvatar, theme, updateSettings, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}