import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CowryCrest } from "@/components/CowryCrest";
import { useApp } from "@/context/AppContext";

export default function SplashScreen() {
  const { isOnboarded, isLoading } = useApp();
  const insets = useSafeAreaInsets();
  const hasNavigated = useRef(false);

  const crestOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(crestOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    const dest = isOnboarded ? "/(auth)/returning" : "/(auth)/welcome";
    const delay = setTimeout(() => router.replace(dest), 1200);
    return () => clearTimeout(delay);
  }, [isLoading, isOnboarded]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <Animated.View style={[styles.crestWrap, { opacity: crestOpacity }]}>
        <CowryCrest size={80} color="#c9a04a" />
      </Animated.View>
      <Animated.View style={{ opacity: wordmarkOpacity, alignItems: "center" }}>
        <Text style={styles.wordmark}>COWRY</Text>
        <Text style={styles.tagline}>Ancient Wealth. Modern Access.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2e22",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  crestWrap: {
    marginBottom: 8,
  },
  wordmark: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    letterSpacing: 6,
    color: "#f5ebd6",
    textAlign: "center",
  },
  tagline: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 14,
    color: "#c9a04a",
    textAlign: "center",
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
