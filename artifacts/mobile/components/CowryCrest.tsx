import React from "react";
import Svg, { Path, Line, G } from "react-native-svg";

interface CowryCrestProps {
  size?: number;
  color?: string;
}

function Shell({ color, sw }: { color: string; sw: number }) {
  const ribs: [number, number, number, number][] = [
    [-2.2, -8.8,  2.2, -8.8],
    [-3.8, -6.8,  3.8, -6.8],
    [-5.0, -4.8,  5.0, -4.8],
    [-5.6, -2.8,  5.6, -2.8],
    [-5.8, -0.8,  5.8, -0.8],
    [-5.8,  1.2,  5.8,  1.2],
    [-5.6,  3.2,  5.6,  3.2],
    [-5.0,  5.2,  5.0,  5.2],
    [-3.8,  7.2,  3.8,  7.2],
    [-2.2,  8.8,  2.2,  8.8],
  ];

  return (
    <G>
      <Path
        d="M 0,-11 C 4.5,-10.5 7,-5 7,0 C 7,5 4.5,10.5 0,11 C -4.5,10.5 -7,5 -7,0 C -7,-5 -4.5,-10.5 0,-11 Z"
        fill="none"
        stroke={color}
        strokeWidth={sw * 1.5}
        strokeLinejoin="round"
      />
      <Line
        x1="0" y1="-9"
        x2="0" y2="9"
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
          strokeWidth={sw * 0.85}
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
