import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { router } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { useApp } from "@/context/AppContext";

export default function SplashScreen() {
  const { isOnboarded, isLoading } = useApp();

  const hasNavigated = useRef(false);
  const videoDone    = useRef(false);
  const loadDone     = useRef(false);
  const screenOpacity = useRef(new Animated.Value(1)).current;

  function doNavigate() {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 450,
      useNativeDriver: false,
    }).start(() => {
      const dest = isOnboarded ? "/(auth)/returning" : "/(auth)/welcome";
      router.replace(dest);
    });
  }

  function tryNavigate() {
    if (hasNavigated.current) return;
    if (!videoDone.current || !loadDone.current) return;
    doNavigate();
  }

  useEffect(() => {
    if (isLoading) return;
    loadDone.current = true;
    tryNavigate();

    const safety = setTimeout(() => {
      if (!hasNavigated.current) doNavigate();
    }, 6000);
    return () => clearTimeout(safety);
  }, [isLoading]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <TouchableWithoutFeedback onPress={doNavigate}>
        <View style={styles.inner}>
          <View style={styles.videoSquare}>
            <Video
              source={require("../assets/cowry-splash.mp4")}
              style={StyleSheet.absoluteFill}
              shouldPlay
              isMuted
              isLooping={false}
              resizeMode={ResizeMode.COVER}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded && status.didJustFinish) {
                  videoDone.current = true;
                  tryNavigate();
                }
              }}
              onError={() => {
                videoDone.current = true;
                loadDone.current = true;
                doNavigate();
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2e22",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoSquare: {
    width: "100%",
    aspectRatio: 1,
  },
});
