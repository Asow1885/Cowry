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

type MockTx = {
  id: string;
  icon: "arrow-up-right" | "arrow-down-left";
  nameKey?: string;
  name?: string;
  detail: string;
  amount: string;
  dateKey?: string;
  dateRaw?: string;
  isSend: boolean;
};

const MOCK_TRANSACTIONS: MockTx[] = [
  {
    id: "1",
    icon: "arrow-up-right",
    name: "Mama",
    detail: "Orange Money · Conakry",
    amount: "-$120.00",
    dateKey: "activity.tx_today",
    isSend: true,
  },
  {
    id: "2",
    icon: "arrow-down-left",
    nameKey: "activity.tx_received",
    detail: "Bank Transfer",
    amount: "+$500.00",
    dateKey: "activity.tx_yesterday",
    isSend: false,
  },
  {
    id: "3",
    icon: "arrow-up-right",
    name: "Papa",
    detail: "Wave · Dakar",
    amount: "-$85.00",
    dateRaw: "Apr 20",
    isSend: true,
  },
];

export default function ActivityScreen() {
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container]}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { fontFamily: fonts.headline }, isRTL && styles.textRTL]}>
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
                  name={tx.icon}
                  size={18}
                  color={tx.isSend ? "#c9a04a" : "#4ade80"}
                />
              </View>
              <View style={[styles.txMeta, isRTL && { alignItems: "flex-end" }]}>
                <Text style={[styles.txName, { fontFamily: fonts.bodyMed }]}>
                  {tx.nameKey ? t(tx.nameKey) : (tx.name ?? "")}
                </Text>
                <Text style={[styles.txDetail, { fontFamily: fonts.body }]}>{tx.detail}</Text>
              </View>
              <View style={[styles.txRight, isRTL && { alignItems: "flex-start" }]}>
                <Text
                  style={[
                    styles.txAmount,
                    { fontFamily: fonts.bodySemi, color: tx.isSend ? "#f5ebd6" : "#4ade80" },
                  ]}
                >
                  {tx.amount}
                </Text>
                <Text style={[styles.txCurrency, { fontFamily: fonts.body }]}>
                  {tx.dateKey ? t(tx.dateKey) : (tx.dateRaw ?? "")}
                </Text>
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
    fontFamily: "Geist_400Regular",
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
    fontFamily: "Geist_500Medium",
    fontSize: 15,
    color: "#0a0907",
    marginBottom: 2,
  },
  txDetail: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#6b6b66",
  },
  txRight: { alignItems: "flex-end" },
  txAmount: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  txCurrency: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#6b6b66",
  },
});
