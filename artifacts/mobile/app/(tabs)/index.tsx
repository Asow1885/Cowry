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

const QUICK_RECIPIENTS = [
  { initial: "M", firstName: "Mama", fullName: "Mama Sow" },
  { initial: "O", firstName: "Ousmane", fullName: "Ousmane Diallo" },
  { initial: "F", firstName: "Fatou", fullName: "Fatou Barry" },
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

  const transactions = [
    {
      dir: "up" as const,
      name: "Mama Sow",
      detail: `${t("home.tx_sent")} · ${t("home.tx_2d")}`,
      amt: "50 USD",
      currency: `${t("home.tx_to")} GNF`,
    },
    {
      dir: "down" as const,
      name: "Chase Bank",
      detail: `${t("home.tx_added")} · ${t("home.tx_thu")}`,
      amt: "+1,000 USD",
      currency: "",
    },
    {
      dir: "up" as const,
      name: "Brother",
      detail: `${t("home.tx_sent")} · ${t("home.tx_3w")}`,
      amt: "80 USD",
      currency: `${t("home.tx_to")} XOF`,
    },
  ];

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

      {/* QUICK SEND — Send to Mama */}
      <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
        <View style={[styles.txHeader, isRTL && styles.rowReverse]}>
          <Text style={[styles.sectionTitle, { fontFamily: fonts.headlineSemi }]}>{t("home.quick_send")}</Text>
          <Text style={[styles.txSeeAll, { fontFamily: fonts.bodyMed }]}>{t("home.see_all")}</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 24 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {QUICK_RECIPIENTS.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={styles.recipientItem}
            activeOpacity={0.8}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <View style={styles.recipientAvatar}>
              <Text style={styles.recipientInitial}>{r.initial}</Text>
            </View>
            <Text style={[styles.recipientName, { fontFamily: fonts.body }]} numberOfLines={1}>
              {t("home.send_to")} {r.firstName}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.recipientItem}
          activeOpacity={0.8}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <View style={[styles.recipientAvatar, styles.recipientAvatarAdd]}>
            <Feather name="plus" size={20} color="#1a2e22" />
          </View>
          <Text style={[styles.recipientName, { fontFamily: fonts.body }]} numberOfLines={1}>
            {t("home.add_money")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

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

        {transactions.map((tx, i) => (
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
  container: { flex: 1, backgroundColor: "#f5ebd6" },
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
    backgroundColor: "rgba(10,9,7,0.1)",
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
    backgroundColor: "rgba(10,9,7,0.07)",
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
    backgroundColor: "#d8e8dc",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(26,46,34,0.12)",
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

  sectionTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    color: "#0a0907",
    letterSpacing: -0.4,
  },

  recipientItem: {
    alignItems: "center",
    gap: 8,
    width: 72,
  },
  recipientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1a2e22",
    alignItems: "center",
    justifyContent: "center",
  },
  recipientAvatarAdd: {
    backgroundColor: "rgba(26,46,34,0.12)",
  },
  recipientInitial: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 20,
    color: "#c9a04a",
  },
  recipientName: {
    fontFamily: "Geist_400Regular",
    fontSize: 11,
    color: "#4a4a45",
    textAlign: "center",
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
    borderColor: "rgba(10,9,7,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  txMeta: { flex: 1, minWidth: 0 },
  txName: {
    fontFamily: "Geist_500Medium",
    fontSize: 16,
    color: "#0a0907",
    marginBottom: 2,
  },
  txDetail: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#6b6b66",
  },
  txRight: { alignItems: "flex-end" },
  txAmt: {
    fontFamily: "Geist_500Medium",
    fontSize: 16,
    color: "#0a0907",
  },
  txCurrency: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    color: "#6b6b66",
  },
});
