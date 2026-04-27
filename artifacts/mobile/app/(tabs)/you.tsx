import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CowryCrest } from "@/components/CowryCrest";
import { useTranslation } from "@/hooks/useTranslation";

export default function YouScreen() {
  const { t, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topInset + 32 }]}>
      <CowryCrest size={32} color="rgba(26,46,34,0.15)" />
      <Text style={[styles.title, { fontFamily: fonts.headlineSemi }]}>
        {t("tabs.you")}
      </Text>
      <Text style={[styles.sub, { fontFamily: fonts.body }]}>
        {t("coming_soon")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5ebd6",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 28,
    color: "#0a0907",
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    color: "#6b6b66",
  },
});
