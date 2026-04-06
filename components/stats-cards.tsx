"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, TrendingDown, Clock, DollarSign } from "lucide-react"
import type { Filament, PrintJob } from "@/lib/types"

interface StatsCardsProps {
  filaments: Filament[]
  printJobs: PrintJob[]
}

export function StatsCards({ filaments, printJobs }: StatsCardsProps) {
  const totalFilaments = filaments.length
  const lowStock = filaments.filter((f) => f.remainingWeight < 300).length
  const totalPrintTime = printJobs.reduce((acc, job) => acc + job.printTime, 0)
  const totalConsumed = printJobs.reduce((acc, job) => acc + job.weightUsed, 0)

  const stats = [
    {
      title: "Filamentos Cadastrados",
      value: totalFilaments,
      subtitle: `${lowStock} com estoque baixo`,
      icon: Package,
      color: "text-chart-2",
    },
    {
      title: "Estoque Baixo",
      value: lowStock,
      subtitle: "Menos de 300g",
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      title: "Tempo Total de Impressão",
      value: `${totalPrintTime.toFixed(1)}h`,
      subtitle: "Este mês",
      icon: Clock,
      color: "text-chart-3",
    },
    {
      title: "Filamento Consumido",
      value: `${(totalConsumed / 1000).toFixed(2)}kg`,
      subtitle: "Este mês",
      icon: DollarSign,
      color: "text-primary",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className={`rounded-lg bg-secondary p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
