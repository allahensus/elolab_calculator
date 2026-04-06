"use client"

import { useState, useEffect, useCallback } from "react"
import type { Filament, PrintJob } from "@/lib/types"
import { sampleFilaments, samplePrintJobs } from "@/lib/store"

const STORAGE_KEY_FILAMENTS = "filacontrol-filaments"
const STORAGE_KEY_PRINTS = "filacontrol-prints"

export function useFilamentStore() {
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega dados do localStorage ou usa dados de exemplo
  useEffect(() => {
    const storedFilaments = localStorage.getItem(STORAGE_KEY_FILAMENTS)
    const storedPrints = localStorage.getItem(STORAGE_KEY_PRINTS)

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

  // Resetar para dados de exemplo
  const resetToSample = useCallback(() => {
    setFilaments(sampleFilaments)
    setPrintJobs(samplePrintJobs)
  }, [])

  return {
    filaments,
    printJobs,
    isLoaded,
    addFilament,
    updateFilament,
    deleteFilament,
    addPrintJob,
    resetToSample,
  }
}
