import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { CowryCrest } from "@/components/CowryCrest";
import { LangPicker } from "@/components/LangPicker";
import { useApp, Language } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function WelcomeScreen() {
  const { language, setLanguage } = useApp();
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const [langPickerVisible, setLangPickerVisible] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleSelectLang(lang: Language) {
    await setLanguage(lang);
    setLangPickerVisible(false);
  }

  function handleCreateAccount() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/phone");
  }

  function handleSignIn() {
    router.push("/(auth)/returning");
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: topInset + 16,
            paddingBottom: bottomInset + 16,
            direction: isRTL ? "rtl" : "ltr",
          },
        ]}
      >
        <View
          style={[
            styles.topRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.logoRow}>
            <CowryCrest size={22} color="#c9a04a" />
            <Text style={styles.logoText}>{t("brand.name")}</Text>
          </View>
          <Pressable
            style={styles.langToggle}
            onPress={() => setLangPickerVisible(true)}
          >
            <Text style={[styles.langToggleText, { fontFamily: fonts.bodyMed }]}>
              {language.toUpperCase()} ▾
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroSection}>
          <Text
            style={[styles.headline, isRTL && styles.textRTL]}
            numberOfLines={2}
          >
            <Text style={[styles.headlinePre, { fontFamily: fonts.headline }]}>{t("welcome.headlinePre")}</Text>
            <Text style={[styles.headlineEmphasis, { fontFamily: fonts.headlineEmphasis }]}>
              {t("welcome.headlineEmphasis")}
            </Text>
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("welcome.subtitle")}
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleCreateAccount}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnPrimaryText, { fontFamily: fonts.bodySemi }]}>
              {t("welcome.cta_primary")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnSecondaryText, { fontFamily: fonts.body }]}>
              {t("welcome.cta_secondary")}
              {!isRTL ? " →" : " ←"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.terms, { fontFamily: fonts.body }, isRTL && styles.textRTL]}>
            {t("welcome.terms")}
          </Text>
        </View>
      </View>

      <LangPicker
        visible={langPickerVisible}
        currentLang={language}
        onSelect={handleSelectLang}
        onClose={() => setLangPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2e22",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 72,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  logoText: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 13,
    letterSpacing: 3,
    color: "#f5ebd6",
  },
  langToggle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(201, 160, 74, 0.15)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.3)",
  },
  langToggleText: {
    fontSize: 10,
    letterSpacing: 1,
    color: "#e4c070",
  },
  heroSection: {
    flex: 1,
    justifyContent: "flex-start",
  },
  headline: {
    fontSize: 60,
    lineHeight: 55,
    letterSpacing: -2.5,
    color: "#f5ebd6",
    marginBottom: 18,
  },
  headlinePre: {
    fontFamily: "Fraunces_400Regular",
  },
  headlineEmphasis: {
    fontFamily: "Fraunces_400Regular_Italic",
    color: "#e4c070",
  },
  subtitle: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 15,
    lineHeight: 22,
    color: "#c9a04a",
  },
  textRTL: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  bottomSection: {
    gap: 0,
  },
  btnPrimary: {
    backgroundColor: "#c9a04a",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 4,
  },
  btnPrimaryText: {
    fontSize: 15,
    color: "#0f1f17",
  },
  btnSecondary: {
    paddingVertical: 12,
    alignItems: "center",
  },
  btnSecondaryText: {
    fontSize: 13,
    color: "#c9a04a",
  },
  terms: {
    fontSize: 10,
    lineHeight: 15,
    color: "rgba(245, 235, 214, 0.4)",
    textAlign: "center",
    marginTop: 8,
  },
});
