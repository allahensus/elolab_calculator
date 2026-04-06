"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Valores médios pré-definidos
const ENERGY_COST_PER_HOUR = 0.15
const MACHINE_DEPRECIATION_PER_HOUR = 0.5

const materialTypes = [
  { value: "pla", label: "PLA", avgPrice: 89.9 },
  { value: "petg", label: "PETG", avgPrice: 109.9 },
  { value: "abs", label: "ABS", avgPrice: 99.9 },
  { value: "tpu", label: "TPU", avgPrice: 159.9 },
  { value: "pla_plus", label: "PLA+", avgPrice: 119.9 },
  { value: "silk", label: "PLA Silk", avgPrice: 139.9 },
]

const complexityMultipliers = [
  { value: "simple", label: "Simples", multiplier: 1.0, description: "Peça básica, sem detalhes" },
  { value: "medium", label: "Médio", multiplier: 1.3, description: "Alguns detalhes ou suportes" },
  { value: "complex", label: "Complexo", multiplier: 1.6, description: "Muitos detalhes, pós-processamento" },
  { value: "custom", label: "Customizado", multiplier: 2.0, description: "Modelagem 3D inclusa" },
]

export function PricingCalculator() {
  const [material, setMaterial] = useState("pla")
  const [filamentPrice, setFilamentPrice] = useState(89.9)
  const [weightGrams, setWeightGrams] = useState(50)
  const [printTimeHours, setPrintTimeHours] = useState(3)
  const [printTimeMinutes, setPrintTimeMinutes] = useState(0)
  const [complexity, setComplexity] = useState("simple")
  const [profitMargin, setProfitMargin] = useState(100) // Porcentagem de lucro
  const [quantity, setQuantity] = useState(1)

  const totalPrintTime = printTimeHours + printTimeMinutes / 60

  const pricing = useMemo(() => {
    // Custo base
    const filamentCost = (filamentPrice / 1000) * weightGrams
    const energyCost = ENERGY_COST_PER_HOUR * totalPrintTime
    const machineCost = MACHINE_DEPRECIATION_PER_HOUR * totalPrintTime
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
      profitPercentage: ((profit / totalCost) * 100).toFixed(0),
    }
  }, [filamentPrice, weightGrams, totalPrintTime, complexity, profitMargin, quantity])

  const handleMaterialChange = (value: string) => {
    setMaterial(value)
    const selectedMaterial = materialTypes.find((m) => m.value === value)
    if (selectedMaterial) {
      setFilamentPrice(selectedMaterial.avgPrice)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-chart-3/20 p-2">
            <TrendingUp className="h-5 w-5 text-chart-3" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium text-foreground">Calculadora de Preço de Venda</CardTitle>
            <CardDescription>Defina o preço ideal para seus produtos</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Material e Preço */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Material</Label>
            <Select value={material} onValueChange={handleMaterialChange}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Preço (R$/kg)</Label>
            <Input
              type="number"
              value={filamentPrice}
              onChange={(e) => setFilamentPrice(Number(e.target.value))}
              className="bg-input border-border text-foreground"
              min={0}
              step={0.01}
            />
          </div>
        </div>

        {/* Peso e Tempo */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Peso (g)</Label>
            <Input
              type="number"
              value={weightGrams}
              onChange={(e) => setWeightGrams(Number(e.target.value))}
              className="bg-input border-border text-foreground"
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Horas</Label>
            <Input
              type="number"
              value={printTimeHours}
              onChange={(e) => setPrintTimeHours(Number(e.target.value))}
              className="bg-input border-border text-foreground"
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Minutos</Label>
            <Input
              type="number"
              value={printTimeMinutes}
              onChange={(e) => setPrintTimeMinutes(Number(e.target.value))}
              className="bg-input border-border text-foreground"
              min={0}
              max={59}
            />
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
