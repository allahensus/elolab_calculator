"use client"

import { useState, useEffect, useCallback } from "react"
import type { Filament, PrintJob, AppSettings, ActiveCalculation } from "@/lib/types"
import { sampleFilaments, samplePrintJobs } from "@/lib/store"

const STORAGE_KEY_FILAMENTS = "filacontrol-filaments"
const STORAGE_KEY_PRINTS = "filacontrol-prints"
const STORAGE_KEY_SETTINGS = "filacontrol-settings"
const STORAGE_KEY_ACTIVE_CALC = "filacontrol-active-calc"

// Configurações padrão - Bambu Lab A1 Combo
const DEFAULT_SETTINGS: AppSettings = {
  printerPower: 150, // Watts (Bambu Lab A1)
  kwhPrice: 0.95, // Preço médio do kWh no Brasil
  machineValue: 4900, // Valor da Bambu Lab A1 Combo
  expectedMachineLifeHours: 8000, // Vida útil estimada em horas
  printerName: "Bambu Lab A1 Combo"
}

// Estado padrão do cálculo ativo
const DEFAULT_ACTIVE_CALC: ActiveCalculation = {
  filamentPrice: 89.9,
  weightGrams: 50,
  printTimeHours: 3,
  printTimeMinutes: 0,
  includeDepreciation: true // Default true para considerar depreciação
}

export function useFilamentStore() {
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([])
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [activeCalc, setActiveCalc] = useState<ActiveCalculation>(DEFAULT_ACTIVE_CALC)
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega dados do localStorage ou usa dados de exemplo
  useEffect(() => {
    const storedFilaments = localStorage.getItem(STORAGE_KEY_FILAMENTS)
    const storedPrints = localStorage.getItem(STORAGE_KEY_PRINTS)
    const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS)
    const storedActiveCalc = localStorage.getItem(STORAGE_KEY_ACTIVE_CALC)

    if (storedFilaments) {
      setFilaments(JSON.parse(storedFilaments))
    } else {
      setFilaments(sampleFilaments)
      localStorage.setItem(STORAGE_KEY_FILAMENTS, JSON.stringify(sampleFilaments))
    }

    if (storedPrints) {
      setPrintJobs(JSON.parse(storedPrints))
    } else {
      setPrintJobs(samplePrintJobs)
      localStorage.setItem(STORAGE_KEY_PRINTS, JSON.stringify(samplePrintJobs))
    }

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    } else {
      setSettings(DEFAULT_SETTINGS)
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS))
    }

    if (storedActiveCalc) {
      setActiveCalc(JSON.parse(storedActiveCalc))
    } else {
      setActiveCalc(DEFAULT_ACTIVE_CALC)
      localStorage.setItem(STORAGE_KEY_ACTIVE_CALC, JSON.stringify(DEFAULT_ACTIVE_CALC))
    }

    setIsLoaded(true)
  }, [])

  // Salva filamentos quando mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_FILAMENTS, JSON.stringify(filaments))
    }
  }, [filaments, isLoaded])

  // Salva impressões quando mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_PRINTS, JSON.stringify(printJobs))
    }
  }, [printJobs, isLoaded])

  // Salva configurações quando mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  // Salva cálculo ativo quando muda
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_CALC, JSON.stringify(activeCalc))
    }
  }, [activeCalc, isLoaded])

  // Adicionar filamento
  const addFilament = useCallback((filament: Omit<Filament, "id">) => {
    const newFilament: Filament = {
      ...filament,
      id: crypto.randomUUID(),
    }
    setFilaments((prev) => [...prev, newFilament])
  }, [])

  // Atualizar filamento
  const updateFilament = useCallback((id: string, updates: Partial<Filament>) => {
    setFilaments((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    )
  }, [])

  // Deletar filamento
  const deleteFilament = useCallback((id: string) => {
    setFilaments((prev) => prev.filter((f) => f.id !== id))
  }, [])

  // Adicionar impressão e descontar do estoque
  const addPrintJob = useCallback((print: Omit<PrintJob, "id">) => {
    const newPrint: PrintJob = {
      ...print,
      id: crypto.randomUUID(),
    }
    setPrintJobs((prev) => [...prev, newPrint])

    // Desconta do estoque do filamento
    setFilaments((prev) =>
      prev.map((f) =>
        f.id === print.filamentId
          ? {
              ...f,
              remainingWeight: Math.max(0, f.remainingWeight - print.weightUsed),
            }
          : f
      )
    )
  }, [])

  // Atualizar configurações
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  // Atualizar cálculo ativo
  const updateActiveCalc = useCallback((updates: Partial<ActiveCalculation>) => {
    setActiveCalc((prev) => ({ ...prev, ...updates }))
  }, [])

  // Resetar para dados de exemplo
  const resetToSample = useCallback(() => {
    setFilaments(sampleFilaments)
    setPrintJobs(samplePrintJobs)
    setSettings(DEFAULT_SETTINGS)
    setActiveCalc(DEFAULT_ACTIVE_CALC)
  }, [])

  return {
    filaments,
    printJobs,
    settings,
    activeCalc,
    isLoaded,
    addFilament,
    updateFilament,
    deleteFilament,
    addPrintJob,
    updateSettings,
    updateActiveCalc,
    resetToSample,
  }
}