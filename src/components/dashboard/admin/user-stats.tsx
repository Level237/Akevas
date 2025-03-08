
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Stat {
  title: string
  value: number
  change: number
  icon: React.ReactNode
}

interface UserStatsProps {
  stats: Stat[]
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value} {stat.title === "Total Revenue" && "XAF"}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change > 0 ? "+" : ""}
              {stat.change}% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

