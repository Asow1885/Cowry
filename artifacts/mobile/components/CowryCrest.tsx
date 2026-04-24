import React from "react";
import Svg, { Ellipse, Line } from "react-native-svg";

interface CowryCrestProps {
  size?: number;
  color?: string;
}

export function CowryCrest({ size = 32, color = "#c9a04a" }: CowryCrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Ellipse
        cx="16"
        cy="8"
        rx="4"
        ry="5.5"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <Line
        x1="16"
        y1="4.5"
        x2="16"
        y2="11.5"
        stroke={color}
        strokeWidth="0.7"
      />
      <Ellipse
        cx="10"
        cy="22"
        rx="4"
        ry="5.5"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <Line
        x1="10"
        y1="18.5"
        x2="10"
        y2="25.5"
        stroke={color}
        strokeWidth="0.7"
      />
      <Ellipse
        cx="22"
        cy="22"
        rx="4"
        ry="5.5"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
      />
      <Line
        x1="22"
        y1="18.5"
        x2="22"
        y2="25.5"
        stroke={color}
        strokeWidth="0.7"
      />
    </Svg>
  );
}
