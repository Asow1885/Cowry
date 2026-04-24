import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
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

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

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

export default function VerifyScreen() {
  const { phone = "", flag = "🌍" } = useLocalSearchParams<{
    phone: string;
    flag: string;
  }>();
  const { language, setLanguage } = useApp();
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hasNavigated = useRef(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  function handleCodeChange(index: number, val: string) {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== "") && !hasNavigated.current) {
      hasNavigated.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        router.push({
          pathname: "/(auth)/profile",
          params: { phone },
        });
      }, 200);
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const isFilled = code.every((d) => d !== "");

  function handleVerify() {
    if (!isFilled || hasNavigated.current) return;
    hasNavigated.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(auth)/profile",
      params: { phone },
    });
  }

  function handleResend() {
    if (countdown > 0) return;
    setCode(Array(CODE_LENGTH).fill(""));
    setCountdown(RESEND_SECONDS);
    hasNavigated.current = false;
    inputRefs.current[0]?.focus();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleSelectLang(lang: Language) {
    await setLanguage(lang);
    setLangPickerVisible(false);
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          { paddingTop: topInset + 16, paddingBottom: bottomInset + 24 },
        ]}
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

        <StepDots current={1} />

        <Text style={[styles.headline, isRTL && styles.textRTL]}>
          <Text style={styles.headlinePre}>{t("verify.headlinePre")}{"\n"}</Text>
          <Text style={styles.headlineEmphasis}>
            {t("verify.headlineEmphasis")}
          </Text>
        </Text>

        <Text style={[styles.helper, isRTL && styles.textRTL]}>
          {t("verify.helper_prefix")}{"\n"}
          <Text style={styles.helperPhone}>
            {flag} {phone}
          </Text>
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.codeBox,
                digit !== "" && styles.codeBoxFilled,
              ]}
            >
              <TextInput
                ref={(r) => {
                  inputRefs.current[i] = r;
                }}
                style={styles.codeInput}
                value={digit}
                onChangeText={(val) => handleCodeChange(i, val)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(i, nativeEvent.key)
                }
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor="#c9a04a"
                caretHidden
              />
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
          <Text
            style={[
              styles.resend,
              countdown > 0 && styles.resendDisabled,
              isRTL && styles.textRTL,
            ]}
          >
            {countdown > 0
              ? `${t("verify.resend_countdown")} 0:${countdown.toString().padStart(2, "0")}`
              : t("verify.resend_now")}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.btnPrimary, !isFilled && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={!isFilled}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>
            {t("verify.cta")} {!isRTL ? "→" : "←"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.back()}
        >
          <Text style={styles.btnSecondaryText}>{t("verify.change_number")}</Text>
        </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#1a2e22" },
  content: { flex: 1, paddingHorizontal: 24 },
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
    marginBottom: 28,
  },
  helperPhone: {
    fontFamily: "Geist_500Medium",
    color: "#f5ebd6",
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  codeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 20,
  },
  codeBox: {
    width: 46,
    height: 56,
    backgroundColor: "#0f1f17",
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.25)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  codeBoxFilled: {
    borderColor: "#c9a04a",
    backgroundColor: "#25402f",
  },
  codeInput: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 24,
    color: "#f5ebd6",
    width: "100%",
    height: "100%",
    padding: 0,
  },
  resend: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#c9a04a",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  resendDisabled: { opacity: 0.45 },
  btnPrimary: {
    backgroundColor: "#c9a04a",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 4,
  },
  btnDisabled: { backgroundColor: "rgba(201, 160, 74, 0.25)" },
  btnPrimaryText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 15,
    color: "#0f1f17",
  },
  btnSecondary: { paddingVertical: 12, alignItems: "center" },
  btnSecondaryText: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#c9a04a",
  },
});
