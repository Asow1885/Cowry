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
import { useTranslation } from "@/hooks/useTranslation";

export default function SplashScreen() {
  const { isOnboarded, isLoading } = useApp();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const hasNavigated = useRef(false);
  const animDone = useRef(false);
  const loadDone = useRef(false);

  const crestOpacity = useRef(new Animated.Value(0)).current;
  const crestScale = useRef(new Animated.Value(0.85)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  function tryNavigate() {
    if (hasNavigated.current) return;
    if (!animDone.current || !loadDone.current) return;
    hasNavigated.current = true;
    const dest = isOnboarded ? "/(auth)/returning" : "/(auth)/welcome";
    router.replace(dest);
  }

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(crestOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.spring(crestScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(400),
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.delay(2000),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]);

    sequence.start(() => {
      animDone.current = true;
      tryNavigate();
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    loadDone.current = true;
    tryNavigate();

    const safety = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        const dest = isOnboarded ? "/(auth)/returning" : "/(auth)/welcome";
        router.replace(dest);
      }
    }, 5500);
    return () => clearTimeout(safety);
  }, [isLoading]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity, paddingTop: topInset }]}>
      <Animated.View
        style={[
          styles.crestWrap,
          { opacity: crestOpacity, transform: [{ scale: crestScale }] },
        ]}
      >
        <CowryCrest size={80} color="#c9a04a" />
      </Animated.View>
      <Animated.View style={{ opacity: wordmarkOpacity, alignItems: "center" }}>
        <Text style={styles.wordmark}>COWRY</Text>
        <Text style={styles.tagline}>{t("splash.tagline")}</Text>
      </Animated.View>
    </Animated.View>
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
