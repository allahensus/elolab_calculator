export interface Filament {
  id: string
  name: string
  brand: string
  material: string
  color: string
  weight: number // em gramas
  pricePerKg: number
  remainingWeight: number
}

export interface PrintJob {
  id: string
  name: string
  filamentId: string
  weightUsed: number // em gramas
  printTime: number // em horas
  date: string
}

export interface CostCalculation {
  filamentCost: number
  energyCost: number
  machineDepreciation: number
  laborCost: number
  totalCost: number
  suggestedPrice: number
}

// Configurações globais da aplicação
export interface AppSettings {
  printerPower: number // Watts
  kwhPrice: number // Preço do kWh em R$
  machineValue: number // Valor da impressora em R$
  expectedMachineLifeHours: number // Vida útil esperada em horas
  printerName: string // Nome da impressora
}

// Estado ativo do cálculo de custo
export interface ActiveCalculation {
  filamentPrice: number
  weightGrams: number
  printTimeHours: number
  printTimeMinutes: number
  includeDepreciation: boolean
}