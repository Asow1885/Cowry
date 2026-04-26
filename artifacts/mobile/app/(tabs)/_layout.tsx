import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

function NativeTabLayout() {
  const { t } = useTranslation();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>{t("tabs.home")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="activity">
        <Icon sf={{ default: "arrow.left.arrow.right", selected: "arrow.left.arrow.right.circle.fill" }} />
        <Label>{t("tabs.activity")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="esim">
        <Icon sf={{ default: "simcard", selected: "simcard.fill" }} />
        <Label>{t("tabs.esim")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="you">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>{t("tabs.you")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const { t } = useTranslation();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#c9a04a",
        tabBarInactiveTintColor: "rgba(26, 46, 34, 0.4)",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "#f5ebd6",
          borderTopWidth: 1,
          borderTopColor: "rgba(10, 9, 7, 0.08)",
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: "#f5ebd6" }]}
            />
          ),
        tabBarLabelStyle: {
          fontFamily: "Geist_400Regular",
          fontSize: 10,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: t("tabs.activity"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="arrow.left.arrow.right" tintColor={color} size={22} />
            ) : (
              <Feather name="activity" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="esim"
        options={{
          title: t("tabs.esim"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="simcard" tintColor={color} size={22} />
            ) : (
              <Feather name="wifi" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: t("tabs.you"),
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person" tintColor={color} size={22} />
            ) : (
              <Feather name="user" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
