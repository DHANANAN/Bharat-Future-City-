"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  X,
  TrainFront,
  Route,
  Warehouse,
  Ship,
  ChevronRight,
  Layers,
  Clock,
  Target,
  Ruler,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────
type LayerKey = "rrr" | "metro" | "dryPorts" | "expressway" | "radialRoads" | "ewTrunk"

interface InfraItem {
  id: string
  layer: LayerKey
  name: string
  shortName: string
  specs: string
  strategicFunction: string
  timelinePhase: string
  details: string[]
}

// ─── Data ───────────────────────────────────────────────────────────────────
const LAYERS: Record<LayerKey, { label: string; color: string; icon: typeof Route }> = {
  rrr: { label: "Regional Ring Road", color: "#FFFFFF", icon: Route },
  metro: { label: "Metro Corridors", color: "#00D4AA", icon: TrainFront },
  dryPorts: { label: "Dry Ports", color: "#FF9500", icon: Warehouse },
  expressway: { label: "Port Expressway", color: "#FF3B30", icon: Ship },
  radialRoads: { label: "Radial Road Grid", color: "#888888", icon: Route },
  ewTrunk: { label: "East-West Trunk", color: "#6B8AFF", icon: Route },
}

const INFRA_ITEMS: InfraItem[] = [
  {
    id: "rrr",
    layer: "rrr",
    name: "Regional Ring Road (RRR)",
    shortName: "RRR",
    specs: "360 km, connects all major national highways",
    strategicFunction: "Freight decongestion bypass for CURE zone",
    timelinePhase: "2026 - 2030",
    details: [
      "Serves as the outer boundary defining the PURE zone",
      "Enables heavy freight to bypass core urban Hyderabad",
      "Connects NH-44, NH-65, NH-765, and NH-163",
      "Provides direct access to Bharat Future City from all directions",
      "Reduces estimated urban freight transit time by 45%",
    ],
  },
  {
    id: "metro-ix",
    layer: "metro",
    name: "Metro Phase II Corridor IX",
    shortName: "Corridor IX",
    specs: "39.6 km: Airport to Bharat Future City",
    strategicFunction: "High-speed transit linking global gateway to economic hub",
    timelinePhase: "2027 - 2032",
    details: [
      "Connects Rajiv Gandhi International Airport to BFC",
      "Estimated 18 stations along the corridor",
      "Expected daily ridership of 450,000+ by 2035",
      "Provides CURE zone workforce direct access to PURE zone jobs",
      "Integration with existing Metro Phase I at Mindspace Junction",
    ],
  },
  {
    id: "dry-port-gudibanda",
    layer: "dryPorts",
    name: "Dry Port - Gudibanda (Mahbubnagar)",
    shortName: "Gudibanda",
    specs: "Inland Container Depot with customs clearance",
    strategicFunction: "Customs clearance and freight aggregation hub",
    timelinePhase: "2029 - 2035",
    details: [
      "Full customs clearance facility reducing port congestion",
      "Container freight station with 500,000 TEU annual capacity",
      "Direct rail connectivity to Machilipatnam port",
      "Bonded warehouse facilities for export-oriented manufacturing",
      "Reduces logistics cost for BFC industries by estimated 18%",
    ],
  },
  {
    id: "dry-port-nalgonda",
    layer: "dryPorts",
    name: "Dry Port - Nalgonda",
    shortName: "Nalgonda",
    specs: "Secondary freight aggregation and distribution center",
    strategicFunction: "Eastern corridor logistics node",
    timelinePhase: "2030 - 2035",
    details: [
      "Serves eastern PURE zone manufacturing clusters",
      "Integrated with NH-65 and the Regional Ring Road",
      "Cold storage facilities for Green Pharma zone exports",
      "Customs clearance for electronics and EV components",
      "Combined capacity with Gudibanda of 800,000+ TEU annually",
    ],
  },
  {
    id: "expressway",
    layer: "expressway",
    name: "Machilipatnam Port Expressway",
    shortName: "Port Expressway",
    specs: "Greenfield highway to Bandar Port",
    strategicFunction: "Direct sea link for manufacturing exports",
    timelinePhase: "2030 - 2038",
    details: [
      "Greenfield 4+4 lane expressway with expandable median",
      "Connects BFC directly to Machilipatnam (Bandar) port",
      "Reduces transit time to sea port from 8+ hours to 3 hours",
      "Dedicated freight lanes for heavy cargo movement",
      "Enables 'Global Value Center' logistics operations from BFC",
    ],
  },
  {
    id: "radial-roads",
    layer: "radialRoads",
    name: "Radial Road Grid",
    shortName: "Radial Grid",
    specs: "Multiple routes connecting ORR to RRR",
    strategicFunction: "Prevent bottlenecks, efficient goods distribution",
    timelinePhase: "2026 - 2035",
    details: [
      "8 radial corridors connecting ORR to RRR",
      "Each corridor designed as 4-lane divided highway",
      "Prevents single-point-of-failure in road network",
      "Serves both passenger and freight traffic",
      "Phased construction aligned with zone activation sequence",
    ],
  },
  {
    id: "ew-trunk",
    layer: "ewTrunk",
    name: "East-West Trunk Road",
    shortName: "E-W Trunk",
    specs: "Links NH-765 (Srisailam) to SH-19 (Nagarjunasagar)",
    strategicFunction: "Internal Bharat Future City corridor",
    timelinePhase: "2028 - 2032",
    details: [
      "Primary internal artery within Bharat Future City",
      "Connects AI City, EV Manufacturing, and Green Pharma zones",
      "Grade-separated interchanges at all major zone entry points",
      "Integrated smart traffic management system",
      "Links directly to RRR and port expressway corridors",
    ],
  },
]

