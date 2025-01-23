import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  change: {
    value: number
    trend: "up" | "down"
  }
  icon: React.ReactNode
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="transition-transform hover:scale-110">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span className="text-sm">This week</span>
          <span
            className={`ml-2 text-sm flex items-center gap-0.5 transition-colors
              ${change.trend === "up" ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}
            `}
          >
            {change.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {change.value}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

