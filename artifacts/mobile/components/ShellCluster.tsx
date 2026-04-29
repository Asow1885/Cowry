import React from "react";
import { Image, View } from "react-native";

interface Props {
  size?: number;
  color?: string;
}

export default function ShellCluster({ size = 110 }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../assets/images/shell_logo.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}
