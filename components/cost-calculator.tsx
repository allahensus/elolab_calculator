"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calculator, Info, Settings2, Zap, Printer, TrendingUp } from "lucide-react"
import { useFilamentStore } from "@/hooks/use-filament-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const materialTypes = [
  { value: "pla", label: "PLA", avgPrice: 89.9 },
  { value: "petg", label: "PETG", avgPrice: 109.9 },
  { value: "abs", label: "ABS", avgPrice: 99.9 },
  { value: "tpu", label: "TPU", avgPrice: 159.9 },
]

export function CostCalculator({ filaments }: { filaments: any[] }) {
  const { settings, updateSettings, activeCalc, updateActiveCalc, isLoaded } = useFilamentStore()
  const [isMounted, setIsMounted] = useState(false)
  const [selectedFilamentId, setSelectedFilamentId] = useState<string>("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFilamentChange = (id: string) => {
    setSelectedFilamentId(id)
    const filament = filaments.find(f => f.id === id)
    if (filament) {
      updateActiveCalc({ filamentPrice: filament.pricePerKg })
    }
  }

  const costs = useMemo(() => {
    if (!activeCalc || !settings) return { filamentCost: 0, energyCost: 0, machineCost: 0, totalCost: 0 }

    const totalHours = (Number(activeCalc.printTimeHours) || 0) + (Number(activeCalc.printTimeMinutes) || 0) / 60
    const filamentCost = ((Number(activeCalc.filamentPrice) || 0) / 1000) * (Number(activeCalc.weightGrams) || 0)
    const energyCost = (Number(settings.printerPower || 0) / 1000) * (Number(settings.kwhPrice || 0)) * totalHours
    const machineCost = (Number(settings.machineValue || 0) / Number(settings.expectedMachineLifeHours || 1)) * totalHours

    const effectiveMachineCost = activeCalc.includeDepreciation ? machineCost : 0

    return {
      filamentCost,
      energyCost,
      machineCost,
      totalCost: filamentCost + energyCost + effectiveMachineCost
    }
  }, [activeCalc, settings])

  if (!isMounted || !isLoaded || !activeCalc) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground font-medium">Sincronizando Elo Lab 3D...</p>
      </div>
    )
  }

  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader className="pb-4 text-left border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-2">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Calculadora de Custos</CardTitle>
              <CardDescription className="text-xs">Sincronizado com sua produção</CardDescription>
            </div>
          </div>

          {/* Botão de Configuração da Impressora */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Configurar Impressora</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Configuração da Impressora
                </DialogTitle>
                <DialogDescription>
                  Configure os dados da sua Bambu Lab A1 Combo para cálculo preciso de depreciação.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Modelo da Impressora</Label>
                  <Input
                    value={settings.printerName}
                    onChange={(e) => updateSettings({ printerName: e.target.value })}
                    placeholder="Bambu Lab A1 Combo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor da Impressora (R$)</Label>
                  <Input
                    type="number"
                    value={settings.machineValue}
                    onChange={(e) => updateSettings({ machineValue: Number(e.target.value) })}
                    placeholder="4900"
                  />
                  <p className="text-xs text-muted-foreground">Valor pago pela Bambu Lab A1 Combo: R$ 4.900</p>
                </div>
                <div className="space-y-2">
                  <Label>Potência (Watts)</Label>
                  <Input
                    type="number"
                    value={settings.printerPower}
                    onChange={(e) => updateSettings({ printerPower: Number(e.target.value) })}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço do kWh (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.kwhPrice}
                    onChange={(e) => updateSettings({ kwhPrice: Number(e.target.value) })}
                    placeholder="0.95"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vida Útil Estimada (horas)</Label>
                  <Input
                    type="number"
                    value={settings.expectedMachineLifeHours}
                    onChange={(e) => updateSettings({ expectedMachineLifeHours: Number(e.target.value) })}
                    placeholder="8000"
                  />
                  <p className="text-xs text-muted-foreground">8.000 horas é a média para impressoras 3D de qualidade</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Selecione o Material</Label>
            <Select value={selectedFilamentId} onValueChange={handleFilamentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um material" />
              </SelectTrigger>
              <SelectContent>
                {filaments.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
                {materialTypes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Peso (g)</Label>
              <Input
                type="number"
                value={activeCalc.weightGrams}
                onChange={(e) => updateActiveCalc({ weightGrams: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Preço R$/kg</Label>
              <Input
                type="number"
                value={activeCalc.filamentPrice}
                onChange={(e) => updateActiveCalc({ filamentPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Tempo (h)</Label>
              <Input
                type="number"
                value={activeCalc.printTimeHours}
                onChange={(e) => updateActiveCalc({ printTimeHours: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Minutos</Label>
              <Input
                type="number"
                value={activeCalc.printTimeMinutes}
                onChange={(e) => updateActiveCalc({ printTimeMinutes: Number(e.target.value) })}
                max={59}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border">
            <div className="text-left">
              <Label className="text-sm font-bold">Incluir Depreciação</Label>
              <p className="text-[10px] text-muted-foreground">Considerar desgaste da Bambu Lab A1 Combo</p>
            </div>
            <Switch
              checked={activeCalc.includeDepreciation}
              onCheckedChange={(val) => updateActiveCalc({ includeDepreciation: val })}
            />
          </div>
        </div>

        <div className="rounded-xl bg-primary/10 p-5 border border-primary/20 text-left">
          <div className="space-y-1 text-sm">
             <div className="flex justify-between">
               <span className="text-muted-foreground">Filamento:</span>
               <span>R$ {costs.filamentCost.toFixed(2)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Energia:</span>
               <span>R$ {costs.energyCost.toFixed(2)}</span>
             </div>
             {activeCalc.includeDepreciation && (
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Depreciação ({settings.printerName}):</span>
                 <span>R$ {costs.machineCost.toFixed(2)}</span>
               </div>
             )}
             <div className="pt-3 mt-2 border-t border-primary/30 flex justify-between items-end text-primary">
                <span className="font-bold uppercase text-[10px]">Custo Total</span>
                <span className="text-2xl font-black">R$ {costs.totalCost.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Botão para ir para Precificar */}
        <Button
          className="w-full gap-2 bg-chart-3 hover:bg-chart-3/90"
          onClick={() => {
            const pricingTab = document.querySelector('[value="pricing"]') as HTMLElement
            if (pricingTab) pricingTab.click()
          }}
        >
          <TrendingUp className="h-4 w-4" />
          Calcular Preço de Venda
        </Button>
      </CardContent>
    </Card>
  )
}

// Exportação padrão para compatibilidade com named import
export { CostCalculator as default }