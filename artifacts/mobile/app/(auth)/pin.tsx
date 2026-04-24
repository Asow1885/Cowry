import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { CowryCrest } from "@/components/CowryCrest";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

const PIN_LENGTH = 6;

const NUMPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

const NUMPAD_LABELS: Record<string, string> = {
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
};

export default function PinScreen() {
  const { user } = useApp();
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState<string[]>([]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  function handleKey(key: string) {
    if (key === "⌫") {
      Haptics.selectionAsync();
      setPin((p) => p.slice(0, -1));
    } else if (key === "") {
      return;
    } else {
      if (pin.length >= PIN_LENGTH) return;
      Haptics.selectionAsync();
      const newPin = [...pin, key];
      setPin(newPin);
      if (newPin.length === PIN_LENGTH) {
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/(tabs)/");
        }, 200);
      }
    }
  }

  const firstName = user?.name?.split(" ")[0] ?? "Ashley";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          { paddingTop: topInset + 24, paddingBottom: bottomInset + 16 },
        ]}
      >
        <View style={styles.logoRow}>
          <CowryCrest size={22} color="#c9a04a" />
          <Text style={styles.logoText}>COWRY</Text>
        </View>

        <View style={styles.headingWrap}>
          <Text style={[styles.headline, isRTL && styles.textRTL]}>
            <Text style={styles.headlinePre}>{t("pin.headlinePre")} </Text>
            <Text style={styles.headlineEmphasis}>
              {t("pin.headlineEmphasis")}
            </Text>
          </Text>
          <Text style={[styles.subtext, isRTL && styles.textRTL]}>
            {t("pin.subtext")}, {firstName}.
          </Text>
        </View>

        <View style={styles.dotsRow}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < pin.length && styles.dotFilled]}
            />
          ))}
        </View>

        <View style={styles.numpad}>
          {NUMPAD.map((row, ri) => (
            <View key={ri} style={styles.numpadRow}>
              {row.map((key, ki) => (
                <TouchableOpacity
                  key={ki}
                  style={[styles.numKey, key === "" && styles.numKeyHidden]}
                  onPress={() => handleKey(key)}
                  activeOpacity={key === "" ? 1 : 0.6}
                  disabled={key === ""}
                >
                  {key !== "" && key !== "⌫" ? (
                    <View style={styles.numKeyInner}>
                      <Text style={styles.numKeyText}>{key}</Text>
                      {NUMPAD_LABELS[key] && (
                        <Text style={styles.numKeyLabel}>
                          {NUMPAD_LABELS[key]}
                        </Text>
                      )}
                    </View>
                  ) : key === "⌫" ? (
                    <Text style={styles.backspace}>{key}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>{t("pin.forgot")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a2e22" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 32,
  },
  logoText: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 13,
    letterSpacing: 3,
    color: "#f5ebd6",
  },
  headingWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  headline: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 4,
  },
  headlinePre: {
    fontFamily: "Fraunces_400Regular",
    color: "#f5ebd6",
    fontSize: 22,
  },
  headlineEmphasis: {
    fontFamily: "Fraunces_400Regular_Italic",
    color: "#e4c070",
    fontSize: 22,
  },
  subtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(245, 235, 214, 0.5)",
    textAlign: "center",
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  dotsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 36,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#c9a04a",
  },
  dotFilled: {
    backgroundColor: "#c9a04a",
  },
  numpad: {
    width: "80%",
    gap: 8,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  numKey: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(245, 235, 214, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  numKeyHidden: {
    backgroundColor: "transparent",
  },
  numKeyInner: {
    alignItems: "center",
  },
  numKeyText: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 26,
    color: "#f5ebd6",
    lineHeight: 30,
  },
  numKeyLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 7,
    letterSpacing: 1,
    color: "rgba(245, 235, 214, 0.45)",
    marginTop: -2,
  },
  backspace: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    color: "#f5ebd6",
  },
  forgotBtn: { marginTop: 20, paddingVertical: 12 },
  forgotText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#c9a04a",
    textAlign: "center",
  },
});
