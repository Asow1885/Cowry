import React from "react";
import Svg, { Path, Ellipse, Line } from "react-native-svg";

interface Props {
  size?: number;
  stroke?: string;
  accent?: string;
  strokeWidth?: number;
}

export default function PouchIcon({
  size = 48,
  stroke = "#1a2e22",
  accent = "#c9a04a",
  strokeWidth = 2.5,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M 38 22 Q 50 16 62 22"
        stroke={stroke}
        strokeWidth={strokeWidth * 0.8}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 28 32 Q 22 45 22 60 Q 22 78 50 84 Q 78 78 78 60 Q 78 45 72 32 Q 50 38 28 32 Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Ellipse
        cx="50"
        cy="58"
        rx="6"
        ry="9"
        fill="none"
        stroke={accent}
        strokeWidth={strokeWidth * 0.8}
      />
      <Line
        x1="50"
        y1="51"
        x2="50"
        y2="65"
        stroke={accent}
        strokeWidth={strokeWidth * 0.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
