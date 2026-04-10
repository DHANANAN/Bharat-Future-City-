import React from "react"
import { ArrowUpRight, BookOpenText, MapPinned, Search, TrainFront, Truck } from "lucide-react"
import { SectionHeader } from "./section-header"
import { SectionWrapper } from "./section-wrapper"

const DPR_LAYERS = [
  {
    title: "Structure plan",
    description:
      "Plot hierarchy, land-use zoning, road hierarchy, utility corridors, public realm edges, and environmental buffers.",
  },
  {
    title: "Transport spine",
    description:
      "Road access, regional ring road tie-ins, metro feasibility, last-mile bus routes, and dedicated freight movement zones.",
  },
  {
    title: "Rail integration",
    description:
      "Cherlapally-oriented passenger and freight links, terminal handling logic, logistics transfer points, and industrial rail access.",
  },
  {
    title: "Utility backbone",
    description:
      "Power, water, drainage, recycled-water loops, ICT ducts, stormwater, and phased service delivery by sector.",
  },
]

const SEARCH_TOPICS = [
  {
    label: "Latest Bharat Future City news",
    keywords: "Bharat Future City latest news Telangana 2026",
  },
  {
    label: "Proposed DPR plan",
    keywords: "Bharat Future City DPR plan layout Telangana",
  },
  {
    label: "Cherlapally rail link",
    keywords: "Cherlapally railway station Bharat Future City connectivity",
  },
  {
    label: "Regional transport links",
    keywords: "Bharat Future City regional ring road metro freight connectivity",
  },
  {
    label: "Recent report or coverage",
    keywords: "Bharat Future City report news Telangana infrastructure",
  },
  {
    label: "Project overview and master plan",
    keywords: "Bharat Future City master plan Telangana infrastructure update",
  },
]

function googleSearchUrl(keywords: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(keywords)}`
}

export function LatestUpdatesSection() {
  return (
    <SectionWrapper id="latest-updates" variant="elevated" showGrid>
      <SectionHeader
        sectionNumber="07"
        title="DPR Plan, Rail Connectivity & Recent Coverage"
        subtitle="A compact closing brief that maps the proposed DPR layout, Cherlapally-linked rail access, and live Google search keywords for the latest Bharat Future City reporting."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div
          className="border p-6 md:p-7"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex size-10 items-center justify-center border"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              <BookOpenText size={18} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                Proposed DPR layout
              </p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Draft structure for the detailed project report
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DPR_LAYERS.map((item) => (
              <div
                key={item.title}
                className="border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}
              >
                <p className="font-mono text-sm tracking-wider uppercase" style={{ color: "var(--primary)" }}>
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-l-2 pl-4 py-3" style={{ borderColor: "var(--accent-warning)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Use this as a presentation-ready summary rather than a formal engineering DPR. It is framed as a
              planning outline that can be aligned with government, rail, and utility studies.
            </p>
          </div>
        </div>

        <div
          className="border p-6 md:p-7"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex size-10 items-center justify-center border"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              <TrainFront size={18} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                Rail and infra links
              </p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Cherlapally, freight access, and regional connectors
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              "Cherlapally rail terminal / station references for passenger and freight access planning.",
              "Regional Ring Road, radial corridors, and industrial access routes feeding the city edge.",
              "Metro, bus, and last-mile mobility links that connect employment zones to the broader Hyderabad region.",
              "Dry port and logistics aggregation points that reduce truck congestion inside the urban core.",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="mt-1 shrink-0" style={{ color: "var(--accent)" }}>
                  <MapPinned size={16} strokeWidth={2.2} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--primary)" }}>
              <Truck size={16} strokeWidth={2.2} />
              Search-first research note
            </div>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              The links below are Google searches built from keywords, so you can quickly pull the latest articles,
              press notes, and reports without hard-coding a potentially stale source.
            </p>
          </div>
        </div>
      </div>

      <div className="border p-6 md:p-7" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex size-10 items-center justify-center border"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            <Search size={18} strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              Latest report and news keywords
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Tap a query to open Google search results in a new tab.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {SEARCH_TOPICS.map((topic) => {
            const searchUrl = googleSearchUrl(topic.keywords)
            return (
              <a
                key={topic.keywords}
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start justify-between gap-3 border px-4 py-3 transition-colors duration-200 hover:brightness-110"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-sunken)" }}
              >
                <span>
                  <span className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {topic.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
                    {topic.keywords}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.2}
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: "var(--accent)" }}
                />
              </a>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}