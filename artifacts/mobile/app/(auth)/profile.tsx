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

const ALL_COUNTRIES = [
  { code: "GN", flag: "🇬🇳", name: "Guinea" },
  { code: "SN", flag: "🇸🇳", name: "Senegal" },
  { code: "ML", flag: "🇲🇱", name: "Mali" },
  { code: "CI", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "CM", flag: "🇨🇲", name: "Cameroon" },
  { code: "BF", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "MR", flag: "🇲🇷", name: "Mauritania" },
  { code: "TG", flag: "🇹🇬", name: "Togo" },
  { code: "BJ", flag: "🇧🇯", name: "Benin" },
  { code: "NE", flag: "🇳🇪", name: "Niger" },
  { code: "GW", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "LR", flag: "🇱🇷", name: "Liberia" },
  { code: "SL", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "GM", flag: "🇬🇲", name: "Gambia" },
  { code: "CV", flag: "🇨🇻", name: "Cape Verde" },
  { code: "MA", flag: "🇲🇦", name: "Morocco" },
  { code: "DZ", flag: "🇩🇿", name: "Algeria" },
  { code: "TN", flag: "🇹🇳", name: "Tunisia" },
  { code: "LY", flag: "🇱🇾", name: "Libya" },
  { code: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "SD", flag: "🇸🇩", name: "Sudan" },
  { code: "ET", flag: "🇪🇹", name: "Ethiopia" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "RW", flag: "🇷🇼", name: "Rwanda" },
  { code: "BI", flag: "🇧🇮", name: "Burundi" },
  { code: "MZ", flag: "🇲🇿", name: "Mozambique" },
  { code: "ZM", flag: "🇿🇲", name: "Zambia" },
  { code: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
  { code: "MW", flag: "🇲🇼", name: "Malawi" },
  { code: "BW", flag: "🇧🇼", name: "Botswana" },
  { code: "NA", flag: "🇳🇦", name: "Namibia" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "LS", flag: "🇱🇸", name: "Lesotho" },
  { code: "SZ", flag: "🇸🇿", name: "Eswatini" },
  { code: "AO", flag: "🇦🇴", name: "Angola" },
  { code: "CD", flag: "🇨🇩", name: "DR Congo" },
  { code: "CG", flag: "🇨🇬", name: "Congo" },
  { code: "GA", flag: "🇬🇦", name: "Gabon" },
  { code: "GQ", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "ST", flag: "🇸🇹", name: "São Tomé and Príncipe" },
  { code: "CF", flag: "🇨🇫", name: "Central African Republic" },
  { code: "TD", flag: "🇹🇩", name: "Chad" },
  { code: "SS", flag: "🇸🇸", name: "South Sudan" },
  { code: "ER", flag: "🇪🇷", name: "Eritrea" },
  { code: "DJ", flag: "🇩🇯", name: "Djibouti" },
  { code: "SO", flag: "🇸🇴", name: "Somalia" },
  { code: "KM", flag: "🇰🇲", name: "Comoros" },
  { code: "MG", flag: "🇲🇬", name: "Madagascar" },
  { code: "SC", flag: "🇸🇨", name: "Seychelles" },
  { code: "MU", flag: "🇲🇺", name: "Mauritius" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "BE", flag: "🇧🇪", name: "Belgium" },
  { code: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "AT", flag: "🇦🇹", name: "Austria" },
  { code: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "DK", flag: "🇩🇰", name: "Denmark" },
  { code: "FI", flag: "🇫🇮", name: "Finland" },
  { code: "IE", flag: "🇮🇪", name: "Ireland" },
  { code: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "CZ", flag: "🇨🇿", name: "Czech Republic" },
  { code: "HU", flag: "🇭🇺", name: "Hungary" },
  { code: "RO", flag: "🇷🇴", name: "Romania" },
  { code: "BG", flag: "🇧🇬", name: "Bulgaria" },
  { code: "GR", flag: "🇬🇷", name: "Greece" },
  { code: "HR", flag: "🇭🇷", name: "Croatia" },
  { code: "SK", flag: "🇸🇰", name: "Slovakia" },
  { code: "SI", flag: "🇸🇮", name: "Slovenia" },
  { code: "RS", flag: "🇷🇸", name: "Serbia" },
  { code: "UA", flag: "🇺🇦", name: "Ukraine" },
  { code: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "NZ", flag: "🇳🇿", name: "New Zealand" },
  { code: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "CN", flag: "🇨🇳", name: "China" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "NP", flag: "🇳🇵", name: "Nepal" },
  { code: "MM", flag: "🇲🇲", name: "Myanmar" },
  { code: "TH", flag: "🇹🇭", name: "Thailand" },
  { code: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "KW", flag: "🇰🇼", name: "Kuwait" },
  { code: "BH", flag: "🇧🇭", name: "Bahrain" },
  { code: "OM", flag: "🇴🇲", name: "Oman" },
  { code: "JO", flag: "🇯🇴", name: "Jordan" },
  { code: "LB", flag: "🇱🇧", name: "Lebanon" },
  { code: "IL", flag: "🇮🇱", name: "Israel" },
  { code: "IQ", flag: "🇮🇶", name: "Iraq" },
  { code: "IR", flag: "🇮🇷", name: "Iran" },
  { code: "AF", flag: "🇦🇫", name: "Afghanistan" },
  { code: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "PE", flag: "🇵🇪", name: "Peru" },
  { code: "VE", flag: "🇻🇪", name: "Venezuela" },
  { code: "EC", flag: "🇪🇨", name: "Ecuador" },
  { code: "BO", flag: "🇧🇴", name: "Bolivia" },
  { code: "PY", flag: "🇵🇾", name: "Paraguay" },
  { code: "UY", flag: "🇺🇾", name: "Uruguay" },
  { code: "GY", flag: "🇬🇾", name: "Guyana" },
  { code: "SR", flag: "🇸🇷", name: "Suriname" },
  { code: "GT", flag: "🇬🇹", name: "Guatemala" },
  { code: "HN", flag: "🇭🇳", name: "Honduras" },
  { code: "SV", flag: "🇸🇻", name: "El Salvador" },
  { code: "NI", flag: "🇳🇮", name: "Nicaragua" },
  { code: "CR", flag: "🇨🇷", name: "Costa Rica" },
  { code: "PA", flag: "🇵🇦", name: "Panama" },
  { code: "CU", flag: "🇨🇺", name: "Cuba" },
  { code: "DO", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "HT", flag: "🇭🇹", name: "Haiti" },
  { code: "JM", flag: "🇯🇲", name: "Jamaica" },
  { code: "TT", flag: "🇹🇹", name: "Trinidad and Tobago" },
];

const COUNTRIES_PRIMARY = ALL_COUNTRIES.slice(0, 8);

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
  const [searchQuery, setSearchQuery] = useState("");

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const displayedCountries = showAll
    ? searchQuery.trim()
      ? ALL_COUNTRIES.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : ALL_COUNTRIES
    : COUNTRIES_PRIMARY;

  const canFinish = name.trim().length > 0 && selectedCountry !== null;

  async function handleFinish() {
    if (!canFinish) return;
    const country = ALL_COUNTRIES.find((c) => c.code === selectedCountry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setUser({
      name: name.trim(),
      phone,
      countryCode: selectedCountry!,
      country: country?.name ?? "",
      countryFlag: country?.flag ?? "",
    });
    await completeOnboarding();
    router.replace("/(tabs)");
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
                placeholder={t("profile.name_placeholder")}
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
              <TouchableOpacity
                onPress={() => setShowAll(true)}
                style={{ marginTop: 10 }}
              >
                <Text style={[styles.seeMore, isRTL && styles.textRTL]}>
                  {t("profile.see_more")}
                </Text>
              </TouchableOpacity>
            )}
            {showAll && (
              <View style={styles.searchWrap}>
                <TextInput
                  style={[styles.searchInput, isRTL && { textAlign: "right" }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search countries..."
                  placeholderTextColor="rgba(245, 235, 214, 0.3)"
                  returnKeyType="search"
                />
              </View>
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
    fontFamily: "Geist_500Medium",
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
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(245, 235, 214, 0.55)",
    marginBottom: 24,
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  fieldWrap: { marginBottom: 20 },
  fieldLabel: {
    fontFamily: "Geist_500Medium",
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
    fontFamily: "Geist_400Regular",
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
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#f5ebd6",
    flex: 1,
  },
  countryNameSelected: { color: "#e4c070", fontFamily: "Geist_500Medium" },
  seeMore: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#c9a04a",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  searchWrap: {
    marginTop: 10,
    backgroundColor: "#0f1f17",
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    color: "#f5ebd6",
    padding: 0,
  },
  btnPrimary: {
    backgroundColor: "#c9a04a",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "rgba(201, 160, 74, 0.25)" },
  btnPrimaryText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 15,
    color: "#0f1f17",
  },
});
