import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import type { SFSymbol } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

type FeatherName = ComponentProps<typeof Feather>["name"];

function TabIcon({
  featherName,
  sfName,
  sfNameFill,
  focused,
  isIOS,
}: {
  featherName: FeatherName;
  sfName: SFSymbol;
  sfNameFill: SFSymbol;
  focused: boolean;
  isIOS: boolean;
}) {
  const iconColor = focused ? "#1a2e22" : "rgba(10,9,7,0.35)";
  return (
    <View style={focused ? styles.iconPill : styles.iconWrap}>
      {isIOS ? (
        <SymbolView
          name={focused ? sfNameFill : sfName}
          tintColor={iconColor}
          size={20}
        />
      ) : (
        <Feather name={featherName} size={20} color={iconColor} />
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
      <NativeTabs.Trigger name="activity">
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
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
            <TabIcon featherName="home" sfName="house" sfNameFill="house.fill" focused={focused} isIOS={isIOS} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: t("tabs.activity"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="clock" sfName="clock" sfNameFill="clock.fill" focused={focused} isIOS={isIOS} />
          ),
        }}
      />
      <Tabs.Screen
        name="esim"
        options={{
          title: t("tabs.esim"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="wifi" sfName="simcard" sfNameFill="simcard.fill" focused={focused} isIOS={isIOS} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: t("tabs.you"),
          tabBarIcon: ({ focused }) => (
            <TabIcon featherName="user" sfName="person" sfNameFill="person.fill" focused={focused} isIOS={isIOS} />
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
