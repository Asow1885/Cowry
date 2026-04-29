import React from "react";
import Svg, { Path, Line, G } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

// Shell outline: ellipse approx a=11 (horiz), b=18 (vert)
// Each rib x-extent = 11 * sqrt(1 - (y/18)²) - margin
// 10 ribs evenly distributed across the shell interior
function Shell({ color }: { color: string }) {
  const ribs: [number, number, number, number][] = [
    [-6.5,  -14,   6.5,  -14],
    [-8.2,  -11,   8.2,  -11],
    [-9.3,   -8,   9.3,   -8],
    [-10.0,  -5,   10.0,  -5],
    [-10.3,  -2,   10.3,  -2],
    [-10.4,   1,   10.4,   1],
    [-10.1,   4,   10.1,   4],
    [-9.6,    7,    9.6,   7],
    [-8.6,   10,    8.6,  10],
    [-7.1,   13,    7.1,  13],
  ];

  return (
    <G>
      <Path
        d="M 0,-18 C 6,-17 11,-9 11,0 C 11,9 6,17 0,18 C -6,17 -11,9 -11,0 C -11,-9 -6,-17 0,-18 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Line
        x1="0" y1="-15"
        x2="0" y2="15"
        stroke={color}
        strokeWidth="1.0"
        strokeLinecap="round"
      />
      {ribs.map(([x1, y1, x2, y2], i) => (
        <Line
          key={i}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke={color}
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}

export default function ShellCluster({ size = 110, color = "#c9b87a" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="-36 -36 72 72">
      <G transform="translate(0,-13)">
        <Shell color={color} />
      </G>
      <G transform="translate(11,6) rotate(120)">
        <Shell color={color} />
      </G>
      <G transform="translate(-11,6) rotate(-120)">
        <Shell color={color} />
      </G>
    </Svg>
  );
}
