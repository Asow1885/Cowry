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
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { CowryCrest } from "@/components/CowryCrest";
import { LangPicker } from "@/components/LangPicker";
import { useApp, Language } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

const COUNTRIES_PRIMARY = [
  { code: "GN", flag: "🇬🇳", name: "Guinea" },
  { code: "SN", flag: "🇸🇳", name: "Senegal" },
  { code: "ML", flag: "🇲🇱", name: "Mali" },
  { code: "CI", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "CM", flag: "🇨🇲", name: "Cameroon" },
  { code: "BF", flag: "🇧🇫", name: "Burkina Faso" },
];

const COUNTRIES_ALL = [
  ...COUNTRIES_PRIMARY,
  { code: "MR", flag: "🇲🇷", name: "Mauritania" },
  { code: "TG", flag: "🇹🇬", name: "Togo" },
  { code: "BJ", flag: "🇧🇯", name: "Benin" },
  { code: "NE", flag: "🇳🇪", name: "Niger" },
  { code: "GW", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "LR", flag: "🇱🇷", name: "Liberia" },
  { code: "SL", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "GM", flag: "🇬🇲", name: "Gambia" },
];

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

export default function ProfileScreen() {
  const { phone = "" } = useLocalSearchParams<{ phone: string }>();
  const { language, setLanguage, setUser, completeOnboarding } = useApp();
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [langPickerVisible, setLangPickerVisible] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const displayedCountries = showAll ? COUNTRIES_ALL : COUNTRIES_PRIMARY;
  const canFinish = name.trim().length > 0 && selectedCountry !== null;

  async function handleFinish() {
    if (!canFinish) return;
    const country = COUNTRIES_ALL.find((c) => c.code === selectedCountry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setUser({
      name: name.trim(),
      phone,
      countryCode: selectedCountry!,
      country: country?.name ?? "",
      countryFlag: country?.flag ?? "",
    });
    await completeOnboarding();
    router.replace("/(tabs)/");
  }

  async function handleSelectLang(lang: Language) {
    await setLanguage(lang);
    setLangPickerVisible(false);
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
              <Text style={styles.logoText}>COWRY</Text>
            </View>
            <Pressable
              style={styles.langToggle}
              onPress={() => setLangPickerVisible(true)}
            >
              <Text style={styles.langToggleText}>
                {language.toUpperCase()} ▾
              </Text>
            </Pressable>
          </View>

          <StepDots current={3} />

          <Text style={[styles.headline, isRTL && styles.textRTL]}>
            <Text style={styles.headlinePre}>{t("profile.headlinePre")}{"\n"}</Text>
            <Text style={styles.headlineEmphasis}>
              {t("profile.headlineEmphasis")}
            </Text>
          </Text>

          <Text style={[styles.helper, isRTL && styles.textRTL]}>
            {t("profile.helper")}
          </Text>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, isRTL && styles.textRTL]}>
              {t("profile.name_label")}
            </Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={[styles.textInput, isRTL && { textAlign: "right" }]}
                value={name}
                onChangeText={setName}
                placeholder="Ashley Sow"
                placeholderTextColor="rgba(245, 235, 214, 0.3)"
                returnKeyType="done"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, isRTL && styles.textRTL]}>
              {t("profile.country_label")}
            </Text>
            <View style={styles.countryGrid}>
              {displayedCountries.map((c) => {
                const isSelected = selectedCountry === c.code;
                return (
                  <TouchableOpacity
                    key={c.code}
                    style={[
                      styles.countryChip,
                      isSelected && styles.countryChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedCountry(c.code);
                      Haptics.selectionAsync();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.countryFlag}>{c.flag}</Text>
                    <Text
                      style={[
                        styles.countryName,
                        isSelected && styles.countryNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {!showAll && (
              <TouchableOpacity onPress={() => setShowAll(true)}>
                <Text style={[styles.seeMore, isRTL && styles.textRTL]}>
                  {t("profile.see_more")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ minHeight: 24 }} />

          <TouchableOpacity
            style={[styles.btnPrimary, !canFinish && styles.btnDisabled]}
            onPress={handleFinish}
            activeOpacity={0.85}
            disabled={!canFinish}
          >
            <Text style={styles.btnPrimaryText}>
              {t("profile.cta")} {!isRTL ? "→" : "←"}
            </Text>
          </TouchableOpacity>
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
    fontFamily: "Inter_500Medium",
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
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(245, 235, 214, 0.55)",
    marginBottom: 24,
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  fieldWrap: { marginBottom: 20 },
  fieldLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#c9a04a",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  inputWrap: {
    backgroundColor: "#0f1f17",
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  textInput: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#f5ebd6",
    padding: 0,
  },
  countryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  countryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#0f1f17",
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.25)",
    borderRadius: 6,
    width: "47%",
  },
  countryChipSelected: {
    borderColor: "#c9a04a",
    backgroundColor: "#25402f",
  },
  countryFlag: { fontSize: 15 },
  countryName: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#f5ebd6",
    flex: 1,
  },
  countryNameSelected: { color: "#e4c070", fontFamily: "Inter_500Medium" },
  seeMore: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#c9a04a",
    textAlign: "center",
    marginTop: 12,
    letterSpacing: 0.3,
  },
  btnPrimary: {
    backgroundColor: "#c9a04a",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "rgba(201, 160, 74, 0.25)" },
  btnPrimaryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#0f1f17",
  },
});
