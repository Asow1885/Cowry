import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "@/hooks/useTranslation";

export default function EsimScreen() {
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { fontFamily: fonts.headline }, isRTL && styles.textRTL]}>
          {t("esim.title")}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Feather name="wifi" size={36} color="#c9a04a" />
        </View>
        <Text style={[styles.subtitle, { fontFamily: fonts.headlineEmphasis }]}>{t("esim.subtitle")}</Text>
        <Text style={styles.comingSoon}>{t("esim.coming_soon")}</Text>
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
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(201, 160, 74, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 18,
    color: "#0a0907",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  comingSoon: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#6b6b66",
    textAlign: "center",
  },
});
