import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Svg, { Circle, Rect } from "react-native-svg";
import PouchIcon from "@/components/PouchIcon";
import { useTranslation } from "@/hooks/useTranslation";

const POUCH_CATEGORIES = [
  { id: "savings",  emoji: "💰", label: "Savings",   suggestions: ["General savings", "Emergency fund", "Monthly savings"] },
  { id: "travel",   emoji: "✈️", label: "Travel",    suggestions: ["Trip home", "Visit Mama", "Summer trip"] },
  { id: "rainy",    emoji: "☔", label: "Rainy day",  suggestions: ["Rainy day fund", "Just in case", "Emergency"] },
  { id: "gift",     emoji: "🎁", label: "Gift",      suggestions: ["Birthday gift", "Anniversary", "Christmas gift"] },
  { id: "birthday", emoji: "🎂", label: "Birthday",  suggestions: ["Mama's birthday", "My birthday", "Birthday party"] },
  { id: "wedding",  emoji: "💍", label: "Wedding",   suggestions: ["Sister's wedding", "Wedding fund", "Wedding gift"] },
  { id: "school",   emoji: "🎓", label: "School",    suggestions: ["School fees", "University fund", "Tuition"] },
  { id: "family",   emoji: "👪", label: "Family",    suggestions: ["Family medical", "Mama's care", "Family support"] },
  { id: "home",     emoji: "🏠", label: "Home",      suggestions: ["New home", "Rent", "Home repairs"] },
  { id: "car",      emoji: "🚗", label: "Car",       suggestions: ["New car", "Car repairs", "Insurance"] },
  { id: "faith",    emoji: "🙏", label: "Faith",     suggestions: ["Tithes", "Tabaski", "Easter"] },
  { id: "custom",   emoji: "✨", label: "Custom",    suggestions: [] },
];

export interface Pouch {
  name: string;
  emoji: string;
  category: string;
  saved: number;
  goal: number | null;
  currency: string;
}

interface Props {
  onComplete: (pouch: Pouch) => void;
  onCancel: () => void;
}

type Category = typeof POUCH_CATEGORIES[0];

