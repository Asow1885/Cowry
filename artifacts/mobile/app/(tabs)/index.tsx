import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import { RatesWidget } from "@/components/RatesWidget";
import CreatePouchFlow, { type Pouch } from "@/components/CreatePouchFlow";

const CURRENCIES = [
  { flag: "🇺🇸", code: "USD", amount: "$0.00" },
  { flag: "🇬🇳", code: "GNF", amount: "0 GNF" },
  { flag: "🇪🇺", code: "EUR", amount: "€0.00" },
];

const QUICK_RECIPIENTS: { initial: string; firstName: string; fullName: string }[] = [];

const STORAGE_KEY = "cowry:pouches:v2";

export default function HomeScreen() {
  const { user } = useApp();
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const [pouches, setPouches] = useState<Pouch[]>([]);
  const [showCreatePouch, setShowCreatePouch] = useState(false);
  const cardScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setPouches(JSON.parse(raw)); } catch { /* ignore */ }
      }
    });
  }, []);

  async function addPouch(p: Pouch) {
    const next = [...pouches, p];
    setPouches(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "AS";

  const transactions: { dir: "up" | "down"; name: string; detail: string; amt: string; currency: string }[] = [];

  function toggleBalance() {
    Haptics.selectionAsync();
    setBalanceVisible((v) => !v);
  }

  function formatAmt(n: number): string {
    return "$" + n.toLocaleString();
  }

  return (
    <>
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
          <TouchableOpacity style={styles.eyeBtn} onPress={toggleBalance} activeOpacity={0.7}>
            <Feather name={balanceVisible ? "eye" : "eye-off"} size={18} color="#0a0907" />
          </TouchableOpacity>
        </View>

        {/* BALANCE */}
        <Text style={[styles.balanceLabel, isRTL && styles.textRTL]}>{t("home.total_balance")}</Text>
        <View style={[styles.balanceRow, isRTL && styles.rowReverse]}>
          {balanceVisible ? (
            <>
              <Text style={[styles.balanceAmt, { fontFamily: fonts.headlineSemi }]}>$0.00</Text>
              <Text style={[styles.balanceCurr, { fontFamily: fonts.headline }]}>USD</Text>
            </>
          ) : (
            <Text style={[styles.balanceAmt, { fontFamily: fonts.headlineSemi }]}>••••••</Text>
          )}
          <View style={styles.chartIcon}>
            <Feather name="bar-chart-2" size={13} color="#1a2e22" />
          </View>
        </View>

        {/* COWRY TAG */}
        {user?.tag ? (
          <View style={[styles.tagPill, isRTL && styles.rowReverse]}>
            <Text style={[styles.tagPillText, { fontFamily: fonts.bodyMed }]}>@{user.tag}</Text>
          </View>
        ) : null}

        {/* SEND — full-width primary */}
        <TouchableOpacity
          style={[styles.sendBtn, isRTL && styles.rowReverse]}
          activeOpacity={0.85}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Feather name="send" size={17} color="#0f1f17" />
          <Text style={[styles.sendBtnText, { fontFamily: fonts.bodySemi }]}>{t("home.send")}</Text>
          <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={17} color="#0f1f17" />
        </TouchableOpacity>

        {/* SECONDARY ACTIONS */}
        <View style={[styles.actions, isRTL && styles.rowReverse]}>
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

      {/* ═══ SWIPEABLE CARD STACK ═══ */}
      <View>
        <ScrollView
          ref={cardScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / screenW);
            setCardIndex(idx);
          }}
        >
          {/* ── Card 1: Main Account ── */}
          <View style={{ width: screenW, paddingHorizontal: 12 }}>
            <View style={styles.card}>
              <View style={styles.cardTab}>
                <View style={[styles.cardTabTitle, isRTL && styles.rowReverse]}>
                  <Text style={[styles.cardTabTitleText, { fontFamily: fonts.headline }]}>{t("home.your_card")}</Text>
                  <Text style={styles.cardTabArrow}>{isRTL ? "‹" : "›"}</Text>
                </View>
                <Text style={styles.cardLogo}>{t("brand.name")}</Text>
              </View>
              <View style={styles.cardTabDrip} />
              <View style={styles.cardBody}>
                <TouchableOpacity style={[styles.cardArrow, isRTL && { left: 24, right: undefined }]}>
                  <Text style={styles.cardArrowText}>{isRTL ? "‹" : "›"}</Text>
                </TouchableOpacity>
                <Text style={[styles.cardH, { fontFamily: fonts.headlineSemi }]}>{t("home.main_account")}</Text>
                <Text style={styles.cardAmt}>$0.00</Text>
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
          </View>

          {/* ── Card 2: Pouches ── */}
          <View style={{ width: screenW, paddingHorizontal: 12 }}>
            <View style={styles.card}>
              <View style={[styles.cardTab, styles.pouchTab]}>
                <View style={[styles.cardTabTitle, isRTL && styles.rowReverse]}>
                  <Text style={[styles.cardTabTitleText, { fontFamily: fonts.headline }]}>{t("home.pouches")}</Text>
                  <Text style={styles.cardTabArrow}>{isRTL ? "‹" : "›"}</Text>
                </View>
                <Text style={[styles.cardLogo, styles.pouchLogo]}>{t("brand.name")}</Text>
              </View>
              <View style={[styles.cardTabDrip, styles.pouchDrip]} />
              <View style={styles.cardBody}>
                {pouches.length === 0 ? (
                  <View style={styles.pouchEmpty}>
                    <Text style={styles.pouchEmptyEmoji}>🐚</Text>
                    <Text style={[styles.pouchEmptyTitle, { fontFamily: fonts.headline }]}>{t("home.pouch_empty_title")}</Text>
                    <Text style={[styles.pouchEmptySub, { fontFamily: fonts.body }]}>{t("home.pouch_empty_sub")}</Text>
                  </View>
                ) : (
                  pouches.map((p, i) => {
                    const pct = p.goal != null && p.goal > 0 ? Math.min(p.saved / p.goal, 1) : 0;
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.pouchRow, i === pouches.length - 1 && { borderBottomWidth: 0 }]}
                        activeOpacity={0.75}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      >
                        <View style={styles.pouchEmoji}>
                          <Text style={styles.pouchEmojiText}>{p.emoji}</Text>
                        </View>
                        <View style={styles.pouchInfo}>
                          <Text style={[styles.pouchName, { fontFamily: fonts.headline }]}>{p.name}</Text>
                          <View style={styles.pouchProgressTrack}>
                            <View style={[styles.pouchProgressFill, { width: `${pct * 100}%` }]} />
                          </View>
                          <View style={[styles.pouchNumbers, isRTL && styles.rowReverse]}>
                            <Text style={[styles.pouchSaved, { fontFamily: fonts.bodyMed }]}>{formatAmt(p.saved)}</Text>
                            <Text style={[styles.pouchOf, { fontFamily: fonts.body }]}>{t("home.pouch_of")}</Text>
                            <Text style={[styles.pouchGoal, { fontFamily: fonts.body }]}>{p.goal != null ? formatAmt(p.goal) : "—"}</Text>
                          </View>
                        </View>
                        <Text style={styles.currencyArrow}>{isRTL ? "‹" : "›"}</Text>
                      </TouchableOpacity>
                    );
                  })
                )}
                <TouchableOpacity style={[styles.accountDetailsBtn, styles.pouchCreateBtn]} activeOpacity={0.75}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowCreatePouch(true); }}>
                  <Feather name="plus" size={14} color="#8a6b2a" />
                  <Text style={[styles.pouchCreateLabel, { fontFamily: fonts.bodyMed }]}>{t("home.pouch_create")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Page dots — tappable to switch cards */}
      <View style={styles.pageDots}>
        {[0, 1].map((i) => (
          <TouchableOpacity
            key={i}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              cardScrollRef.current?.scrollTo({ x: i * screenW, animated: true });
              setCardIndex(i);
            }}
          >
            <View style={[styles.dot, cardIndex === i && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* TRANSACTIONS */}
      <View style={{ paddingHorizontal: 24 }}>
        <View style={[styles.txHeader, isRTL && styles.rowReverse]}>
          <Text style={[styles.txTitle, { fontFamily: fonts.headlineSemi }]}>{t("home.transactions")}</Text>
          <Text style={[styles.txSeeAll, { fontFamily: fonts.bodyMed }]}>{t("home.see_all")}</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.txEmpty}>
            <Text style={[styles.txEmptyText, { fontFamily: fonts.body }]}>{t("home.no_transactions")}</Text>
          </View>
        ) : transactions.map((tx, i) => (
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

      {/* LIVE EXCHANGE RATES */}
      <View style={{ paddingHorizontal: 24 }}>
        <RatesWidget />
      </View>
    </ScrollView>

    {showCreatePouch && (
      <CreatePouchFlow
        onComplete={(p) => { addPouch(p); setShowCreatePouch(false); }}
        onCancel={() => setShowCreatePouch(false)}
      />
    )}
    </>
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
    fontSize: 13,
    color: "#6b6b66",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 28,
  },
  balanceAmt: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 58,
    lineHeight: 58,
    letterSpacing: -1.5,
    color: "#0a0907",
  },
  balanceCurr: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 22,
    color: "#6b6b66",
    letterSpacing: -0.3,
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

  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(26,46,34,0.1)",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 22,
    marginTop: -10,
  },
  tagPillText: {
    fontFamily: "Geist_500Medium",
    fontSize: 13,
    color: "#1a2e22",
    letterSpacing: 0.1,
  },

  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#c9a04a",
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 22,
    marginBottom: 10,
  },
  sendBtnText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 17,
    color: "#0f1f17",
    letterSpacing: 0.1,
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
  chipWithIcon: { flexDirection: "row", gap: 4 },
  chipText: {
    fontFamily: "Geist_500Medium",
    fontSize: 14,
    color: "#0a0907",
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

  /* ── Shared card shell ── */
  card: {
    backgroundColor: "#f5f5f3",
    borderRadius: 18,
    overflow: "hidden",
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
  pouchTab: { backgroundColor: "#f4ead0" },
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
  pouchLogo: { color: "#8a6b2a" },
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
  pouchDrip: { backgroundColor: "#f4ead0" },
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

  /* ── Pouch card ── */
  pouchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(10,9,7,0.07)",
  },
  pouchEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(10,9,7,0.08)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pouchEmojiText: { fontSize: 20, lineHeight: 24 },
  pouchInfo: { flex: 1, minWidth: 0, gap: 5 },
  pouchName: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 16,
    color: "#0a0907",
  },
  pouchProgressTrack: {
    height: 5,
    backgroundColor: "#ebebe8",
    borderRadius: 100,
    overflow: "hidden",
  },
  pouchProgressFill: {
    height: "100%",
    backgroundColor: "#c9a04a",
    borderRadius: 100,
  },
  pouchNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  pouchSaved: {
    fontFamily: "Geist_500Medium",
    fontSize: 12,
    color: "#0a0907",
  },
  pouchOf: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#999994",
  },
  pouchGoal: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#999994",
  },
  pouchEmpty: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8d8d4",
    borderStyle: "dashed",
    marginBottom: 8,
  },
  pouchEmptyEmoji: { fontSize: 32, marginBottom: 12 },
  pouchEmptyTitle: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 16,
    color: "#0a0907",
    marginBottom: 6,
  },
  pouchEmptySub: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#6b6b66",
    textAlign: "center",
    lineHeight: 18,
  },
  pouchCreateBtn: { backgroundColor: "#f4ead0" },
  pouchCreateLabel: {
    fontFamily: "Geist_500Medium",
    fontSize: 13,
    color: "#8a6b2a",
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
  txEmpty: {
    paddingVertical: 28,
    alignItems: "center",
  },
  txEmptyText: {
    fontSize: 14,
    color: "rgba(10,9,7,0.45)",
    textAlign: "center",
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
