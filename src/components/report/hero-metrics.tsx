"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface MetricConfig {
  /** The final numeric value to animate to */
  target: number
  /** Prefix before the number (e.g. "₹", "$") */
  prefix?: string
  /** Suffix after the number (e.g. "L Cr", "T") */
  suffix?: string
  /** Whether to format with commas */
  formatCommas?: boolean
  /** Descriptive label underneath */
  label: string
  /** Accent color for the value */
  accent: string
  /** Short monospace tag above the value */
  tag: string
}

const METRICS: MetricConfig[] = [
  {
    target: 30000,
    formatCommas: true,
    suffix: "",
    label: "Acres within 765 sq km zone",
    accent: "var(--accent-neon-green)",
    tag: "LAND AREA",
  },
  {
    target: 5.75,
    prefix: "₹",
    suffix: "L Cr",
    formatCommas: false,
    label: "Investment pledges secured",
    accent: "var(--accent-magenta)",
    tag: "INVESTMENT",
  },
  {
    target: 3,
    prefix: "$",
    suffix: "T",
    formatCommas: false,
    label: "Vision 2047 GDP target",
    accent: "var(--accent-cyan)",
    tag: "GDP TARGET",
  },
]

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function formatNumber(n: number, commas: boolean): string {
  if (commas) {
    return Math.round(n).toLocaleString("en-IN")
  }
  // For decimals (like 5.75), show two decimal places during animation, snap to clean at end
  if (n % 1 !== 0) {
    return n.toFixed(2)
  }
  return Math.round(n).toString()
}

function AnimatedMetric({ config, shouldAnimate }: { config: MetricConfig; shouldAnimate: boolean }) {
  const [displayValue, setDisplayValue] = useState("0")
  const [hasAnimated, setHasAnimated] = useState(false)
  const rafRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    if (hasAnimated) return
    setHasAnimated(true)

    const duration = config.target >= 1000 ? 2400 : 1800
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = eased * config.target

      setDisplayValue(formatNumber(current, !!config.formatCommas))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Snap to final value
        setDisplayValue(formatNumber(config.target, !!config.formatCommas))
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [config.target, config.formatCommas, hasAnimated])

  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      // Small stagger per metric isn't needed here since the parent delays visibility
      animate()
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [shouldAnimate, animate, hasAnimated])

  return (
    <div
      className="p-6 md:p-8 relative overflow-hidden group"
      style={{ backgroundColor: "var(--card)" }}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 h-[2px] transition-all duration-1000 ease-out"
        style={{
          backgroundColor: config.accent,
          width: shouldAnimate ? "100%" : "0%",
        }}
      />

      {/* Tag */}
      <p
        className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3"
        style={{ color: "var(--text-dim)" }}
      >
        {config.tag}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        {config.prefix && (
          <span
            className="font-sans text-2xl md:text-3xl font-bold"
            style={{ color: config.accent }}
          >
            {config.prefix}
          </span>
        )}
        <span
          className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter tabular-nums"
          style={{
            color: config.accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {displayValue}
        </span>
        {config.suffix && (
          <span
            className="font-sans text-lg md:text-xl font-bold ml-1"
            style={{ color: config.accent, opacity: 0.8 }}
          >
            {config.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p
        className="mt-3 text-sm leading-relaxed"
        style={{ color: "var(--muted-foreground)" }}
      >
        {config.label}
      </p>

      {/* Decorative corner tick */}
      <div
        className="absolute bottom-3 right-3 w-3 h-3 opacity-20"
        style={{
          borderRight: `1px solid ${config.accent}`,
          borderBottom: `1px solid ${config.accent}`,
        }}
      />
    </div>
  )
}

export function HeroMetrics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-3 gap-px"
      style={{ backgroundColor: "var(--border)" }}
    >
      {METRICS.map((metric, index) => (
        <div
          key={metric.tag}
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
          }}
        >
          <AnimatedMetric config={metric} shouldAnimate={isInView} />
        </div>
      ))}
    </div>
  )
}
