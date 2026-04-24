import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t("not_found.title")}</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>{t("not_found.back")}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1a2e22",
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 20,
    color: "#f5ebd6",
    textAlign: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontFamily: "Geist_400Regular",
    fontSize: 14,
    color: "#c9a04a",
  },
});
