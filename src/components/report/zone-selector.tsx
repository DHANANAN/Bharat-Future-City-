"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Building2,
  Factory,
  Wheat,
  X,
  MapPin,
  TrendingUp,
  Users,
  Banknote,
  ChevronRight,
  Layers,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface ZoneProject {
  name: string
  type: string
}

interface ZoneData {
  id: string
  label: string
  fullName: string
  tagline: string
  color: string
  icon: "building" | "factory" | "wheat"
  boundary: string
  strategicFunction: string
  focusSectors: string[]
  keyProjects: ZoneProject[]
  investmentRange: string
  employmentProjection: string
  gdpContribution: string
  description: string
}

const ZONES: ZoneData[] = [
  {
    id: "cure",
    label: "CURE",
    fullName: "Core Urban Region Economy",
    tagline: "Services-led global metropolis",
    color: "#FFFFFF",
    icon: "building",
    boundary: "Within 160-km Outer Ring Road (ORR)",
    strategicFunction:
      "Net-zero services-led global metropolis focused on high-value knowledge economy sectors. Hyderabad's dense urban core driving IT, finance, and innovation.",
    focusSectors: ["IT & Software Services", "Financial Services", "R&D & Innovation", "Education & Skilling"],
    keyProjects: [
      { name: "HITEC City Corridor", type: "IT/ITES Hub" },
      { name: "T-Hub", type: "Startup Incubator" },
      { name: "Financial District", type: "Finance Hub" },
      { name: "Genome Valley", type: "Biotech R&D" },
    ],
    investmentRange: "Existing + Incremental growth",
    employmentProjection: "905,715+ IT/ITES employees (current)",
    gdpContribution: "~14% of Hyderabad's GDP (2021)",
    description:
      "The CURE zone encompasses Hyderabad's established economic engine within the Outer Ring Road. It positions the city as a net-zero services-led global metropolis, leveraging existing infrastructure like HITEC City (generating $32B in IT exports) and T-Hub (2,000+ startups). Focus is on densification, transit-oriented development, and maintaining global competitiveness in IT, finance, and R&D sectors.",
  },
  {
    id: "pure",
    label: "PURE",
    fullName: "Peri-Urban Region Economy",
    tagline: "Manufacturing & logistics powerhouse",
    color: "#FF3B30",
    icon: "factory",
    boundary: "Between ORR and 360-km Regional Ring Road (RRR)",
    strategicFunction:
      "Large-scale manufacturing, logistics, and industrial expansion corridor. Directly addresses Hyderabad's western corridor saturation with new economic geography.",
    focusSectors: [
      "Advanced Manufacturing",
      "EV & Green Energy",
      "Pharma & Biotech",
      "AI & Deep Tech",
      "Aerospace & Defence",
      "Medical Tourism",
    ],
    keyProjects: [
      { name: "Bharat Future City", type: "30,000-acre Net-Zero Smart City" },
      { name: "AI City", type: "Artificial Intelligence Hub" },
      { name: "Green Pharma Zone", type: "Sustainable Pharma Manufacturing" },
      { name: "EV Manufacturing Cluster", type: "Electric Vehicle Production" },
      { name: "Young India Skills University", type: "Education & Workforce Hub" },
      { name: "Sports Zone & Healthcare", type: "Integrated Services" },
    ],
    investmentRange: "Rs. 5.75 lakh crore pledged (2025 Summit)",
    employmentProjection: "500,000+ jobs targeted by 2047",
    gdpContribution: "Primary engine for 10% national GDP target",
    description:
      "The PURE zone is where Bharat Future City — India's most ambitious greenfield urban development — anchors Telangana's industrial transformation. Located 35 km south of Hyderabad between NH-765 and SH-19, the 30,000-acre net-zero smart city houses seven integrated economic zones. Metro Corridor IX (39.6 km) will connect it to the airport and CURE zone, while the RRR provides freight bypass capabilities and dry ports enable customs clearance.",
  },
  {
    id: "rare",
    label: "RARE",
    fullName: "Rural Agri Region Economy",
    tagline: "Agriculture & green economy frontier",
    color: "#00D4AA",
    icon: "wheat",
    boundary: "Beyond 360-km Regional Ring Road (RRR)",
    strategicFunction:
      "Agricultural modernization, green economy development, and agro-industrial value chains. Ensures inclusive growth reaches rural Telangana.",
    focusSectors: [
      "Modern Agriculture",
      "Agro-Processing",
      "Green Energy Generation",
      "Rural Digital Infrastructure",
    ],
    keyProjects: [
      { name: "Agro-Industrial Corridors", type: "Value Chain Hubs" },
      { name: "Rural Digital Network", type: "Connectivity Infrastructure" },
      { name: "Green Energy Parks", type: "Solar & Wind Farms" },
      { name: "Food Processing Clusters", type: "Agro-Processing" },
    ],
    investmentRange: "State budget + PPP allocations",
    employmentProjection: "Agricultural workforce modernization",
    gdpContribution: "Agriculture & allied sectors backbone",
    description:
      "The RARE zone extends across Telangana's vast rural geography beyond the Regional Ring Road. It focuses on transforming agricultural productivity through modernization, agro-processing value chains, and green economy initiatives. This zone ensures that Vision 2047's growth reaches every district, connecting rural economies to the PURE zone's manufacturing output and CURE zone's services demand through digital infrastructure and logistics networks.",
  },
]

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function ZoneIcon({ type, size = 28 }: { type: ZoneData["icon"]; size?: number }) {
  const props = {
    size,
    strokeWidth: 2,
    style: { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" },
  }
  if (type === "building") return <Building2 {...props} />
  if (type === "factory") return <Factory {...props} />
  return <Wheat {...props} />
}

function StatRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof MapPin
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="mt-0.5 shrink-0" style={{ color }}>
        <Icon size={16} strokeWidth={2} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.18))" }} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </p>
        <p className="text-sm leading-relaxed mt-0.5" style={{ color: "var(--foreground)" }}>
          {value}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Detail Panel                                                        */
