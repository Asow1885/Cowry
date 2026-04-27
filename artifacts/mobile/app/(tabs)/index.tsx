import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

const CURRENCIES = [
  { flag: "🇺🇸", code: "USD", amount: "$1,240.00" },
  { flag: "🇬🇳", code: "GNF", amount: "0 GNF" },
  { flag: "🇪🇺", code: "EUR", amount: "€0.00" },
];

const PAGE_DOTS = [true, false, false, false];

const TRANSACTIONS = [
  { dir: "up" as const, name: "Mama Sow", detail: "Sent · 2 days ago", amt: "50 USD", currency: "To GNF" },
  { dir: "down" as const, name: "Chase Bank", detail: "Added · Thursday", amt: "+1,000 USD", currency: "" },
  { dir: "up" as const, name: "Brother", detail: "Sent · 3 weeks ago", amt: "80 USD", currency: "To XOF" },
];

export default function HomeScreen() {
  const { user } = useApp();
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "AS";

  function toggleBalance() {
    Haptics.selectionAsync();
    setBalanceVisible((v) => !v);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 108 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 24, paddingTop: topInset }}>

        {/* TOP BAR */}
        <View style={[styles.topBar, isRTL && styles.rowReverse]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TouchableOpacity
            style={styles.earnPill}
            activeOpacity={0.85}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text style={styles.earnPillText}>{t("home.earn_cta")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.eyeBtn} onPress={toggleBalance} activeOpacity={0.7}>
            <Feather name={balanceVisible ? "eye" : "eye-off"} size={18} color="#0a0907" />
          </TouchableOpacity>
        </View>

        {/* BALANCE */}
        <Text style={[styles.balanceLabel, isRTL && styles.textRTL]}>{t("home.total_balance")}</Text>
        <View style={[styles.balanceRow, isRTL && styles.rowReverse]}>
          {balanceVisible ? (
            <>
              <Text style={[styles.balanceAmt, { fontFamily: fonts.headlineSemi }]}>$1,240.00</Text>
              <Text style={[styles.balanceCurr, { fontFamily: fonts.headline }]}>USD</Text>
            </>
          ) : (
            <Text style={[styles.balanceAmt, { fontFamily: fonts.headlineSemi }]}>••••••</Text>
          )}
          <View style={styles.chartIcon}>
            <Feather name="bar-chart-2" size={13} color="#1a2e22" />
          </View>
        </View>

        {/* ACTION CHIPS */}
        <View style={[styles.actions, isRTL && styles.rowReverse]}>
          <TouchableOpacity style={[styles.chip, styles.chipPrimary]} activeOpacity={0.85}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Text style={[styles.chipTextPrimary, { fontFamily: fonts.bodyMed }]}>{t("home.send")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} activeOpacity={0.8}>
            <Text style={[styles.chipText, { fontFamily: fonts.bodyMed }]}>{t("home.add_money")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} activeOpacity={0.8}>
            <Text style={[styles.chipText, { fontFamily: fonts.bodyMed }]}>{t("home.request")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chip, styles.chipWithIcon]} activeOpacity={0.8}>
            <Text style={[styles.chipText, { fontFamily: fonts.bodyMed }]}>{t("home.scan")}</Text>
            <Feather name="maximize" size={11} color="#0a0907" style={{ opacity: 0.7 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CARD WIDGET */}
      <View style={{ paddingHorizontal: 12, marginBottom: 0 }}>
        <View style={styles.card}>
          {/* Card tab */}
          <View style={styles.cardTab}>
            <View style={[styles.cardTabTitle, isRTL && styles.rowReverse]}>
              <Text style={[styles.cardTabTitleText, { fontFamily: fonts.headline }]}>{t("home.your_card")}</Text>
              <Text style={styles.cardTabArrow}>{isRTL ? "‹" : "›"}</Text>
            </View>
            <Text style={styles.cardLogo}>{t("brand.name")}</Text>
          </View>
          {/* Drip effect */}
          <View style={styles.cardTabDrip} />

          {/* Card body */}
          <View style={styles.cardBody}>
            <TouchableOpacity style={[styles.cardArrow, isRTL && { left: 24, right: undefined }]}>
              <Text style={styles.cardArrowText}>{isRTL ? "‹" : "›"}</Text>
            </TouchableOpacity>
            <Text style={[styles.cardH, { fontFamily: fonts.headlineSemi }]}>{t("home.main_account")}</Text>
            <Text style={styles.cardAmt}>$1,240.00</Text>

            {CURRENCIES.map((c) => (
              <View key={c.code} style={[styles.currencyRow, isRTL && styles.rowReverse]}>
                <View style={[styles.currencyLeft, isRTL && styles.rowReverse]}>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>{c.flag}</Text>
                  </View>
                  <Text style={[styles.currencyAmt, { fontFamily: fonts.body }]}>{c.amount}</Text>
                </View>
                <Text style={styles.currencyArrow}>{isRTL ? "‹" : "›"}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.accountDetailsBtn} activeOpacity={0.75}>
              <Text style={styles.accountDetailsBtnText}>🏛</Text>
              <Text style={[styles.accountDetailsBtnLabel, { fontFamily: fonts.bodyMed }]}>{t("home.account_details")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Page dots */}
        <View style={styles.pageDots}>
          {PAGE_DOTS.map((active, i) => (
            <View key={i} style={[styles.dot, active && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* TRANSACTIONS */}
      <View style={{ paddingHorizontal: 24 }}>
        <View style={[styles.txHeader, isRTL && styles.rowReverse]}>
          <Text style={[styles.txTitle, { fontFamily: fonts.headlineSemi }]}>{t("home.transactions")}</Text>
          <Text style={[styles.txSeeAll, { fontFamily: fonts.bodyMed }]}>{t("home.see_all")}</Text>
        </View>

        {TRANSACTIONS.map((tx, i) => (
          <View key={i} style={[styles.txRow, isRTL && styles.rowReverse]}>
            <View style={styles.txIcon}>
              <Feather name={tx.dir === "up" ? "arrow-up" : "arrow-down"} size={18} color="#0a0907" />
            </View>
            <View style={styles.txMeta}>
              <Text style={[styles.txName, { fontFamily: fonts.bodyMed }]}>{tx.name}</Text>
              <Text style={[styles.txDetail, { fontFamily: fonts.body }]}>{tx.detail}</Text>
            </View>
            <View style={[styles.txRight, isRTL && { alignItems: "flex-start" }]}>
              <Text style={[styles.txAmt, { fontFamily: fonts.bodyMed }]}>{tx.amt}</Text>
              {tx.currency ? (
                <Text style={[styles.txCurrency, { fontFamily: fonts.body }]}>{tx.currency}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  rowReverse: { flexDirection: "row-reverse" },
  textRTL: { textAlign: "right" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ebebe8",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 14,
    color: "#0a0907",
  },
  earnPill: {
    backgroundColor: "#1a2e22",
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  earnPillText: {
    fontFamily: "Geist_500Medium",
    fontSize: 14,
    color: "#e4c070",
  },
  eyeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(10,9,7,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  balanceLabel: {
    fontFamily: "Geist_400Regular",
    fontSize: 16,
    color: "#6b6b66",
    marginBottom: 6,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 24,
  },
  balanceAmt: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 38,
    lineHeight: 38,
    letterSpacing: -0.76,
    color: "#0a0907",
  },
  balanceCurr: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 18,
    color: "#6b6b66",
  },
  chartIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ebf2ec",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#d8e8dc",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  chipPrimary: {
    backgroundColor: "#1a2e22",
  },
  chipWithIcon: {
    flexDirection: "row",
    gap: 4,
  },
  chipText: {
    fontFamily: "Geist_500Medium",
    fontSize: 14,
    color: "#0a0907",
  },
  chipTextPrimary: {
    fontFamily: "Geist_500Medium",
    fontSize: 14,
    color: "#e4c070",
  },

  card: {
    backgroundColor: "#f5f5f3",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 0,
  },
  cardTab: {
    backgroundColor: "#d8e8dc",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 76,
    borderRadius: 18,
  },
  cardTabTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardTabTitleText: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 18,
    color: "#0a0907",
  },
  cardTabArrow: {
    fontFamily: "Geist_400Regular",
    fontSize: 18,
    color: "rgba(10,9,7,0.5)",
  },
  cardLogo: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 16,
    color: "#1a2e22",
    letterSpacing: 2,
  },
  cardTabDrip: {
    height: 16,
    width: 80,
    backgroundColor: "#d8e8dc",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
    marginTop: -1,
    zIndex: 2,
  },
  cardBody: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: "#f5f5f3",
    position: "relative",
  },
  cardArrow: {
    position: "absolute",
    top: 20,
    right: 24,
  },
  cardArrowText: {
    fontFamily: "Geist_400Regular",
    fontSize: 18,
    color: "#999994",
  },
  cardH: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 30,
    color: "#0a0907",
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  cardAmt: {
    fontFamily: "Geist_400Regular",
    fontSize: 16,
    color: "#6b6b66",
    marginBottom: 22,
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  currencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ebebe8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flagEmoji: { fontSize: 16, lineHeight: 20 },
  currencyAmt: {
    fontFamily: "Geist_400Regular",
    fontSize: 16,
    color: "#0a0907",
  },
  currencyArrow: {
    fontFamily: "Geist_400Regular",
    fontSize: 16,
    color: "#999994",
  },
  accountDetailsBtn: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ebebe8",
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  accountDetailsBtnText: { fontSize: 14 },
  accountDetailsBtnLabel: {
    fontFamily: "Geist_500Medium",
    fontSize: 13,
    color: "#0a0907",
  },

  pageDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d8d8d4",
  },
  dotActive: { backgroundColor: "#1a2e22" },

  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 18,
    marginTop: 8,
  },
  txTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 24,
    color: "#0a0907",
    letterSpacing: -0.5,
  },
  txSeeAll: {
    fontFamily: "Geist_500Medium",
    fontSize: 14,
    color: "#1a2e22",
    textDecorationLine: "underline",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#d8d8d4",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txMeta: { flex: 1, minWidth: 0 },
  txName: {
    fontFamily: "Geist_500Medium",
    fontSize: 16,
    color: "#999994",
    marginBottom: 2,
  },
  txDetail: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#999994",
  },
  txRight: { alignItems: "flex-end" },
  txAmt: {
    fontFamily: "Geist_500Medium",
    fontSize: 16,
    color: "#999994",
  },
  txCurrency: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#999994",
  },
});
