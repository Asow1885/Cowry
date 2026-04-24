import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nManager, Platform } from "react-native";
import * as Localization from "expo-localization";

export type Language = "en" | "fr" | "ar" | "pt";

export interface UserProfile {
  name: string;
  phone: string;
  countryCode: string;
  country: string;
  countryFlag: string;
}

interface AppState {
  language: Language;
  user: UserProfile | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  setUser: (user: UserProfile) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEYS = {
  LANGUAGE: "@cowry/language",
  USER: "@cowry/user",
  ONBOARDED: "@cowry/onboarded",
};

function detectDeviceLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    const tag = locales[0]?.languageTag ?? "en";
    const code = tag.split("-")[0].toLowerCase();
    if (code === "fr") return "fr";
    if (code === "ar") return "ar";
    if (code === "pt") return "pt";
    return "en";
  } catch {
    return "en";
  }
}

function applyRTL(lang: Language) {
  if (Platform.OS === "web") return;
  const shouldBeRTL = lang === "ar";
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    detectDeviceLanguage()
  );
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadState() {
      try {
        const [savedLang, savedUser, savedOnboarded] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
        ]);
        if (savedLang) {
          setLanguageState(savedLang as Language);
          applyRTL(savedLang as Language);
        } else {
          applyRTL(language);
        }
        if (savedUser) setUserState(JSON.parse(savedUser));
        if (savedOnboarded === "true") setIsOnboarded(true);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
    loadState();
  }, []);

  async function setLanguage(lang: Language) {
    setLanguageState(lang);
    applyRTL(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  async function setUser(u: UserProfile) {
    setUserState(u);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
  }

  async function completeOnboarding() {
    setIsOnboarded(true);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, "true");
  }

  async function resetOnboarding() {
    setIsOnboarded(false);
    setUserState(null);
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.ONBOARDED]);
  }

  return (
    <AppContext.Provider
      value={{
        language,
        user,
        isOnboarded,
        isLoading,
        setLanguage,
        setUser,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
