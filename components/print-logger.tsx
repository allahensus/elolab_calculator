"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Printer, Clock, Scale, Calendar } from "lucide-react"
import type { Filament, PrintJob } from "@/lib/types"

interface PrintLoggerProps {
  filaments: Filament[]
  printJobs: PrintJob[]
  onAddPrint: (print: Omit<PrintJob, "id">) => void
}

export function PrintLogger({ filaments, printJobs, onAddPrint }: PrintLoggerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newPrint, setNewPrint] = useState({
    name: "",
    filamentId: "",
    weightUsed: 0,
    printTime: 0,
    date: new Date().toISOString().split("T")[0],
  })

  const selectedFilament = filaments.find((f) => f.id === newPrint.filamentId)

  const handleAdd = () => {
    if (newPrint.name.trim() && newPrint.filamentId && newPrint.weightUsed > 0) {
      onAddPrint(newPrint)
      setNewPrint({
        name: "",
        filamentId: "",
        weightUsed: 0,
        printTime: 0,
        date: new Date().toISOString().split("T")[0],
      })
      setIsOpen(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00")
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
  }

  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return h > 0 ? `${h}h ${m}min` : `${m}min`
  }

  // Agrupa impressões por data (mais recentes primeiro)
  const recentPrints = [...printJobs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  // Estatísticas rápidas
  const todayPrints = printJobs.filter(
    (p) => p.date === new Date().toISOString().split("T")[0]
  )
  const todayWeight = todayPrints.reduce((sum, p) => sum + p.weightUsed, 0)
  const todayTime = todayPrints.reduce((sum, p) => sum + p.printTime, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
          <Printer className="h-5 w-5 text-primary" />
          Registro de Impressões
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Registrar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nova Impressão</DialogTitle>
              <DialogDescription>
                Registre uma nova peça impressa para controle de estoque.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="print-name">Nome da Peça</Label>
                <Input
                  id="print-name"
                  placeholder="Ex: Suporte Celular"
                  value={newPrint.name}
                  onChange={(e) =>
                    setNewPrint({ ...newPrint, name: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Filamento Utilizado</Label>
                <Select
                  value={newPrint.filamentId}
                  onValueChange={(value) =>
                    setNewPrint({ ...newPrint, filamentId: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Selecione o filamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {filaments.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: f.color }}
                          />
                          {f.name} ({f.remainingWeight}g restantes)
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFilament && newPrint.weightUsed > selectedFilament.remainingWeight && (
                  <p className="text-xs text-destructive">
                    Peso maior que o estoque disponível ({selectedFilament.remainingWeight}g)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight-used">Peso Usado (g)</Label>
                  <Input
                    id="weight-used"
                    type="number"
                    min={0}
                    placeholder="Ex: 45"
                    value={newPrint.weightUsed || ""}
                    onChange={(e) =>
                      setNewPrint({
                        ...newPrint,
                        weightUsed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Veja no slicer (Cura, PrusaSlicer)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="print-time">Tempo (horas)</Label>
                  <Input
                    id="print-time"
                    type="number"
                    step="0.5"
                    min={0}
                    placeholder="Ex: 3.5"
                    value={newPrint.printTime || ""}
                    onChange={(e) =>
                      setNewPrint({
                        ...newPrint,
                        printTime: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="print-date">Data</Label>
                <Input
                  id="print-date"
                  type="date"
                  value={newPrint.date}
                  onChange={(e) =>
                    setNewPrint({ ...newPrint, date: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                onClick={handleAdd}
                disabled={
                  !newPrint.name.trim() ||
                  !newPrint.filamentId ||
                  newPrint.weightUsed <= 0 ||
                  (selectedFilament && newPrint.weightUsed > selectedFilament.remainingWeight)
                }
              >
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Estatísticas do dia */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Hoje</p>
            <p className="text-lg font-semibold text-foreground">
              {todayPrints.length} peça(s)
            </p>
            <p className="text-xs text-muted-foreground">{todayWeight}g usados</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Tempo Hoje</p>
            <p className="text-lg font-semibold text-foreground">
              {formatTime(todayTime)}
            </p>
            <p className="text-xs text-muted-foreground">de impressão</p>
          </div>
        </div>

        {/* Lista de impressões recentes */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Impressões Recentes
          </p>
          {recentPrints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Printer className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhuma impressão registrada
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPrints.map((print) => {
                const filament = filaments.find((f) => f.id === print.filamentId)
                return (
                  <div
                    key={print.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-2"
                  >
                    {filament && (
                      <div
                        className="h-8 w-8 shrink-0 rounded"
                        style={{ backgroundColor: filament.color }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {print.name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(print.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          {print.weightUsed}g
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(print.printTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
