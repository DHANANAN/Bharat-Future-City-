"use client"

import { useState } from "react"
import { Scale, Users, Layers, Building2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MitigationStrategy {
  id: string
  title: string
  icon: typeof Scale
  color: string
  summary: string
  steps: {
    title: string
    description: string
  }[]
  timeline: string
  stakeholders: string
}

const MITIGATION_STRATEGIES: MitigationStrategy[] = [
  {
    id: "legal",
    title: "Legal Compliance Pathway",
    icon: Scale,
    color: "#FF3B30",
    summary: "Proactive judicial engagement and voluntary LARR Act adherence to establish legal legitimacy.",
    steps: [
      {
        title: "Seek Judicial Clarity",
        description: "Proactively approach Telangana High Court for declaratory judgment on land repurposing legality, presenting comprehensive plans demonstrating overriding public purpose and enhanced rehabilitation packages.",
      },
      {
        title: "Voluntary LARR Act Adherence",
        description: "Conduct and publish comprehensive Social Impact Assessment to build legitimacy despite state exemptions.",
      },
      {
        title: "Enhanced Compensation Delivery",
        description: "Expedite distribution of proposed 121 sq yd plots plus ₹16 lakh per acre to 4,174 affected farmers.",
      },
    ],
    timeline: "Immediate (Q1 2026)",
    stakeholders: "State Government, High Court, Legal Counsel",
  },
  {
    id: "stakeholder",
    title: "Stakeholder Engagement Framework",
    icon: Users,
    color: "#00D4AA",
    summary: "Genuine consultation and flexible compensation to rebuild trust and secure social license.",
    steps: [
      {
        title: "Genuine Consultations",
        description: "Initiate transparent dialogue with affected parties through public hearings to formally record grievances and concerns.",
      },
      {
        title: "Flexible Compensation Options",
        description: "Offer plots-plus-cash as one option among several, exploring supplementary valuation methodologies and negotiated settlements.",
      },
      {
        title: "Community Partnerships",
        description: "Implement benefit-sharing mechanisms, preferential local employment quotas, and comprehensive skill development programs.",
      },
    ],
    timeline: "Ongoing (2026-2027)",
    stakeholders: "Farmers, Local Communities, NGOs, District Administration",
  },
  {
    id: "phased",
    title: "Phased Rollout Model",
    icon: Layers,
    color: "#FF9500",
    summary: "Strategic three-phase development to demonstrate tangible progress and build momentum.",
    steps: [
      {
        title: "Phase 1: Pilot Development",
        description: "Begin development on undisputed land parcels hosting Young India Skill University and sports hub to demonstrate tangible progress.",
      },
      {
        title: "Phase 2: Core Infrastructure",
        description: "Focus on water treatment, renewable grids, and transport connectivity using Pan-City approach providing regional benefits.",
      },
      {
        title: "Phase 3: Scaled Expansion",
        description: "Post-legal resolution expansion into contentious parcels, using pilot phase success as demonstration and incentive.",
      },
    ],
    timeline: "2026-2034",
    stakeholders: "BFCDA, Infrastructure Partners, Central & State Ministries",
  },
  {
    id: "governance",
    title: "Governance Strengthening",
    icon: Building2,
    color: "#FFFFFF",
    summary: "Democratic accountability and financial sustainability through integrated local governance.",
    steps: [
      {
        title: "Integrate with Local Governance",
        description: "Establish formal linkages between BFCDA and surrounding municipalities/gram panchayats, including elected representatives on SPV board.",
      },
      {
        title: "Financial Sustainability",
        description: "Develop long-term financial plan beyond initial grants, focusing on viable revenue models from city services and infrastructure.",
      },
      {
        title: "Capacity Building",
        description: "Invest in institutional capacity and talent acquisition for urban planning, smart city technologies, and stakeholder management.",
      },
    ],
    timeline: "2026-2030",
    stakeholders: "BFCDA, Municipal Bodies, Finance Department",
  },
]

function MitigationCard({ strategy }: { strategy: MitigationStrategy }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = strategy.icon

  return (
    <div
      className="border transition-colors duration-200"
      style={{
        borderColor: expanded ? strategy.color : "var(--border)",
        backgroundColor: expanded ? `${strategy.color}0A` : "var(--surface-sunken)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-stretch w-full text-left cursor-pointer"
      >
        <div
          className="w-1 self-stretch flex-shrink-0"
          style={{ backgroundColor: strategy.color }}
        />
        <div className="flex-1 px-4 py-4 md:px-5 md:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 flex items-center justify-center border"
                  style={{
                    borderColor: strategy.color,
                    backgroundColor: `${strategy.color}12`,
                  }}
                >
                  <Icon size={16} style={{ color: strategy.color }} />
                </div>
                <h3 className="text-base md:text-lg font-bold text-primary">
                  {strategy.title}
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {strategy.summary}
              </p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-dim)" }}
                >
                  Timeline: {strategy.timeline}
                </span>
                <span
                  className="font-mono text-xs px-2 py-0.5 border"
                  style={{
                    borderColor: `${strategy.color}44`,
                    color: strategy.color,
                    backgroundColor: `${strategy.color}0D`,
                  }}
                >
                  {strategy.steps.length} steps
                </span>
              </div>
            </div>
            <ChevronRight
              size={20}
              className={cn(
                "transition-transform duration-300 flex-shrink-0 mt-1",
                expanded && "rotate-90"
              )}
              style={{ color: expanded ? strategy.color : "var(--muted-foreground)" }}
            />
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: expanded ? "1000px" : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div
          className="px-4 pb-5 md:px-5 md:pb-6 ml-1"
          style={{ borderTop: `1px solid ${strategy.color}44` }}
        >
          {/* Implementation steps */}
          <div className="mt-4 space-y-4">
            <p
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: strategy.color }}
            >
              Implementation Steps
            </p>
            {strategy.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="mt-1 w-6 h-6 flex items-center justify-center border flex-shrink-0 font-mono text-xs"
                  style={{
                    borderColor: `${strategy.color}44`,
                    color: strategy.color,
                    backgroundColor: `${strategy.color}0D`,
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary mb-1">
                    {step.title}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Responsible stakeholders */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p
              className="font-mono text-xs tracking-widest uppercase mb-2"
              style={{ color: "var(--text-dim)" }}
            >
              Responsible Stakeholders
            </p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              {strategy.stakeholders}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MitigationCards({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="mb-6">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-2"
          style={{ color: "var(--accent)" }}
        >
          Strategic Mitigation Framework
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-primary">
          Actionable Mitigation Strategies
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Comprehensive risk mitigation across legal, stakeholder, execution, and governance dimensions with clear implementation pathways and responsible parties.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {MITIGATION_STRATEGIES.map((strategy) => (
          <MitigationCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  )
}
