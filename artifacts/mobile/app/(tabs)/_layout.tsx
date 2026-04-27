import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

function TabIcon({
  featherName,
  sfName,
  focused,
  isIOS,
}: {
  featherName: string;
  sfName: string;
  focused: boolean;
  isIOS: boolean;
}) {
  const iconColor = focused ? "#1a2e22" : "rgba(10,9,7,0.35)";
  return (
    <View style={focused ? styles.iconPill : styles.iconWrap}>
      {isIOS ? (
        <SymbolView
          name={focused ? `${sfName}.fill` : sfName}
          tintColor={iconColor}
          size={20}
        />
      ) : (
        <Feather name={featherName as any} size={20} color={iconColor} />
      )}
    </View>
  );
}

function NativeTabLayout() {
  const { t } = useTranslation();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>{t("tabs.home")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cards">
        <Icon sf={{ default: "creditcard", selected: "creditcard.fill" }} />
        <Label>{t("tabs.cards")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="recipients">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>{t("tabs.recipients")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="payments">
        <Icon sf={{ default: "arrow.left.arrow.right", selected: "arrow.left.arrow.right.circle.fill" }} />
        <Label>{t("tabs.payments")}</Label>
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
        tabBarActiveTintColor: "#0a0907",
        tabBarInactiveTintColor: "rgba(10,9,7,0.35)",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "white",
          borderTopWidth: 1,
          borderTopColor: "rgba(10,9,7,0.08)",
          elevation: 0,
          height: isWeb ? 84 : 88,
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
              style={[StyleSheet.absoluteFill, { backgroundColor: "white" }]}
            />
          ),
        tabBarLabelStyle: {
          fontFamily: "Geist_500Medium",
          fontSize: 11,
          letterSpacing: 0.1,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="home" sfName="house" focused={focused} isIOS={isIOS} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: t("tabs.cards"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="credit-card" sfName="creditcard" focused={focused} isIOS={isIOS} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipients"
        options={{
          title: t("tabs.recipients"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="users" sfName="person.2" focused={focused} isIOS={isIOS} />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: t("tabs.payments"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="repeat" sfName="arrow.left.arrow.right" focused={focused} isIOS={isIOS} />
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

const styles = StyleSheet.create({
  iconPill: {
    backgroundColor: "#ebf2ec",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
