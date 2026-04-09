"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  Flag,
  Zap,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Building2,
  GraduationCap,
  Droplets,
  Train,
  Scale,
  Users,
  TrendingUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface Milestone {
  label: string
  detail: string
  icon: LucideIcon
  type: "milestone" | "risk-gate" | "decision-gate"
}

interface Phase {
  id: string
  number: string
  title: string
  subtitle: string
  timeframe: string
  color: string
  icon: LucideIcon
  description: string
  model: string
  milestones: Milestone[]
}

const PHASES: Phase[] = [
  {
    id: "pilot",
    number: "01",
    title: "Pilot Development",
    subtitle: "Area-Based Development on Undisputed Land",
    timeframe: "2026 - 2029",
    color: "var(--accent-cyan)",
    icon: Flag,
    description:
      "Establish credibility through tangible progress on legally clear parcels. Young India Skills University and sports hub serve as anchor institutions, demonstrating the city's commitment to education and community benefit before scaling.",
    model: "Area-Based Development (ABD)",
    milestones: [
      {
        label: "Young India Skills University groundbreaking",
        detail:
          "Anchor institution on undisputed land — immediate visible progress and community benefit.",
        icon: GraduationCap,
        type: "milestone",
      },
      {
        label: "Sports hub construction begins",
        detail:
          "Second flagship facility demonstrating multi-sector commitment beyond pharma.",
        icon: Building2,
        type: "milestone",
      },
      {
        label: "Risk Gate: Farmer grievance assessment",
        detail:
          "Formal public hearings to record grievances. Compensation package rollout for 4,174 affected farmers (121 sq yd plots + ₹16L/acre).",
        icon: AlertTriangle,
        type: "risk-gate",
      },
      {
        label: "Decision Gate: Legal clarity checkpoint",
        detail:
          "Evaluate High Court response to Section 99 declaratory judgment petition. Assess if land repurposing receives judicial sanction before expanding scope.",
        icon: Scale,
        type: "decision-gate",
      },
      {
        label: "Voluntary SIA publication",
        detail:
          "Conduct and publish comprehensive Social Impact Assessment to build legitimacy despite state amendment exemptions.",
        icon: ShieldCheck,
        type: "milestone",
      },
    ],
  },
  {
    id: "infrastructure",
    number: "02",
    title: "Core Infrastructure",
    subtitle: "Pan-City Systems Providing Regional Benefits",
    timeframe: "2029 - 2035",
    color: "var(--accent-warning)",
    icon: Zap,
    description:
      "Build the backbone: water treatment, renewable energy grids, and transport connectivity using the Pan-City approach. These investments provide benefits to surrounding communities, creating broader regional buy-in and reducing opposition.",
    model: "Pan-City Approach",
    milestones: [
      {
        label: "Water treatment & district cooling commissioning",
        detail:
          "Net-zero-aligned utility infrastructure serving both BFC and surrounding districts.",
        icon: Droplets,
        type: "milestone",
      },
      {
        label: "Renewable energy grid activation",
        detail:
          "Solar and green energy grid powering Phase 1 facilities — first net-zero milestone.",
        icon: Zap,
        type: "milestone",
      },
      {
        label: "Metro Corridor IX connection",
        detail:
          "39.6 km airport-to-BFC metro link providing high-speed transit to CURE zone workforce.",
        icon: Train,
        type: "milestone",
      },
      {
        label: "Risk Gate: Environmental compliance audit",
        detail:
          "Independent third-party audit of net-zero claims against fragmented legal framework. Address GHG emission tracking gaps.",
        icon: AlertTriangle,
        type: "risk-gate",
      },
      {
        label: "Decision Gate: SPV governance reform",
        detail:
          "Formal integration of elected representatives onto BFCDA board. Establish financial sustainability plan beyond initial grants.",
        icon: Scale,
        type: "decision-gate",
      },
      {
        label: "Community benefit-sharing launch",
        detail:
          "Preferential local employment and skill development programs activated for surrounding villages.",
        icon: Users,
        type: "milestone",
      },
    ],
  },
  {
    id: "expansion",
    number: "03",
    title: "Scaled Expansion",
    subtitle: "Full Multi-Sector City Activation",
    timeframe: "2035 - 2047",
    color: "var(--accent)",
    icon: Rocket,
    description:
      "Post-legal resolution, expand into remaining parcels using Phase 1 and 2 success as proof-of-concept. Activate all seven economic zones — AI City, Green Pharma, EV Manufacturing, Healthcare, Aerospace & Defence — targeting 5 lakh jobs and positioning Telangana to capture 10% of India's GDP.",
    model: "Full-Scale Integrated Development",
    milestones: [
      {
        label: "AI City & Green Pharma zone activation",
        detail:
          "High-value knowledge economy zones open on resolved land parcels.",
        icon: Building2,
        type: "milestone",
      },
      {
        label: "EV Manufacturing & Aerospace zones launch",
        detail:
          "Industrial manufacturing corridors connected to RRR and dry ports.",
        icon: Rocket,
        type: "milestone",
      },
      {
        label: "Risk Gate: Mid-course economic review",
        detail:
          "Assess progress toward 10% national GDP target. Evaluate if investment inflows and employment growth track projections.",
        icon: AlertTriangle,
        type: "risk-gate",
      },
      {
        label: "Decision Gate: Expansion financing",
        detail:
          "Evaluate long-term financial model viability. Transition from grant-dependent to city-service revenue-based sustainability.",
        icon: Scale,
        type: "decision-gate",
      },
      {
        label: "5 lakh jobs target realization",
        detail:
          "Full employment across all seven zones — Telangana's Vision 2047 economic engine operational.",
        icon: TrendingUp,
        type: "milestone",
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function MilestoneTypeBadge({ type }: { type: Milestone["type"] }) {
  const config = {
    milestone: {
      label: "Milestone",
      bg: "var(--surface-elevated)",
      color: "var(--primary)",
      border: "var(--border)",
    },
    "risk-gate": {
      label: "Risk Gate",
      bg: "rgba(255, 149, 0, 0.1)",
      color: "var(--accent-warning)",
      border: "var(--accent-warning)",
    },
    "decision-gate": {
      label: "Decision Gate",
      bg: "rgba(255, 59, 48, 0.1)",
      color: "var(--accent)",
      border: "var(--accent)",
    },
  }

  const c = config[type]

  return (
    <span
      className="inline-flex items-center font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border"
      style={{
        backgroundColor: c.bg,
        color: c.color,
        borderColor: c.border,
      }}
    >
      {c.label}
    </span>
  )
}

function MilestoneRow({
  milestone,
  phaseColor,
  isVisible,
  index,
}: {
  milestone: Milestone
  phaseColor: string
  isVisible: boolean
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const Icon = milestone.icon

  const dotColor =
    milestone.type === "risk-gate"
      ? "var(--accent-warning)"
      : milestone.type === "decision-gate"
        ? "var(--accent)"
        : phaseColor

  return (
    <div
      className="relative flex gap-4 group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-12px)",
        transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08 + 0.15}s`,
      }}
    >
      {/* Dot on the internal sub-line */}
      <div className="relative flex flex-col items-center pt-1 shrink-0">
        <div
          className="w-2.5 h-2.5 z-10"
          style={{
            backgroundColor: dotColor,
            boxShadow: `0 0 8px ${dotColor}`,
          }}
        />
        <div
          className="w-px flex-1 mt-1"
          style={{ backgroundColor: "var(--border)" }}
        />
      </div>

      {/* Content */}
      <div
        className="flex-1 pb-5 border-b cursor-pointer"
        style={{ borderColor: "var(--border)" }}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setExpanded(!expanded)
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <Icon
              size={16}
              className="shrink-0 mt-0.5"
              style={{ color: dotColor }}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary leading-snug">
                {milestone.label}
              </p>
              <div className="mt-1.5">
                <MilestoneTypeBadge type={milestone.type} />
              </div>
            </div>
          </div>
          <ChevronRight
            size={14}
            className="shrink-0 mt-1 transition-transform duration-200"
            style={{
              color: "var(--muted-foreground)",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>

        {/* Expandable detail */}
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: expanded ? "120px" : "0px",
            opacity: expanded ? 1 : 0,
          }}
        >
          <p
            className="mt-3 text-xs leading-relaxed pl-7"
            style={{ color: "var(--muted-foreground)" }}
          >
            {milestone.detail}
          </p>
        </div>
      </div>
    </div>
  )
}

function PhaseCard({
  phase,
  isActive,
  phaseIndex,
}: {
  phase: Phase
  isActive: boolean
  phaseIndex: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Icon = phase.icon

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${phaseIndex * 0.12}s`,
      }}
    >
      {/* Phase connector line (visible between phases) */}
      {phaseIndex < PHASES.length - 1 && (
        <div
          className="absolute left-5 md:left-6 top-full w-px h-8 z-0"
          style={{
            background: `linear-gradient(to bottom, ${phase.color}, var(--border))`,
          }}
        />
      )}

      <div
        className="border relative overflow-hidden transition-all duration-500"
        style={{
          borderColor: isActive ? phase.color : "var(--border)",
          backgroundColor: "var(--card)",
          boxShadow: isActive
            ? `0 0 0 1px ${phase.color}, inset 0 1px 0 0 ${phase.color}`
            : "none",
        }}
      >
        {/* Accent top bar */}
        <div
          className="h-1 w-full"
          style={{ backgroundColor: phase.color }}
        />

        {/* Phase header */}
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            {/* Phase icon */}
            <div
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 border"
              style={{
                borderColor: phase.color,
                backgroundColor: isActive
                  ? `color-mix(in srgb, ${phase.color} 10%, transparent)`
                  : "var(--surface-sunken)",
              }}
            >
              <Icon
                size={20}
                style={{ color: phase.color }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: phase.color }}
                >
                  Phase {phase.number}
                </span>
                <span
                  className="font-mono text-[10px] tracking-wider px-2 py-0.5 border"
                  style={{
                    color: "var(--muted-foreground)",
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface-sunken)",
                  }}
                >
                  {phase.timeframe}
                </span>
              </div>
              <h3 className="mt-1.5 text-xl md:text-2xl font-bold text-primary tracking-tight">
                {phase.title}
              </h3>
              <p
                className="text-sm mt-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                {phase.subtitle}
              </p>
            </div>
          </div>

          {/* Development model tag */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: "var(--text-dim)" }}
            >
              Model
            </span>
            <span
              className="font-mono text-xs px-2 py-0.5 border"
              style={{
                color: phase.color,
                borderColor: phase.color,
                backgroundColor: `color-mix(in srgb, ${phase.color} 5%, transparent)`,
              }}
            >
              {phase.model}
            </span>
          </div>

          {/* Description */}
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {phase.description}
          </p>
        </div>

        {/* Milestones separator */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* Milestones list */}
        <div className="p-5 md:p-6">
          <p
            className="font-mono text-[10px] tracking-widest uppercase mb-4"
            style={{ color: "var(--text-dim)" }}
          >
            Milestones & Gates ({phase.milestones.length})
          </p>
          <div className="space-y-0">
            {phase.milestones.map((ms, i) => (
              <MilestoneRow
                key={ms.label}
                milestone={ms}
                phaseColor={phase.color}
                isVisible={isVisible}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Legend                                                               */
/* ------------------------------------------------------------------ */

function Legend() {
  const items = [
    { label: "Milestone", color: "var(--primary)", shape: "square" },
    { label: "Risk Gate", color: "var(--accent-warning)", shape: "square" },
    { label: "Decision Gate", color: "var(--accent)", shape: "square" },
  ] as const

  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5"
            style={{ backgroundColor: item.color }}
          />
          <span
            className="font-mono text-[10px] tracking-wider uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                        */
/* ------------------------------------------------------------------ */

function PhaseProgressBar({
  phases,
  activeIndex,
  onPhaseClick,
}: {
  phases: Phase[]
  activeIndex: number
  onPhaseClick: (index: number) => void
}) {
  return (
    <div className="flex items-stretch gap-px w-full" style={{ backgroundColor: "var(--border)" }}>
      {phases.map((phase, i) => {
        const isActive = i === activeIndex
        const isPast = i < activeIndex
        return (
          <button
            key={phase.id}
            onClick={() => onPhaseClick(i)}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3 transition-colors duration-300 cursor-pointer text-left"
            style={{
              backgroundColor: isActive
                ? `color-mix(in srgb, ${phase.color} 12%, var(--card))`
                : isPast
                  ? "var(--surface-elevated)"
                  : "var(--card)",
              borderBottom: isActive ? `2px solid ${phase.color}` : "2px solid transparent",
            }}
          >
            <span
              className="font-mono text-xs font-bold hidden sm:inline"
              style={{
                color: isActive ? phase.color : isPast ? "var(--muted-foreground)" : "var(--text-dim)",
              }}
            >
              {phase.number}
            </span>
            <span
              className="text-xs md:text-sm font-medium truncate"
              style={{
                color: isActive ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {phase.title}
            </span>
            {isPast && (
              <CheckCircle2
                size={12}
                className="shrink-0 hidden md:block"
                style={{ color: phase.color }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export function PhasedRolloutTimeline({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activePhase, setActivePhase] = useState(0)

  const setPhaseRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      phaseRefs.current[index] = el
    },
    []
  )

  /* Track which phase card is most visible in the viewport */
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    phaseRefs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            setActivePhase(i)
          }
        },
        { threshold: [0.25, 0.5] }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollToPhase = (index: number) => {
    const el = phaseRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: "var(--accent)" }}
          >
            Strategic Execution Roadmap
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Phased Rollout Model
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Three-phase approach balancing immediate credibility with long-term scale.
          </p>
        </div>
        <Legend />
      </div>

      {/* Sticky-ish phase selector bar */}
      <div
        ref={containerRef}
        className="border mb-8"
        style={{ borderColor: "var(--border)" }}
      >
        <PhaseProgressBar
          phases={PHASES}
          activeIndex={activePhase}
          onPhaseClick={scrollToPhase}
        />
      </div>

      {/* Timeline: Vertical stack of phase cards */}
      <div className="relative">
        {/* Vertical main line */}
        <div
          className="absolute left-5 md:left-6 top-0 bottom-0 w-px z-0"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* Animated progress fill on the vertical line */}
        <div
          className="absolute left-5 md:left-6 top-0 w-px z-[1] transition-all duration-700 ease-out"
          style={{
            height:
              activePhase === 0
                ? "33%"
                : activePhase === 1
                  ? "66%"
                  : "100%",
            background: `linear-gradient(to bottom, var(--accent-cyan), var(--accent-warning), var(--accent))`,
          }}
        />

        <div className="relative z-[2] space-y-8">
          {PHASES.map((phase, i) => (
            <div key={phase.id} ref={setPhaseRef(i)}>
              <PhaseCard
                phase={phase}
                isActive={i === activePhase}
                phaseIndex={i}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline end marker */}
      <div className="flex items-center gap-4 mt-8">
        <div
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border"
          style={{
            borderColor: "var(--accent-cyan)",
            backgroundColor: "color-mix(in srgb, var(--accent-cyan) 10%, transparent)",
          }}
        >
          <CheckCircle2 size={20} style={{ color: "var(--accent-cyan)" }} />
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-primary">
            Vision 2047 Target
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Telangana&apos;s $3 trillion economy with BFC as primary economic engine
          </p>
        </div>
      </div>
    </div>
  )
}