// ─── SVG Map Geometry ───────────────────────────────────────────────────────
// Schematic map: Hyderabad center, ORR inner ring, RRR outer ring,
// BFC zone to the south, with infrastructure paths drawn as wireframe lines.

const MAP_WIDTH = 800
const MAP_HEIGHT = 600

// Center of Hyderabad
const HYD_CENTER = { x: 400, y: 230 }
const ORR_RX = 110
const ORR_RY = 90
const RRR_RX = 260
const RRR_RY = 210

// BFC zone (south of Hyderabad, within PURE zone)
const BFC_CENTER = { x: 400, y: 430 }
const BFC_W = 160
const BFC_H = 80

// Airport location (southwest)
const AIRPORT = { x: 240, y: 340 }

// Dry port locations
const GUDIBANDA = { x: 200, y: 500 }
const NALGONDA = { x: 600, y: 470 }

// Machilipatnam (east, off-map direction)
const MACHILIPATNAM = { x: 760, y: 550 }

// ─── Component ──────────────────────────────────────────────────────────────
export function InfrastructureMap() {
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    new Set(["rrr", "metro", "dryPorts", "expressway", "radialRoads", "ewTrunk"])
  )
  const [selectedItem, setSelectedItem] = useState<InfraItem | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const toggleLayer = useCallback((key: LayerKey) => {
    setActiveLayers((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        // If the selected item belongs to this layer, deselect
        if (selectedItem?.layer === key) setSelectedItem(null)
      } else {
        next.add(key)
      }
      return next
    })
  }, [selectedItem])

  const handleItemClick = useCallback((item: InfraItem) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item))
  }, [])

  // Close sidebar on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const isLayerActive = useCallback(
    (key: LayerKey) => activeLayers.has(key),
    [activeLayers]
  )

  const isItemHighlighted = useCallback(
    (id: string) => selectedItem?.id === id,
    [selectedItem]
  )

  const getLayerOpacity = useCallback(
    (key: LayerKey) => {
      if (!activeLayers.has(key)) return 0
      if (selectedItem && selectedItem.layer !== key) return 0.25
      return 1
    },
    [activeLayers, selectedItem]
  )

  // Radial road endpoints (8 directions from ORR to RRR)
  const radialEndpoints = useMemo(() => {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315]
    return angles.map((deg) => {
      const rad = (deg * Math.PI) / 180
      return {
        x1: HYD_CENTER.x + ORR_RX * Math.cos(rad),
        y1: HYD_CENTER.y + ORR_RY * Math.sin(rad),
        x2: HYD_CENTER.x + RRR_RX * Math.cos(rad),
        y2: HYD_CENTER.y + RRR_RY * Math.sin(rad),
      }
    })
  }, [])

  return (
    <div className="relative border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}>
      {/* Corner markers (brutalist) */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "var(--accent)" }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: "var(--accent)" }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: "var(--accent)" }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: "var(--accent)" }} />

      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="flex items-center gap-3">
          <Layers size={14} style={{ color: "var(--accent)" }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            Infrastructure Map
          </span>
        </div>
        <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
          {activeLayers.size}/{Object.keys(LAYERS).length} layers
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ─── Main Map Area ─── */}
        <div className="flex-1 relative">
          {/* Layer toggles (horizontal, above map) */}
          <div
            className="flex flex-wrap gap-2 px-4 py-3 border-b"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            {(Object.entries(LAYERS) as [LayerKey, (typeof LAYERS)[LayerKey]][]).map(
              ([key, layer]) => {
                const active = isLayerActive(key)
                const Icon = layer.icon
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleLayer(key)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 border font-mono text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer",
                      "hover:brightness-110"
                    )}
                    style={{
                      borderColor: active ? layer.color : "var(--border)",
                      backgroundColor: active ? `${layer.color}12` : "transparent",
                      color: active ? layer.color : "var(--text-dim)",
                      opacity: active ? 1 : 0.72,
                    }}
                  >
                    <Icon size={13} strokeWidth={2.2} />
                    <span className="hidden sm:inline">{layer.label}</span>
                    <span className="sm:hidden">{key === "expressway" ? "Port" : key === "radialRoads" ? "Radial" : key === "ewTrunk" ? "E-W" : layer.label.split(" ")[0]}</span>
                  </button>
                )
              }
            )}
          </div>

          {/* SVG Map */}
          <div className="relative overflow-hidden" style={{ backgroundColor: "var(--surface-sunken)" }}>
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="w-full h-auto"
              style={{ minHeight: "380px", maxHeight: "520px" }}
              role="img"
              aria-label="Schematic infrastructure map of the Bharat Future City region showing highways, metro corridors, dry ports, and expressways"
            >
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
                {/* Glow filter for highlighted elements */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-strong">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

              {/* Zone labels (always visible) */}
              <text x={HYD_CENTER.x} y={50} textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="11" fontFamily="monospace" letterSpacing="4">
                CURE ZONE
              </text>
              <text x={HYD_CENTER.x} y={148} textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="11" fontFamily="monospace" letterSpacing="4">
                PURE ZONE
              </text>

              {/* ── ORR (always visible, faded) ── */}
              <ellipse
                cx={HYD_CENTER.x}
                cy={HYD_CENTER.y}
                rx={ORR_RX}
                ry={ORR_RY}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={HYD_CENTER.x + ORR_RX + 8}
                y={HYD_CENTER.y - 10}
                fill="rgba(255,255,255,0.2)"
                fontSize="9"
                fontFamily="monospace"
              >
                ORR
              </text>

              {/* Hyderabad center marker */}
              <circle cx={HYD_CENTER.x} cy={HYD_CENTER.y} r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx={HYD_CENTER.x} cy={HYD_CENTER.y} r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <text
                x={HYD_CENTER.x}
                y={HYD_CENTER.y - 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                HYDERABAD
              </text>

              {/* Airport marker */}
              <g opacity={0.4}>
                <rect x={AIRPORT.x - 8} y={AIRPORT.y - 8} width="16" height="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1={AIRPORT.x - 4} y1={AIRPORT.y} x2={AIRPORT.x + 4} y2={AIRPORT.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <line x1={AIRPORT.x} y1={AIRPORT.y - 4} x2={AIRPORT.x} y2={AIRPORT.y + 4} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <text x={AIRPORT.x} y={AIRPORT.y - 14} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
                  RGIA
                </text>
              </g>

              {/* ── Layer: Regional Ring Road ── */}
              <g
                style={{
                  opacity: getLayerOpacity("rrr"),
                  transition: "opacity 0.4s ease",
                }}
              >
                <ellipse
                  cx={HYD_CENTER.x}
                  cy={HYD_CENTER.y}
                  rx={RRR_RX}
                  ry={RRR_RY}
                  fill="none"
                  stroke={LAYERS.rrr.color}
                  strokeWidth={isItemHighlighted("rrr") ? "3" : "1.5"}
                  strokeDasharray={isItemHighlighted("rrr") ? "none" : "12 6"}
                  filter={isItemHighlighted("rrr") ? "url(#glow)" : undefined}
                  className="cursor-pointer"
                  onClick={() => handleItemClick(INFRA_ITEMS[0])}
                  onMouseEnter={() => setHoveredItem("rrr")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ transition: "stroke-width 0.3s ease" }}
                />
                <text
                  x={HYD_CENTER.x + RRR_RX + 6}
                  y={HYD_CENTER.y - 30}
                  fill={LAYERS.rrr.color}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  opacity={isItemHighlighted("rrr") ? 1 : 0.7}
                >
                  RRR
                </text>
                <text
                  x={HYD_CENTER.x + RRR_RX + 6}
                  y={HYD_CENTER.y - 18}
                  fill={LAYERS.rrr.color}
                  fontSize="7"
                  fontFamily="monospace"
                  opacity={0.5}
                >
                  360 km
                </text>
              </g>

              {/* ── Layer: Radial Roads ── */}
              <g
                style={{
                  opacity: getLayerOpacity("radialRoads"),
                  transition: "opacity 0.4s ease",
                }}
              >
                {radialEndpoints.map((ep, i) => (
                  <line
                    key={`radial-${i}`}
                    x1={ep.x1}
                    y1={ep.y1}
                    x2={ep.x2}
                    y2={ep.y2}
                    stroke={LAYERS.radialRoads.color}
                    strokeWidth={isItemHighlighted("radial-roads") ? "2" : "0.8"}
                    strokeDasharray="4 4"
                    className="cursor-pointer"
                    onClick={() => handleItemClick(INFRA_ITEMS[5])}
                    onMouseEnter={() => setHoveredItem("radial-roads")}
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                ))}
              </g>

              {/* ── Layer: Metro Corridor IX ── */}
              <g
                style={{
                  opacity: getLayerOpacity("metro"),
                  transition: "opacity 0.4s ease",
                }}
              >
                <path
                  d={`M ${AIRPORT.x},${AIRPORT.y} Q ${320},${390} ${BFC_CENTER.x},${BFC_CENTER.y - BFC_H / 2}`}
                  fill="none"
                  stroke={LAYERS.metro.color}
                  strokeWidth={isItemHighlighted("metro-ix") ? "3.5" : "2"}
                  strokeDasharray={isItemHighlighted("metro-ix") ? "none" : "8 4"}
                  filter={isItemHighlighted("metro-ix") ? "url(#glow)" : undefined}
                  className="cursor-pointer"
                  onClick={() => handleItemClick(INFRA_ITEMS[1])}
                  onMouseEnter={() => setHoveredItem("metro-ix")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ transition: "stroke-width 0.3s ease" }}
                />
                {/* Station dots along metro */}
                {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t) => {
                  // Quadratic bezier interpolation for station placement
                  const px = (1 - t) * (1 - t) * AIRPORT.x + 2 * (1 - t) * t * 320 + t * t * BFC_CENTER.x
                  const py = (1 - t) * (1 - t) * AIRPORT.y + 2 * (1 - t) * t * 390 + t * t * (BFC_CENTER.y - BFC_H / 2)
                  return (
                    <circle
                      key={`station-${t}`}
                      cx={px}
                      cy={py}
                      r="2.5"
                      fill={LAYERS.metro.color}
                      opacity={isItemHighlighted("metro-ix") ? 1 : 0.6}
                    />
                  )
                })}
                <text
                  x={290}
                  y={370}
                  fill={LAYERS.metro.color}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  transform="rotate(-55, 290, 370)"
                  opacity={isItemHighlighted("metro-ix") ? 1 : 0.7}
                >
                  CORRIDOR IX
                </text>
              </g>

              {/* ── Layer: East-West Trunk ── */}
              <g
                style={{
                  opacity: getLayerOpacity("ewTrunk"),
                  transition: "opacity 0.4s ease",
                }}
              >
                <line
                  x1={BFC_CENTER.x - BFC_W - 30}
                  y1={BFC_CENTER.y}
                  x2={BFC_CENTER.x + BFC_W + 30}
                  y2={BFC_CENTER.y}
                  stroke={LAYERS.ewTrunk.color}
                  strokeWidth={isItemHighlighted("ew-trunk") ? "3" : "1.5"}
                  strokeDasharray={isItemHighlighted("ew-trunk") ? "none" : "10 5"}
                  filter={isItemHighlighted("ew-trunk") ? "url(#glow)" : undefined}
                  className="cursor-pointer"
                  onClick={() => handleItemClick(INFRA_ITEMS[6])}
                  onMouseEnter={() => setHoveredItem("ew-trunk")}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                <text
                  x={BFC_CENTER.x - BFC_W - 40}
                  y={BFC_CENTER.y - 8}
                  fill={LAYERS.ewTrunk.color}
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="end"
                  opacity={0.6}
                >
                  NH-765
                </text>
                <text
                  x={BFC_CENTER.x + BFC_W + 40}
                  y={BFC_CENTER.y - 8}
                  fill={LAYERS.ewTrunk.color}
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="start"
                  opacity={0.6}
                >
                  SH-19
                </text>
              </g>

              {/* ── BFC Zone (always visible) ── */}
              <rect
                x={BFC_CENTER.x - BFC_W}
                y={BFC_CENTER.y - BFC_H}
                width={BFC_W * 2}
                height={BFC_H * 2}
                fill="rgba(255, 59, 48, 0.04)"
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* BFC zone internal grid */}
              {[0.33, 0.66].map((frac) => (
                <line
                  key={`bfc-v-${frac}`}
                  x1={BFC_CENTER.x - BFC_W + BFC_W * 2 * frac}
                  y1={BFC_CENTER.y - BFC_H}
                  x2={BFC_CENTER.x - BFC_W + BFC_W * 2 * frac}
                  y2={BFC_CENTER.y + BFC_H}
                  stroke="rgba(255, 59, 48, 0.08)"
                  strokeWidth="0.5"
                />
              ))}
              <line
                x1={BFC_CENTER.x - BFC_W}
                y1={BFC_CENTER.y}
                x2={BFC_CENTER.x + BFC_W}
                y2={BFC_CENTER.y}
                stroke="rgba(255, 59, 48, 0.08)"
                strokeWidth="0.5"
              />

              {/* BFC zone labels */}
              <text
                x={BFC_CENTER.x}
                y={BFC_CENTER.y - BFC_H - 10}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="3"
              >
                BHARAT FUTURE CITY
              </text>
              <text
                x={BFC_CENTER.x}
                y={BFC_CENTER.y - BFC_H - 0}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="7"
                fontFamily="monospace"
                opacity="0.5"
              >
                30,000 ACRES
              </text>

              {/* BFC internal zone labels */}
              {[
                { label: "AI", x: BFC_CENTER.x - BFC_W * 0.66, y: BFC_CENTER.y - BFC_H * 0.45 },
                { label: "EV", x: BFC_CENTER.x, y: BFC_CENTER.y - BFC_H * 0.45 },
                { label: "PHARMA", x: BFC_CENTER.x + BFC_W * 0.66, y: BFC_CENTER.y - BFC_H * 0.45 },
                { label: "EDU", x: BFC_CENTER.x - BFC_W * 0.66, y: BFC_CENTER.y + BFC_H * 0.45 },
                { label: "HEALTH", x: BFC_CENTER.x, y: BFC_CENTER.y + BFC_H * 0.45 },
                { label: "AERO", x: BFC_CENTER.x + BFC_W * 0.66, y: BFC_CENTER.y + BFC_H * 0.45 },
              ].map((z) => (
                <text
                  key={z.label}
                  x={z.x}
                  y={z.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255, 59, 48, 0.25)"
                  fontSize="7"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  {z.label}
                </text>
              ))}

              {/* ── Layer: Dry Ports ── */}
              <g
                style={{
                  opacity: getLayerOpacity("dryPorts"),
                  transition: "opacity 0.4s ease",
                }}
              >
                {/* Gudibanda */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleItemClick(INFRA_ITEMS[2])}
                  onMouseEnter={() => setHoveredItem("dry-port-gudibanda")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <rect
                    x={GUDIBANDA.x - 12}
                    y={GUDIBANDA.y - 12}
                    width="24"
                    height="24"
                    fill={isItemHighlighted("dry-port-gudibanda") ? `${LAYERS.dryPorts.color}30` : `${LAYERS.dryPorts.color}10`}
                    stroke={LAYERS.dryPorts.color}
                    strokeWidth={isItemHighlighted("dry-port-gudibanda") ? "2" : "1"}
                    filter={isItemHighlighted("dry-port-gudibanda") ? "url(#glow)" : undefined}
                  />
                  <line x1={GUDIBANDA.x - 5} y1={GUDIBANDA.y} x2={GUDIBANDA.x + 5} y2={GUDIBANDA.y} stroke={LAYERS.dryPorts.color} strokeWidth="1.5" />
                  <line x1={GUDIBANDA.x} y1={GUDIBANDA.y - 5} x2={GUDIBANDA.x} y2={GUDIBANDA.y + 5} stroke={LAYERS.dryPorts.color} strokeWidth="1.5" />
                  <text x={GUDIBANDA.x} y={GUDIBANDA.y + 24} textAnchor="middle" fill={LAYERS.dryPorts.color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                    GUDIBANDA
                  </text>
                  <text x={GUDIBANDA.x} y={GUDIBANDA.y + 34} textAnchor="middle" fill={LAYERS.dryPorts.color} fontSize="6" fontFamily="monospace" opacity="0.6">
                    DRY PORT
                  </text>
                </g>
                {/* Connector line from Gudibanda to BFC */}
                <line
                  x1={GUDIBANDA.x + 12}
                  y1={GUDIBANDA.y - 12}
                  x2={BFC_CENTER.x - BFC_W}
                  y2={BFC_CENTER.y + BFC_H * 0.5}
                  stroke={LAYERS.dryPorts.color}
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />

                {/* Nalgonda */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleItemClick(INFRA_ITEMS[3])}
                  onMouseEnter={() => setHoveredItem("dry-port-nalgonda")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <rect
                    x={NALGONDA.x - 12}
                    y={NALGONDA.y - 12}
                    width="24"
                    height="24"
                    fill={isItemHighlighted("dry-port-nalgonda") ? `${LAYERS.dryPorts.color}30` : `${LAYERS.dryPorts.color}10`}
                    stroke={LAYERS.dryPorts.color}
                    strokeWidth={isItemHighlighted("dry-port-nalgonda") ? "2" : "1"}
                    filter={isItemHighlighted("dry-port-nalgonda") ? "url(#glow)" : undefined}
                  />
                  <line x1={NALGONDA.x - 5} y1={NALGONDA.y} x2={NALGONDA.x + 5} y2={NALGONDA.y} stroke={LAYERS.dryPorts.color} strokeWidth="1.5" />
                  <line x1={NALGONDA.x} y1={NALGONDA.y - 5} x2={NALGONDA.x} y2={NALGONDA.y + 5} stroke={LAYERS.dryPorts.color} strokeWidth="1.5" />
                  <text x={NALGONDA.x} y={NALGONDA.y + 24} textAnchor="middle" fill={LAYERS.dryPorts.color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                    NALGONDA
                  </text>
                  <text x={NALGONDA.x} y={NALGONDA.y + 34} textAnchor="middle" fill={LAYERS.dryPorts.color} fontSize="6" fontFamily="monospace" opacity="0.6">
                    DRY PORT
                  </text>
                </g>
                {/* Connector line from Nalgonda to BFC */}
                <line
                  x1={NALGONDA.x - 12}
                  y1={NALGONDA.y - 12}
                  x2={BFC_CENTER.x + BFC_W}
                  y2={BFC_CENTER.y + BFC_H * 0.5}
                  stroke={LAYERS.dryPorts.color}
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
              </g>

              {/* ── Layer: Port Expressway ── */}
              <g
                style={{
                  opacity: getLayerOpacity("expressway"),
                  transition: "opacity 0.4s ease",
                }}
              >
                <path
                  d={`M ${BFC_CENTER.x + BFC_W},${BFC_CENTER.y + BFC_H * 0.3} L ${MACHILIPATNAM.x},${MACHILIPATNAM.y}`}
                  fill="none"
                  stroke={LAYERS.expressway.color}
                  strokeWidth={isItemHighlighted("expressway") ? "3" : "1.5"}
                  strokeDasharray={isItemHighlighted("expressway") ? "none" : "10 5"}
                  filter={isItemHighlighted("expressway") ? "url(#glow)" : undefined}
                  className="cursor-pointer"
                  onClick={() => handleItemClick(INFRA_ITEMS[4])}
                  onMouseEnter={() => setHoveredItem("expressway")}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                {/* Machilipatnam marker */}
                <g>
                  <circle cx={MACHILIPATNAM.x} cy={MACHILIPATNAM.y} r="6" fill={`${LAYERS.expressway.color}20`} stroke={LAYERS.expressway.color} strokeWidth="1" />
                  <circle cx={MACHILIPATNAM.x} cy={MACHILIPATNAM.y} r="2" fill={LAYERS.expressway.color} />
                  <text x={MACHILIPATNAM.x - 8} y={MACHILIPATNAM.y - 12} textAnchor="end" fill={LAYERS.expressway.color} fontSize="7" fontFamily="monospace" fontWeight="bold">
                    MACHILIPATNAM
                  </text>
                  <text x={MACHILIPATNAM.x - 8} y={MACHILIPATNAM.y - 3} textAnchor="end" fill={LAYERS.expressway.color} fontSize="6" fontFamily="monospace" opacity="0.6">
                    BANDAR PORT
                  </text>
                </g>
              </g>

              {/* Hover tooltip */}
              {hoveredItem && !selectedItem && (() => {
                const item = INFRA_ITEMS.find((i) => i.id === hoveredItem)
                if (!item) return null
                return (
                  <g>
                    <rect
                      x={MAP_WIDTH / 2 - 120}
                      y={12}
                      width="240"
                      height="30"
                      fill="#0A0A0A"
                      stroke={LAYERS[item.layer].color}
                      strokeWidth="1"
                    />
                    <text
                      x={MAP_WIDTH / 2}
                      y={32}
                      textAnchor="middle"
                      fill={LAYERS[item.layer].color}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {item.name} — Click for details
                    </text>
                  </g>
                )
              })()}
            </svg>

            {/* Map legend (bottom-left overlay) */}
            <div
              className="absolute bottom-3 left-3 p-2 border"
              style={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "var(--border)" }}
            >
              <p className="font-mono text-[8px] tracking-widest uppercase mb-1" style={{ color: "var(--text-dim)" }}>
                Legend
              </p>
              <div className="flex flex-col gap-0.5">
                {(Object.entries(LAYERS) as [LayerKey, (typeof LAYERS)[LayerKey]][]).map(([key, layer]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2"
                    style={{ opacity: isLayerActive(key) ? 1 : 0.3 }}
                  >
                    <div className="w-3 h-[2px]" style={{ backgroundColor: layer.color }} />
                    <span className="font-mono text-[7px]" style={{ color: layer.color }}>
                      {layer.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom interactive hint */}
          <div
            className="px-4 py-2 border-t flex items-center justify-between"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <span className="font-mono text-[10px]" style={{ color: "var(--text-dim)" }}>
              Click any infrastructure element for details
            </span>
            <span className="font-mono text-[10px]" style={{ color: "var(--text-dim)" }}>
              Toggle layers above to filter
            </span>
          </div>
        </div>

        {/* ─── Detail Sidebar ─── */}
        <div
          ref={sidebarRef}
          className={cn(
            "border-t lg:border-t-0 lg:border-l overflow-hidden transition-all duration-400 ease-out",
            selectedItem ? "max-h-[600px] lg:max-h-none lg:w-[320px] opacity-100" : "max-h-0 lg:max-h-none lg:w-0 opacity-0"
          )}
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          {selectedItem && (
            <div className="p-5">
              {/* Sidebar header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2"
                      style={{ backgroundColor: LAYERS[selectedItem.layer].color }}
                    />
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: LAYERS[selectedItem.layer].color }}
                    >
                      {LAYERS[selectedItem.layer].label}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-primary leading-tight">
                    {selectedItem.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-1 border cursor-pointer transition-colors hover:bg-[var(--surface-elevated)]"
                  style={{ borderColor: "var(--border)" }}
                  aria-label="Close detail panel"
                >
                  <X size={14} style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>

              {/* Spec cards */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 p-3 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}>
                  <Ruler size={14} className="mt-0.5 shrink-0" style={{ color: LAYERS[selectedItem.layer].color }} />
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--text-dim)" }}>
                      Specifications
                    </p>
                    <p className="text-xs leading-relaxed text-primary">{selectedItem.specs}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}>
                  <Target size={14} className="mt-0.5 shrink-0" style={{ color: LAYERS[selectedItem.layer].color }} />
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--text-dim)" }}>
                      Strategic Function
                    </p>
                    <p className="text-xs leading-relaxed text-primary">{selectedItem.strategicFunction}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}>
                  <Clock size={14} className="mt-0.5 shrink-0" style={{ color: LAYERS[selectedItem.layer].color }} />
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--text-dim)" }}>
                      Timeline Phase
                    </p>
                    <p className="text-xs leading-relaxed font-mono font-bold" style={{ color: LAYERS[selectedItem.layer].color }}>
                      {selectedItem.timelinePhase}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail points */}
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "var(--text-dim)" }}>
                  Key Details
                </p>
                <div className="space-y-2">
                  {selectedItem.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight
                        size={10}
                        className="mt-1 shrink-0"
                        style={{ color: LAYERS[selectedItem.layer].color }}
                      />
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline bar */}
              <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--text-dim)" }}>
                  Development Timeline
                </p>
                <div className="relative h-2 w-full" style={{ backgroundColor: "var(--surface-sunken)" }}>
                  {(() => {
                    const startYear = parseInt(selectedItem.timelinePhase.split("-")[0].trim())
                    const endYear = parseInt(selectedItem.timelinePhase.split("-")[1]?.trim() || selectedItem.timelinePhase.split("-")[0].trim())
                    const totalSpan = 2038 - 2026
                    const left = ((startYear - 2026) / totalSpan) * 100
                    const width = ((endYear - startYear) / totalSpan) * 100
                    return (
                      <div
                        className="absolute top-0 h-full"
                        style={{
                          left: `${left}%`,
                          width: `${Math.max(width, 3)}%`,
                          backgroundColor: LAYERS[selectedItem.layer].color,
                        }}
                      />
                    )
                  })()}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[8px]" style={{ color: "var(--text-dim)" }}>2026</span>
                  <span className="font-mono text-[8px]" style={{ color: "var(--text-dim)" }}>2032</span>
                  <span className="font-mono text-[8px]" style={{ color: "var(--text-dim)" }}>2038</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
