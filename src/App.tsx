
import React from "react"
import { ReportNav } from "@/components/report/report-nav"
import { HeroSection } from "@/components/report/hero-section"
import { SectionWrapper } from "@/components/report/section-wrapper"
import { SectionHeader } from "@/components/report/section-header"
import { MetricCard } from "@/components/report/metric-card"
import { MitigationCards } from "@/components/report/mitigation-cards"
import { ZoneSelector } from "@/components/report/zone-selector"
import { LegalTimeline } from "@/components/report/legal-timeline"
import { GDPProjectionViz } from "@/components/report/gdp-projection-viz"
import { InfrastructureMap } from "@/components/report/infrastructure-map"
import { RiskMatrix } from "@/components/report/risk-matrix"
import { PhasedRolloutTimeline } from "@/components/report/phased-rollout-timeline"
import { LandStatusBreakdown } from "@/components/report/land-status-breakdown"
import { EconomicComparisonTable } from "@/components/report/economic-comparison-table"
import { ReportFooter } from "@/components/report/report-footer"
import { LitigationSection } from "@/components/report/litigation-section"

export default function Page() {
  return (
    <main>
      <ReportNav />

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <HeroSection />

      {/* ============================================================ */}
      {/* SECTION 01: EXECUTIVE SUMMARY / CURE-PURE-RARE */}
      {/* ============================================================ */}
      <SectionWrapper id="executive-summary" variant="elevated">
        <SectionHeader
          sectionNumber="01"
          title="Strategic Overview"
          subtitle="Telangana's CURE-PURE-RARE spatial framework and Bharat Future City's role as the state's primary economic engine for Vision 2047."
        />

        <div className="space-y-6">
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--foreground)" }}>
            Bharat Future City represents India&apos;s most ambitious greenfield urban development
            — a 30,000-acre net-zero smart city designed to anchor Telangana&apos;s transformation into a{" "}
            <strong className="text-primary">$3 trillion economy by 2047</strong>. Located 35 km south
            of Hyderabad, the project operationalizes the PURE (Peri-Urban Region Economy) zone within
            Telangana&apos;s pioneering CURE-PURE-RARE spatial framework — making Telangana the first
            Indian state to structure its entire geography into specialized economic zones.
          </p>

          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--foreground)" }}>
            The December 2025 Telangana Global Summit secured{" "}
            <strong className="text-primary">₹5.75 lakh crore in investment pledges</strong>, with
            Brookfield and Adani committing infrastructure capital specifically for the city. Seven
            integrated zones — AI City, Green Pharma, EV Manufacturing, Education Hub, Sports Zone,
            Healthcare, and Aerospace/Defence — target{" "}
            <strong className="text-primary">5 lakh initial jobs</strong> and position Telangana to
            capture 10% of India&apos;s GDP by 2047.
          </p>
        </div>

        {/* CURE-PURE-RARE zone selector */}
        <div className="mt-12">
          <ZoneSelector />
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-rule" />

      {/* ============================================================ */}
      {/* SECTION 02: LEGAL FEASIBILITY ANALYSIS */}
      {/* ============================================================ */}
      <SectionWrapper id="legal-feasibility" variant="default" showGrid>
        <SectionHeader
          sectionNumber="02"
          title="Legal Feasibility Analysis"
          subtitle="Land repurposing compliance pathways under the LARR Act 2013, addressing farmer claims, pending court cases, and enhanced compensation frameworks."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-12" style={{ backgroundColor: "var(--border)" }}>
          <MetricCard value="14,000" label="Acres requiring compliance navigation" sentiment="warning" />
          <MetricCard value="4,174" label="Affected farmers in compensation program" sentiment="neutral" />
          <MetricCard value="2,000+" label="Acres under court stay orders" sentiment="warning" />
        </div>

        {/* Legal timeline */}
        <LegalTimeline className="mb-12" />

        {/* Land status breakdown — heavy component */}
        <LandStatusBreakdown />

        {/* Litigation Section — NEW comprehensive court cases */}
        <div className="mt-16">
          <LitigationSection />
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-rule" />

      {/* ============================================================ */}
      {/* SECTION 03: COMPARATIVE ECONOMIC BENCHMARKING */}
      {/* ============================================================ */}
      <SectionWrapper id="economic-benchmarking" variant="elevated">
        <SectionHeader
          sectionNumber="03"
          title="Comparative Economic Benchmarking"
          subtitle="HITEC City & T-Hub vs. Bharat Future City — current performance against projected economic impact, with explicit data limitation disclosures."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mb-12" style={{ backgroundColor: "var(--border)" }}>
          <MetricCard value="$32B" label="HITEC City IT exports (FY 2022-23)" sentiment="positive" />
          <MetricCard value="905K" label="IT/ITES employees across 1,500 companies" sentiment="positive" />
          <MetricCard value="4.72%" label="Telangana's national GDP share (2023-24) — VERIFIED" sentiment="neutral" />
          <MetricCard value="5L+" label="Jobs targeted by Bharat Future City" sentiment="positive" />
        </div>

        {/* Economic comparison table — heavy component */}
        <EconomicComparisonTable />

        {/* GDP projection visualization — interactive component */}
        <GDPProjectionViz />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-rule" />

      {/* ============================================================ */}
      {/* SECTION 04: INFRASTRUCTURE INTEGRATION STRATEGY */}
      {/* ============================================================ */}
      <SectionWrapper id="infrastructure" variant="default" showGrid>
        <SectionHeader
          sectionNumber="04"
          title="Infrastructure Integration Strategy"
          subtitle="Multi-modal transport network aligned with Vision 2047's CURE-PURE-RARE zonal architecture — highways, metro, dry ports, and industrial corridors."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-12" style={{ backgroundColor: "var(--border)" }}>
          <MetricCard value="360 km" label="Regional Ring Road connecting all major NHs" sentiment="positive" />
          <MetricCard value="39.6 km" label="Metro Phase II Corridor IX to BFC" sentiment="positive" />
          <MetricCard value="2" label="Dry ports for customs & freight aggregation" sentiment="neutral" />
        </div>

        {/* Infrastructure map — interactive component */}
        <InfrastructureMap />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-rule" />

      {/* ============================================================ */}
      {/* SECTION 05: RISK ASSESSMENT */}
      {/* ============================================================ */}
      <SectionWrapper id="risk-assessment" variant="elevated">
        <SectionHeader
          sectionNumber="05"
          title="Risk Assessment & Mitigation"
          subtitle="Critical vulnerabilities across legal, environmental, stakeholder, and governance dimensions — with actionable mitigation strategies and phased rollout plans."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-12" style={{ backgroundColor: "var(--border)" }}>
          <MetricCard value="20 yrs" label="Average land dispute resolution timeline in India" sentiment="warning" />
          <MetricCard value="3" label="Villages with High Court stay orders" sentiment="warning" />
        </div>

        {/* Risk matrix — interactive component */}
        <div className="mb-12">
          <RiskMatrix />
        </div>

        {/* Phased rollout timeline */}
        <PhasedRolloutTimeline className="mb-12" />

        {/* Mitigation strategy cards */}
        <MitigationCards />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-rule" />

      {/* ============================================================ */}
      {/* SECTION 06: VISION 2047 ALIGNMENT */}
      {/* ============================================================ */}
      <SectionWrapper id="vision-2047" variant="default" showGrid>
        <SectionHeader
          sectionNumber="06"
          title="Alignment with Telangana's Vision 2047"
          subtitle="Mapping Bharat Future City's role in achieving Telangana's $3 trillion economy — CURE, PURE, and RARE zone integration, net-zero goals, and greenfield development."
        />

        <div className="space-y-6 mb-12">
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--foreground)" }}>
            Vision 2047 positions Telangana to contribute{" "}
            <strong className="text-primary">10% to India&apos;s projected $30 trillion GDP</strong> by
            2047, with Bharat Future City as the primary driver. This requires more than doubling the
            state&apos;s current 4.72% national GDP share over 22 years — demanding consistently higher
            growth than the national average.
          </p>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--foreground)" }}>
            The CURE-PURE-RARE framework spatially organizes Telangana&apos;s entire geography into
            specialized economic zones. The Core Urban Region Economy (CURE) focuses on IT, finance,
            and R&D within the 160-km Outer Ring Road. The Peri-Urban Region Economy (PURE), anchored
            by Bharat Future City, enables manufacturing, logistics, and industrial expansion. The
            Rural Agri Region Economy (RARE) drives agriculture, green economy, and agro-industries
            beyond the Regional Ring Road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-12" style={{ backgroundColor: "var(--border)" }}>
          <MetricCard value="$3T" label="Telangana Vision 2047 GDP target" sentiment="positive" />
          <MetricCard value="10%" label="Target share of India's national GDP" sentiment="neutral" />
          <MetricCard value="Net-Zero" label="India's first net-zero smart urban hub" sentiment="positive" />
        </div>

        {/* Vision 2047 alignment — uses the zone selector from earlier context */}
        <div
          className="border p-6 md:p-8"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <h3 className="text-xl font-bold text-primary mb-6">Seven Integrated Economic Zones</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { zone: "AI City", desc: "Artificial intelligence research, development, and commercial applications" },
              { zone: "Green Pharma", desc: "Sustainable pharmaceutical manufacturing and biotech innovation" },
              { zone: "EV Manufacturing", desc: "Electric vehicle production, battery tech, and charging infrastructure" },
              { zone: "Education Hub", desc: "Anchored by Young India Skills University — workforce development" },
              { zone: "Healthcare", desc: "Medical tourism, hospital infrastructure, and health-tech startups" },
              { zone: "Aerospace & Defence", desc: "Defence manufacturing, aerospace R&D, and export-oriented production" },
            ].map((z) => (
              <div
                key={z.zone}
                className="border p-4 group cursor-pointer transition-colors duration-200"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface-sunken)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-cyan)";
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--surface-elevated)"
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--surface-sunken)"
                }}
              >
                <p className="font-mono text-sm font-bold text-primary">{z.zone}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {z.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feasibility note */}
        <div
          className="mt-8 border-l-2 pl-6 py-4"
          style={{ borderColor: "var(--accent-warning)" }}
        >
          <p
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: "var(--accent-warning)" }}
          >
            Feasibility Assessment
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            The 10% national GDP target is a highly ambitious aspirational goal representing an extreme
            outlier scenario. A single urban project driving such massive economic shift would be
            historically unprecedented. Success is contingent on flawless execution, massive sustained
            capital inflows, and favorable macroeconomic conditions over 20+ years.
          </p>
        </div>
      </SectionWrapper>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <ReportFooter />
    </main>
  )
}
