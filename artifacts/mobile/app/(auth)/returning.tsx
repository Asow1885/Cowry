import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { CowryCrest } from "@/components/CowryCrest";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function ReturningScreen() {
  const { user } = useApp();
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  function handleBiometric() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)");
  }

  function handlePin() {
    router.push("/(auth)/pin");
  }

  const firstName = user?.name?.split(" ")[0] ?? "Ashley";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          { paddingTop: topInset + 24, paddingBottom: bottomInset + 24 },
        ]}
      >
        <View style={styles.logoRow}>
          <CowryCrest size={22} color="#c9a04a" />
          <Text style={styles.logoText}>COWRY</Text>
        </View>

        <View style={styles.centerSection}>
          <TouchableOpacity
            style={styles.faceIdRing}
            onPress={handleBiometric}
            activeOpacity={0.8}
          >
            <View style={styles.faceIdOuter} />
            <CowryCrest size={52} color="#c9a04a" />
          </TouchableOpacity>

          <View style={styles.greetingWrap}>
            <Text style={[styles.greeting, isRTL && styles.textRTL]}>
              {t("returning.welcome_pre")}{" "}
              <Text style={styles.greetingName}>{firstName}</Text>
            </Text>
            <Text style={[styles.prompt, { fontFamily: fonts.body }, isRTL && styles.textRTL]}>
              {t("returning.prompt")}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handlePin} style={styles.pinBtn}>
          <Text style={[styles.pinBtnText, { fontFamily: fonts.body }]}>
            {t("returning.use_pin")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a2e22" },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "center",
  },
  logoText: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 13,
    letterSpacing: 3,
    color: "#f5ebd6",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  faceIdRing: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  faceIdOuter: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#c9a04a",
  },
  greetingWrap: { alignItems: "center", gap: 8 },
  greeting: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 24,
    color: "#f5ebd6",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  greetingName: {
    fontFamily: "Fraunces_400Regular_Italic",
    color: "#e4c070",
  },
  prompt: {
    fontSize: 13,
    color: "rgba(245, 235, 214, 0.5)",
    textAlign: "center",
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  pinBtn: { paddingVertical: 12 },
  pinBtnText: {
    fontSize: 14,
    color: "#c9a04a",
    textAlign: "center",
  },
});
