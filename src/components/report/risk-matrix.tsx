"use client"

import React from "react"

import { useState, useCallback } from "react"
import {
  AlertTriangle,
  Scale,
  Leaf,
  Users,
  Landmark,
  ChevronRight,
  ShieldAlert,
  CircleAlert,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type Severity = "HIGH" | "MEDIUM" | "LOW"

interface Risk {
  id: string
  title: string
  severity: Severity
  impact: string
  description: string
  details: string[]
}

interface RiskCategory {
  id: string
  label: string
  icon: React.ElementType
  severity: Severity
  summary: string
  risks: Risk[]
}

const RISK_DATA: RiskCategory[] = [
  {
    id: "legal",
    label: "Legal & Land Acquisition",
    icon: Scale,
    severity: "HIGH",
    summary:
      "Critical legal barriers under LARR Act Section 99, pending litigation in multiple villages, and farmer claims under Section 101.",
    risks: [
      {
        id: "legal-1",
        title: "Section 99: Change of Purpose Prohibition",
        severity: "HIGH",
        impact: "Project-blocking",
        description:
          "Repurposing land acquired for 'Green Pharma City' for a multi-sector hub directly conflicts with Section 99 of the LARR Act 2013.",
        details: [
          "Previous BRS government formally informed Telangana High Court land would be used exclusively for green pharma purposes",
          "Multi-sector city encompassing AI hubs, health cities, electronics, and residential zones constitutes clear deviation",
          "Requires formal court notification and potentially new judicial interpretation of 'public purpose'",
        ],
      },
      {
        id: "legal-2",
        title: "Farmer Claims Under Section 101",
        severity: "HIGH",
        impact: "Land supply risk",
        description:
          "Section 101 mandates return of unutilized land if not used within five years for the stated purpose.",
        details: [
          "~10,000 acres have been paid for, but farmers argue original Pharma City basis is void",
          "Over 1,500 acres where farmers haven't approached courts but remain vulnerable",
          "Over 2,000 acres under court-issued stay orders",
        ],
      },
      {
        id: "legal-3",
        title: "Pending High Court Litigation",
        severity: "HIGH",
        impact: "Timeline delays",
        description:
          "High Court has stayed land takeovers in at least three villages and quashed acquisition awards in others.",
        details: [
          "Affected villages include Kurmidda, Thatiparti, and Medipally",
          "Petitions cite inadequate compensation and procedural flaws",
          "Average land dispute resolution timeline in India: 20 years",
        ],
      },
    ],
  },
  {
    id: "environmental",
    label: "Environmental & Net-Zero Compliance",
    icon: Leaf,
    severity: "HIGH",
    summary:
      "Fragmented legal framework for net-zero development, high implementation costs, and definitional ambiguity around 'net-zero city' claims.",
    risks: [
      {
        id: "env-1",
        title: "Fragmented Legal Framework",
        severity: "HIGH",
        impact: "Regulatory uncertainty",
        description:
          "India lacks a single overarching climate law to guide net-zero development, creating ambiguity for a project claiming net-zero goals.",
        details: [
          "Action driven by legacy environmental laws that don't explicitly focus on GHG emissions",
          "No unified framework to certify or verify net-zero claims for urban developments",
          "Risk of non-compliance with evolving international climate standards",
        ],
      },
      {
        id: "env-2",
        title: "High Implementation Costs",
        severity: "MEDIUM",
        impact: "Financial viability",
        description:
          "Net-zero architecture requires substantial upfront investment in renewable energy, energy-efficient materials, and smart grid integration.",
        details: [
          "Lack of clear financing models for net-zero urban development in India",
          "Nascent CCUS (Carbon Capture, Utilization and Storage) technology presents significant financial risks",
          "District cooling systems and renewable grids require massive capital expenditure",
        ],
      },
      {
        id: "env-3",
        title: "Net-Zero Definition Ambiguity",
        severity: "MEDIUM",
        impact: "Credibility risk",
        description:
          "The term 'net-zero city' lacks practical definition, leading to potential misaligned strategies and over-claiming.",
        details: [
          "No standardized metrics for measuring a city's net-zero status",
          "Risk of greenwashing allegations undermining investor confidence",
          "International scrutiny on India's climate commitments adds pressure",
        ],
      },
    ],
  },
  {
    id: "stakeholder",
    label: "Stakeholder & Socio-Political",
    icon: Users,
    severity: "MEDIUM",
    summary:
      "Political reversal and trust deficit from Congress government's pivot, opposition narrative framing the project as real estate conversion.",
    risks: [
      {
        id: "stake-1",
        title: "Political Reversal & Trust Deficit",
        severity: "HIGH",
        impact: "Social license",
        description:
          "Congress government, when in opposition, supported farmers protesting Pharma City and promised to scrap it. Their pivot is viewed as betrayal.",
        details: [
          "Farmer communities previously received direct political support from Congress leaders",
          "Pivot to Bharat Future City without extensive consultation erodes trust",
          "Risk of sustained grassroots resistance and protest movements",
        ],
      },
      {
        id: "stake-2",
        title: "Opposition Narrative",
        severity: "MEDIUM",
        impact: "Political headwinds",
        description:
          "BRS party accuses the government of converting land for real estate interests, violating the Land Acquisition Act.",
        details: [
          "Narrative gains traction given the scope expansion from pharma-only to multi-sector",
          "Media coverage amplifies opposition claims, creating challenging public perception",
          "May influence judicial proceedings and public interest litigations",
        ],
      },
    ],
  },
  {
    id: "governance",
    label: "Governance & Execution",
    icon: Landmark,
    severity: "MEDIUM",
    summary:
      "SPV model governance flaws from Smart Cities Mission experience, funding gaps, and capacity constraints for phased execution.",
    risks: [
      {
        id: "gov-1",
        title: "SPV Model Governance Flaws",
        severity: "MEDIUM",
        impact: "Accountability gap",
        description:
          "India's Smart Cities Mission relied on SPVs that sidelined elected municipal bodies and lacked public accountability.",
        details: [
          "Parallel governance structure lacks democratic accountability",
          "Limited execution capacity demonstrated in previous Smart Cities Mission",
          "Risk of technocratic decision-making disconnected from community needs",
        ],
      },
      {
        id: "gov-2",
        title: "Funding Sustainability Gaps",
        severity: "MEDIUM",
        impact: "Long-term viability",
        description:
          "Smart Cities Mission struggled with funding, expecting ULBs to contribute significantly and raise private funds.",
        details: [
          "Investment pledges vs. actual disbursement often shows significant gap",
          "Long-term revenue models from city services remain unproven",
          "Dependency on sustained political will across potential government changes",
        ],
      },
      {
        id: "gov-3",
        title: "Execution Capacity Constraints",
        severity: "LOW",
        impact: "Phased rollout risk",
        description:
          "Managing a 30,000-acre development across 7 specialized zones requires unprecedented coordination capacity.",
        details: [
          "Requires simultaneous management of legal, construction, and policy workstreams",
          "Shortage of skilled urban planning and smart city development talent in India",
          "Inter-departmental coordination across state and central agencies",
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const SEVERITY_CONFIG: Record<
  Severity,
  { color: string; bg: string; borderColor: string; label: string }
> = {
  HIGH: {
    color: "#FF00FF",
    bg: "rgba(255, 0, 255, 0.1)",
    borderColor: "rgba(255, 0, 255, 0.4)",
    label: "HIGH",
  },
  MEDIUM: {
    color: "#FFFF00",
    bg: "rgba(255, 255, 0, 0.1)",
    borderColor: "rgba(255, 255, 0, 0.4)",
    label: "MED",
  },
  LOW: {
    color: "#00FF9F",
    bg: "rgba(0, 255, 159, 0.1)",
    borderColor: "rgba(0, 255, 159, 0.4)",
    label: "LOW",
  },
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const cfg = SEVERITY_CONFIG[severity]
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase px-2.5 py-1 border"
      style={{
        color: cfg.color,
        backgroundColor: cfg.bg,
        borderColor: cfg.borderColor,
      }}
    >
      {severity === "HIGH" && <ShieldAlert size={12} />}
      {severity === "MEDIUM" && <CircleAlert size={12} />}
      {severity === "LOW" && <Info size={12} />}
      {cfg.label}
    </span>
  )
}

function SeverityIcon({ severity }: { severity: Severity }) {
  const cfg = SEVERITY_CONFIG[severity]
  return (
    <div
      className="w-1 self-stretch flex-shrink-0"
      style={{ backgroundColor: cfg.color }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  MINI RISK SEVERITY GRID — visual overview at top                  */
/* ------------------------------------------------------------------ */

function RiskOverviewGrid({
  onCategoryClick,
  expandedCategory,
}: {
  onCategoryClick: (id: string) => void
  expandedCategory: string | null
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-8" style={{ backgroundColor: "var(--border)" }}>
      {RISK_DATA.map((cat) => {
        const isActive = expandedCategory === cat.id
        const cfg = SEVERITY_CONFIG[cat.severity]
        const Icon = cat.icon
        const highCount = cat.risks.filter((r) => r.severity === "HIGH").length
        const medCount = cat.risks.filter((r) => r.severity === "MEDIUM").length
        const lowCount = cat.risks.filter((r) => r.severity === "LOW").length

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryClick(cat.id)}
            className={cn(
              "relative flex flex-col items-start p-4 md:p-5 text-left transition-all duration-200 cursor-pointer group",
            )}
            style={{
              backgroundColor: isActive
                ? "var(--surface-elevated)"
                : "var(--card)",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "var(--surface-elevated)"
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "var(--card)"
              }
            }}
          >
            {/* Active indicator line */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 transition-all duration-200"
              style={{
                backgroundColor: isActive ? cfg.color : "transparent",
              }}
            />

            <div className="flex items-center gap-2 mb-3 w-full">
              <Icon size={16} style={{ color: cfg.color }} />
              <span
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: "var(--muted-foreground)" }}
              >
                {cat.label.split(" ")[0]}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <SeverityBadge severity={cat.severity} />
            </div>

            {/* Mini risk counts */}
            <div className="flex items-center gap-3 mt-auto">
              {highCount > 0 && (
                <span className="flex items-center gap-1 font-mono text-[10px]" style={{ color: "#FF3B30" }}>
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#FF3B30" }} />
                  {highCount}
                </span>
              )}
              {medCount > 0 && (
                <span className="flex items-center gap-1 font-mono text-[10px]" style={{ color: "#FF9500" }}>
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#FF9500" }} />
                  {medCount}
                </span>
              )}
              {lowCount > 0 && (
                <span className="flex items-center gap-1 font-mono text-[10px]" style={{ color: "#00D4AA" }}>
                  <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#00D4AA" }} />
                  {lowCount}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  INDIVIDUAL RISK ROW                                               */
/* ------------------------------------------------------------------ */

function RiskRow({ risk }: { risk: Risk }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = SEVERITY_CONFIG[risk.severity]

  return (
    <div
      className="border transition-colors duration-200"
      style={{
        borderColor: expanded ? cfg.borderColor : "var(--border)",
        backgroundColor: expanded ? cfg.bg : "var(--surface-sunken)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-stretch w-full text-left cursor-pointer group"
      >
        <SeverityIcon severity={risk.severity} />
        <div className="flex-1 px-4 py-4 md:px-5 md:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="text-sm md:text-base font-bold text-primary leading-tight">
                  {risk.title}
                </h4>
                <SeverityBadge severity={risk.severity} />
              </div>
              <p
                className="mt-1.5 text-xs md:text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {risk.description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
              <span
                className="hidden sm:inline-block font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border"
                style={{
                  color: cfg.color,
                  borderColor: cfg.borderColor,
                  backgroundColor: cfg.bg,
                }}
              >
                {risk.impact}
              </span>
              <ChevronRight
                size={16}
                className={cn(
                  "transition-transform duration-200 flex-shrink-0",
                  expanded && "rotate-90"
                )}
                style={{ color: "var(--muted-foreground)" }}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: expanded ? "500px" : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div
          className="px-4 pb-4 md:px-5 md:pb-5 ml-1"
          style={{ borderTop: `1px solid ${cfg.borderColor}` }}
        >
          <ul className="mt-3 space-y-2">
            {risk.details.map((detail, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                <span
                  className="mt-1.5 w-1 h-1 flex-shrink-0"
                  style={{ backgroundColor: cfg.color }}
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CATEGORY ACCORDION                                                */
/* ------------------------------------------------------------------ */

function CategorySection({
  category,
  isExpanded,
  onToggle,
}: {
  category: RiskCategory
  isExpanded: boolean
  onToggle: () => void
}) {
  const cfg = SEVERITY_CONFIG[category.severity]
  const Icon = category.icon

  return (
    <div
      className="border transition-colors duration-200"
      style={{
        borderColor: isExpanded ? cfg.borderColor : "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Category header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center w-full px-5 py-4 md:px-6 md:py-5 text-left cursor-pointer group"
      >
        <div
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0 border mr-4"
          style={{
            borderColor: cfg.borderColor,
            backgroundColor: cfg.bg,
          }}
        >
          <Icon size={18} style={{ color: cfg.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base md:text-lg font-bold text-primary leading-tight">
              {category.label}
            </h3>
            <SeverityBadge severity={category.severity} />
          </div>
          <p
            className="mt-1 text-xs md:text-sm leading-relaxed line-clamp-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {category.summary}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span
            className="hidden md:inline-block font-mono text-xs"
            style={{ color: "var(--text-dim)" }}
          >
            {category.risks.length} risk{category.risks.length !== 1 ? "s" : ""}
          </span>
          <ChevronRight
            size={20}
            className={cn(
              "transition-transform duration-300 ease-out",
              isExpanded && "rotate-90"
            )}
            style={{ color: isExpanded ? cfg.color : "var(--muted-foreground)" }}
          />
        </div>
      </button>

      {/* Expanded risks */}
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: isExpanded ? "2000px" : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div
          className="px-4 pb-4 md:px-5 md:pb-5 space-y-2"
          style={{ borderTop: `1px solid var(--border)` }}
        >
          <div className="pt-3 space-y-2">
            {category.risks.map((risk) => (
              <RiskRow key={risk.id} risk={risk} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  AGGREGATE SEVERITY BAR — visual summary                           */
/* ------------------------------------------------------------------ */

function SeverityDistributionBar() {
  const allRisks = RISK_DATA.flatMap((c) => c.risks)
  const total = allRisks.length
  const high = allRisks.filter((r) => r.severity === "HIGH").length
  const med = allRisks.filter((r) => r.severity === "MEDIUM").length
  const low = allRisks.filter((r) => r.severity === "LOW").length

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: "var(--text-dim)" }}
        >
          Risk Distribution
        </span>
        <span
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          {total} total risks identified
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-2 gap-px">
        <div
          style={{
            width: `${(high / total) * 100}%`,
            backgroundColor: "#FF3B30",
          }}
          title={`${high} High severity`}
        />
        <div
          style={{
            width: `${(med / total) * 100}%`,
            backgroundColor: "#FF9500",
          }}
          title={`${med} Medium severity`}
        />
        <div
          style={{
            width: `${(low / total) * 100}%`,
            backgroundColor: "#00D4AA",
          }}
          title={`${low} Low severity`}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3">
        <span className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: "#FF3B30" }}>
          <span className="w-2 h-2 inline-block" style={{ backgroundColor: "#FF3B30" }} />
          HIGH ({high})
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: "#FF9500" }}>
          <span className="w-2 h-2 inline-block" style={{ backgroundColor: "#FF9500" }} />
          MEDIUM ({med})
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: "#00D4AA" }}>
          <span className="w-2 h-2 inline-block" style={{ backgroundColor: "#00D4AA" }} />
          LOW ({low})
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  IMPACT × LIKELIHOOD MATRIX GRID                                   */
/* ------------------------------------------------------------------ */

type MatrixCell = {
  riskId: string
  title: string
  category: string
  severity: Severity
}

const MATRIX_POSITIONS: Record<string, { likelihood: number; impact: number }> = {
  "legal-1": { likelihood: 4, impact: 4 },
  "legal-2": { likelihood: 3, impact: 4 },
  "legal-3": { likelihood: 4, impact: 3 },
  "env-1": { likelihood: 3, impact: 3 },
  "env-2": { likelihood: 2, impact: 3 },
  "env-3": { likelihood: 2, impact: 2 },
  "stake-1": { likelihood: 3, impact: 3 },
  "stake-2": { likelihood: 3, impact: 2 },
  "gov-1": { likelihood: 2, impact: 2 },
  "gov-2": { likelihood: 2, impact: 3 },
  "gov-3": { likelihood: 1, impact: 2 },
}

function ImpactLikelihoodMatrix({
  onRiskHover,
  hoveredRisk,
}: {
  onRiskHover: (id: string | null) => void
  hoveredRisk: string | null
}) {
  const allRisks: MatrixCell[] = RISK_DATA.flatMap((cat) =>
    cat.risks.map((r) => ({
      riskId: r.id,
      title: r.title,
      category: cat.label,
      severity: r.severity,
    }))
  )

  const impactLabels = ["", "Low", "Moderate", "Significant", "Critical"]
  const likelihoodLabels = ["", "Unlikely", "Possible", "Likely", "Very Likely"]

  // Grid cell background heat
  const getCellHeat = (likelihood: number, impact: number) => {
    const score = likelihood * impact
    if (score >= 12) return "rgba(255, 59, 48, 0.12)"
    if (score >= 6) return "rgba(255, 149, 0, 0.06)"
    return "rgba(0, 212, 170, 0.03)"
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle size={14} style={{ color: "var(--accent)" }} />
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: "var(--text-dim)" }}
        >
          Impact vs Likelihood Matrix
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Column headers (Impact) */}
          <div className="grid gap-px" style={{ gridTemplateColumns: "80px repeat(4, 1fr)" }}>
            <div />
            {impactLabels.slice(1).map((label) => (
              <div
                key={label}
                className="text-center font-mono text-[10px] tracking-wider uppercase py-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Impact label */}
          <div
            className="text-center font-mono text-[10px] tracking-widest uppercase mb-1"
            style={{ color: "var(--text-dim)" }}
          >
            {'Impact \u2192'}
          </div>

          {/* Grid rows (Likelihood, reversed so high is top) */}
          {[4, 3, 2, 1].map((likelihood) => (
            <div
              key={likelihood}
              className="grid gap-px mb-px"
              style={{ gridTemplateColumns: "80px repeat(4, 1fr)" }}
            >
              {/* Row label */}
              <div
                className="flex items-center justify-end pr-3 font-mono text-[10px] tracking-wider uppercase"
                style={{ color: "var(--muted-foreground)" }}
              >
                {likelihoodLabels[likelihood]}
              </div>

              {/* Cells */}
              {[1, 2, 3, 4].map((impact) => {
                const cellRisks = allRisks.filter((r) => {
                  const pos = MATRIX_POSITIONS[r.riskId]
                  return pos && pos.likelihood === likelihood && pos.impact === impact
                })
                return (
                  <div
                    key={impact}
                    className="relative min-h-[52px] md:min-h-[60px] border flex flex-wrap items-center justify-center gap-1 p-1"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: getCellHeat(likelihood, impact),
                    }}
                  >
                    {cellRisks.map((r) => {
                      const cfg = SEVERITY_CONFIG[r.severity]
                      const isHovered = hoveredRisk === r.riskId
                      return (
                        <div
                          key={r.riskId}
                          className="relative group/dot"
                          onMouseEnter={() => onRiskHover(r.riskId)}
                          onMouseLeave={() => onRiskHover(null)}
                        >
                          <div
                            className="w-3 h-3 md:w-3.5 md:h-3.5 cursor-pointer transition-transform duration-150"
                            style={{
                              backgroundColor: cfg.color,
                              transform: isHovered ? "scale(1.6)" : "scale(1)",
                              outline: isHovered
                                ? `2px solid ${cfg.color}`
                                : "none",
                              outlineOffset: "2px",
                            }}
                          />
                          {/* Tooltip */}
                          <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-10 transition-opacity duration-150"
                            style={{ opacity: isHovered ? 1 : 0 }}
                          >
                            <div
                              className="border px-3 py-2 whitespace-nowrap shadow-lg"
                              style={{
                                backgroundColor: "#111111",
                                borderColor: cfg.borderColor,
                                maxWidth: "260px",
                                whiteSpace: "normal",
                              }}
                            >
                              <p
                                className="font-mono text-[10px] tracking-wider uppercase mb-0.5"
                                style={{ color: cfg.color }}
                              >
                                {r.category}
                              </p>
                              <p className="text-xs font-bold text-primary leading-tight">
                                {r.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Likelihood label */}
          <div
            className="font-mono text-[10px] tracking-widest uppercase mt-1 pl-[80px]"
            style={{ color: "var(--text-dim)" }}
          >
            {'\u2191 Likelihood'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                        */
/* ------------------------------------------------------------------ */

export function RiskMatrix() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("legal")
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null)

  const handleCategoryToggle = useCallback((id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div>
      {/* Overview grid */}
      <RiskOverviewGrid
        onCategoryClick={handleCategoryToggle}
        expandedCategory={expandedCategory}
      />

      {/* Impact × Likelihood Matrix */}
      <ImpactLikelihoodMatrix
        onRiskHover={setHoveredRisk}
        hoveredRisk={hoveredRisk}
      />

      {/* Severity distribution bar */}
      <SeverityDistributionBar />

      {/* Category accordions */}
      <div className="space-y-2">
        {RISK_DATA.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isExpanded={expandedCategory === category.id}
            onToggle={() => handleCategoryToggle(category.id)}
          />
        ))}
      </div>
    </div>
  )
}
