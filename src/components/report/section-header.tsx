import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  sectionNumber: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({
  sectionNumber,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <div className="flex items-center gap-4 mb-4">
        <span
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: "var(--accent)" }}
        >
          {sectionNumber}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 text-lg md:text-xl max-w-3xl leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
