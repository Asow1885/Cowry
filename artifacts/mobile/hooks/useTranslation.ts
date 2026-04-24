import { useApp } from "@/context/AppContext";

import en from "@/locale/en.json";
import fr from "@/locale/fr.json";
import ar from "@/locale/ar.json";
import pt from "@/locale/pt.json";

type LocaleData = typeof en;

const locales: Record<string, LocaleData> = { en, fr, ar, pt };

function getNestedValue(obj: Record<string, unknown>, keyPath: string): string {
  const parts = keyPath.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return keyPath;
    }
  }
  return typeof current === "string" ? current : keyPath;
}

export function useTranslation() {
  const { language } = useApp();
  const locale = locales[language] ?? en;
  const isRTL = language === "ar";
  const bodyFont = language === "ar" ? "NotoSansArabic_400Regular" : "Geist_400Regular";
  const bodyFontMedium = language === "ar" ? "NotoSansArabic_700Bold" : "Geist_500Medium";

  function t(key: string): string {
    return getNestedValue(locale as unknown as Record<string, unknown>, key);
  }

  return { t, isRTL, language, bodyFont, bodyFontMedium };
}