export default function CreatePouchFlow({ onComplete, onCancel }: Props) {
  const { t, isRTL, fonts } = useTranslation();
  const insets = useSafeAreaInsets();
  const [step, setStep]                       = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [pouchName, setPouchName]             = useState("");
  const [hasGoal, setHasGoal]                 = useState(false);
  const [goalAmount, setGoalAmount]           = useState("");
  const [computedGoal, setComputedGoal]       = useState<number | null>(null);
  const toggleAnim = useRef(new Animated.Value(0)).current;

  const progressPct =
    step === 1 ? 0.03 : step === 2 ? 0.33 : step === 3 ? 0.66 : 0.95;

  function goBack() {
    if (step === 1) { onCancel(); return; }
    setStep((s) => s - 1);
  }

  function goNext() { setStep((s) => s + 1); }

  function handleCategoryPick(cat: Category) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(cat);
    if (cat.suggestions.length > 0 && !pouchName) {
      setPouchName(cat.suggestions[0]);
    }
  }

  function toggleGoal() {
    Haptics.selectionAsync();
    const next = !hasGoal;
    setHasGoal(next);
    Animated.timing(toggleAnim, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function handleFinish() {
    const goal = hasGoal ? parseFloat(goalAmount.replace(/[^0-9.]/g, "")) || null : null;
    setComputedGoal(goal);
    setStep(5);
  }

  function handleGoalBlur() {
    const num = parseFloat(goalAmount.replace(/[^0-9.]/g, ""));
    if (!isNaN(num)) {
      setGoalAmount(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }

  function buildPouch(): Pouch {
    return {
      name: pouchName,
      emoji: selectedCategory!.emoji,
      category: selectedCategory!.id,
      saved: 0,
      goal: computedGoal,
      currency: "USD",
    };
  }

  const toggleKnobX = toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 18] });
  const toggleBg    = toggleAnim.interpolate({ inputRange: [0, 1], outputRange: ["#d8d8d4", "#c9a04a"] });

  const canContinue2 = !!selectedCategory;
  const canContinue3 = pouchName.trim().length > 0;
  const canFinish    = !hasGoal || goalAmount.trim().length > 0;

  return (
    <Modal animationType="slide" presentationStyle="fullScreen" statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top || 12 }]}>

        {/* ── HEADER (steps 1–4) ── */}
        {step < 5 && (
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.75}>
              <Text style={styles.backBtnText}>{step === 1 ? "×" : "‹"}</Text>
            </TouchableOpacity>
            <View style={styles.progressLine}>
              <View style={[styles.progressFill, { width: `${progressPct * 100}%` as `${number}%` }]} />
            </View>
            <Text style={styles.stepNum}>{step}/4</Text>
          </View>
        )}

        {/* ══════════════════════════════════════
            STEP 1 — WELCOME SPLASH
        ══════════════════════════════════════ */}
        {step === 1 && (
          <View style={styles.body}>
            <View style={styles.splashContent}>
              <PouchIcon size={140} />
              <Text style={[styles.splashH, { fontFamily: fonts.headline }]}>
                {"Let's open a "}
                <Text style={[styles.splashHEm, { fontFamily: fonts.headline }]}>{"pouch."}</Text>
              </Text>
              <Text style={[styles.splashSub, { fontFamily: fonts.body }]}>
                {t("pouch_flow.splash_sub")}
              </Text>
            </View>
            <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85} onPress={goNext}>
              <Text style={[styles.btnPrimaryText, { fontFamily: fonts.bodyMed }]}>
                {t("pouch_flow.get_started")} →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ══════════════════════════════════════
            STEP 2 — PICK AN ICON
        ══════════════════════════════════════ */}
        {step === 2 && (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.bodyScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.qH, { fontFamily: fonts.headline }]}>
                {"What's it "}
                <Text style={[styles.qHEm, { fontFamily: fonts.headline }]}>{"for?"}</Text>
              </Text>
              <Text style={[styles.qSub, { fontFamily: fonts.body }]}>{t("pouch_flow.icon_sub")}</Text>

              <View style={styles.iconGrid}>
                {POUCH_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.iconTile, selectedCategory?.id === cat.id && styles.iconTileSelected]}
                    activeOpacity={0.8}
                    onPress={() => handleCategoryPick(cat)}
                  >
                    <Text style={styles.iconTileEmoji}>{cat.emoji}</Text>
                    <Text style={[styles.iconTileLabel, { fontFamily: fonts.bodyMed }]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={[styles.btnContainer, { paddingBottom: insets.bottom || 24 }]}>
              <TouchableOpacity
                style={[styles.btnPrimary, !canContinue2 && styles.btnDisabled]}
                activeOpacity={canContinue2 ? 0.85 : 1}
                onPress={canContinue2 ? goNext : undefined}
              >
                <Text style={[styles.btnPrimaryText, { fontFamily: fonts.bodyMed }]}>
                  {t("pouch_flow.continue")} →
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* ══════════════════════════════════════
            STEP 3 — NAME IT
        ══════════════════════════════════════ */}
        {step === 3 && (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.bodyScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.qH, { fontFamily: fonts.headline }]}>
                {"Name your "}
                <Text style={[styles.qHEm, { fontFamily: fonts.headline }]}>{"pouch."}</Text>
              </Text>
              <Text style={[styles.qSub, { fontFamily: fonts.body }]}>{t("pouch_flow.name_sub")}</Text>

              <View style={[styles.selectionRow, isRTL && { flexDirection: "row-reverse" }]}>
                <View style={styles.selectionEmoji}>
                  <Text style={{ fontSize: 20 }}>{selectedCategory?.emoji}</Text>
                </View>
                <Text style={[styles.selectionLabel, { fontFamily: fonts.bodySemi }]}>
                  {t("pouch_flow.your_selection")}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { fontFamily: fonts.bodySemi }]}>
                  {t("pouch_flow.name_field_label")}
                </Text>
                <TextInput
                  style={[styles.fieldInput, { fontFamily: fonts.body }]}
                  value={pouchName}
                  onChangeText={setPouchName}
                  placeholder={t("pouch_flow.name_placeholder")}
                  placeholderTextColor="#999994"
                  autoFocus
                  returnKeyType="done"
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>

              {selectedCategory && selectedCategory.suggestions.length > 0 && (
                <>
                  <Text style={[styles.suggestionsLabel, { fontFamily: fonts.bodySemi }]}>
                    {t("pouch_flow.suggestions")}
                  </Text>
                  <View style={styles.suggestions}>
                    {selectedCategory.suggestions.map((s, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.suggestionChip}
                        activeOpacity={0.8}
                        onPress={() => { setPouchName(s); Haptics.selectionAsync(); }}
                      >
                        <Text style={[styles.suggestionChipText, { fontFamily: fonts.body }]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
            <View style={[styles.btnContainer, { paddingBottom: insets.bottom || 24 }]}>
              <TouchableOpacity
                style={[styles.btnPrimary, !canContinue3 && styles.btnDisabled]}
                activeOpacity={canContinue3 ? 0.85 : 1}
                onPress={canContinue3 ? goNext : undefined}
              >
                <Text style={[styles.btnPrimaryText, { fontFamily: fonts.bodyMed }]}>
                  {t("pouch_flow.continue")} →
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* ══════════════════════════════════════
            STEP 4 — SET A GOAL
        ══════════════════════════════════════ */}
        {step === 4 && (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.bodyScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.qH, { fontFamily: fonts.headline }]}>
                {"Set a "}
                <Text style={[styles.qHEm, { fontFamily: fonts.headline }]}>{"goal?"}</Text>
              </Text>
              <Text style={[styles.qSub, { fontFamily: fonts.body }]}>{t("pouch_flow.goal_sub")}</Text>

              <TouchableOpacity
                style={styles.toggleRow}
                activeOpacity={0.85}
                onPress={toggleGoal}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toggleLabel, { fontFamily: fonts.headline }]}>
                    {t("pouch_flow.add_goal")}
                  </Text>
                  <Text style={[styles.toggleSub, { fontFamily: fonts.body }]}>
                    {t("pouch_flow.add_goal_sub")}
                  </Text>
                </View>
                <Animated.View style={[styles.toggle, { backgroundColor: toggleBg }]}>
                  <Animated.View style={[styles.toggleKnob, { transform: [{ translateX: toggleKnobX }] }]} />
                </Animated.View>
              </TouchableOpacity>

              {hasGoal && (
                <>
                  <View style={styles.field}>
                    <Text style={[styles.fieldLabel, { fontFamily: fonts.bodySemi }]}>
                      {t("pouch_flow.goal_field_label")}
                    </Text>
                    <TextInput
                      style={[styles.fieldInput, { fontFamily: fonts.body }]}
                      value={goalAmount}
                      onChangeText={setGoalAmount}
                      onBlur={handleGoalBlur}
                      placeholder="$0.00"
                      placeholderTextColor="#999994"
                      keyboardType="decimal-pad"
                      autoFocus
                      textAlign={isRTL ? "right" : "left"}
                    />
                  </View>
                  <View style={styles.goalPreview}>
                    <View style={[styles.goalPreviewRow, isRTL && { flexDirection: "row-reverse" }]}>
                      <View style={styles.goalPreviewEmoji}>
                        <Text style={{ fontSize: 18 }}>{selectedCategory?.emoji}</Text>
                      </View>
                      <Text style={[styles.goalPreviewName, { fontFamily: fonts.headline }]}>
                        {pouchName}
                      </Text>
                    </View>
                    <View style={styles.goalBar}>
                      <View style={[styles.goalBarFill, { width: "0%" as `${number}%` }]} />
                    </View>
                    <View style={[styles.goalNumbers, isRTL && { flexDirection: "row-reverse" }]}>
                      <Text style={[styles.goalSaved, { fontFamily: fonts.bodyMed }]}>$0.00</Text>
                      <Text style={[styles.goalTarget, { fontFamily: fonts.body }]}>
                        {t("pouch_flow.goal_of")} {goalAmount ? `$${goalAmount}` : "$0.00"}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
            <View style={[styles.btnContainer, { paddingBottom: insets.bottom || 24 }]}>
              <TouchableOpacity
                style={[styles.btnPrimary, !canFinish && styles.btnDisabled]}
                activeOpacity={canFinish ? 0.85 : 1}
                onPress={canFinish ? handleFinish : undefined}
              >
                <Text style={[styles.btnPrimaryText, { fontFamily: fonts.bodyMed }]}>
                  {t("pouch_flow.open_pouch")} →
                </Text>
              </TouchableOpacity>
              {!hasGoal && (
                <TouchableOpacity style={styles.btnSkip} activeOpacity={0.75} onPress={handleFinish}>
                  <Text style={[styles.btnSkipText, { fontFamily: fonts.body }]}>
                    {t("pouch_flow.skip_goal")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        )}

        {/* ══════════════════════════════════════
            STEP 5 — SUCCESS SPLASH
        ══════════════════════════════════════ */}
        {step === 5 && selectedCategory && (
          <View style={[styles.successScreen, { paddingBottom: insets.bottom || 24 }]}>
            <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 200 500" preserveAspectRatio="none">
              <Circle cx="30"  cy="80"  r="3"   fill="#c9a04a" />
              <Circle cx="170" cy="100" r="2"   fill="#e4c070" />
              <Circle cx="55"  cy="150" r="2.5" fill="#c9a04a" />
              <Circle cx="180" cy="190" r="2"   fill="#e4c070" />
              <Circle cx="20"  cy="240" r="2"   fill="#c9a04a" />
              <Circle cx="155" cy="60"  r="2.5" fill="#c9a04a" />
              <Circle cx="90"  cy="320" r="2"   fill="#e4c070" />
              <Circle cx="140" cy="280" r="1.5" fill="#c9a04a" />
              <Rect x="140" y="135" width="3" height="6" fill="#e4c070" transform="rotate(45 141.5 138)" />
              <Rect x="40"  y="185" width="3" height="6" fill="#c9a04a" transform="rotate(-30 41.5 188)" />
              <Rect x="170" y="225" width="3" height="6" fill="#e4c070" transform="rotate(60 171.5 228)" />
              <Rect x="70"  y="300" width="3" height="6" fill="#c9a04a" transform="rotate(20 71.5 303)" />
            </Svg>

            <View style={styles.successIconWrap}>
              <PouchIcon size={140} stroke="#f5ebd6" accent="#c9a04a" />
            </View>

            <Text style={[styles.successH, { fontFamily: fonts.headline }]}>
              {"Your pouch "}
              <Text style={[styles.successHEm, { fontFamily: fonts.headline }]}>{"is open."}</Text>
            </Text>
            <Text style={[styles.successSub, { fontFamily: fonts.body }]}>
              {pouchName} {t("pouch_flow.success_sub")}
            </Text>

            <View style={styles.successCard}>
              <View style={[styles.successCardRow, isRTL && { flexDirection: "row-reverse" }]}>
                <View style={styles.successCardEmoji}>
                  <Text style={{ fontSize: 16 }}>{selectedCategory.emoji}</Text>
                </View>
                <Text style={[styles.successCardName, { fontFamily: fonts.headline }]}>
                  {pouchName}
                </Text>
              </View>
              <View style={styles.successBar}>
                <View style={[styles.successBarFill, { width: "0%" as `${number}%` }]} />
              </View>
              <View style={[styles.successRow, isRTL && { flexDirection: "row-reverse" }]}>
                <Text style={[styles.successSaved, { fontFamily: fonts.bodyMed }]}>$0.00</Text>
                {computedGoal != null && (
                  <Text style={[styles.successTarget, { fontFamily: fonts.body }]}>
                    {t("pouch_flow.goal_of")} ${computedGoal.toLocaleString()}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, styles.btnSuccessGold]}
              activeOpacity={0.85}
              onPress={() => onComplete(buildPouch())}
            >
              <Text style={[styles.btnSuccessText, { fontFamily: fonts.bodyMed }]}>
                {t("pouch_flow.add_money")} →
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSkip} activeOpacity={0.75} onPress={() => onComplete(buildPouch())}>
              <Text style={[styles.btnSkipSuccess, { fontFamily: fonts.body }]}>
                {t("pouch_flow.done")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf5ec",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 14,
    flexShrink: 0,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ebebe8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  backBtnText: {
    fontFamily: "Geist_400Regular",
    fontSize: 18,
    color: "#0a0907",
    lineHeight: 22,
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#ebebe8",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#c9a04a",
    borderRadius: 100,
  },
  stepNum: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.2,
    color: "#8a6b2a",
    flexShrink: 0,
  },

  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 32,
    flexDirection: "column",
  },
  bodyScroll: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },

  splashContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  splashH: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: "#0a0907",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  splashHEm: {
    fontStyle: "italic",
    color: "#8a6b2a",
  },
  splashSub: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#6b6b66",
    textAlign: "center",
    maxWidth: 260,
    marginBottom: 32,
  },

  qH: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: "#0a0907",
    marginBottom: 6,
  },
  qHEm: {
    fontStyle: "italic",
    color: "#8a6b2a",
  },
  qSub: {
    fontFamily: "Geist_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#6b6b66",
    marginBottom: 24,
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  iconTile: {
    width: "30.5%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "rgba(10,9,7,0.08)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 10,
  },
  iconTileSelected: {
    borderColor: "#c9a04a",
    borderWidth: 2,
    backgroundColor: "#f4ead0",
  },
  iconTileEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  iconTileLabel: {
    fontFamily: "Geist_500Medium",
    fontSize: 10,
    color: "#0a0907",
    textAlign: "center",
  },

  selectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  selectionEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f4ead0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionLabel: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.4,
    color: "#8a6b2a",
    textTransform: "uppercase",
  },

  field: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.6,
    color: "#8a6b2a",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  fieldInput: {
    width: "100%",
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#c9a04a",
    borderRadius: 10,
    fontSize: 15,
    color: "#0a0907",
  },

  suggestionsLabel: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.4,
    color: "#6b6b66",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 24,
  },
  suggestionChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#ebf2ec",
    borderRadius: 100,
  },
  suggestionChipText: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#0a0907",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "rgba(10,9,7,0.08)",
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 15,
    color: "#0a0907",
    marginBottom: 2,
  },
  toggleSub: {
    fontFamily: "Geist_400Regular",
    fontSize: 11,
    color: "#6b6b66",
  },
  toggle: {
    width: 38,
    height: 22,
    borderRadius: 100,
    flexShrink: 0,
  },
  toggleKnob: {
    position: "absolute",
    top: 2,
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },

  goalPreview: {
    padding: 14,
    backgroundColor: "#f4ead0",
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  goalPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  goalPreviewEmoji: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(10,9,7,0.08)",
  },
  goalPreviewName: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 15,
    color: "#0a0907",
  },
  goalBar: {
    height: 5,
    backgroundColor: "rgba(10,9,7,0.1)",
    borderRadius: 100,
    overflow: "hidden",
  },
  goalBarFill: {
    height: "100%",
    backgroundColor: "#c9a04a",
    borderRadius: 100,
  },
  goalNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  goalSaved: {
    fontFamily: "Geist_500Medium",
    fontSize: 11,
    color: "#0a0907",
  },
  goalTarget: {
    fontFamily: "Geist_400Regular",
    fontSize: 11,
    color: "#6b6b66",
  },

  btnContainer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    gap: 4,
  },
  btnPrimary: {
    paddingVertical: 15,
    backgroundColor: "#1a2e22",
    borderRadius: 10,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.35 },
  btnPrimaryText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 14,
    color: "#e4c070",
  },
  btnSkip: {
    paddingVertical: 12,
    alignItems: "center",
  },
  btnSkipText: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#8a6b2a",
  },

  successScreen: {
    flex: 1,
    backgroundColor: "#1a2e22",
    paddingHorizontal: 22,
    paddingTop: 32,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  successIconWrap: {
    marginBottom: 24,
  },
  successH: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: "#faf5ec",
    textAlign: "center",
    marginBottom: 8,
  },
  successHEm: {
    fontStyle: "italic",
    color: "#e4c070",
  },
  successSub: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    color: "rgba(245,235,214,0.7)",
    textAlign: "center",
    marginBottom: 28,
  },
  successCard: {
    backgroundColor: "rgba(245,235,214,0.08)",
    borderWidth: 1,
    borderColor: "rgba(201,160,74,0.3)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    width: "100%",
    maxWidth: 320,
    gap: 10,
  },
  successCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  successCardEmoji: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f4ead0",
    alignItems: "center",
    justifyContent: "center",
  },
  successCardName: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 15,
    color: "#faf5ec",
  },
  successBar: {
    height: 5,
    backgroundColor: "rgba(245,235,214,0.15)",
    borderRadius: 100,
    overflow: "hidden",
  },
  successBarFill: {
    height: "100%",
    backgroundColor: "#c9a04a",
    borderRadius: 100,
  },
  successRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  successSaved: {
    fontFamily: "Geist_500Medium",
    fontSize: 11,
    color: "#e4c070",
  },
  successTarget: {
    fontFamily: "Geist_400Regular",
    fontSize: 11,
    color: "rgba(245,235,214,0.5)",
  },
  btnSuccessGold: {
    backgroundColor: "#c9a04a",
    width: "100%",
    maxWidth: 320,
  },
  btnSuccessText: {
    fontFamily: "Geist_600SemiBold",
    fontSize: 14,
    color: "#0f1f17",
  },
  btnSkipSuccess: {
    fontFamily: "Geist_400Regular",
    fontSize: 12,
    color: "#e4c070",
    paddingVertical: 12,
    textAlign: "center",
  },
});
