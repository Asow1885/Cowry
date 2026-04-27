import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Localization from "expo-localization";
import { Ionicons } from "@expo/vector-icons";
import { CowryCrest } from "@/components/CowryCrest";
import { LangPicker } from "@/components/LangPicker";
import { useApp, Language } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

const COUNTRY_CODES = [
  { flag: "🇺🇸", code: "+1", name: "United States", region: "US" },
  { flag: "🇫🇷", code: "+33", name: "France", region: "FR" },
  { flag: "🇬🇧", code: "+44", name: "United Kingdom", region: "GB" },
  { flag: "🇬🇳", code: "+224", name: "Guinea", region: "GN" },
  { flag: "🇸🇳", code: "+221", name: "Senegal", region: "SN" },
  { flag: "🇲🇱", code: "+223", name: "Mali", region: "ML" },
  { flag: "🇳🇬", code: "+234", name: "Nigeria", region: "NG" },
  { flag: "🇬🇭", code: "+233", name: "Ghana", region: "GH" },
  { flag: "🇨🇮", code: "+225", name: "Côte d'Ivoire", region: "CI" },
  { flag: "🇨🇲", code: "+237", name: "Cameroon", region: "CM" },
  { flag: "🇲🇦", code: "+212", name: "Morocco", region: "MA" },
  { flag: "🇵🇹", code: "+351", name: "Portugal", region: "PT" },
  { flag: "🇧🇷", code: "+55", name: "Brazil", region: "BR" },
  { flag: "🇩🇿", code: "+213", name: "Algeria", region: "DZ" },
  { flag: "🇹🇳", code: "+216", name: "Tunisia", region: "TN" },
  { flag: "🇪🇬", code: "+20", name: "Egypt", region: "EG" },
  { flag: "🇨🇦", code: "+1", name: "Canada", region: "CA" },
  { flag: "🇧🇪", code: "+32", name: "Belgium", region: "BE" },
  { flag: "🇪🇸", code: "+34", name: "Spain", region: "ES" },
  { flag: "🇮🇹", code: "+39", name: "Italy", region: "IT" },
];

function getCountryDisplayName(regionCode: string, language: string): string {
  try {
    const displayNames = new Intl.DisplayNames([language], { type: "region" });
    return displayNames.of(regionCode) ?? regionCode;
  } catch {
    const fallback = COUNTRY_CODES.find((c) => c.region === regionCode);
    return fallback?.name ?? regionCode;
  }
}

function getDefaultCountry() {
  try {
    const locales = Localization.getLocales();
    const regionCode = locales[0]?.regionCode ?? "";
    if (regionCode) {
      const match = COUNTRY_CODES.find((c) => c.region === regionCode.toUpperCase());
      if (match) return match;
    }
  } catch {
    // ignore
  }
  return COUNTRY_CODES[0];
}

function StepDots({ current }: { current: number }) {
  return (
    <View style={stepStyles.row}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i < current && stepStyles.done,
            i === current && stepStyles.active,
          ]}
        />
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 5, marginBottom: 20 },
  dot: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(201, 160, 74, 0.2)",
  },
  done: { backgroundColor: "#c9a04a" },
  active: { backgroundColor: "#e4c070" },
});

