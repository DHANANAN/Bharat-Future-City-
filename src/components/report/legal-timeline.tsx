"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

type EventCategory = "acquisition" | "legal" | "challenge" | "milestone"

interface TimelineEvent {
  year: number
  /** Optional month (1-indexed) for more granular placement */
  month?: number
  title: string
  description: string
  category: EventCategory
  /** Which LARR Act section is relevant, if any */
  section?: string
}

const EVENTS: TimelineEvent[] = [
  {
    year: 2013,
    title: "LARR Act 2013 Enacted",
    description:
      "The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act is enacted nationally, establishing consent, SIA, and fair compensation requirements.",
    category: "legal",
    section: "LARR Act 2013",
  },
  {
    year: 2014,
    title: "Land Acquisition Begins",
    description:
      "The BRS (then-TRS) government begins acquiring ~20,000 acres of land south of Hyderabad for the proposed Hyderabad Pharma City, a dedicated pharmaceutical manufacturing zone.",
    category: "acquisition",
  },
  {
    year: 2016,
    title: "Telangana LARR Amendment",
    description:
      "Telangana enacts Section 10A via the LARR (Telangana Amendment) Act 2016, exempting infrastructure projects and industrial corridors from Social Impact Assessments and consent requirements.",
    category: "legal",
    section: "Section 10A",
  },
  {
    year: 2017,
    month: 6,
    title: "Judicial Commitment: Green Pharma",
    description:
      "The BRS government formally informs the Telangana High Court that acquired land will be used exclusively for 'green pharma' purposes—a commitment that creates legal obligations under Section 99.",
    category: "challenge",
    section: "Section 99",
  },
  {
    year: 2019,
    title: "Farmer Petitions Filed",
    description:
      "Farmers in multiple villages file petitions citing inadequate compensation and procedural flaws. Courts issue stay orders on land takeovers in Kurmidda, Thatiparti, and Medipally.",
    category: "challenge",
    section: "Section 101",
  },
  {
    year: 2021,
    title: "Ongoing Disputes Escalate",
    description:
      "Over 1,500 acres where farmers haven't approached courts but remain legally vulnerable. Government fencing of disputed parcels sparks contempt-of-court petitions from affected landowners.",
    category: "challenge",
  },
  {
    year: 2023,
    month: 3,
    title: "Court Quashes Awards",
    description:
      "The Telangana High Court quashes acquisition awards in several villages due to petitions citing inadequate compensation and procedural flaws. Over 2,000 acres now under court-issued stay orders.",
    category: "challenge",
    section: "High Court Order",
  },
  {
    year: 2023,
    month: 12,
    title: "Congress Government Takes Office",
    description:
      "The incoming Congress government—which had previously supported farmer protests and promised to scrap Pharma City—assumes power in Telangana, creating political uncertainty over the project's future.",
    category: "milestone",
  },
  {
    year: 2024,
    month: 6,
    title: "Bharat Future City Announced",
    description:
      "The Congress government pivots: instead of scrapping the project, it rebrands and massively expands scope to 'Bharat Future City'—a 30,000-acre multi-sector net-zero smart city. This triggers Section 99 compliance questions.",
    category: "milestone",
    section: "Section 99 Conflict",
  },
  {
    year: 2024,
    month: 9,
    title: "Government Challenges 2023 Order",
    description:
      "Paradoxically, the Congress government challenges the very 2023 court order quashing acquisition awards—an order Congress leaders celebrated while in opposition. Exposes political contradictions.",
    category: "challenge",
  },
  {
    year: 2025,
    month: 1,
    title: "Enhanced Compensation Proposed",
    description:
      "Government proposes 121 sq yd developed residential plots plus ₹16 lakh per acre for 4,174 affected farmers, with free land registration. Aims to weaken legal standing of return demands.",
    category: "milestone",
  },
  {
    year: 2025,
    month: 12,
    title: "Global Summit: ₹5.75L Cr Pledged",
    description:
      "The Telangana Global Summit 2025 secures ₹5.75 lakh crore in investment pledges. Brookfield and Adani commit infrastructure capital. Seven economic zones announced with 5 lakh jobs target.",
    category: "milestone",
  },
]

