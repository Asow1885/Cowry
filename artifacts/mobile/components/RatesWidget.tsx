import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { useTranslation } from "@/hooks/useTranslation";

const PAIRS = [
  { code: "GNF", flag: "🇬🇳", name: "Franc" },
  { code: "XOF", flag: "🇸🇳", name: "CFA" },
  { code: "NGN", flag: "🇳🇬", name: "Naira" },
  { code: "MAD", flag: "🇲🇦", name: "Dirham" },
  { code: "KES", flag: "🇰🇪", name: "Shilling" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
];

function formatRate(rate: number): string {
  if (rate >= 100) return rate.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (rate >= 1) return rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

export function RatesWidget() {
  const { t, isRTL, fonts } = useTranslation();
  const { rates, updatedAt, loading, error, refetch } = useExchangeRates();

  const timeLabel = updatedAt
    ? updatedAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.rowReverse]}>
        <View style={[styles.headerLeft, isRTL && styles.rowReverse]}>
          <View style={styles.liveDot} />
          <Text style={[styles.title, { fontFamily: fonts.headlineSemi }]}>
            {t("home.live_rates")}
          </Text>
        </View>
        <View style={[styles.headerRight, isRTL && styles.rowReverse]}>
          {timeLabel ? (
            <Text style={[styles.updated, { fontFamily: fonts.body }]}>
              {t("home.rates_updated")} {timeLabel}
            </Text>
          ) : null}
          <TouchableOpacity onPress={refetch} activeOpacity={0.7} style={styles.refreshBtn}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#1a2e22" />
        </View>
      ) : error ? (
        <TouchableOpacity onPress={refetch} activeOpacity={0.8} style={styles.errorRow}>
          <Text style={[styles.errorText, { fontFamily: fonts.body }]}>
            {t("home.rates_unavailable")}
          </Text>
          <Text style={styles.retryText}>{t("home.rates_retry")}</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
          style={{ marginHorizontal: -24 }}
        >
          {PAIRS.map(({ code, flag, name }) => {
            const rate = rates?.[code];
            if (!rate) return null;
            return (
              <View key={code} style={styles.rateCard}>
                <Text style={styles.rateFlag}>{flag}</Text>
                <Text style={[styles.rateCode, { fontFamily: fonts.bodyMed }]}>{code}</Text>
                <Text style={[styles.rateName, { fontFamily: fonts.body }]}>{name}</Text>
                <Text style={[styles.rateValue, { fontFamily: fonts.headlineSemi }]}>
                  {formatRate(rate)}
                </Text>
                <Text style={[styles.rateBase, { fontFamily: fonts.body }]}>
                  {t("home.rates_per_usd")}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 8,
  },
  rowReverse: { flexDirection: "row-reverse" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#3aac5e",
  },
  title: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    color: "#0a0907",
    letterSpacing: -0.4,
  },
  updated: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#6b6b66",
  },
  refreshBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(26,46,34,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshIcon: {
    fontSize: 14,
    color: "#1a2e22",
    lineHeight: 17,
  },

  loadingRow: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "flex-start",
  },
  errorRow: {
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: "rgba(201,160,74,0.12)",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    color: "#6b6b66",
  },
  retryText: {
    fontFamily: "Geist_500Medium",
    fontSize: 13,
    color: "#1a2e22",
    textDecorationLine: "underline",
  },

  rateCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: 110,
    gap: 2,
    shadowColor: "#0a0907",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  rateFlag: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 4,
  },
  rateCode: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 15,
    color: "#0a0907",
    letterSpacing: 0.3,
  },
  rateName: {
    fontFamily: "Geist_400Regular",
    fontSize: 11,
    color: "#6b6b66",
    marginBottom: 8,
  },
  rateValue: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 18,
    color: "#1a2e22",
    letterSpacing: -0.3,
  },
  rateBase: {
    fontFamily: "Geist_400Regular",
    fontSize: 10,
    color: "#999994",
    marginTop: 1,
  },
});
