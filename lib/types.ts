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
