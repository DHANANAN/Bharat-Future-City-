"use client"

import { useState, useMemo, useCallback } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { TrendingUp, AlertTriangle, Target, Info } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

const CURRENT_YEAR = 2025
const TARGET_YEAR = 2047
const YEARS = Array.from({ length: TARGET_YEAR - CURRENT_YEAR + 1 }, (_, i) => CURRENT_YEAR + i)

// Telangana real data
const TELANGANA_GSDP_2024 = 16.21 // trillion INR (FY2023-24 approx)
const INDIA_GDP_2024 = 343.7 // trillion INR (approx)
const TELANGANA_SHARE_2024 = 4.72 // %
const INDIA_GDP_TARGET_2047 = 600 // trillion INR ($30T at ~20 INR/$)
const TARGET_SHARE = 10 // %
const TARGET_GSDP = INDIA_GDP_TARGET_2047 * (TARGET_SHARE / 100) // 60 trillion

// National GDP growth assumption (baseline 6.5% nominal)
const NATIONAL_GROWTH_RATE = 6.5

function compoundGrowth(base: number, rate: number, years: number): number {
  return base * Math.pow(1 + rate / 100, years)
}

function requiredCAGR(current: number, target: number, years: number): number {
  return (Math.pow(target / current, 1 / years) - 1) * 100
}

/* ------------------------------------------------------------------ */
/*  Scenario presets                                                    */
/* ------------------------------------------------------------------ */

type Scenario = "conservative" | "moderate" | "aggressive" | "custom"

