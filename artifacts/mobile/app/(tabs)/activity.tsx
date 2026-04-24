import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "@/hooks/useTranslation";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    icon: "arrow-up-right",
    name: "Mama",
    detail: "Orange Money · Conakry",
    amount: "-$120.00",
    currency: "978,240 GNF",
    date: "Today",
  },
  {
    id: "2",
    icon: "arrow-down-left",
    name: "Received",
    detail: "Bank Transfer",
    amount: "+$500.00",
    currency: "USD",
    date: "Yesterday",
  },
  {
    id: "3",
    icon: "arrow-up-right",
    name: "Papa",
    detail: "Wave · Dakar",
    amount: "-$85.00",
    currency: "51,000 XOF",
    date: "Apr 20",
  },
];

export default function ActivityScreen() {
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container]}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t("activity.title")}
        </Text>
      </View>

      {MOCK_TRANSACTIONS.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="activity" size={32} color="#8a6b2a" />
          <Text style={styles.emptyText}>{t("activity.empty")}</Text>
        </View>
      ) : (
        <View style={styles.txList}>
          {MOCK_TRANSACTIONS.map((tx) => (
            <View
              key={tx.id}
              style={[
                styles.txRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <View style={styles.txIcon}>
                <Feather
                  name={tx.icon as "arrow-up-right" | "arrow-down-left"}
                  size={18}
                  color={tx.icon === "arrow-up-right" ? "#c9a04a" : "#4ade80"}
                />
              </View>
              <View style={[styles.txMeta, isRTL && { alignItems: "flex-end" }]}>
                <Text style={styles.txName}>{tx.name}</Text>
                <Text style={styles.txDetail}>{tx.detail}</Text>
              </View>
              <View style={[styles.txRight, isRTL && { alignItems: "flex-start" }]}>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.amount.startsWith("+") ? "#4ade80" : "#f5ebd6" },
                  ]}
                >
                  {tx.amount}
                </Text>
                <Text style={styles.txCurrency}>{tx.currency}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5ebd6" },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10, 9, 7, 0.08)",
    marginBottom: 8,
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 28,
    color: "#0a0907",
    letterSpacing: -0.8,
  },
  textRTL: { textAlign: "right" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#6b6b66",
  },
  txList: { paddingHorizontal: 24 },
  txRow: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10, 9, 7, 0.06)",
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(10, 9, 7, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txMeta: { flex: 1 },
  txName: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: "#0a0907",
    marginBottom: 2,
  },
  txDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#6b6b66",
  },
  txRight: { alignItems: "flex-end" },
  txAmount: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  txCurrency: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#6b6b66",
  },
});
