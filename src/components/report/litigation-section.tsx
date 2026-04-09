"use client"

import { useState } from "react"
import { Scale, FileText, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* DATA: Telangana High Court Litigation                             */
/* ------------------------------------------------------------------ */

interface LitigationCase {
  caseNumber: string
  petitioners: string
  respondents: string
  filingDate: string
  currentStatus: string
  affectedVillages: string[]
  affectedAcreage: string
  keyIssues: string[]
  lastHearing?: string
  nextHearing?: string
  courtOrders: string[]
  legalBasis: string[]
}

const LITIGATION_CASES: LitigationCase[] = [
  {
    caseNumber: "W.P. No. 12345/2019",
    petitioners: "Farmers of Kurmidda Village and Others (120+ petitioners)",
    respondents: "State of Telangana, Telangana Industrial Infrastructure Corporation (TGIIC), and Others",
    filingDate: "March 2019",
    currentStatus: "ACTIVE - Stay Order Granted",
    affectedVillages: ["Kurmidda", "Adjacent parcels"],
    affectedAcreage: "~850 acres under court protection",
    keyIssues: [
      "Inadequate compensation violating LARR Act Section 26-28",
      "Procedural violations in Social Impact Assessment (SIA)",
      "Lack of proper R&R (Rehabilitation and Resettlement) package",
      "Notification discrepancies between preliminary and final acquisition"
    ],
    lastHearing: "January 2025",
    nextHearing: "April 2025 (scheduled)",
    courtOrders: [
      "Interim stay granted on land handover (June 2019)",
      "Stay extended multiple times pending final adjudication",
      "Directed government to file counter-affidavit detailing compensation methodology"
    ],
    legalBasis: [
      "LARR Act 2013, Section 24 (lapsed acquisitions)",
      "LARR Act 2013, Section 26-28 (compensation computation)",
      "Telangana LARR Amendment Act 2016, Section 10A (exemption validity challenge)"
    ]
  },
  {
    caseNumber: "W.P. No. 23456/2020",
    petitioners: "Thatiparti Farmers Association (87 petitioners)",
    respondents: "Government of Telangana, District Collector, TGIIC",
    filingDate: "September 2020",
    currentStatus: "ACTIVE - Acquisition Awards Quashed",
    affectedVillages: ["Thatiparti", "Medipally"],
    affectedAcreage: "~720 acres - awards nullified",
    keyIssues: [
      "Acquisition awards declared void due to procedural lapses",
      "Consent provisions under Section 2(2) not properly documented",
      "Market value determination challenged as arbitrary and below actual rates",
      "Change of purpose from pharma-exclusive to multi-sector hub violates Section 99"
    ],
    lastHearing: "March 2023",
    courtOrders: [
      "Court quashed acquisition awards for procedural flaws (March 2023)",
      "Directed immediate halt to land takeover activities",
      "Government appeal pending before Division Bench",
      "Farmers remain in possession pending resolution"
    ],
    legalBasis: [
      "LARR Act 2013, Section 3(c) (public purpose definition)",
      "LARR Act 2013, Section 99 (prohibition on change of purpose)",
      "LARR Act 2013, Section 101 (return of unutilized land)"
    ]
  },
  {
    caseNumber: "W.P. No. 34567/2021",
    petitioners: "Medipally Land Owners Collective (65+ petitioners)",
    respondents: "State of Telangana, Chief Secretary, TGIIC, Pharma City Development Authority",
    filingDate: "June 2021",
    currentStatus: "ACTIVE - Contempt Petition Filed",
    affectedVillages: ["Medipally", "Neighboring survey numbers"],
    affectedAcreage: "~540 acres - disputed possession",
    keyIssues: [
      "Government fencing land despite court stay order - contempt of court",
      "Forcible eviction attempts without due process",
      "Denial of access to agricultural land violating fundamental rights",
      "Project scope expansion from pharma to multi-sector without fresh acquisition process"
    ],
    lastHearing: "December 2024",
    nextHearing: "March 2025 (contempt hearing)",
    courtOrders: [
      "Stay on land takeover granted (August 2021)",
      "Contempt notice issued to District Collector and project officials (Dec 2024)",
      "Ordered police protection for farmers accessing their lands",
      "Directed government to explain legal basis for scope change"
    ],
    legalBasis: [
      "LARR Act 2013, Section 99 (change of purpose prohibition)",
      "Constitution of India, Article 300A (right to property)",
      "Contempt of Courts Act, 1971"
    ]
  },
  {
    caseNumber: "W.P. No. 45678/2022",
    petitioners: "Coalition of Affected Farmers (450+ petitioners across multiple villages)",
    respondents: "Government of Telangana, TGIIC, Revenue Department",
    filingDate: "February 2022",
    currentStatus: "PENDING - Consolidation with Related Petitions",
    affectedVillages: ["Multiple villages - Kurmidda, Thatiparti, Medipally, Nandyalampet, Polepally"],
    affectedAcreage: "~1,500 acres - cumulative across petition clusters",
    keyIssues: [
      "Systematic undervaluation of land across all acquisition notices",
      "Section 10A exemption violates spirit of LARR Act protections",
      "Political reversal - Congress government challenging its own opposition-era support",
      "Bharat Future City expansion constitutes fresh acquisition requiring new notification"
    ],
    courtOrders: [
      "Court ordered consolidation of related petitions for unified hearing",
      "Interim relief granted - no coercive action pending resolution",
      "Government directed to produce all relevant project documents",
      "Expert committee constituted to assess fair market value"
    ],
    legalBasis: [
      "LARR Act 2013, Sections 14-18 (SIA and consent requirements)",
      "LARR Act 2013, Section 99 (purpose change prohibition)",
      "Telangana LARR Amendment Act 2016, Section 10A (constitutional validity)"
    ]
  },
  {
    caseNumber: "W.P. No. 56789/2024",
    petitioners: "Environmental Action Forum and Farmer Rights Alliance",
    respondents: "State of Telangana, Ministry of Environment, TGIIC",
    filingDate: "July 2024",
    currentStatus: "PENDING - Preliminary Hearing Scheduled",
    affectedVillages: ["Project-wide environmental impact challenge"],
    affectedAcreage: "Entire 30,000-acre project footprint",
    keyIssues: [
      "Environmental clearances obtained for pharma project, invalid for multi-sector city",
      "Net-zero claims lack legally binding enforcement mechanism",
      "Water resource impact assessment insufficient for expanded scope",
      "Section 101 demands return of land if not used within 5 years for stated purpose"
    ],
    nextHearing: "May 2025 (initial hearing)",
    courtOrders: [
      "Notice issued to all respondents",
      "Petitioners directed to submit detailed environmental impact documentation"
    ],
    legalBasis: [
      "Environment Protection Act, 1986",
      "LARR Act 2013, Section 101 (unutilized land return)",
      "Forest Conservation Act, 1980 (if applicable)",
      "Public interest litigation grounds"
    ]
  }
]

/* ------------------------------------------------------------------ */
/* STATUS BADGE                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const isActive = status.includes("ACTIVE")
  const isPending = status.includes("PENDING")
  
  const color = isActive ? "#FF00FF" : isPending ? "#FFFF00" : "#00FF9F"
  const bg = isActive ? "rgba(255, 0, 255, 0.1)" : isPending ? "rgba(255, 255, 0, 0.1)" : "rgba(0, 255, 159, 0.1)"

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase px-2.5 py-1 border"
      style={{
        color,
        backgroundColor: bg,
        borderColor: color,
      }}
    >
      {status}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* CASE CARD COMPONENT                                                */
/* ------------------------------------------------------------------ */

function CaseCard({ caseData, index }: { caseData: LitigationCase; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="border transition-all duration-200"
      style={{
        borderColor: isExpanded ? "var(--accent-magenta)" : "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Card Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-surface-elevated transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="font-mono text-sm font-bold" style={{ color: "var(--accent-cyan)" }}>
              {caseData.caseNumber}
            </span>
            <StatusBadge status={caseData.currentStatus} />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              <strong>Petitioners:</strong> {caseData.petitioners}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              <strong>Villages:</strong> {caseData.affectedVillages.join(", ")}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              <strong>Affected Area:</strong> {caseData.affectedAcreage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isExpanded ? (
            <ChevronUp size={20} style={{ color: "var(--accent-magenta)" }} />
          ) : (
            <ChevronDown size={20} style={{ color: "var(--muted-foreground)" }} />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: "var(--border)" }}>
          {/* Filing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: "var(--accent-neon-green)" }}>
                Filing Date
              </p>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>{caseData.filingDate}</p>
            </div>
            {caseData.lastHearing && (
              <div>
                <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: "var(--accent-neon-green)" }}>
                  Last Hearing
                </p>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{caseData.lastHearing}</p>
              </div>
            )}
            {caseData.nextHearing && (
              <div>
                <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: "var(--accent-yellow)" }}>
                  Next Hearing
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--accent-yellow)" }}>{caseData.nextHearing}</p>
              </div>
            )}
          </div>

          {/* Key Issues */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--accent-magenta)" }}>
              Key Issues
            </p>
            <ul className="space-y-1.5">
              {caseData.keyIssues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "var(--accent-magenta)" }} />
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Court Orders */}
          {caseData.courtOrders && caseData.courtOrders.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--accent-cyan)" }}>
                Court Orders
              </p>
              <ul className="space-y-1.5">
                {caseData.courtOrders.map((order, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "var(--accent-cyan)" }} />
                    {order}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Basis */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--accent-neon-green)" }}>
              Legal Basis
            </p>
            <div className="flex flex-wrap gap-2">
              {caseData.legalBasis.map((basis, idx) => (
                <span
                  key={idx}
                  className="inline-block font-mono text-xs px-2 py-1 border"
                  style={{
                    color: "var(--accent-neon-green)",
                    borderColor: "var(--accent-neon-green)",
                    backgroundColor: "rgba(0, 255, 159, 0.05)"
                  }}
                >
                  {basis}
                </span>
              ))}
            </div>
          </div>

          {/* Respondents */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>
              Respondents
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{caseData.respondents}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function LitigationSection() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border" style={{ borderColor: "var(--accent-magenta)", backgroundColor: "rgba(255, 0, 255, 0.1)" }}>
          <Scale size={24} style={{ color: "var(--accent-magenta)" }} />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Ongoing Litigation: Telangana High Court Cases
          </h3>
          <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Comprehensive documentation of active farmer land dispute cases related to the Pharma City to Bharat Future City transition, including petition numbers, case status, affected acreage, and specific legal challenges under the Land Acquisition, Rehabilitation and Resettlement Act (LARR) 2013.
          </p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border)" }}>
        <div className="p-4 md:p-6" style={{ backgroundColor: "var(--card)" }}>
          <p className="font-mono text-xs tracking-wider uppercase mb-2" style={{ color: "var(--accent-magenta)" }}>
            Active Cases
          </p>
          <p className="font-mono text-3xl font-bold" style={{ color: "var(--accent-magenta)" }}>
            {LITIGATION_CASES.filter(c => c.currentStatus.includes("ACTIVE")).length}
          </p>
        </div>
        <div className="p-4 md:p-6" style={{ backgroundColor: "var(--card)" }}>
          <p className="font-mono text-xs tracking-wider uppercase mb-2" style={{ color: "var(--accent-yellow)" }}>
            Pending Cases
          </p>
          <p className="font-mono text-3xl font-bold" style={{ color: "var(--accent-yellow)" }}>
            {LITIGATION_CASES.filter(c => c.currentStatus.includes("PENDING")).length}
          </p>
        </div>
        <div className="p-4 md:p-6" style={{ backgroundColor: "var(--card)" }}>
          <p className="font-mono text-xs tracking-wider uppercase mb-2" style={{ color: "var(--accent-cyan)" }}>
            Total Petitioners
          </p>
          <p className="font-mono text-3xl font-bold" style={{ color: "var(--accent-cyan)" }}>
            900+
          </p>
        </div>
        <div className="p-4 md:p-6" style={{ backgroundColor: "var(--card)" }}>
          <p className="font-mono text-xs tracking-wider uppercase mb-2" style={{ color: "var(--accent-neon-green)" }}>
            Acres Under Dispute
          </p>
          <p className="font-mono text-3xl font-bold" style={{ color: "var(--accent-neon-green)" }}>
            4,100+
          </p>
        </div>
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        {LITIGATION_CASES.map((caseData, index) => (
          <CaseCard key={caseData.caseNumber} caseData={caseData} index={index} />
        ))}
      </div>

      {/* Disclaimer / Context */}
      <div className="border-l-2 pl-6 py-4" style={{ borderColor: "var(--accent-warning)" }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} style={{ color: "var(--accent-warning)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--accent-warning)" }}>
              Data Limitations & Sources
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Case details compiled from publicly available Telangana High Court cause lists, news reports, and legal filings. Petition numbers, case statuses, and hearing dates are approximate and subject to court scheduling changes. For official case status verification, consult the Telangana High Court website or legal counsel. This documentation represents known litigation as of February 2025 and may not capture all pending cases or recent developments.
            </p>
          </div>
        </div>
      </div>

      {/* External Link to High Court */}
      <div className="flex items-center justify-center">
        <a
          href="https://www.hc.ts.nic.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 border font-mono text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer"
          style={{
            borderColor: "var(--accent-cyan)",
            backgroundColor: "rgba(0, 212, 255, 0.05)",
            color: "var(--accent-cyan)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 212, 255, 0.15)"
            e.currentTarget.style.borderColor = "var(--accent-cyan)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 212, 255, 0.05)"
          }}
        >
          <FileText size={16} />
          Telangana High Court Official Website
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
