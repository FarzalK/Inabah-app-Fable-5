"use client";

import type { NafsStation } from "@/types";
import type { SpiritualScore } from "@/lib/scoring";
import { getNafsDescription, getNafsGateMessage } from "@/lib/scoring";
import { NAFS_STATIONS as STATIONS, STATION_COLORS } from "@/lib/data";

interface NafsGaugeProps {
  score: SpiritualScore;
  compact?: boolean;
}

export default function NafsGauge({ score, compact = false }: NafsGaugeProps) {
  const { nafsStation, nafsScore, nafsProgress, trend } = score;
  const color = STATION_COLORS[nafsStation];
  const stationIndex = STATIONS.indexOf(nafsStation);

  const cx = 110, cy = compact ? 90 : 100, r = compact ? 72 : 80;
  const startAngle = -200, endAngle = 20;
  const totalArc = endAngle - startAngle;
  const overallPct = (nafsScore / 4) * 100;
  const fillAngle = startAngle + (totalArc * overallPct) / 100;

  function polarToXY(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(from: number, to: number) {
    const s = polarToXY(from), e = polarToXY(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const gateMsg = getNafsGateMessage(score);
  const trendIcon = trend === "improving" ? "↑" : trend === "declining" ? "↓" : "→";
  const trendColor = trend === "improving" ? "#5C7A5C" : trend === "declining" ? "#C0392B" : "var(--text-tertiary)";
  const svgH = compact ? 120 : 140;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col items-center">
        <svg width="220" height={svgH} viewBox={`0 0 220 ${svgH}`}>
          {/* Track */}
          <path d={describeArc(startAngle, endAngle)} fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round"/>
          {/* Zone markers */}
          {STATIONS.map((station, i) => {
            const zs = startAngle + (totalArc * (i / 4));
            const ze = startAngle + (totalArc * ((i + 1) / 4));
            return (
              <path key={station} d={describeArc(zs + 1, ze - 1)} fill="none"
                stroke={STATION_COLORS[station]} strokeWidth="12" strokeLinecap="round"
                opacity={stationIndex === i ? 0.2 : 0.06}/>
            );
          })}
          {/* Fill */}
          <path d={describeArc(startAngle, Math.min(fillAngle, endAngle - 1))}
            fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"/>
          {/* Labels */}
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="13" fontWeight="600" fill={color}>
            {nafsStation}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">
            {nafsProgress}% through station
          </text>
          <text x={cx} y={cy + 24} textAnchor="middle" fontSize="11" fill={trendColor}>
            {trendIcon} {trend}
          </text>
        </svg>

        {/* Station dots */}
        <div className="flex items-center gap-4 mt-1">
          {STATIONS.map((station, i) => (
            <div key={station} className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: STATION_COLORS[station],
                  opacity: stationIndex >= i ? 1 : 0.2,
                  transform: stationIndex === i ? "scale(1.5)" : "scale(1)",
                }}/>
              <span className="text-[9px]" style={{ color: stationIndex === i ? STATION_COLORS[station] : "var(--text-tertiary)" }}>
                {station.split("'")[0].split("ā")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!compact && (
        <p className="text-[12px] leading-relaxed text-center mt-3" style={{ color: "var(--text-secondary)" }}>
          {getNafsDescription(nafsStation)}
        </p>
      )}

      {gateMsg && (
        <div className="mt-3 p-3 rounded-lg" style={{ background: "color-mix(in srgb, var(--sand) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--sand) 40%, transparent)" }}>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--terracotta)" }}>{gateMsg}</p>
        </div>
      )}
    </div>
  );
}
