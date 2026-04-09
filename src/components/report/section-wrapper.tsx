"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
  /** Whether this section has an alternate (elevated) background */
  variant?: "default" | "elevated" | "sunken"
  /** Whether to show grid overlay */
  showGrid?: boolean
}

export function SectionWrapper({
  id,
  children,
  className,
  variant = "default",
  showGrid = false,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const bgMap = {
    default: "bg-background",
    elevated: "",
    sunken: "",
  }

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative w-full py-20 px-6 md:py-28 md:px-8 lg:py-32",
        bgMap[variant],
        showGrid && "grid-overlay",
        className
      )}
      style={{
        backgroundColor:
          variant === "elevated"
            ? "var(--surface-elevated)"
            : variant === "sunken"
              ? "var(--surface-sunken)"
              : undefined,
      }}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {children}
      </div>
    </section>
  )
}
