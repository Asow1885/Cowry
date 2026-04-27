import React from "react";
import Svg, { Ellipse, G, Line } from "react-native-svg";

interface CowryCrestProps {
  size?: number;
  color?: string;
}

const SHELLS = [
  { cx: 16,   cy: 7.5,  rx: 4.3, ry: 6.0 },
  { cx: 9.5,  cy: 23.5, rx: 4.3, ry: 6.0 },
  { cx: 22.5, cy: 23.5, rx: 4.3, ry: 6.0 },
];

export function CowryCrest({ size = 32, color = "#c9a04a" }: CowryCrestProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {SHELLS.map((s, i) => {
        const spineTop = s.cy - s.ry + 1.2;
        const spineBot = s.cy + s.ry - 1.2;
        const len = spineBot - spineTop;
        const TEETH = 9;
        const step = len / (TEETH + 1);
        const reach = s.rx * 0.60;
        const gap = 0.30;

        const teeth: React.ReactElement[] = [];
        for (let j = 1; j <= TEETH; j++) {
          const ty = spineTop + j * step;
          teeth.push(
            <Line
              key={`tL${i}${j}`}
              x1={s.cx - reach} y1={ty}
              x2={s.cx - gap}   y2={ty}
              stroke={color}
              strokeWidth="0.44"
              strokeLinecap="round"
            />
          );
          teeth.push(
            <Line
              key={`tR${i}${j}`}
              x1={s.cx + gap}   y1={ty}
              x2={s.cx + reach} y2={ty}
              stroke={color}
              strokeWidth="0.44"
              strokeLinecap="round"
            />
          );
        }

        return (
          <G key={i}>
            <Ellipse
              cx={s.cx} cy={s.cy}
              rx={s.rx} ry={s.ry}
              fill="none"
              stroke={color}
              strokeWidth="1.15"
            />
            <Line
              x1={s.cx} y1={spineTop}
              x2={s.cx} y2={spineBot}
              stroke={color}
              strokeWidth="0.52"
            />
            {teeth}
          </G>
        );
      })}
    </Svg>
  );
}
