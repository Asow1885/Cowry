import React from "react";
import Svg, { Path, Line, G } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}

function Shell({ color }: { color: string }) {
  const ribs: [number, number, number, number][] = [
    [-3.5, -14,  3.5, -14],
    [-6,   -11,  6,   -11],
    [-8,    -8,  8,    -8],
    [-9,    -5,  9,    -5],
    [-9,    -2,  9,    -2],
    [-9,     1,  9,     1],
    [-9,     4,  9,     4],
    [-8,     7,  8,     7],
    [-6,    10,  6,    10],
    [-3.5,  13,  3.5,  13],
  ];

  return (
    <G>
      <Path
        d="M 0,-18 C 7,-17 11,-8 11,0 C 11,8 7,17 0,18 C -7,17 -11,8 -11,0 C -11,-8 -7,-17 0,-18 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Line
        x1="0" y1="-15"
        x2="0" y2="15"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {ribs.map(([x1, y1, x2, y2], i) => (
        <Line
          key={i}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke={color}
          strokeWidth="0.9"
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
