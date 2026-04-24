import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="verify" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="returning" />
      <Stack.Screen name="pin" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
