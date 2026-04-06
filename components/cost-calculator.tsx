"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Filament } from "@/lib/types"

// Valores médios pré-definidos para facilitar o uso
const ENERGY_COST_PER_HOUR = 0.15 // R$ por hora de impressão (média para impressoras FDM)
const MACHINE_DEPRECIATION_PER_HOUR = 0.5 // R$ por hora considerando impressora de ~R$2000 com 4000h de vida útil

// Tipos de material com preços médios (usado quando não há filamentos cadastrados)
const materialTypes = [
  { value: "pla", label: "PLA", avgPrice: 89.9 },
  { value: "petg", label: "PETG", avgPrice: 109.9 },
  { value: "abs", label: "ABS", avgPrice: 99.9 },
  { value: "tpu", label: "TPU", avgPrice: 159.9 },
  { value: "pla_plus", label: "PLA+", avgPrice: 119.9 },
  { value: "silk", label: "PLA Silk", avgPrice: 139.9 },
]

interface CostCalculatorProps {
  filaments?: Filament[]
}

export function CostCalculator({ filaments = [] }: CostCalculatorProps) {
  const [selectedFilamentId, setSelectedFilamentId] = useState<string>("")
  const [material, setMaterial] = useState("pla")
  const [filamentPrice, setFilamentPrice] = useState(89.9)
  const [weightGrams, setWeightGrams] = useState(50)
  const [printTimeHours, setPrintTimeHours] = useState(3)
  const [printTimeMinutes, setPrintTimeMinutes] = useState(0)

  const hasFilaments = filaments.length > 0
  const selectedFilament = filaments.find((f) => f.id === selectedFilamentId)

  // Usa o preço do filamento selecionado ou o preço manual
  const effectivePrice = selectedFilament ? selectedFilament.pricePerKg : filamentPrice

  const totalPrintTime = printTimeHours + printTimeMinutes / 60

  const costs = useMemo(() => {
    // Custo do filamento (preço por kg / 1000 * peso em gramas)
    const filamentCost = (effectivePrice / 1000) * weightGrams

    // Custo de energia (valor médio já calculado)
    const energyCost = ENERGY_COST_PER_HOUR * totalPrintTime

    // Depreciação da máquina
    const machineCost = MACHINE_DEPRECIATION_PER_HOUR * totalPrintTime

    // Custo total
    const totalCost = filamentCost + energyCost + machineCost

    return {
      filamentCost,
      energyCost,
      machineCost,
      totalCost,
    }
  }, [effectivePrice, weightGrams, totalPrintTime])

  const handleMaterialChange = (value: string) => {
    setMaterial(value)
    const selectedMaterial = materialTypes.find((m) => m.value === value)
    if (selectedMaterial) {
      setFilamentPrice(selectedMaterial.avgPrice)
    }
  }

  const handleFilamentChange = (value: string) => {
    setSelectedFilamentId(value)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/20 p-2">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium text-foreground">Calculadora de Custos</CardTitle>
            <CardDescription>Calcule o custo real da sua impressão</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Seleção de filamento (se houver cadastrados) */}
        {hasFilaments ? (
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Selecione o Filamento</Label>
            <Select value={selectedFilamentId} onValueChange={handleFilamentChange}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Escolha um filamento cadastrado" />
              </SelectTrigger>
              <SelectContent>
                {filaments.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: f.color }}
                      />
                      {f.name} - R$ {f.pricePerKg.toFixed(2)}/kg
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFilament && (
              <p className="text-xs text-muted-foreground">
                {selectedFilament.material} • {selectedFilament.brand} • {selectedFilament.remainingWeight}g disponíveis
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Material (fallback quando não há filamentos) */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Tipo de Material</Label>
              <Select value={material} onValueChange={handleMaterialChange}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label} (média R$ {m.avgPrice.toFixed(2)}/kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preço do filamento */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-foreground">Preço do Filamento (R$/kg)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground">
                      <p>Ajuste para o preço que você pagou</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={filamentPrice}
                onChange={(e) => setFilamentPrice(Number(e.target.value))}
                className="bg-input border-border text-foreground"
                min={0}
                step={0.01}
              />
            </div>
          </>
        )}

        {/* Peso utilizado */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-foreground">Peso da Peça (gramas)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground">
                  <p>Veja no fatiador (Cura, PrusaSlicer)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="number"
            value={weightGrams}
            onChange={(e) => setWeightGrams(Number(e.target.value))}
            className="bg-input border-border text-foreground"
            min={0}
          />
        </div>

        {/* Tempo de impressão */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Tempo de Impressão</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Horas</span>
              <Input
                type="number"
                value={printTimeHours}
                onChange={(e) => setPrintTimeHours(Number(e.target.value))}
                className="bg-input border-border text-foreground"
                min={0}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Minutos</span>
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
        </div>

        {/* Resultados */}
        <div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">Detalhamento do Custo</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Filamento:</span>
              <span className="text-foreground">R$ {costs.filamentCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Energia elétrica:</span>
              <span className="text-foreground">R$ {costs.energyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desgaste da máquina:</span>
              <span className="text-foreground">R$ {costs.machineCost.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3">
              <span className="font-medium text-foreground">Custo Total:</span>
              <span className="text-lg font-semibold text-primary">R$ {costs.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
