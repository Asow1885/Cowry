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
import { CowryCrest } from "@/components/CowryCrest";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";

const RECIPIENTS = [
  { id: "1", name: "Mama", flag: "🇬🇳", lastSent: "$120" },
  { id: "2", name: "Papa", flag: "🇸🇳", lastSent: "$85" },
  { id: "3", name: "Awa", flag: "🇲🇱", lastSent: "$60" },
];

const RATES = [
  { flag: "🇬🇳", code: "GNF", rate: "8,152" },
  { flag: "🇸🇳", code: "XOF", rate: "600" },
  { flag: "🇳🇬", code: "NGN", rate: "1,580" },
  { flag: "🇬🇭", code: "GHS", rate: "14.2" },
];

export default function HomeScreen() {
  const { user } = useApp();
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const firstName = user?.name?.split(" ")[0] ?? "Ashley";

  function toggleBalance() {
    Haptics.selectionAsync();
    setBalanceVisible((v) => !v);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.greenSection, { paddingTop: topInset + 20 }]}>
        <View
          style={[
            styles.headerRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.logoRow}>
            <CowryCrest size={20} color="#c9a04a" />
            <Text style={styles.logoText}>COWRY</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Feather name="bell" size={20} color="#c9a04a" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingWrap}>
          <Text style={[styles.greeting, isRTL && styles.textRTL]}>
            {t("home.greeting")} {firstName}.
          </Text>
        </View>

        <View style={styles.balanceCard}>
          <View
            style={[
              styles.balanceRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Text style={styles.balanceLabel}>{t("home.balance_label")}</Text>
            <TouchableOpacity onPress={toggleBalance}>
              <Feather
                name={balanceVisible ? "eye" : "eye-off"}
                size={16}
                color="rgba(245, 235, 214, 0.55)"
              />
            </TouchableOpacity>
          </View>
          {balanceVisible ? (
            <Text style={styles.balanceAmount}>$2,481.50</Text>
          ) : (
            <Text style={styles.balanceHidden}>••••••</Text>
          )}
          <Text style={styles.balanceEquiv}>
            {t("home.equiv_prefix")} 20,228,232 GNF
          </Text>
        </View>

        <View style={styles.sendSection}>
          <Text style={[styles.sendLabel, isRTL && styles.textRTL]}>
            {t("home.send_to")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipientsRow}
            style={{ marginHorizontal: -24 }}
          >
            <View style={{ width: 24 }} />
            {RECIPIENTS.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.recipientCard}
                activeOpacity={0.85}
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <View style={styles.recipientAvatar}>
                  <Text style={styles.recipientFlag}>{r.flag}</Text>
                </View>
                <Text style={styles.recipientName} numberOfLines={1}>
                  {r.name}
                </Text>
                <Text style={styles.recipientLast}>{r.lastSent}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addRecipient} activeOpacity={0.8}>
              <View style={styles.addRecipientIcon}>
                <Feather name="plus" size={18} color="#c9a04a" />
              </View>
              <Text style={styles.addRecipientText} numberOfLines={2}>
                {t("home.add_someone")}
              </Text>
            </TouchableOpacity>
            <View style={{ width: 24 }} />
          </ScrollView>
        </View>
      </View>

      <View style={styles.creamSection}>
        <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t("home.live_rates")}
        </Text>
        <View style={styles.ratesGrid}>
          {RATES.map((r) => (
            <View key={r.code} style={styles.rateCard}>
              <View style={styles.rateTop}>
                <Text style={styles.rateFlag}>{r.flag}</Text>
                <Text style={styles.rateCode}>{r.code}</Text>
              </View>
              <Text style={styles.rateAmount}>{r.rate}</Text>
              <Text style={styles.rateLabel}>{t("home.per_usd")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <CowryCrest size={28} color="#c9a04a" />
          </View>
          <View style={styles.promoRight}>
            <Text style={styles.promoTitle}>{t("home.promo_title")}</Text>
            <Text style={styles.promoSub}>{t("home.promo_sub")}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5ebd6" },
  greenSection: {
    backgroundColor: "#1a2e22",
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  logoText: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 13,
    letterSpacing: 3,
    color: "#f5ebd6",
  },
  notifBtn: {
    position: "relative",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#c9a04a",
    borderWidth: 1.5,
    borderColor: "#1a2e22",
  },
  greetingWrap: { marginBottom: 16 },
  greeting: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 22,
    color: "#f5ebd6",
    letterSpacing: -0.5,
  },
  textRTL: { textAlign: "right", writingDirection: "rtl" },
  balanceCard: { marginBottom: 24 },
  balanceRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  balanceLabel: {
    fontFamily: "Geist_400Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "rgba(245, 235, 214, 0.55)",
    textTransform: "uppercase",
  },
  balanceAmount: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 48,
    letterSpacing: -2,
    color: "#f5ebd6",
    lineHeight: 56,
  },
  balanceHidden: {
    fontFamily: "Geist_500Medium",
    fontSize: 36,
    color: "rgba(245, 235, 214, 0.5)",
    lineHeight: 56,
  },
  balanceEquiv: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 13,
    color: "#c9a04a",
    marginTop: 2,
  },
  sendSection: {},
  sendLabel: {
    fontFamily: "Geist_500Medium",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(245, 235, 214, 0.55)",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  recipientsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 4,
  },
  recipientCard: {
    backgroundColor: "rgba(245, 235, 214, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(201, 160, 74, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    width: 80,
    gap: 5,
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0f1f17",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  recipientFlag: { fontSize: 20 },
  recipientName: {
    fontFamily: "Geist_500Medium",
    fontSize: 11,
    color: "#f5ebd6",
    textAlign: "center",
  },
  recipientLast: {
    fontFamily: "Geist_400Regular",
    fontSize: 10,
    color: "#c9a04a",
    textAlign: "center",
  },
  addRecipient: {
    width: 80,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  addRecipientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(201, 160, 74, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addRecipientText: {
    fontFamily: "Geist_400Regular",
    fontSize: 10,
    color: "rgba(245, 235, 214, 0.45)",
    textAlign: "center",
    lineHeight: 14,
  },
  creamSection: { padding: 24, paddingTop: 28 },
  sectionTitle: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 18,
    color: "#0a0907",
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  ratesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  rateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    width: "47%",
    borderWidth: 1,
    borderColor: "rgba(10, 9, 7, 0.07)",
  },
  rateTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  rateFlag: { fontSize: 16 },
  rateCode: {
    fontFamily: "Geist_500Medium",
    fontSize: 11,
    color: "#6b6b66",
    letterSpacing: 0.5,
  },
  rateAmount: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 22,
    color: "#0a0907",
    letterSpacing: -0.5,
  },
  rateLabel: {
    fontFamily: "Geist_400Regular",
    fontSize: 10,
    color: "#6b6b66",
    marginTop: 1,
  },
  promoBanner: {
    backgroundColor: "#1a2e22",
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  promoLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#25402f",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  promoRight: { flex: 1 },
  promoTitle: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 16,
    color: "#e4c070",
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  promoSub: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "rgba(245, 235, 214, 0.55)",
    lineHeight: 17,
  },
});
