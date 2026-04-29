import React from "react";
import Svg, { Path, Line, G } from "react-native-svg";

interface CowryCrestProps {
  size?: number;
  color?: string;
}

// Shell outline: ellipse approx a=5.5 (horiz), b=9 (vert)
// Each rib x-extent = 5.5 * sqrt(1 - (y/9)²) - margin
// 10 ribs evenly distributed across the shell interior
function Shell({ color, sw }: { color: string; sw: number }) {
  const ribs: [number, number, number, number][] = [
    [-3.25, -7.0,  3.25, -7.0],
    [-4.1,  -5.5,  4.1,  -5.5],
    [-4.65, -4.0,  4.65, -4.0],
    [-5.0,  -2.5,  5.0,  -2.5],
    [-5.15, -1.0,  5.15, -1.0],
    [-5.2,   0.5,  5.2,   0.5],
    [-5.05,  2.0,  5.05,  2.0],
    [-4.8,   3.5,  4.8,   3.5],
    [-4.3,   5.0,  4.3,   5.0],
    [-3.55,  6.5,  3.55,  6.5],
  ];

  return (
    <G>
      <Path
        d="M 0,-9 C 3,-8.5 5.5,-4.5 5.5,0 C 5.5,4.5 3,8.5 0,9 C -3,8.5 -5.5,4.5 -5.5,0 C -5.5,-4.5 -3,-8.5 0,-9 Z"
        fill="none"
        stroke={color}
        strokeWidth={sw * 1.5}
        strokeLinejoin="round"
      />
      <Line
        x1="0" y1="-7.5"
        x2="0" y2="7.5"
        stroke={color}
        strokeWidth={sw * 1.0}
        strokeLinecap="round"
      />
      {ribs.map(([x1, y1, x2, y2], i) => (
        <Line
          key={i}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke={color}
          strokeWidth={sw * 0.7}
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}

export function CowryCrest({ size = 32, color = "#c9a04a" }: CowryCrestProps) {
  const sw = size / 32;
  return (
    <Svg width={size} height={size} viewBox="-16 -16 32 32">
      <G transform="translate(0,-8)">
        <Shell color={color} sw={sw} />
      </G>
      <G transform="translate(7,4) rotate(120)">
        <Shell color={color} sw={sw} />
      </G>
      <G transform="translate(-7,4) rotate(-120)">
        <Shell color={color} sw={sw} />
      </G>
    </Svg>
  );
}
