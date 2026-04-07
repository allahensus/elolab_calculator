"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useOrderStore } from "@/hooks/use-order-store"
import { useFilamentStore } from "@/hooks/use-filament-store"
import type { Order, OrderItem } from "@/lib/types"

interface OrderFormProps {
  initialOrder?: Order
  onClose: () => void
  onSuccess: () => void
}

export function OrderForm({ initialOrder, onClose, onSuccess }: OrderFormProps) {
  const { addOrder, updateOrder } = useOrderStore()
  const { filaments } = useFilamentStore()

  const isEditing = !!initialOrder

  const [source, setSource] = useState<'marketplace' | 'private'>(initialOrder?.source || 'private')
  const [marketplace, setMarketplace] = useState(initialOrder?.marketplace || 'mercadolivre')
  const [customerName, setCustomerName] = useState(initialOrder?.customerName || '')
  const [customerPhone, setCustomerPhone] = useState(initialOrder?.customerPhone || '')
  const [customerEmail, setCustomerEmail] = useState(initialOrder?.customerEmail || '')
  const [items, setItems] = useState<OrderItem[]>(initialOrder?.items || [
    { productName: '', quantity: 1, weightGrams: 0, filamentId: '', pricePerUnit: 0, totalPrice: 0 }
  ])
  const [deliveryDeadline, setDeliveryDeadline] = useState(
    initialOrder?.deliveryDeadline ? new Date(initialOrder.deliveryDeadline).toISOString().split('T')[0] : ''
  )
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(initialOrder?.priority || 'medium')
  const [shippingCost, setShippingCost] = useState(initialOrder?.shippingCost || 0)
  const [discount, setDiscount] = useState(initialOrder?.discount || 0)

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === 'quantity' || field === 'pricePerUnit') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].pricePerUnit
    }

    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, weightGrams: 0, filamentId: '', pricePerUnit: 0, totalPrice: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateTotals = () => {
    const totalWeight = items.reduce((sum, item) => sum + (item.weightGrams * item.quantity), 0)
    const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0) - discount + shippingCost
    const estimatedPrintHours = items.reduce((sum, item) => sum + (item.weightGrams * item.quantity / 10), 0)
    return { totalWeight, totalValue, estimatedPrintHours }
  }

  const handleSubmit = () => {
    const { totalWeight, totalValue, estimatedPrintHours } = calculateTotals()

    if (isEditing && initialOrder) {
      // Atualizar pedido existente
      updateOrder(initialOrder.id, {
        source,
        marketplace: source === 'marketplace' ? marketplace as any : undefined,
        customerName,
        customerPhone,
        customerEmail,
        items,
        totalWeight,
        totalValue,
        shippingCost: shippingCost || undefined,
        discount: discount || undefined,
        deliveryDeadline,
        priority,
        estimatedPrintHours,
        updatedAt: new Date().toISOString()
      })
    } else {
      // Criar novo pedido
      addOrder({
        source,
        marketplace: source === 'marketplace' ? marketplace as any : undefined,
        customerName,
        customerPhone,
        customerEmail,
        items,
        totalWeight,
        totalValue,
        shippingCost: shippingCost || undefined,
        discount: discount || undefined,
        orderDate: new Date().toISOString(),
        deliveryDeadline,
        status: 'pending',
        priority,
        estimatedPrintHours,
        paymentStatus: 'pending'
      })
    }

    onSuccess()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edite as informações do pedido' : 'Registre um pedido de marketplace ou cliente particular'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Origem do Pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select value={source} onValueChange={(v: any) => setSource(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Cliente Particular</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {source === 'marketplace' && (
              <div className="space-y-2">
                <Label>Marketplace</Label>
                <Select value={marketplace} onValueChange={setMarketplace}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                    <SelectItem value="shopee">Shopee</SelectItem>
                    <SelectItem value="olx">OLX</SelectItem>
                    <SelectItem value="enjoei">Enjoei</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm sm:text-base">Dados do Cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Email</Label>
                <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm sm:text-base">Itens do Pedido</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div key={index} className="p-3 border border-border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium">Item {index + 1}</span>
                    {items.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Produto</Label>
                      <Input
                        placeholder="Nome"
                        value={item.productName}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Qtd</Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Peso (g)</Label>
                      <Input
                        type="number"
                        value={item.weightGrams}
                        onChange={(e) => updateItem(index, 'weightGrams', Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Preço (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.pricePerUnit}
                        onChange={(e) => updateItem(index, 'pricePerUnit', Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prazos e Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prazo de Entrega *</Label>
              <Input
                type="date"
                value={deliveryDeadline}
                onChange={(e) => setDeliveryDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta (Urgente)</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financeiro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frete (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Desconto (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Resumo */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Resumo do Pedido</h4>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>Peso total:</span>
                <span className="font-medium">{calculateTotals().totalWeight}g</span>
              </div>
              <div className="flex justify-between">
                <span>Horas estimadas:</span>
                <span className="font-medium">{calculateTotals().estimatedPrintHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t">
                <span>Valor Total:</span>
                <span>R$ {calculateTotals().totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} size="sm" className="sm:size-default">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!customerName || !deliveryDeadline} size="sm" className="sm:size-default">
              {isEditing ? 'Salvar Alterações' : 'Registrar Pedido'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}