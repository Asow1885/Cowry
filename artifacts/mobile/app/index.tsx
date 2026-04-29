import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useApp } from "@/context/AppContext";
import ShellCluster from "@/components/ShellCluster";

const GREEN   = "#1a2e22";
const GOLD    = "#c9a04a";
const CREAM   = "#f0e8d0";

export default function SplashScreen() {
  const { isOnboarded, isLoading } = useApp();

  const hasNavigated = useRef(false);
  const readyRef     = useRef(false);

  const glowOpacity    = useRef(new Animated.Value(0)).current;
  const shellY         = useRef(new Animated.Value(-260)).current;
  const shellRotate    = useRef(new Animated.Value(0)).current;
  const shellBounceY   = useRef(new Animated.Value(0)).current;
  const shellOpacity   = useRef(new Animated.Value(0)).current;
  const cowryScale     = useRef(new Animated.Value(1.7)).current;
  const cowryOpacity   = useRef(new Animated.Value(0)).current;
  const dividerScale   = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  function doNavigate() {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      router.replace(isOnboarded ? "/(auth)/returning" : "/(auth)/welcome");
    });
  }

  useEffect(() => {
    if (!isLoading) {
      readyRef.current = true;
    }
  }, [isLoading]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(80),

      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(180),
          Animated.parallel([
            Animated.timing(shellOpacity, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
            }),
            Animated.timing(shellY, {
              toValue: 0,
              duration: 540,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(shellRotate, {
              toValue: 1,
              duration: 540,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),

      Animated.sequence([
        Animated.spring(shellBounceY, {
          toValue: -18,
          speed: 28,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(shellBounceY, {
          toValue: 0,
          speed: 14,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(cowryOpacity, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cowryScale, {
          toValue: 1,
          duration: 680,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(260),
          Animated.timing(dividerScale, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(480),
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.delay(900),
    ]).start(() => {
      doNavigate();
    });

    const safety = setTimeout(() => doNavigate(), 6000);
    return () => clearTimeout(safety);
  }, []);

  const rotateStr = shellRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-30deg", "10deg"],
  });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <View style={styles.glowOuter} />
        <View style={styles.glowInner} />
      </Animated.View>

      <View style={styles.stage}>
        <View style={styles.brand}>
          <Animated.View style={{
            transform: [{ scale: cowryScale }],
            opacity: cowryOpacity,
          }}>
            <Text style={styles.wordmark}>COWRY</Text>
          </Animated.View>

          <Animated.View style={[styles.divider, { transform: [{ scaleX: dividerScale }] }]} />

          <Animated.Text
            style={[styles.tagline, { opacity: taglineOpacity }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
          >
            ANCIENT WEALTH · MODERN ACCESS
          </Animated.Text>
        </View>

        <Animated.View style={[
          styles.shellWrap,
          {
            opacity: shellOpacity,
            transform: [
              { translateY: shellY },
              { translateY: shellBounceY },
              { rotate: rotateStr },
            ],
          },
        ]}>
          <ShellCluster size={110} color={CREAM} />
          <View style={styles.shadow} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  glowContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 480,
    height: 480,
  },
  glowOuter: {
    position: "absolute",
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: "#2d4530",
  },
  glowInner: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#c9a04a",
    opacity: 0.09,
  },
  stage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 36,
    width: "100%",
  },
  brand: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  wordmark: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 46,
    letterSpacing: 7,
    color: CREAM,
    includeFontPadding: false,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: GOLD,
    marginTop: 11,
    marginBottom: 10,
    opacity: 0.8,
  },
  tagline: {
    fontFamily: "Geist_400Regular",
    fontSize: 8.5,
    letterSpacing: 1.8,
    color: CREAM,
    opacity: 0.68,
  },
  shellWrap: {
    alignItems: "center",
    width: 110,
  },
  shadow: {
    width: 60,
    height: 5,
    borderRadius: 50,
    backgroundColor: "#000",
    opacity: 0.22,
    marginTop: 2,
    alignSelf: "center",
  },
});