const PRESETS: Record<Exclude<Scenario, "custom">, { growth: number; capital: number; employment: number }> = {
  conservative: { growth: 8, capital: 30, employment: 1.0 },
  moderate: { growth: 11, capital: 60, employment: 1.5 },
  aggressive: { growth: 14.5, capital: 100, employment: 2.0 },
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip                                                      */
/* ------------------------------------------------------------------ */

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
  dataKey: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        border: "1px solid #2A2A2A",
        padding: "12px 16px",
      }}
    >
      <p
        className="font-mono text-xs mb-2"
        style={{ color: "#FFFFFF" }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6 mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs" style={{ color: "#888888" }}>
              {entry.name}
            </span>
          </div>
          <span className="font-mono text-xs font-bold" style={{ color: entry.color }}>
            {typeof entry.value === "number"
              ? entry.value < 100
                ? `${entry.value.toFixed(1)}%`
                : `₹${entry.value.toFixed(1)}T`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Slider component                                                    */
/* ------------------------------------------------------------------ */

function BrutalistSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
  info,
  accentColor,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (val: number) => void
  unit: string
  info: string
  accentColor: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider uppercase" style={{ color: "#888888" }}>
            {label}
          </span>
          <span title={info}>
            <Info
              size={12}
              style={{ color: "#666666" }}
              className="cursor-help"
            />
          </span>
        </div>
        <span className="font-mono text-sm font-bold" style={{ color: accentColor }}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="relative w-full h-8 flex items-center">
        {/* Track background */}
        <div
          className="absolute left-0 right-0 h-1"
          style={{ backgroundColor: "#2A2A2A" }}
        />
        {/* Filled track */}
        <div
          className="absolute left-0 h-1"
          style={{
            width: `${pct}%`,
            backgroundColor: accentColor,
          }}
        />
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-8 cursor-pointer opacity-0"
          style={{ zIndex: 2 }}
        />
        {/* Thumb */}
        <div
          className="absolute w-4 h-4 border-2 pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            backgroundColor: "#000000",
            borderColor: accentColor,
            zIndex: 1,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[10px]" style={{ color: "#444444" }}>
          {min}{unit}
        </span>
        <span className="font-mono text-[10px]" style={{ color: "#444444" }}>
          {max}{unit}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Probability gauge                                                   */
/* ------------------------------------------------------------------ */

function ProbabilityGauge({ probability }: { probability: number }) {
  const color =
    probability >= 60
      ? "#00FF9F"
      : probability >= 30
        ? "#FFFF00"
        : "#FF00FF"

  const label =
    probability >= 60
      ? "Achievable"
      : probability >= 30
        ? "Challenging"
        : "Extreme Outlier"

  return (
    <div
      className="border p-4"
      style={{
        borderColor: "#2A2A2A",
        backgroundColor: "#050505",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs tracking-wider uppercase" style={{ color: "#888888" }}>
          Target Probability
        </span>
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color }}>
          {label}
        </span>
      </div>
      {/* Bar */}
      <div className="relative w-full h-3" style={{ backgroundColor: "#1A1A1A" }}>
        <div
          className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(probability, 100)}%`,
            backgroundColor: color,
          }}
        />
        {/* Markers */}
        <div className="absolute top-0 h-full w-px" style={{ left: "30%", backgroundColor: "#444444" }} />
        <div className="absolute top-0 h-full w-px" style={{ left: "60%", backgroundColor: "#444444" }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[10px]" style={{ color: "#444444" }}>0%</span>
        <span className="font-mono text-[10px]" style={{ color: "#444444" }}>30%</span>
        <span className="font-mono text-[10px]" style={{ color: "#444444" }}>60%</span>
        <span className="font-mono text-[10px]" style={{ color: "#444444" }}>100%</span>
      </div>
      <p className="font-mono text-2xl font-bold mt-3" style={{ color }}>
        {probability.toFixed(0)}%
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export function GDPProjectionViz() {
  const [scenario, setScenario] = useState<Scenario>("moderate")
  const [customGrowth, setCustomGrowth] = useState(11)
  const [customCapital, setCustomCapital] = useState(60)
  const [customEmployment, setCustomEmployment] = useState(1.5)

  const activeValues = useMemo(() => {
    if (scenario === "custom") {
      return { growth: customGrowth, capital: customCapital, employment: customEmployment }
    }
    return PRESETS[scenario]
  }, [scenario, customGrowth, customCapital, customEmployment])

  // Effective growth rate: base + capital bonus + employment bonus
  const effectiveGrowth = useMemo(() => {
    const capitalBonus = (activeValues.capital - 30) * 0.02 // every ₹1L Cr above baseline = 0.02% boost
    const employmentBonus = (activeValues.employment - 1.0) * 1.5 // each 0.1 multiplier above 1.0 = 0.15%
    return activeValues.growth + capitalBonus + employmentBonus
  }, [activeValues])

  // Required CAGR to hit 10% target
  const requiredGrowth = useMemo(() => {
    return requiredCAGR(TELANGANA_GSDP_2024, TARGET_GSDP, TARGET_YEAR - CURRENT_YEAR)
  }, [])

  // Generate projection data
  const chartData = useMemo(() => {
    return YEARS.map((year) => {
      const yearsFromNow = year - CURRENT_YEAR
      const telanganaGSDP = compoundGrowth(TELANGANA_GSDP_2024, effectiveGrowth, yearsFromNow)
      const indiaGDP = compoundGrowth(INDIA_GDP_2024, NATIONAL_GROWTH_RATE, yearsFromNow)
      const share = (telanganaGSDP / indiaGDP) * 100
      const requiredGSDP = compoundGrowth(TELANGANA_GSDP_2024, requiredGrowth, yearsFromNow)
      const requiredShare = (requiredGSDP / indiaGDP) * 100

      // Band = +/- 1.5%
      const upperGSDP = compoundGrowth(TELANGANA_GSDP_2024, effectiveGrowth + 1.5, yearsFromNow)
      const lowerGSDP = compoundGrowth(TELANGANA_GSDP_2024, Math.max(effectiveGrowth - 1.5, 0), yearsFromNow)
      const upperShare = (upperGSDP / indiaGDP) * 100
      const lowerShare = (lowerGSDP / indiaGDP) * 100

      return {
        year,
        projectedShare: parseFloat(share.toFixed(2)),
        requiredShare: parseFloat(requiredShare.toFixed(2)),
        upperBand: parseFloat(upperShare.toFixed(2)),
        lowerBand: parseFloat(lowerShare.toFixed(2)),
        projectedGSDP: parseFloat(telanganaGSDP.toFixed(1)),
        requiredGSDP: parseFloat(requiredGSDP.toFixed(1)),
      }
    })
  }, [effectiveGrowth, requiredGrowth])

  // Final year data
  const finalData = chartData[chartData.length - 1]
  const hitsTarget = finalData.projectedShare >= TARGET_SHARE
  const gapPct = TARGET_SHARE - finalData.projectedShare

  // Probability heuristic: sigmoid curve around the gap
  const probability = useMemo(() => {
    if (hitsTarget) return Math.min(85, 60 + (finalData.projectedShare - TARGET_SHARE) * 5)
    const deficit = TARGET_SHARE - finalData.projectedShare
    // Larger gap = lower probability. At deficit ~5%, probability ~5%
    const p = Math.max(2, 60 * Math.exp(-0.5 * deficit))
    return parseFloat(p.toFixed(0))
  }, [hitsTarget, finalData.projectedShare])

  const handleScenarioClick = useCallback((s: Scenario) => {
    setScenario(s)
    if (s !== "custom") {
      setCustomGrowth(PRESETS[s].growth)
      setCustomCapital(PRESETS[s].capital)
      setCustomEmployment(PRESETS[s].employment)
    }
  }, [])

  const handleGrowthChange = useCallback((val: number) => {
    setCustomGrowth(val)
    setScenario("custom")
  }, [])

  const handleCapitalChange = useCallback((val: number) => {
    setCustomCapital(val)
    setScenario("custom")
  }, [])

  const handleEmploymentChange = useCallback((val: number) => {
    setCustomEmployment(val)
    setScenario("custom")
  }, [])

  return (
    <div
      className="border"
      style={{
        borderColor: "#2A2A2A",
        backgroundColor: "#0A0A0A",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b"
        style={{ borderColor: "#2A2A2A" }}
      >
        <Target size={14} style={{ color: "#FF3B30" }} />
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#FF3B30" }}>
          Interactive Projection
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#2A2A2A" }} />
        <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "#666666" }}>
          10% GDP Target Analysis
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ---- Left panel: controls ---- */}
        <div
          className="lg:w-[340px] p-5 border-b lg:border-b-0 lg:border-r flex-shrink-0"
          style={{ borderColor: "#2A2A2A" }}
        >
          {/* Scenario presets */}
          <div className="mb-6">
            <span className="font-mono text-[10px] tracking-widest uppercase mb-3 block" style={{ color: "#666666" }}>
              Scenario Presets
            </span>
            <div className="grid grid-cols-3 gap-px" style={{ backgroundColor: "#2A2A2A" }}>
              {(["conservative", "moderate", "aggressive"] as const).map((s) => {
                const isActive = scenario === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleScenarioClick(s)}
                    className="py-2 px-1 font-mono text-[10px] tracking-wider uppercase cursor-pointer transition-colors duration-150"
                    style={{
                      backgroundColor: isActive ? "#1A1A1A" : "#050505",
                      color: isActive ? "#00FF9F" : "#666666",
                      borderBottom: isActive ? "2px solid #00FF9F" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#111111"
                        e.currentTarget.style.color = "#AAAAAA"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#050505"
                        e.currentTarget.style.color = "#666666"
                      }
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sliders */}
          <BrutalistSlider
            label="Growth Rate"
            value={scenario === "custom" ? customGrowth : activeValues.growth}
            min={4}
            max={18}
            step={0.5}
            onChange={handleGrowthChange}
            unit="%"
            info="Telangana's annual nominal GDP growth rate. Current national average is ~6.5%. States like Gujarat sustained ~11% for extended periods."
            accentColor="#00FF9F"
          />

          <BrutalistSlider
            label="Capital Inflows"
            value={scenario === "custom" ? customCapital : activeValues.capital}
            min={10}
            max={150}
            step={5}
            onChange={handleCapitalChange}
            unit=" L Cr"
            info="Sustained annual capital investment in lakhs of crores. ₹5.75 lakh crore was pledged at the 2025 Global Summit as a one-time commitment."
            accentColor="#00D4FF"
          />

          <BrutalistSlider
            label="Employment Multiplier"
            value={scenario === "custom" ? customEmployment : activeValues.employment}
            min={0.5}
            max={3.0}
            step={0.1}
            onChange={handleEmploymentChange}
            unit="x"
            info="Ratio of indirect + induced jobs per direct job created. Tech hubs like HITEC City typically generate 1.5-2.5x multipliers."
            accentColor="#FFFF00"
          />

          {/* Probability gauge */}
          <div className="mt-4">
            <ProbabilityGauge probability={probability} />
          </div>

          {/* Key stats */}
          <div
            className="mt-4 grid grid-cols-2 gap-px"
            style={{ backgroundColor: "#2A2A2A" }}
          >
            <div className="p-3" style={{ backgroundColor: "#050505" }}>
              <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "#666666" }}>
                Effective CAGR
              </p>
              <p className="font-mono text-lg font-bold" style={{ color: "#00FF9F" }}>
                {effectiveGrowth.toFixed(1)}%
              </p>
            </div>
            <div className="p-3" style={{ backgroundColor: "#050505" }}>
              <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "#666666" }}>
                Required CAGR
              </p>
              <p className="font-mono text-lg font-bold" style={{ color: "#FF00FF" }}>
                {requiredGrowth.toFixed(1)}%
              </p>
            </div>
            <div className="p-3" style={{ backgroundColor: "#050505" }}>
              <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "#666666" }}>
                2047 Share
              </p>
              <p className="font-mono text-lg font-bold" style={{ color: hitsTarget ? "#00FF9F" : "#FFFF00" }}>
                {finalData.projectedShare.toFixed(1)}%
              </p>
            </div>
            <div className="p-3" style={{ backgroundColor: "#050505" }}>
              <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "#666666" }}>
                Gap to Target
              </p>
              <p className="font-mono text-lg font-bold" style={{ color: hitsTarget ? "#00FF9F" : "#FF00FF" }}>
                {hitsTarget ? "+" : ""}{(-gapPct).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* ---- Right panel: chart ---- */}
        <div className="flex-1 p-5 min-w-0">
          {/* Chart title */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-sm" style={{ color: "#FFFFFF" }}>
                Telangana GDP Share Trajectory
              </h3>
              <p className="font-mono text-[10px] mt-1" style={{ color: "#666666" }}>
                Projected vs required national GDP share (2025 - 2047)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5" style={{ backgroundColor: "#00FF9F" }} />
                <span className="font-mono text-[10px]" style={{ color: "#888888" }}>Projected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5" style={{ backgroundColor: "#FF00FF", borderTop: "1px dashed #FF00FF" }} />
                <span className="font-mono text-[10px]" style={{ color: "#888888" }}>Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 opacity-20" style={{ backgroundColor: "#00D4FF" }} />
                <span className="font-mono text-[10px]" style={{ color: "#888888" }}>Range</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full" style={{ height: "340px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 6"
                  stroke="#1A1A1A"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#666666", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: "#2A2A2A" }}
                  tickLine={{ stroke: "#2A2A2A" }}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: "#666666", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: "#2A2A2A" }}
                  tickLine={{ stroke: "#2A2A2A" }}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#2A2A2A", strokeDasharray: "4 4" }}
                />

                {/* Target reference line */}
                <ReferenceLine
                  y={TARGET_SHARE}
                  stroke="#FF00FF"
                  strokeDasharray="8 4"
                  strokeWidth={1}
                  label={{
                    value: "10% TARGET",
                    position: "insideTopRight",
                    fill: "#FF00FF",
                    fontSize: 10,
                    fontFamily: "monospace",
                  }}
                />

                {/* Current share reference */}
                <ReferenceLine
                  y={TELANGANA_SHARE_2024}
                  stroke="#444444"
                  strokeDasharray="4 4"
                  strokeWidth={0.5}
                  label={{
                    value: "4.72% CURRENT",
                    position: "insideBottomRight",
                    fill: "#444444",
                    fontSize: 9,
                    fontFamily: "monospace",
                  }}
                />

                {/* Phase shading */}
                <ReferenceArea
                  x1={2025}
                  x2={2034}
                  fill="#FFFFFF"
                  fillOpacity={0.015}
                  label={{
                    value: "Phase 1-2",
                    position: "insideTopLeft",
                    fill: "#333333",
                    fontSize: 9,
                    fontFamily: "monospace",
                  }}
                />

                {/* Confidence band */}
                <Area
                  type="monotone"
                  dataKey="upperBand"
                  stroke="none"
                  fill="url(#bandGradient)"
                  fillOpacity={1}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="lowerBand"
                  stroke="none"
                  fill="#0A0A0A"
                  fillOpacity={1}
                  isAnimationActive={false}
                />

                {/* Required path */}
                <Line
                  type="monotone"
                  dataKey="requiredShare"
                  name="Required Path"
                  stroke="#FF00FF"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={800}
                />

                {/* Projected path */}
                <Line
                  type="monotone"
                  dataKey="projectedShare"
                  name="Projected Share"
                  stroke="#00FF9F"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Insight bar */}
          <div
            className="mt-4 flex items-start gap-3 p-4 border"
            style={{
              borderColor: hitsTarget ? "rgba(0, 255, 159, 0.3)" : "rgba(255, 0, 255, 0.3)",
              backgroundColor: hitsTarget ? "rgba(0, 255, 159, 0.08)" : "rgba(255, 0, 255, 0.08)",
            }}
          >
            {hitsTarget ? (
              <TrendingUp size={16} style={{ color: "#00FF9F", flexShrink: 0, marginTop: 2 }} />
            ) : (
              <AlertTriangle size={16} style={{ color: "#FFFF00", flexShrink: 0, marginTop: 2 }} />
            )}
            <div>
              <p className="text-xs leading-relaxed" style={{ color: "#E5E5E5" }}>
                {hitsTarget ? (
                  <>
                    At an effective growth rate of <strong>{effectiveGrowth.toFixed(1)}%</strong>, Telangana could
                    reach <strong>{finalData.projectedShare.toFixed(1)}%</strong> of national GDP by 2047, exceeding
                    the 10% target. This scenario requires sustained, unprecedented growth and massive capital deployment
                    over two decades.
                  </>
                ) : (
                  <>
                    At an effective growth rate of <strong>{effectiveGrowth.toFixed(1)}%</strong>, Telangana would
                    reach only <strong>{finalData.projectedShare.toFixed(1)}%</strong> of national GDP by 2047 —
                    a <strong>{Math.abs(gapPct).toFixed(1)} percentage point gap</strong> from the 10% target.
                    The required CAGR of <strong>{requiredGrowth.toFixed(1)}%</strong> would be historically
                    unprecedented for any Indian state over a sustained period.
                  </>
                )}
              </p>
              <p className="text-[10px] font-mono mt-2" style={{ color: "#666666" }}>
                Projection assumes India grows at {NATIONAL_GROWTH_RATE}% nominal GDP. Confidence band = +/- 1.5% around selected growth rate.
              </p>
            </div>
          </div>

          {/* Scenario comparison mini-table */}
          <div className="mt-4">
            <span className="font-mono text-[10px] tracking-widest uppercase mb-2 block" style={{ color: "#666666" }}>
              Scenario Comparison
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                    <th className="font-mono text-[10px] uppercase tracking-wider py-2 pr-4" style={{ color: "#666666" }}>Scenario</th>
                    <th className="font-mono text-[10px] uppercase tracking-wider py-2 pr-4" style={{ color: "#666666" }}>Growth</th>
                    <th className="font-mono text-[10px] uppercase tracking-wider py-2 pr-4" style={{ color: "#666666" }}>2047 Share</th>
                    <th className="font-mono text-[10px] uppercase tracking-wider py-2" style={{ color: "#666666" }}>2047 GSDP</th>
                  </tr>
                </thead>
                <tbody>
                  {(["conservative", "moderate", "aggressive"] as const).map((s) => {
                    const preset = PRESETS[s]
                    const effGr = preset.growth + (preset.capital - 30) * 0.02 + (preset.employment - 1.0) * 1.5
                    const finalGSDP = compoundGrowth(TELANGANA_GSDP_2024, effGr, TARGET_YEAR - CURRENT_YEAR)
                    const finalIndiaGDP = compoundGrowth(INDIA_GDP_2024, NATIONAL_GROWTH_RATE, TARGET_YEAR - CURRENT_YEAR)
                    const finalShareVal = (finalGSDP / finalIndiaGDP) * 100
                    const isActive = scenario === s

                    return (
                      <tr
                        key={s}
                        style={{
                          borderBottom: "1px solid #1A1A1A",
                          backgroundColor: isActive ? "#111111" : "transparent",
                        }}
                      >
                        <td className="font-mono text-xs py-2 pr-4 capitalize" style={{ color: isActive ? "#FFFFFF" : "#888888" }}>
                          {s}
                        </td>
                        <td className="font-mono text-xs py-2 pr-4" style={{ color: "#E5E5E5" }}>
                          {effGr.toFixed(1)}%
                        </td>
                        <td className="font-mono text-xs py-2 pr-4" style={{ color: finalShareVal >= 10 ? "#00D4AA" : "#FF9500" }}>
                          {finalShareVal.toFixed(1)}%
                        </td>
                        <td className="font-mono text-xs py-2" style={{ color: "#E5E5E5" }}>
                          ₹{finalGSDP.toFixed(0)}T
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
