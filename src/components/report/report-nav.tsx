"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, MoonStar, SunMedium, X } from "lucide-react"
import { useTheme } from "next-themes"

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
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const isDark = mounted ? theme === "dark" : false

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
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between gap-3">
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

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors duration-200 cursor-pointer",
                  activeSection === s.id ? "text-primary" : ""
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
            className="hidden md:inline-flex font-mono uppercase tracking-wider"
          >
            {mounted && isDark ? <SunMedium size={14} /> : <MoonStar size={14} />}
            <span>{mounted && isDark ? "Light" : "Dark"}</span>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
            className="text-primary"
          >
            {mounted && isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 cursor-pointer"
            aria-label="Toggle navigation"
            style={{ color: "var(--primary)" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-4 pt-2"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="mb-3 inline-flex items-center gap-2 font-mono text-sm tracking-wider uppercase"
            style={{ color: "var(--accent)" }}
          >
            {mounted && isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
            {mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
          </button>
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
