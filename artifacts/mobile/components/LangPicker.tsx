import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Language } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

interface LangPickerProps {
  visible: boolean;
  currentLang: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "pt", label: "Portuguese", native: "Português" },
];

export function LangPicker({
  visible,
  currentLang,
  onSelect,
  onClose,
}: LangPickerProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>{t("change_language")}</Text>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langRow, isSelected && styles.langRowSelected]}
                onPress={() => onSelect(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.langInfo}>
                  <Text
                    style={[
                      styles.langNative,
                      isSelected && styles.langNativeSelected,
                      lang.code === "ar" && styles.langArabic,
                    ]}
                  >
                    {lang.native}
                  </Text>
                  <Text style={styles.langSub}>{lang.label}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 9, 7, 0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1a2e22",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(201, 160, 74, 0.3)",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 20,
    color: "#f5ebd6",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.15)",
  },
  langRowSelected: {
    backgroundColor: "#25402f",
    borderColor: "#c9a04a",
  },
  langInfo: {
    flex: 1,
  },
  langNative: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 17,
    color: "#f5ebd6",
    marginBottom: 2,
  },
  langNativeSelected: {
    color: "#e4c070",
  },
  langArabic: {
    fontFamily: "NotoSansArabic_400Regular",
    textAlign: "right",
  },
  langSub: {
    fontSize: 12,
    color: "rgba(245, 235, 214, 0.5)",
    fontFamily: "Geist_400Regular",
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c9a04a",
  },
});