/* ------------------------------------------------------------------ */

function ZoneDetail({ zone, onClose }: { zone: ZoneData; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className="border animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{
        backgroundColor: "var(--card)",
        borderColor: zone.color,
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center border"
            style={{ borderColor: zone.color, color: zone.color }}
          >
            <ZoneIcon type={zone.icon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider" style={{ color: zone.color }}>
                {zone.label}
              </span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {zone.fullName}
              </span>
            </div>
            <p className="font-mono text-[10px] tracking-wider uppercase mt-0.5" style={{ color: "var(--text-dim)" }}>
              {zone.tagline}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 border cursor-pointer transition-colors duration-150"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = zone.color
            e.currentTarget.style.color = zone.color
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)"
            e.currentTarget.style.color = "var(--muted-foreground)"
          }}
          aria-label="Close zone detail"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px" style={{ backgroundColor: "var(--border)" }}>
        {/* Left column — narrative & stats */}
        <div className="lg:col-span-5 p-5" style={{ backgroundColor: "var(--card)" }}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--foreground)" }}>
            {zone.description}
          </p>

          <StatRow icon={MapPin} label="Geographic Boundary" value={zone.boundary} color={zone.color} />
          <StatRow icon={TrendingUp} label="GDP / Economic Role" value={zone.gdpContribution} color={zone.color} />
          <StatRow icon={Users} label="Employment" value={zone.employmentProjection} color={zone.color} />
          <StatRow icon={Banknote} label="Investment" value={zone.investmentRange} color={zone.color} />
        </div>

        {/* Right column — sectors & projects */}
        <div className="lg:col-span-7 p-5" style={{ backgroundColor: "var(--surface-sunken)" }}>
          {/* Focus sectors */}
          <div className="mb-6">
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-3"
              style={{ color: "var(--muted-foreground)" }}
            >
              Focus Sectors
            </p>
            <div className="flex flex-wrap gap-2">
              {zone.focusSectors.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-mono border"
                  style={{ borderColor: zone.color + "44", color: zone.color, backgroundColor: zone.color + "0D" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Key projects */}
          <div>
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-3"
              style={{ color: "var(--muted-foreground)" }}
            >
              Key Projects
            </p>
            <div className="space-y-0 border-t" style={{ borderColor: "var(--border)" }}>
              {zone.keyProjects.map((p, i) => {
                const isPrimary = p.name === "Bharat Future City"
                return (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 px-3 py-2.5 border-b transition-colors duration-150"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: isPrimary ? zone.color + "0D" : "transparent",
                    }}
                  >
                    <span
                      className="font-mono text-[10px] w-5 text-center shrink-0"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ChevronRight size={12} style={{ color: zone.color }} className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isPrimary ? zone.color : "var(--foreground)" }}
                      >
                        {p.name}
                      </span>
                      <span className="text-xs ml-2" style={{ color: "var(--text-dim)" }}>
                        {p.type}
                      </span>
                    </div>
                    {isPrimary && (
                      <span
                        className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase shrink-0 border"
                        style={{ borderColor: zone.color, color: zone.color }}
                      >
                        Anchor
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic function footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: zone.color }}>
          Strategic Function
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {zone.strategicFunction}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Concentric Ring Diagram (SVG)                                       */
/* ------------------------------------------------------------------ */

function ConcentricDiagram({
  activeZone,
  hoveredZone,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  activeZone: string | null
  hoveredZone: string | null
  onSelect: (id: string) => void
  onHover: (id: string) => void
  onHoverEnd: () => void
}) {
  const cx = 200
  const cy = 200
  const rings = [
    { id: "cure", r: 60, label: "CURE", color: "#FFFFFF" },
    { id: "pure", r: 120, label: "PURE", color: "#FF3B30" },
    { id: "rare", r: 175, label: "RARE", color: "#00D4AA" },
  ]

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-[360px] mx-auto"
      role="img"
      aria-label="CURE-PURE-RARE concentric zone diagram"
    >
      {/* Grid lines */}
      <line x1="0" y1="200" x2="400" y2="200" stroke="var(--grid-line)" strokeWidth="1" />
      <line x1="200" y1="0" x2="200" y2="400" stroke="var(--grid-line)" strokeWidth="1" />
      <line x1="58" y1="58" x2="342" y2="342" stroke="var(--grid-line)" strokeWidth="0.5" />
      <line x1="342" y1="58" x2="58" y2="342" stroke="var(--grid-line)" strokeWidth="0.5" />

      {/* Rings — outer to inner */}
      {[...rings].reverse().map((ring) => {
        const isActive = activeZone === ring.id
        const isHovered = hoveredZone === ring.id
        const highlighted = isActive || isHovered
        return (
          <g key={ring.id}>
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill={highlighted ? ring.color + "12" : "transparent"}
              stroke={ring.color}
              strokeWidth={highlighted ? 2 : 1}
              opacity={highlighted ? 1 : 0.4}
              className="transition-all duration-300 cursor-pointer"
              style={{ outline: "none" }}
              onClick={() => onSelect(ring.id)}
              onMouseEnter={() => onHover(ring.id)}
              onMouseLeave={onHoverEnd}
              tabIndex={0}
              role="button"
              aria-label={`Select ${ring.label} zone`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(ring.id)
                }
              }}
            />
            {/* Dashed ring for emphasis when active */}
            {isActive && (
              <circle
                cx={cx}
                cy={cy}
                r={ring.r + 6}
                fill="none"
                stroke={ring.color}
                strokeWidth={0.5}
                strokeDasharray="4 4"
                opacity={0.5}
                className="pointer-events-none"
              />
            )}
          </g>
        )
      })}

      {/* Center dot — Hyderabad */}
      <circle cx={cx} cy={cy} r={4} fill="var(--foreground)" />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        className="font-mono"
        fill="var(--muted-foreground)"
        fontSize="8"
        letterSpacing="0.1em"
      >
        HYDERABAD
      </text>

      {/* Zone labels */}
      {rings.map((ring) => {
        const isActive = activeZone === ring.id
        const isHovered = hoveredZone === ring.id
        const highlighted = isActive || isHovered
        // Position label on the right side of each ring
        const labelX = cx + ring.r * 0.7
        const labelY = cy - ring.r * 0.7
        return (
          <g
            key={ring.id + "-label"}
            className="cursor-pointer"
            onClick={() => onSelect(ring.id)}
            onMouseEnter={() => onHover(ring.id)}
            onMouseLeave={onHoverEnd}
          >
            <text
              x={labelX}
              y={labelY}
              textAnchor="start"
              className="font-mono"
              fill={ring.color}
              fontSize={highlighted ? "13" : "11"}
              fontWeight={highlighted ? "700" : "500"}
              letterSpacing="0.15em"
              opacity={highlighted ? 1 : 0.6}
              style={{ transition: "all 0.2s ease" }}
            >
              {ring.label}
            </text>
          </g>
        )
      })}

      {/* BFC marker in PURE zone */}
      <g>
        <circle cx={cx - 30} cy={cy + 85} r={3} fill="#FF3B30" />
        <circle cx={cx - 30} cy={cy + 85} r={7} fill="none" stroke="#FF3B30" strokeWidth={0.5} opacity={0.5} />
        <text
          x={cx - 30}
          y={cy + 100}
          textAnchor="middle"
          className="font-mono"
          fill="#FF3B30"
          fontSize="7"
          letterSpacing="0.08em"
          fontWeight="700"
        >
          BFC
        </text>
      </g>

      {/* ORR label */}
      <text
        x={cx + 48}
        y={cy + 8}
        className="font-mono"
        fill="var(--text-dim)"
        fontSize="6"
        letterSpacing="0.08em"
      >
        ORR (160km)
      </text>

      {/* RRR label */}
      <text
        x={cx + 95}
        y={cy + 8}
        className="font-mono"
        fill="var(--text-dim)"
        fontSize="6"
        letterSpacing="0.08em"
      >
        RRR (360km)
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Zone Grid Cards                                                     */
/* ------------------------------------------------------------------ */

function ZoneCard({
  zone,
  isActive,
  isHovered,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  zone: ZoneData
  isActive: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: () => void
  onHoverEnd: () => void
}) {
  const highlighted = isActive || isHovered

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className="relative flex flex-col items-start p-5 border text-left cursor-pointer transition-all duration-200 w-full focus:outline-none"
      style={{
        borderColor: highlighted ? zone.color : "var(--border)",
        backgroundColor: highlighted ? zone.color + "0A" : "var(--surface-sunken)",
      }}
      aria-pressed={isActive}
      aria-label={`${zone.label}: ${zone.fullName}`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-0.5 transition-all duration-300"
        style={{
          backgroundColor: zone.color,
          width: highlighted ? "100%" : "0%",
        }}
      />

      <div className="flex items-center gap-3 mb-3 w-full">
        <div
          className="w-10 h-10 flex items-center justify-center border transition-colors duration-200"
          style={{
            borderColor: highlighted ? zone.color : "var(--border)",
            color: highlighted ? zone.color : "var(--muted-foreground)",
          }}
        >
          <ZoneIcon type={zone.icon} size={20} />
        </div>
        <div className="min-w-0">
          <p
            className="font-mono text-base font-bold tracking-wider transition-colors duration-200"
            style={{ color: highlighted ? zone.color : "var(--foreground)" }}
          >
            {zone.label}
          </p>
          <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "var(--text-dim)" }}>
            {zone.fullName}
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {zone.tagline}
      </p>

      {/* Indicator dot */}
      {isActive && (
        <div className="absolute top-3 right-3 w-1.5 h-1.5" style={{ backgroundColor: zone.color }} />
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export function ZoneSelector() {
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback(
    (id: string) => {
      setActiveZone((prev) => (prev === id ? null : id))
    },
    []
  )

  const handleHover = useCallback((id: string) => {
    setHoveredZone(id)
  }, [])

  const handleHoverEnd = useCallback(() => {
    setHoveredZone(null)
  }, [])

  const activeData = ZONES.find((z) => z.id === activeZone) ?? null

  // Scroll detail into view when opened
  useEffect(() => {
    if (activeData && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [activeData])

  return (
    <div className="w-full">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <Layers size={14} style={{ color: "var(--accent)" }} />
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--accent)" }}>
          CURE-PURE-RARE Spatial Framework
        </p>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
        <p className="font-mono text-[10px]" style={{ color: "var(--text-dim)" }}>
          Click a zone to explore
        </p>
      </div>

      {/* Two-column layout: diagram + cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px" style={{ backgroundColor: "var(--border)" }}>
        {/* SVG Diagram */}
        <div
          className="lg:col-span-5 flex items-center justify-center p-6"
          style={{ backgroundColor: "var(--surface-sunken)" }}
        >
          <ConcentricDiagram
            activeZone={activeZone}
            hoveredZone={hoveredZone}
            onSelect={handleSelect}
            onHover={handleHover}
            onHoverEnd={handleHoverEnd}
          />
        </div>

        {/* Zone cards */}
        <div
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-px"
          style={{ backgroundColor: "var(--border)" }}
        >
          {ZONES.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isActive={activeZone === zone.id}
              isHovered={hoveredZone === zone.id}
              onSelect={() => handleSelect(zone.id)}
              onHover={() => handleHover(zone.id)}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>

      {/* Detail expansion panel */}
      <div ref={detailRef}>
        {activeData && (
          <div className="mt-px">
            <ZoneDetail zone={activeData} onClose={() => setActiveZone(null)} />
          </div>
        )}
      </div>
    </div>
  )
}
