import { cn } from "@/lib/utils"

interface MetricCardProps {
  value: string
  label: string
  sentiment?: "positive" | "warning" | "neutral"
  className?: string
}

export function MetricCard({
  value,
  label,
  sentiment = "neutral",
  className,
}: MetricCardProps) {
  const accentColor =
    sentiment === "positive"
      ? "var(--accent-cyan)"
      : sentiment === "warning"
        ? "var(--accent-warning)"
        : "var(--primary)"

  return (
    <div
      className={cn(
        "border p-6 md:p-8 relative overflow-hidden group",
        className
      )}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Accent top line */}
      <div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{ backgroundColor: accentColor }}
      />
      <p
        className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
        style={{ color: accentColor }}
      >
        {value}
      </p>
      <p
        className="mt-3 text-sm md:text-base leading-relaxed"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </p>
    </div>
  )
}
