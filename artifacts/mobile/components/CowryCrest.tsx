import React from "react";
import { Image, View } from "react-native";

interface CowryCrestProps {
  size?: number;
  color?: string;
}

export function CowryCrest({ size = 32, color = "#c9a04a" }: CowryCrestProps) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../assets/images/shell_logo.png")}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    </View>
  );
}
