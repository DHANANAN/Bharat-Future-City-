import { cn } from "@/lib/utils"

interface ComponentPlaceholderProps {
  name: string
  description: string
  height?: string
  className?: string
}

/**
 * Placeholder for heavy interactive components that will be implemented later.
 * Renders a visible wireframe-style box matching the data brutalism aesthetic.
 */
export function ComponentPlaceholder({
  name,
  description,
  height = "320px",
  className,
}: ComponentPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative border border-dashed flex flex-col items-center justify-center p-8 text-center",
        className
      )}
      style={{
        minHeight: height,
        borderColor: "var(--border)",
        backgroundColor: "var(--surface-sunken)",
      }}
    >
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "var(--accent)" }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: "var(--accent)" }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: "var(--accent)" }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: "var(--accent)" }} />

      <span
        className="font-mono text-xs tracking-widest uppercase mb-3"
        style={{ color: "var(--accent)" }}
      >
        Component
      </span>
      <p className="font-mono text-lg font-bold text-primary">{name}</p>
      <p
        className="mt-2 text-sm max-w-md leading-relaxed"
        style={{ color: "var(--text-dim)" }}
      >
        {description}
      </p>
    </div>
  )
}
