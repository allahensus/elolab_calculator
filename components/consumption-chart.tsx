"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { monthlyConsumption } from "@/lib/store"

export function ConsumptionChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">Consumo Mensal por Material</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyConsumption} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPla" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.18 35)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.7 0.18 35)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPetg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAbs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.15 140)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.7 0.15 140)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.12 80)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.75 0.12 80)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" />
              <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}g`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.01 250)",
                  border: "1px solid oklch(0.28 0.01 250)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                labelStyle={{ color: "oklch(0.95 0 0)" }}
                formatter={(value: number) => [`${value}g`, ""]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span style={{ color: "oklch(0.95 0 0)" }}>{value.toUpperCase()}</span>}
              />
              <Area
                type="monotone"
                dataKey="pla"
                stroke="oklch(0.7 0.18 35)"
                fillOpacity={1}
                fill="url(#colorPla)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="petg"
                stroke="oklch(0.65 0.15 200)"
                fillOpacity={1}
                fill="url(#colorPetg)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="abs"
                stroke="oklch(0.7 0.15 140)"
                fillOpacity={1}
                fill="url(#colorAbs)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="tpu"
                stroke="oklch(0.75 0.12 80)"
                fillOpacity={1}
                fill="url(#colorTpu)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
