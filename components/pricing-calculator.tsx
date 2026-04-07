"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { DollarSign, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useFilamentStore } from "@/hooks/use-filament-store"

const complexityMultipliers = [
  { value: "simple", label: "Simples", multiplier: 1.0, description: "Peça básica, sem detalhes" },
  { value: "medium", label: "Médio", multiplier: 1.3, description: "Alguns detalhes ou suportes" },
  { value: "complex", label: "Complexo", multiplier: 1.6, description: "Muitos detalhes, pós-processamento" },
  { value: "custom", label: "Customizado", multiplier: 2.0, description: "Modelagem 3D inclusa" },
]

export function PricingCalculator() {
  const { activeCalc, settings, updateActiveCalc } = useFilamentStore()

  // Estados locais para a calculadora de preço
  const [complexity, setComplexity] = useState("simple")
  const [profitMargin, setProfitMargin] = useState(100)
  const [quantity, setQuantity] = useState(1)

  // Sincroniza os dados do Custo com a Precificação automaticamente
  const totalPrintTime = (activeCalc?.printTimeHours || 0) + (activeCalc?.printTimeMinutes || 0) / 60

  const pricing = useMemo(() => {
    if (!activeCalc || !settings) {
      return {
        baseCost: 0,
        adjustedCost: 0,
        pricePerUnit: 0,
        discountedPrice: 0,
        totalPrice: 0,
        profit: 0,
        quantityDiscount: 0,
        profitPercentage: "0",
      }
    }

    // Cálculo do custo base (mesma fórmula do CostCalculator)
    const filamentCost = ((activeCalc.filamentPrice || 0) / 1000) * (activeCalc.weightGrams || 0)
    const energyCost = (settings.printerPower / 1000) * settings.kwhPrice * totalPrintTime
    const machineCost = activeCalc.includeDepreciation
      ? (settings.machineValue / settings.expectedMachineLifeHours) * totalPrintTime
      : 0

    const baseCost = filamentCost + energyCost + machineCost

    // Multiplicador de complexidade
    const complexityData = complexityMultipliers.find((c) => c.value === complexity)
    const complexityMultiplier = complexityData?.multiplier || 1

    // Custo ajustado pela complexidade
    const adjustedCost = baseCost * complexityMultiplier

    // Preço com margem de lucro
    const pricePerUnit = adjustedCost * (1 + profitMargin / 100)

    // Desconto por quantidade
    let quantityDiscount = 0
    if (quantity >= 10) quantityDiscount = 0.15
    else if (quantity >= 5) quantityDiscount = 0.1
    else if (quantity >= 3) quantityDiscount = 0.05

    const discountedPrice = pricePerUnit * (1 - quantityDiscount)
    const totalPrice = discountedPrice * quantity

    // Lucro real
    const totalCost = baseCost * quantity
    const profit = totalPrice - totalCost

    return {
      baseCost,
      adjustedCost,
      pricePerUnit,
      discountedPrice,
      totalPrice,
      profit,
      quantityDiscount: quantityDiscount * 100,
      profitPercentage: totalCost > 0 ? ((profit / totalCost) * 100).toFixed(0) : "0",
    }
  }, [activeCalc, settings, totalPrintTime, complexity, profitMargin, quantity])

  // Voltar para a aba de Custo
  const goToCostTab = () => {
    const costTab = document.querySelector('[value="cost"]') as HTMLElement
    if (costTab) costTab.click()
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-chart-3/20 p-2">
              <TrendingUp className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-foreground">Calculadora de Preço de Venda</CardTitle>
              <CardDescription>Defina o preço ideal para seus produtos</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={goToCostTab} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Custo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Dados vindos do Custo (apenas leitura) */}
        <div className="rounded-lg bg-secondary/30 p-4 border border-border">
          <h4 className="mb-3 text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-chart-3" />
            Dados da Impressão (da aba Custo)
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Material (R$/kg)</p>
              <p className="font-medium">R$ {activeCalc?.filamentPrice?.toFixed(2) || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Peso</p>
              <p className="font-medium">{activeCalc?.weightGrams || 0}g</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Tempo</p>
              <p className="font-medium">
                {activeCalc?.printTimeHours || 0}h {activeCalc?.printTimeMinutes || 0}min
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Depreciação</p>
              <p className="font-medium">{activeCalc?.includeDepreciation ? "✓ Incluída" : "✗ Não incluída"}</p>
            </div>
          </div>
        </div>

        {/* Complexidade */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Complexidade do Trabalho</Label>
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {complexityMultipliers.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label} - {c.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Margem de Lucro */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">Margem de Lucro</Label>
            <span className="text-sm font-medium text-primary">{profitMargin}%</span>
          </div>
          <Slider
            value={[profitMargin]}
            onValueChange={(value) => setProfitMargin(value[0])}
            min={50}
            max={300}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50%</span>
            <span>150%</span>
            <span>300%</span>
          </div>
        </div>

        {/* Quantidade */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Quantidade</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="bg-input border-border text-foreground"
            min={1}
          />
          {pricing.quantityDiscount > 0 && (
            <p className="flex items-center gap-1 text-xs text-chart-3">
              <AlertCircle className="h-3 w-3" />
              Desconto de {pricing.quantityDiscount}% aplicado por quantidade
            </p>
          )}
        </div>

        {/* Resultados */}
        <div className="mt-6 space-y-3">
          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <h4 className="mb-3 text-sm font-medium text-foreground">Resumo de Preços</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custo base por unidade:</span>
                <span className="text-foreground">R$ {pricing.baseCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custo ajustado (complexidade):</span>
                <span className="text-foreground">R$ {pricing.adjustedCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preço por unidade:</span>
                <span className="text-foreground">R$ {pricing.discountedPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preço Total Sugerido</p>
                <p className="text-2xl font-bold text-primary">R$ {pricing.totalPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Lucro Estimado</p>
                <p className="flex items-center gap-1 text-lg font-semibold text-chart-3">
                  <DollarSign className="h-4 w-4" />
                  R$ {pricing.profit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Exportação padrão para compatibilidade com named import
export { PricingCalculator as default }