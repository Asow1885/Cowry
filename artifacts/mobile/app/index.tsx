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

  const crestOpacity = useRef(new Animated.Value(0)).current;
  const crestScale = useRef(new Animated.Value(0.85)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoading) return;

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
      if (isOnboarded) {
        router.replace("/(auth)/returning");
      } else {
        router.replace("/(auth)/welcome");
      }
    });
  }, [isLoading, isOnboarded]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={[styles.content, { paddingTop: topInset }]}>
        <Animated.View
          style={[
            styles.crestWrap,
            {
              opacity: crestOpacity,
              transform: [{ scale: crestScale }],
            },
          ]}
        >
          <CowryCrest size={80} color="#c9a04a" />
        </Animated.View>
        <Animated.View style={{ opacity: wordmarkOpacity }}>
          <Text style={styles.wordmark}>COWRY</Text>
          <Text style={styles.tagline}>Ancient Wealth. Modern Access.</Text>
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
  content: {
    alignItems: "center",
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
