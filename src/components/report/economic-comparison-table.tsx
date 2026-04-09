'use client'

import { useState } from 'react'
import { Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ValueMode = 'current' | 'projected'

interface DataRow {
  metric: string
  hitecValue: string
  hitecSource: string
  hitecYear: string
  bfcValue: string
  bfcTimeline: string
  projectedHitec?: string
  projectedBFC?: string
  details?: string
  warning?: string
}

const tableData: DataRow[] = [
  {
    metric: 'IT/Tech Exports',
    hitecValue: '$32B (₹2.41T)',
    hitecSource: 'Telangana IT Department',
    hitecYear: 'FY 2022-23',
    bfcValue: 'Multi-sector diversification',
    bfcTimeline: '2026-2047',
    projectedHitec: '$48B (₹3.6T)',
    projectedBFC: '$150B+ (₹11.25T)',
    details: 'HITEC City established IT exports infrastructure; BFC aims for broader economic diversification across AI, pharma, EV manufacturing, and aerospace sectors.',
  },
  {
    metric: 'Employment',
    hitecValue: '905,715 IT/ITES employees',
    hitecSource: 'NASSCOM/State IT Records',
    hitecYear: '2023',
    bfcValue: '500,000+ jobs (target)',
    bfcTimeline: 'By 2047',
    projectedHitec: '1.2M employees',
    projectedBFC: '500K+ employees',
    details: 'HITEC City hosts 1,500+ companies; BFC targets diversified employment across seven economic zones with emphasis on manufacturing and R&D.',
  },
  {
    metric: 'Total Companies',
    hitecValue: '1,500+ companies',
    hitecSource: 'HITEC City Association',
    hitecYear: '2023',
    bfcValue: 'Target: 2,000+ companies',
    bfcTimeline: 'By 2047',
    projectedHitec: '2,000+ companies',
    projectedBFC: '2,000+ companies',
    details: 'HITEC City concentrated on IT services; BFC aims for industrial diversification including global manufacturing hubs and unicorn incubation.',
  },
  {
    metric: 'GDP Contribution (Local)',
    hitecValue: '~14% of Hyderabad GDP',
    hitecSource: 'Economic Census 2021',
    hitecYear: '2021',
    bfcValue: 'Primary Vision 2047 engine',
    bfcTimeline: '2026-2047',
    projectedHitec: '~16% of Hyderabad GDP',
    projectedBFC: 'Target: 40% of Telangana GDP',
    details: 'HITEC City anchors Hyderabad\'s services economy; BFC positioned as the primary driver of Telangana\'s $3 trillion economy target.',
  },
  {
    metric: 'National GDP Contribution',
    hitecValue: '~5% (UNVERIFIED CLAIM)',
    hitecSource: 'No verified source',
    hitecYear: '—',
    bfcValue: 'Target: 10% by 2047',
    bfcTimeline: '2047',
    projectedHitec: '~5.5% (if claim accurate)',
    projectedBFC: '10% of India GDP',
    details: 'Telangana state contributed 4.72% to national GDP in 2023-24, making the 5% HITEC City claim statistically improbable.',
    warning: 'The 5% national GDP claim for HITEC City could not be verified. Telangana\'s entire state economy was 4.72% of national GDP in 2023-24, making this figure for a single corridor impossible.',
  },
  {
    metric: 'Investment Secured',
    hitecValue: 'Organic growth (decades)',
    hitecSource: 'Historical development',
    hitecYear: '1998-2023',
    bfcValue: '₹5.75 lakh crore pledged',
    bfcTimeline: 'Dec 2025 Summit',
    projectedHitec: 'Continued organic growth',
    projectedBFC: '₹8.63 lakh crore (inflation-adjusted)',
    details: 'HITEC City grew organically over 25+ years; BFC secured unprecedented upfront investment pledges from Brookfield, Adani, and international investors.',
  },
  {
    metric: 'Land Area',
    hitecValue: '~500 acres core area',
    hitecSource: 'HITEC City Development Authority',
    hitecYear: '2023',
    bfcValue: '30,000 acres (765 sq km zone)',
    bfcTimeline: '2026-2047',
    projectedHitec: '~500 acres',
    projectedBFC: '30,000 acres',
    details: 'HITEC City is a dense urban tech corridor; BFC is a greenfield net-zero smart city with 60x the land area for integrated industrial, residential, and innovation zones.',
  },
  {
    metric: 'Innovation Ecosystem',
    hitecValue: 'T-Hub: 2,000+ startups, $2B+ funding',
    hitecSource: 'T-Hub Annual Report',
    hitecYear: '2024',
    bfcValue: 'AI City, Education Hub, R&D clusters',
    bfcTimeline: 'Phased rollout',
    projectedHitec: '3,000+ startups, $4B+ funding',
    projectedBFC: 'Target: 5,000+ startups',
    details: 'T-Hub has facilitated 25,000+ jobs and established Hyderabad as India\'s startup hub; BFC aims to replicate and expand this model with AI-first infrastructure.',
  },
]

export function EconomicComparisonTable() {
  const [valueMode, setValueMode] = useState<ValueMode>('current')
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  return (
    <div className="w-full space-y-6">
      {/* Header with toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-primary font-mono">
            HITEC City & T-Hub vs. Bharat Future City
          </h3>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Comparative economic metrics with verified data sources. Hover for details.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2 border p-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <button
            onClick={() => setValueMode('current')}
            className={cn(
              'px-4 py-2 text-xs font-mono tracking-wide uppercase transition-colors cursor-pointer',
              valueMode === 'current' ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
            style={{
              backgroundColor: valueMode === 'current' ? 'var(--primary)' : 'transparent',
            }}
          >
            Current (2023-25)
          </button>
          <button
            onClick={() => setValueMode('projected')}
            className={cn(
              'px-4 py-2 text-xs font-mono tracking-wide uppercase transition-colors cursor-pointer',
              valueMode === 'projected' ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
            style={{
              backgroundColor: valueMode === 'projected' ? 'var(--primary)' : 'transparent',
            }}
          >
            Projected (2047)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-elevated)' }}>
              <th
                className="border p-4 text-left text-xs font-mono tracking-wider uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                Metric
              </th>
              <th
                className="border p-4 text-left text-xs font-mono tracking-wider uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                HITEC City + T-Hub
              </th>
              <th
                className="border p-4 text-left text-xs font-mono tracking-wider uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                Bharat Future City
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr
                key={idx}
                className="transition-all duration-200 cursor-pointer relative"
                style={{
                  backgroundColor: hoveredRow === idx ? 'var(--surface-elevated)' : 'var(--card)',
                }}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Metric column */}
                <td
                  className="border p-4 font-medium align-top"
                  style={{
                    borderColor: hoveredRow === idx ? 'var(--accent-cyan)' : 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span>{row.metric}</span>
                    {row.warning && (
                      <button
                        className="relative flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTooltip(activeTooltip === idx ? null : idx)
                        }}
                        onMouseEnter={() => setActiveTooltip(idx)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <AlertTriangle
                          size={16}
                          style={{ color: 'var(--accent-warning)' }}
                        />
                        {activeTooltip === idx && (
                          <div
                            className="absolute left-6 top-0 z-50 w-64 border p-3 text-xs leading-relaxed shadow-lg"
                            style={{
                              backgroundColor: 'var(--popover)',
                              borderColor: 'var(--accent-warning)',
                              color: 'var(--popover-foreground)',
                            }}
                          >
                            {row.warning}
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </td>

                {/* HITEC City column */}
                <td
                  className="border p-4 align-top"
                  style={{
                    borderColor: hoveredRow === idx ? 'var(--accent-cyan)' : 'var(--border)',
                  }}
                >
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-medium" style={{ color: 'var(--primary)' }}>
                      {valueMode === 'current' ? row.hitecValue : (row.projectedHitec || row.hitecValue)}
                    </p>
                    {valueMode === 'current' && (
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {row.hitecSource} • {row.hitecYear}
                      </p>
                    )}
                  </div>
                </td>

                {/* BFC column */}
                <td
                  className="border p-4 align-top"
                  style={{
                    borderColor: hoveredRow === idx ? 'var(--accent-cyan)' : 'var(--border)',
                  }}
                >
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-medium" style={{ color: 'var(--accent-cyan)' }}>
                      {valueMode === 'current' ? row.bfcValue : (row.projectedBFC || row.bfcValue)}
                    </p>
                    {valueMode === 'current' && (
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {row.bfcTimeline}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details panel - shows on hover */}
      {hoveredRow !== null && (
        <div
          className="border-l-2 pl-6 py-4 transition-all duration-300"
          style={{ borderColor: 'var(--accent-cyan)', backgroundColor: 'var(--surface-elevated)' }}
        >
          <div className="flex items-start gap-3">
            <Info size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--accent-cyan)' }}>
                {tableData[hoveredRow].metric} — Detailed Context
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {tableData[hoveredRow].details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data disclaimer */}
      <div
        className="border-l-2 pl-6 py-4 mt-8"
        style={{ borderColor: 'var(--accent-warning)' }}
      >
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--accent-warning)' }}>
          Data Limitation Notice
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          The claim that HITEC City and T-Hub combined contribute approximately 5% of India&apos;s national GDP
          could not be substantiated through official sources. Telangana state contributed 4.72% to national
          GDP in 2023-24, making a 5% contribution from a sub-region statistically improbable. Projected 2047
          values use conservative 3% annual inflation and 6% nominal GDP growth assumptions. All figures should
          be treated as estimates subject to macroeconomic variability.
        </p>
      </div>
    </div>
  )
}
