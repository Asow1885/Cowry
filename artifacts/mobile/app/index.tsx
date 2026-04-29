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

const GREEN = "#1a2e22";
const GOLD  = "#c9a04a";
const CREAM = "#f0e8d0";

// Blur-simulation offsets: 8 ghost copies spread around the text
const BLUR_OFFSETS: [number, number][] = [
  [-5, 0], [5, 0], [0, -2], [0, 2],
  [-4, -2], [4, -2], [-4, 2], [4, 2],
];

export default function SplashScreen() {
  const { isOnboarded, isLoading } = useApp();
  const hasNavigated = useRef(false);

  const glowOpacity    = useRef(new Animated.Value(0)).current;
  const shellY         = useRef(new Animated.Value(-340)).current;
  const shellX         = useRef(new Animated.Value(28)).current;  // lateral arc
  const shellDepth     = useRef(new Animated.Value(0.78)).current; // depth scale
  const shellRotate    = useRef(new Animated.Value(0)).current;
  const shellBounceY   = useRef(new Animated.Value(0)).current;
  const shellOpacity   = useRef(new Animated.Value(0)).current;
  const cowryOpacity   = useRef(new Animated.Value(0)).current;
  const cowryScale     = useRef(new Animated.Value(1.55)).current;
  const cowryBlur      = useRef(new Animated.Value(1)).current;
  const dividerScale   = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  function doNavigate() {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    // Navigate immediately so next screen loads underneath the splash
    router.replace(isOnboarded ? "/(auth)/returning" : "/(auth)/welcome");

    // Then dissolve the splash away — no flash, cross-dissolve feel
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 900,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),

      // ── Glow + coin toss entrance ──────────────────────────────
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 1100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(140),
          Animated.parallel([
            Animated.timing(shellOpacity, {
              toValue: 1,
              duration: 260,
              useNativeDriver: true,
            }),
            // Y: falls in on a gravity arc — fast entry, soft landing
            Animated.timing(shellY, {
              toValue: 0,
              duration: 1180,
              easing: Easing.bezier(0.22, 0.0, 0.18, 1.0),
              useNativeDriver: true,
            }),
            // X: lateral drift — coin arcs inward from a slight angle
            Animated.timing(shellX, {
              toValue: 0,
              duration: 1300,
              easing: Easing.bezier(0.34, 1.12, 0.64, 1.0), // gentle overshoot
              useNativeDriver: true,
            }),
            // Depth: scale up from 0.78 — coin coming from further away
            Animated.timing(shellDepth, {
              toValue: 1,
              duration: 1180,
              easing: Easing.bezier(0.22, 0.0, 0.18, 1.0),
              useNativeDriver: true,
            }),
            // Rotation: tumbles and settles with trailing lag
            Animated.timing(shellRotate, {
              toValue: 1,
              duration: 1320,
              easing: Easing.bezier(0.14, 0.8, 0.28, 1.0),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),

      // ── Damped landing bounce ─────────────────────────────────
      Animated.sequence([
        Animated.timing(shellBounceY, {
          toValue: -11,
          duration: 145,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shellBounceY, {
          toValue: 4,
          duration: 175,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shellBounceY, {
          toValue: -3,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shellBounceY, {
          toValue: 0,
          duration: 165,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // ── COWRY blur-to-focus + wordmark scale ─────────────────
      Animated.parallel([
        Animated.timing(cowryOpacity, {
          toValue: 1,
          duration: 720,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cowryScale, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Blur → sharp: ghost copies fade out as text comes into focus
        Animated.timing(cowryBlur, {
          toValue: 0,
          duration: 2450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(dividerScale, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(540),
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 620,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.delay(3900),
    ]).start(() => doNavigate());

    const safety = setTimeout(() => doNavigate(), 11000);
    return () => clearTimeout(safety);
  }, []);

  const rotateStr = shellRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-35deg", "8deg"],
  });

  // Ghost-copy opacity: present when blurry (cowryBlur=1), gone when sharp (cowryBlur=0)
  const blurGhostOpacity = cowryBlur.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.9],
  });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <View style={styles.glowOuter} />
        <View style={styles.glowInner} />
      </Animated.View>

      <View style={styles.stage}>
        <View style={styles.brand}>

          {/* ── COWRY with blur-to-focus ─────────────────────── */}
          <Animated.View style={{
            transform: [{ scale: cowryScale }],
            opacity: cowryOpacity,
          }}>
            <View>
              {/* Sharp base layer — always present */}
              <Text style={styles.wordmark}>COWRY</Text>

              {/* Ghost blur layer — fades out as sharp comes in */}
              <Animated.View style={[
                StyleSheet.absoluteFillObject,
                { opacity: blurGhostOpacity },
              ]}>
                {BLUR_OFFSETS.map(([tx, ty], i) => (
                  <Text
                    key={i}
                    style={[styles.wordmark, {
                      position: "absolute",
                      opacity: 0.18,
                      transform: [{ translateX: tx }, { translateY: ty }],
                    }]}
                  >
                    COWRY
                  </Text>
                ))}
              </Animated.View>
            </View>
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

        {/* ── Shell coin toss ─────────────────────────────────── */}
        <Animated.View style={[
          styles.shellWrap,
          {
            opacity: shellOpacity,
            transform: [
              { translateY: shellY },
              { translateY: shellBounceY },
              { translateX: shellX },
              { scale: shellDepth },
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