const YEAR_MIN = 2013
const YEAR_MAX = 2026

/* ------------------------------------------------------------------ */
/* CATEGORY STYLING                                                    */
/* ------------------------------------------------------------------ */

function categoryColor(cat: EventCategory): string {
  switch (cat) {
    case "acquisition":
      return "#00D4FF"
    case "legal":
      return "#FFFF00"
    case "challenge":
      return "#FF00FF"
    case "milestone":
      return "#00FF9F"
  }
}

function categoryLabel(cat: EventCategory): string {
  switch (cat) {
    case "acquisition":
      return "Acquisition"
    case "legal":
      return "Legislation"
    case "challenge":
      return "Legal Challenge"
    case "milestone":
      return "Milestone"
  }
}

/* ------------------------------------------------------------------ */
/* TOOLTIP COMPONENT                                                   */
/* ------------------------------------------------------------------ */

function EventTooltip({
  event,
  anchorRect,
  containerRect,
}: {
  event: TimelineEvent
  anchorRect: DOMRect
  containerRect: DOMRect
}) {
  const color = categoryColor(event.category)
  const tooltipWidth = 340

  // Position relative to the container
  const leftRelative = anchorRect.left - containerRect.left + anchorRect.width / 2
  // Clamp horizontally so it doesn't overflow
  const clampedLeft = Math.max(
    tooltipWidth / 2 + 8,
    Math.min(leftRelative, containerRect.width - tooltipWidth / 2 - 8)
  )

  // Place above or below the node depending on vertical position
  const nodeTop = anchorRect.top - containerRect.top
  const placeAbove = nodeTop > 200

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: clampedLeft,
        ...(placeAbove
          ? { bottom: containerRect.height - nodeTop + 16 }
          : { top: nodeTop + anchorRect.height + 16 }),
        transform: "translateX(-50%)",
        width: tooltipWidth,
      }}
    >
      <div
        className="border p-4 shadow-2xl"
        style={{
          backgroundColor: "#0A0A0A",
          borderColor: color,
          boxShadow: `0 0 24px ${color}22`,
        }}
      >
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 shrink-0"
            style={{ backgroundColor: color }}
          />
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color }}
          >
            {categoryLabel(event.category)}
          </span>
          {event.section && (
            <span
              className="font-mono text-[10px] tracking-wide ml-auto px-1.5 py-0.5 border"
              style={{
                color,
                borderColor: `${color}44`,
                backgroundColor: `${color}0D`,
              }}
            >
              {event.section}
            </span>
          )}
        </div>

        {/* Year + Title */}
        <p className="font-mono text-xs mb-1" style={{ color: "#888888" }}>
          {event.month
            ? `${event.year}.${String(event.month).padStart(2, "0")}`
            : event.year}
        </p>
        <p className="font-sans text-sm font-bold text-primary leading-snug mb-2">
          {event.title}
        </p>

        {/* Description */}
        <p
          className="text-xs leading-relaxed"
          style={{ color: "#AAAAAA" }}
        >
          {event.description}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* LEGEND                                                              */
/* ------------------------------------------------------------------ */