export default function PhoneScreen() {
  const { language, setLanguage } = useApp();
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const [countryCode, setCountryCode] = useState(getDefaultCountry);
  const [phone, setPhone] = useState("");
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleSelectLang(lang: Language) {
    await setLanguage(lang);
    setLangPickerVisible(false);
  }

  function handleSend() {
    if (!phone.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(auth)/verify",
      params: { phone: `${countryCode.code} ${phone}`, flag: countryCode.flag },
    });
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingTop: topInset + 16, paddingBottom: bottomInset + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.topRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons
                name={isRTL ? "arrow-forward" : "arrow-back"}
                size={20}
                color="#f5ebd6"
              />
            </TouchableOpacity>
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

          <StepDots current={0} />

          <Text
            style={[styles.headline, isRTL && styles.textRTL]}
            numberOfLines={2}
          >
            <Text style={[styles.headlinePre, { fontFamily: fonts.headline }]}>{t("phone.headlinePre")}{"\n"}</Text>
            <Text style={[styles.headlineEmphasis, { fontFamily: fonts.headlineEmphasis }]}>
              {t("phone.headlineEmphasis")}
            </Text>
          </Text>

          <Text style={[styles.helper, { fontFamily: fonts.body }, isRTL && styles.textRTL]}>
            {t("phone.helper")}
          </Text>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { fontFamily: fonts.bodyMed }, isRTL && styles.textRTL]}>
              {t("phone.label")}
            </Text>
            <View
              style={[
                styles.input,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <TouchableOpacity
                style={styles.countryBtn}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Text style={styles.flag}>{countryCode.flag}</Text>
                <Text style={[styles.dialCode, { fontFamily: fonts.bodyMed }]}>{countryCode.code}</Text>
                <Text style={styles.dialChevron}>▾</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TextInput
                style={[styles.phoneInput, { fontFamily: fonts.body }, isRTL && { textAlign: "right" }]}
                value={phone}
                onChangeText={setPhone}
                placeholder={t("phone.number_placeholder")}
                placeholderTextColor="rgba(245, 235, 214, 0.35)"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleSend}
              />
            </View>
          </View>

          {showCountryPicker && (
            <ScrollView
              style={styles.countryList}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {COUNTRY_CODES.map((c) => (
                <TouchableOpacity
                  key={c.code + c.name}
                  style={[
                    styles.countryItem,
                    c.code === countryCode.code &&
                      c.name === countryCode.name &&
                      styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    setCountryCode(c);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.flag}>{c.flag}</Text>
                  <Text style={[styles.countryName, { fontFamily: fonts.body }]}>{getCountryDisplayName(c.region, language)}</Text>
                  <Text style={[styles.countryDialCode, { fontFamily: fonts.bodyMed }]}>{c.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={{ flex: 1, minHeight: 40 }} />

          <TouchableOpacity
            style={[
              styles.btnPrimary,
              !phone.trim() && styles.btnPrimaryDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={!phone.trim()}
          >
            <Text style={[styles.btnPrimaryText, { fontFamily: fonts.bodySemi }]}>
              {t("phone.cta")} {!isRTL ? "→" : "←"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.terms, { fontFamily: fonts.body }, isRTL && styles.textRTL]}>
            {t("phone.terms")}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

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
  container: { flex: 1, backgroundColor: "#1a2e22" },
  content: { paddingHorizontal: 24 },
  topRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 7 },
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
  headline: {
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: -1.2,
    color: "#f5ebd6",
    marginBottom: 12,
  },
  headlinePre: { fontFamily: "Fraunces_400Regular" },
  headlineEmphasis: {
    fontFamily: "Fraunces_400Regular_Italic",
    color: "#e4c070",
  },
  helper: {
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(245, 235, 214, 0.55)",
    marginBottom: 28,
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#c9a04a",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f1f17",
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.3)",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  flag: { fontSize: 18 },
  dialCode: {
    fontSize: 13,
    color: "#f5ebd6",
    opacity: 0.85,
  },
  dialChevron: { fontSize: 8, color: "#c9a04a", marginLeft: 2 },
  divider: { width: 1, height: 20, backgroundColor: "rgba(201,160,74,0.2)" },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: "#f5ebd6",
    padding: 0,
  },
  countryList: {
    backgroundColor: "#0f1f17",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.2)",
    maxHeight: 200,
    marginBottom: 12,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(201,160,74,0.08)",
  },
  countryItemSelected: { backgroundColor: "#25402f" },
  countryName: {
    flex: 1,
    fontSize: 13,
    color: "#f5ebd6",
  },
  countryDialCode: {
    fontSize: 12,
    color: "#c9a04a",
  },
  btnPrimary: {
    backgroundColor: "#c9a04a",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  btnPrimaryDisabled: { backgroundColor: "rgba(201, 160, 74, 0.25)" },
  btnPrimaryText: {
    fontSize: 15,
    color: "#0f1f17",
  },
  terms: {
    fontSize: 10,
    color: "rgba(245, 235, 214, 0.35)",
    textAlign: "center",
  },
});
