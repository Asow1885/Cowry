import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import { router } from "expo-router";

export default function YouScreen() {
  const { user, language, resetOnboarding } = useApp();
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AS";

  async function handleReset() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await resetOnboarding();
    router.replace("/(auth)/welcome");
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t("you.title")}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? "Ashley Sow"}</Text>
          <Text style={styles.userPhone}>{user?.phone ?? ""}</Text>
          {user?.country && (
            <View style={styles.countryBadge}>
              <Text style={styles.countryFlag}>{user.countryFlag}</Text>
              <Text style={styles.countryName}>{user.country}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Feather name="globe" size={18} color="#8a6b2a" />
            <Text style={styles.rowLabel}>{t("change_language")}</Text>
            <Text style={styles.rowValue}>{language.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Feather name="shield" size={18} color="#8a6b2a" />
            <Text style={styles.rowLabel}>{t("you.security")}</Text>
            <Text style={styles.rowValue}>{t("you.security_value")}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Feather name="bell" size={18} color="#8a6b2a" />
            <Text style={styles.rowLabel}>{t("you.notifications")}</Text>
            <Text style={styles.rowValue}>{t("you.notifications_value")}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleReset}>
          <Feather name="log-out" size={16} color="#8a6b2a" />
          <Text style={styles.signOutText}>{t("you.sign_out")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5ebd6" },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10, 9, 7, 0.08)",
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 28,
    color: "#0a0907",
    letterSpacing: -0.8,
  },
  textRTL: { textAlign: "right" },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  avatarWrap: { alignItems: "center", marginBottom: 32, gap: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1a2e22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 22,
    color: "#c9a04a",
  },
  userName: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 22,
    color: "#0a0907",
    letterSpacing: -0.5,
  },
  userPhone: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#6b6b66",
  },
  countryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "rgba(201, 160, 74, 0.12)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.25)",
  },
  countryFlag: { fontSize: 14 },
  countryName: {
    fontFamily: "Geist_500Medium",
    fontSize: 12,
    color: "#8a6b2a",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10, 9, 7, 0.06)",
  },
  rowLabel: {
    fontFamily: "Geist_400Regular",
    fontSize: 15,
    color: "#0a0907",
    flex: 1,
  },
  rowValue: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#6b6b66",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  signOutText: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    color: "#8a6b2a",
  },
});
