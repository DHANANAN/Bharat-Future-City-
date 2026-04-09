"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const sections = [
  { id: "executive-summary", label: "Overview" },
  { id: "legal-feasibility", label: "Legal" },
  { id: "economic-benchmarking", label: "Economic" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "risk-assessment", label: "Risk" },
  { id: "vision-2047", label: "Vision 2047" },
]

export function ReportNav() {
  const [activeSection, setActiveSection] = useState("executive-summary")
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)

      const sectionEls = sections
        .map((s) => ({
          id: s.id,
          el: document.getElementById(s.id),
        }))
        .filter((s) => s.el !== null)

      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i].el
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(sectionEls[i].id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
      style={{
        backgroundColor: scrolled ? "rgba(0, 0, 0, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
        {/* Logo / Title */}
        <a
          href="#hero"
          className={cn(
            "font-mono text-xs tracking-widest uppercase transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0"
          )}
          style={{ color: "var(--accent)" }}
        >
          BFC Report
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors duration-200 cursor-pointer",
                activeSection === s.id
                  ? "text-primary"
                  : ""
              )}
              style={{
                color:
                  activeSection === s.id ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom:
                  activeSection === s.id
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 cursor-pointer"
          aria-label="Toggle navigation"
          style={{ color: "var(--primary)" }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-4 pt-2"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMobileOpen(false)}
              className="block py-2 font-mono text-sm tracking-wider uppercase cursor-pointer"
              style={{
                color:
                  activeSection === s.id ? "var(--accent)" : "var(--muted-foreground)",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
