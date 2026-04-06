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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Package, AlertTriangle } from "lucide-react"
import type { Filament } from "@/lib/types"

const MATERIALS = ["PLA", "PETG", "ABS", "TPU", "ASA", "Nylon", "PC", "PLA+"]
const BRANDS = ["3D Fila", "Voolt", "eSUN", "Creality", "Polymaker", "Hatchbox", "Outro"]
const COLORS_PRESET = [
  { name: "Preto", hex: "#1a1a1a" },
  { name: "Branco", hex: "#f5f5f5" },
  { name: "Vermelho", hex: "#e53935" },
  { name: "Azul", hex: "#1976d2" },
  { name: "Verde", hex: "#43a047" },
  { name: "Amarelo", hex: "#fdd835" },
  { name: "Laranja", hex: "#fb8c00" },
  { name: "Rosa", hex: "#ec407a" },
  { name: "Roxo", hex: "#8e24aa" },
  { name: "Cinza", hex: "#757575" },
  { name: "Transparente", hex: "#e0e0e0" },
]

interface FilamentManagerProps {
  filaments: Filament[]
  onAdd: (filament: Omit<Filament, "id">) => void
  onUpdate: (id: string, filament: Partial<Filament>) => void
  onDelete: (id: string) => void
}

const defaultFilament = {
  name: "",
  brand: "3D Fila",
  material: "PLA",
  color: "#1a1a1a",
  weight: 1000,
  pricePerKg: 89.9,
  remainingWeight: 1000,
}

export function FilamentManager({ filaments, onAdd, onUpdate, onDelete }: FilamentManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null)
  const [newFilament, setNewFilament] = useState(defaultFilament)

  const lowStockFilaments = filaments.filter(
    (f) => (f.remainingWeight / f.weight) * 100 < 30
  )

  const handleAdd = () => {
    if (newFilament.name.trim()) {
      onAdd(newFilament)
      setNewFilament(defaultFilament)
      setIsAddOpen(false)
    }
  }

  const handleUpdate = () => {
    if (editingFilament) {
      onUpdate(editingFilament.id, editingFilament)
      setEditingFilament(null)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const FilamentForm = ({
    data,
    onChange,
  }: {
    data: typeof defaultFilament | Filament
    onChange: (data: typeof defaultFilament | Filament) => void
  }) => (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Filamento</Label>
          <Input
            id="name"
            placeholder="Ex: PLA Preto Fosco"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Select
            value={data.brand}
            onValueChange={(value) => onChange({ ...data, brand: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select
            value={data.material}
            onValueChange={(value) => onChange({ ...data, material: value })}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATERIALS.map((mat) => (
                <SelectItem key={mat} value={mat}>
                  {mat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cor</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS_PRESET.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => onChange({ ...data, color: c.hex })}
                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  data.color === c.hex ? "border-primary ring-2 ring-primary" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso Total (g)</Label>
          <Select
            value={data.weight.toString()}
            onValueChange={(value) =>
              onChange({
                ...data,
                weight: parseInt(value),
                remainingWeight: Math.min(data.remainingWeight, parseInt(value)),
              })
            }
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="250">250g</SelectItem>
              <SelectItem value="500">500g</SelectItem>
              <SelectItem value="1000">1kg</SelectItem>
              <SelectItem value="2000">2kg</SelectItem>
              <SelectItem value="3000">3kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="remaining">Restante (g)</Label>
          <Input
            id="remaining"
            type="number"
            min={0}
            max={data.weight}
            value={data.remainingWeight}
            onChange={(e) =>
              onChange({
                ...data,
                remainingWeight: Math.min(parseInt(e.target.value) || 0, data.weight),
              })
            }
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Preço/kg (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min={0}
            value={data.pricePerKg}
            onChange={(e) =>
              onChange({ ...data, pricePerKg: parseFloat(e.target.value) || 0 })
            }
            className="bg-secondary border-border"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Alerta de estoque baixo */}
      {lowStockFilaments.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">
                {lowStockFilaments.length} filamento(s) com estoque baixo
              </p>
              <p className="text-xs text-muted-foreground">
                {lowStockFilaments.map((f) => f.name).join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card principal */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Package className="h-5 w-5 text-primary" />
            Meus Filamentos
          </CardTitle>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Filamento</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo filamento para adicionar ao estoque.
                </DialogDescription>
              </DialogHeader>
              <FilamentForm data={newFilament} onChange={setNewFilament} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAdd}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {filaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum filamento cadastrado
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddOpen(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Adicionar primeiro filamento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filaments.map((filament) => {
                const percentage = (filament.remainingWeight / filament.weight) * 100
                const isLow = percentage < 30

                return (
                  <div
                    key={filament.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3"
                  >
                    <div
                      className="h-10 w-10 shrink-0 rounded-lg border border-border"
                      style={{ backgroundColor: filament.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-foreground">
                          {filament.name}
                        </p>
                        {isLow && (
                          <span className="shrink-0 rounded bg-destructive/20 px-1.5 py-0.5 text-xs text-destructive">
                            Baixo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filament.brand} • {filament.material} •{" "}
                        {formatCurrency(filament.pricePerKg)}/kg
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full transition-all ${
                              isLow ? "bg-destructive" : "bg-primary"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {filament.remainingWeight}g / {filament.weight}g
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {/* Botão Editar */}
                      <Dialog
                        open={editingFilament?.id === filament.id}
                        onOpenChange={(open) =>
                          setEditingFilament(open ? filament : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Editar Filamento</DialogTitle>
                            <DialogDescription>
                              Atualize os dados do filamento selecionado.
                            </DialogDescription>
                          </DialogHeader>
                          {editingFilament && (
                            <FilamentForm
                              data={editingFilament}
                              onChange={(data) =>
                                setEditingFilament(data as Filament)
                              }
                            />
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button onClick={handleUpdate}>Salvar</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Botão Excluir */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir filamento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir{" "}
                              <strong>{filament.name}</strong>? Esta ação não pode
                              ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(filament.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
