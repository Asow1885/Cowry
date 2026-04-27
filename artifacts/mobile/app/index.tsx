import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { CowryCrest } from "@/components/CowryCrest";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function SplashScreen() {
  const { isOnboarded, isLoading } = useApp();
  const { t } = useTranslation();

  const hasNavigated = useRef(false);
  const animDone = useRef(false);
  const loadDone = useRef(false);

  const crestOpacity    = useRef(new Animated.Value(0)).current;
  const crestTranslateX = useRef(new Animated.Value(44)).current;
  const crestTranslateY = useRef(new Animated.Value(64)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkX       = useRef(new Animated.Value(-28)).current;
  const taglineOpacity  = useRef(new Animated.Value(0)).current;
  const screenOpacity   = useRef(new Animated.Value(1)).current;

  function tryNavigate() {
    if (hasNavigated.current) return;
    if (!animDone.current || !loadDone.current) return;
    hasNavigated.current = true;
    const dest = isOnboarded ? "/(auth)/returning" : "/(auth)/welcome";
    router.replace(dest);
  }

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    Animated.parallel([
      Animated.sequence([
        Animated.delay(350),
        Animated.parallel([
          Animated.timing(crestOpacity, {
            toValue: 1,
            duration: 1100,
            easing: ease,
            useNativeDriver: false,
          }),
          Animated.timing(crestTranslateX, {
            toValue: 0,
            duration: 1300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
          }),
          Animated.timing(crestTranslateY, {
            toValue: 0,
            duration: 1300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(1400),
        Animated.parallel([
          Animated.timing(wordmarkOpacity, {
            toValue: 1,
            duration: 800,
            easing: ease,
            useNativeDriver: false,
          }),
          Animated.timing(wordmarkX, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(2100),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          easing: ease,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.delay(7600),
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
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
    }, 10000);
    return () => clearTimeout(safety);
  }, [isLoading]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={[styles.glowOuter, { pointerEvents: "none" }]} />

      <View style={styles.lockup}>
        <Animated.View
          style={[
            styles.textGroup,
            { opacity: wordmarkOpacity, transform: [{ translateX: wordmarkX }] },
          ]}
        >
          <Text style={styles.wordmark}>COWRY</Text>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>

          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            {t("splash.tagline").toUpperCase()}
          </Animated.Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.crestWrap,
            {
              opacity: crestOpacity,
              transform: [
                { translateX: crestTranslateX },
                { translateY: crestTranslateY },
              ],
            },
          ]}
        >
          <CowryCrest size={92} color="#c9a04a" />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2e22",
    alignItems: "center",
    justifyContent: "center",
  },
  glowOuter: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(78, 120, 70, 0.16)",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -170 }, { translateY: -200 }],
  },
  lockup: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  textGroup: {
    flex: 1,
    paddingRight: 16,
  },
  wordmark: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 46,
    letterSpacing: 3,
    color: "#f5ebd6",
    lineHeight: 52,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(201, 160, 74, 0.35)",
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c9a04a",
    marginHorizontal: 7,
    opacity: 0.7,
  },
  tagline: {
    fontFamily: "Geist_400Regular",
    fontSize: 9,
    letterSpacing: 2.2,
    color: "#c9a04a",
    opacity: 0.85,
  },
  crestWrap: {
    flexShrink: 0,
  },
});
