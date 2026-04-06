import type { Filament, PrintJob } from "./types"

// Dados de exemplo para demonstração
export const sampleFilaments: Filament[] = [
  {
    id: "1",
    name: "PLA Preto",
    brand: "3D Fila",
    material: "PLA",
    color: "#1a1a1a",
    weight: 1000,
    pricePerKg: 89.9,
    remainingWeight: 450,
  },
  {
    id: "2",
    name: "PETG Branco",
    brand: "3D Fila",
    material: "PETG",
    color: "#f5f5f5",
    weight: 1000,
    pricePerKg: 109.9,
    remainingWeight: 780,
  },
  {
    id: "3",
    name: "ABS Vermelho",
    brand: "Voolt",
    material: "ABS",
    color: "#e53935",
    weight: 1000,
    pricePerKg: 99.9,
    remainingWeight: 200,
  },
  {
    id: "4",
    name: "PLA Azul",
    brand: "3D Fila",
    material: "PLA",
    color: "#1976d2",
    weight: 1000,
    pricePerKg: 89.9,
    remainingWeight: 920,
  },
  {
    id: "5",
    name: "TPU Transparente",
    brand: "eSUN",
    material: "TPU",
    color: "#e0e0e0",
    weight: 500,
    pricePerKg: 159.9,
    remainingWeight: 350,
  },
]

export const samplePrintJobs: PrintJob[] = [
  { id: "1", name: "Suporte Celular", filamentId: "1", weightUsed: 45, printTime: 3.5, date: "2026-04-01" },
  { id: "2", name: "Vaso Decorativo", filamentId: "2", weightUsed: 120, printTime: 8, date: "2026-04-02" },
  { id: "3", name: "Capa Protetora", filamentId: "3", weightUsed: 35, printTime: 2, date: "2026-04-02" },
  { id: "4", name: "Miniatura RPG", filamentId: "1", weightUsed: 15, printTime: 4, date: "2026-04-03" },
  { id: "5", name: "Organizador Mesa", filamentId: "4", weightUsed: 80, printTime: 6, date: "2026-04-03" },
  { id: "6", name: "Chaveiro Custom", filamentId: "1", weightUsed: 8, printTime: 0.5, date: "2026-04-04" },
  { id: "7", name: "Case Raspberry", filamentId: "2", weightUsed: 65, printTime: 5, date: "2026-04-04" },
  { id: "8", name: "Peça Flexível", filamentId: "5", weightUsed: 25, printTime: 2, date: "2026-04-05" },
  { id: "9", name: "Prototipo Engrenagem", filamentId: "3", weightUsed: 40, printTime: 3, date: "2026-04-05" },
  { id: "10", name: "Base Luminária", filamentId: "4", weightUsed: 150, printTime: 10, date: "2026-04-06" },
]

// Consumo mensal de exemplo (últimos 6 meses)
export const monthlyConsumption = [
  { month: "Nov", pla: 850, petg: 320, abs: 180, tpu: 50 },
  { month: "Dez", pla: 1200, petg: 450, abs: 220, tpu: 80 },
  { month: "Jan", pla: 950, petg: 380, abs: 150, tpu: 60 },
  { month: "Fev", pla: 1100, petg: 520, abs: 280, tpu: 120 },
  { month: "Mar", pla: 1350, petg: 480, abs: 200, tpu: 90 },
  { month: "Abr", pla: 680, petg: 285, abs: 75, tpu: 25 },
]
