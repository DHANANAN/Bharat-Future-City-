"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { HeroMetrics } from "@/components/report/hero-metrics"

export function HeroSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 overflow-hidden grid-overlay"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Subtle geometric accent */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--primary) 0, var(--primary) 1px, transparent 1px, transparent 40px)",
        }}
      />

      {/* Accent corner mark */}
      <div
        className="absolute top-8 left-6 md:left-8 flex items-center gap-3 hidden md:flex"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease 0.2s",
        }}
      >
        <div className="w-2 h-2" style={{ backgroundColor: "var(--accent)" }} />
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--muted-foreground)" }}
        >
          Interactive Report / 2025
        </span>
      </div>

      <div className="mx-auto max-w-6xl w-full">
        {/* Main heading */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-primary leading-[0.95] text-balance">
            Bharat Future City
          </h1>
          <p
            className="mt-4 text-lg md:text-2xl lg:text-3xl font-light tracking-tight"
            style={{ color: "var(--muted-foreground)" }}
          >
            Engineering India&apos;s Net-Zero Economic Engine
          </p>
        </div>

        {/* Divider */}
        <div
          className="mt-10 h-px w-full max-w-lg"
          style={{
            backgroundColor: "var(--border)",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 1.1s",
          }}
        />

        {/* Subtext */}
        <div
          className="mt-8 max-w-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 1.2s ease 1.3s",
          }}
        >
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Telangana&apos;s 30,000-acre greenfield smart city — a comprehensive analysis
            of legal feasibility, economic projections, infrastructure integration,
            risk mitigation, and alignment with Vision 2047&apos;s $3 trillion economy target.
          </p>
        </div>

        {/* Animated hero metrics — count-up on scroll into view */}
        <div
          className="mt-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 1.4s ease 1.6s",
          }}
        >
          <HeroMetrics />
        </div>

        {/* Table of contents */}
        <div
          className="mt-14"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 1.8s",
          }}
        >
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--text-dim)" }}
          >
            Contents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { num: "01", label: "Executive Summary", id: "executive-summary" },
              { num: "02", label: "Legal Feasibility", id: "legal-feasibility" },
              { num: "03", label: "Economic Benchmarking", id: "economic-benchmarking" },
              { num: "04", label: "Infrastructure Strategy", id: "infrastructure" },
              { num: "05", label: "Risk Assessment", id: "risk-assessment" },
              { num: "06", label: "Vision 2047 Alignment", id: "vision-2047" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-3 p-3 border cursor-pointer transition-colors duration-200"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface-sunken)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)"
                  e.currentTarget.style.backgroundColor = "var(--surface-elevated)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.backgroundColor = "var(--surface-sunken)"
                }}
              >
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  {item.num}
                </span>
                <span className="text-sm text-primary">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator - removed for cleaner UX */}
    </section>
  )
}