function Legend({
  activeFilter,
  onFilter,
}: {
  activeFilter: EventCategory | "all"
  onFilter: (f: EventCategory | "all") => void
}) {
  const items: { key: EventCategory | "all"; label: string; color: string }[] = [
    { key: "all", label: "All Events", color: "#FFFFFF" },
    { key: "acquisition", label: "Acquisition", color: "#FFFFFF" },
    { key: "legal", label: "Legislation", color: "#FF9500" },
    { key: "challenge", label: "Legal Challenge", color: "#FF3B30" },
    { key: "milestone", label: "Milestone", color: "#00D4AA" },
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onFilter(item.key)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 border font-mono text-[11px] tracking-wide uppercase transition-all duration-200 cursor-pointer",
            activeFilter === item.key
              ? "opacity-100"
              : "opacity-50 hover:opacity-80"
          )}
          style={{
            borderColor:
              activeFilter === item.key ? item.color : "#2A2A2A",
            backgroundColor:
              activeFilter === item.key ? `${item.color}0D` : "transparent",
            color: item.color,
          }}
        >
          {item.key !== "all" && (
            <span
              className="w-2 h-2 shrink-0"
              style={{ backgroundColor: item.color }}
            />
          )}
          {item.label}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export function LegalTimeline({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)
  const [filter, setFilter] = useState<EventCategory | "all">("all")
  const [isVisible, setIsVisible] = useState(false)

  // Reveal on scroll
  useEffect(() => {
    const el = containerRef.current
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

  const filteredEvents =
    filter === "all"
      ? EVENTS
      : EVENTS.filter((e) => e.category === filter)

  /** Compute horizontal % position of an event */
  const getPosition = useCallback((ev: TimelineEvent) => {
    const totalMonths = (YEAR_MAX - YEAR_MIN) * 12
    const eventMonth = (ev.year - YEAR_MIN) * 12 + (ev.month ?? 6)
    // Pad 3% on each side
    return 3 + (eventMonth / totalMonths) * 94
  }, [])

  /** Stagger vertically to avoid overlaps */
  const getTrack = useCallback(
    (idx: number): number => {
      // Simple alternating rows with extra row for dense clusters
      const positions = filteredEvents.map((e) => getPosition(e))
      const pos = positions[idx]

      // Check how close the previous event is
      let row = idx % 2
      if (idx > 0) {
        const prevPos = positions[idx - 1]
        if (Math.abs(pos - prevPos) < 4) {
          row = idx % 3
        }
      }
      return row
    },
    [filteredEvents, getPosition]
  )

  const handleMouseEnter = useCallback(
    (idx: number, el: HTMLElement) => {
      setHoveredIdx(idx)
      setAnchorRect(el.getBoundingClientRect())
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect())
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null)
    setAnchorRect(null)
  }, [])

  // Year markers from 2013-2025
  const yearMarkers = Array.from(
    { length: YEAR_MAX - YEAR_MIN },
    (_, i) => YEAR_MIN + i
  )

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <p
            className="font-mono text-[11px] tracking-widest uppercase mb-1"
            style={{ color: "var(--accent)" }}
          >
            Legal Chronology
          </p>
          <h3 className="text-lg md:text-xl font-bold text-primary">
            Land Acquisition & Repurposing Timeline
          </h3>
        </div>
        <p
          className="font-mono text-[11px] tracking-wide"
          style={{ color: "#666666" }}
        >
          {YEAR_MIN} &mdash; {YEAR_MAX - 1} | {EVENTS.length} key events
        </p>
      </div>

      {/* Legend / Filter */}
      <Legend activeFilter={filter} onFilter={setFilter} />

      {/* Timeline container */}
      <div
        className="relative border overflow-x-auto overflow-y-visible"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface-sunken)",
        }}
      >
        <div
          ref={trackRef}
          className="relative"
          style={{
            minWidth: 900,
            height: 280,
            padding: "24px 0 36px",
          }}
        >
          {/* Year vertical lines + labels */}
          {yearMarkers.map((year) => {
            const totalMonths = (YEAR_MAX - YEAR_MIN) * 12
            const monthOffset = (year - YEAR_MIN) * 12
            const pct = 3 + (monthOffset / totalMonths) * 94
            return (
              <div
                key={year}
                className="absolute top-0 h-full"
                style={{
                  left: `${pct}%`,
                  width: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="absolute font-mono text-[10px] tracking-wider select-none"
                  style={{
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#555555",
                  }}
                >
                  {year}
                </span>
              </div>
            )
          })}

          {/* Horizontal axis line */}
          <div
            className="absolute"
            style={{
              top: "55%",
              left: "3%",
              right: "3%",
              height: 1,
              backgroundColor: "#2A2A2A",
            }}
          />

          {/* Event nodes */}
          {filteredEvents.map((event, idx) => {
            const pct = getPosition(event)
            const track = getTrack(idx)
            const color = categoryColor(event.category)
            const isHovered = hoveredIdx === idx
            const isAnyHovered = hoveredIdx !== null
            const isCritical = event.category === "challenge"

            // Vertical offset: center at 55%, stagger +/- around it
            const centerY = 55
            const offsets = [-28, 18, -48]
            const topPercent = centerY + offsets[track % offsets.length]

            return (
              <div
                key={`${event.year}-${event.title}`}
                className="absolute cursor-pointer group"
                style={{
                  left: `${pct}%`,
                  top: `${topPercent}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isHovered ? 30 : 10,
                  transition: "opacity 0.2s, transform 0.3s",
                  opacity: isVisible
                    ? isAnyHovered && !isHovered
                      ? 0.35
                      : 1
                    : 0,
                  transitionDelay: isVisible ? `${idx * 60}ms` : "0ms",
                }}
                onMouseEnter={(e) =>
                  handleMouseEnter(idx, e.currentTarget)
                }
                onMouseLeave={handleMouseLeave}
              >
                {/* Vertical connector to axis */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: offsets[track % offsets.length] < 0 ? "100%" : "auto",
                    bottom: offsets[track % offsets.length] >= 0 ? "100%" : "auto",
                    height: `${Math.abs(offsets[track % offsets.length]) - 6}%`,
                    width: 1,
                    backgroundColor: isHovered ? color : "#2A2A2A",
                    transition: "background-color 0.2s",
                    minHeight: 12,
                  }}
                />

                {/* Node */}
                <div
                  className="relative flex flex-col items-center"
                  style={{
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.2s",
                  }}
                >
                  {/* Dot */}
                  <div
                    className="relative"
                    style={{
                      width: isCritical ? 14 : 10,
                      height: isCritical ? 14 : 10,
                    }}
                  >
                    {/* Pulse ring for critical events */}
                    {isCritical && (
                      <div
                        className="absolute inset-0"
                        style={{
                          border: `1px solid ${color}`,
                          opacity: 0.4,
                          animation: "pulse 2s ease-in-out infinite",
                          transform: "scale(1.8)",
                        }}
                      />
                    )}
                    {/* Glow for hovered */}
                    {isHovered && (
                      <div
                        className="absolute inset-0"
                        style={{
                          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}44`,
                          backgroundColor: color,
                          transform: "scale(1.6)",
                          opacity: 0.3,
                        }}
                      />
                    )}
                    <div
                      className="w-full h-full relative"
                      style={{
                        backgroundColor: color,
                        border: `1px solid ${color}`,
                      }}
                    />
                  </div>

                  {/* Year label on node */}
                  <span
                    className="font-mono text-[10px] tracking-wider mt-1 whitespace-nowrap select-none"
                    style={{
                      color: isHovered ? color : "#666666",
                      transition: "color 0.2s",
                    }}
                  >
                    {event.month
                      ? `${event.year}.${String(event.month).padStart(2, "0")}`
                      : event.year}
                  </span>

                  {/* Short title */}
                  <span
                    className="font-mono text-[9px] tracking-wide mt-0.5 max-w-[100px] text-center whitespace-nowrap overflow-hidden text-ellipsis select-none"
                    style={{
                      color: isHovered ? "#E5E5E5" : "#444444",
                      transition: "color 0.2s",
                    }}
                  >
                    {event.title}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tooltip rendered at container level */}
        {hoveredIdx !== null && anchorRect && containerRect && (
          <EventTooltip
            event={filteredEvents[hoveredIdx]}
            anchorRect={anchorRect}
            containerRect={containerRect}
          />
        )}

        {/* Scroll hint for mobile */}
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 md:hidden pointer-events-none"
          style={{ opacity: 0.4 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888888"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span
            className="font-mono text-[8px] tracking-widest uppercase"
            style={{ color: "#666666" }}
          >
            Scroll
          </span>
        </div>
      </div>

      {/* Section 99 callout */}
      <div
        className="mt-6 border-l-2 pl-5 py-3"
        style={{ borderColor: "#FF3B30" }}
      >
        <p
          className="font-mono text-[10px] tracking-widest uppercase mb-1"
          style={{ color: "#FF3B30" }}
        >
          Critical Compliance Gap
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#AAAAAA" }}>
          Section 99 of the LARR Act explicitly prohibits changing the purpose
          of land acquisition. The 2017 judicial commitment to "green pharma"
          usage directly conflicts with the 2024 multi-sector Future City
          announcement, creating the project&apos;s most significant legal barrier.
        </p>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1.8); }
          50% { opacity: 0.15; transform: scale(2.4); }
        }
      `}</style>
    </div>
  )
}
