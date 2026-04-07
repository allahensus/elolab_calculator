"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Package, Truck, CheckCircle, AlertCircle, DollarSign, Calendar, User, Phone, Mail, Edit } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderDetailsProps {
  order: Order
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Order>) => void
  onEdit?: () => void
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
  producing: { label: "Produzindo", color: "bg-blue-500", icon: Package },
  ready: { label: "Pronto", color: "bg-green-500", icon: CheckCircle },
  shipped: { label: "Enviado", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Entregue", color: "bg-emerald-500", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-500", icon: AlertCircle }
}

export function OrderDetails({ order, onClose, onUpdate, onEdit }: OrderDetailsProps) {
  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white gap-1 text-xs sm:text-sm`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-base sm:text-lg">Pedido #{order.orderNumber}</span>
            <div className="flex gap-2">
              {getStatusBadge(order.status as keyof typeof statusConfig)}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} className="h-7 sm:h-8">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Informações do Cliente */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              Cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <p className="text-muted-foreground">Nome</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              {order.customerPhone && (
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {order.customerPhone}
                  </p>
                </div>
              )}
              {order.customerEmail && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-1 break-all">
                    <Mail className="h-3 w-3 shrink-0" />
                    {order.customerEmail}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Itens do Pedido */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">Itens do Pedido</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm p-2 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {item.quantity}x • {item.weightGrams}g cada
                    </p>
                  </div>
                  <div className="text-left sm:text-right mt-1 sm:mt-0">
                    <p className="font-medium">R$ {item.totalPrice.toFixed(2)}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">R$ {item.pricePerUnit.toFixed(2)}/un</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Prazos e Produção */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground">Data do Pedido</p>
              <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Prazo de Entrega</p>
              <p className={`font-medium ${
                order.daysRemaining < 0 ? 'text-red-500' :
                order.daysRemaining <= 2 ? 'text-yellow-500' : ''
              }`}>
                {new Date(order.deliveryDeadline).toLocaleDateString('pt-BR')}
                {order.daysRemaining > 0 && ` (${order.daysRemaining} dias)`}
                {order.daysRemaining === 0 && ` (hoje)`}
                {order.daysRemaining < 0 && ` (atrasado)`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Prioridade</p>
              <Badge variant={order.priority === 'high' ? 'destructive' : order.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                {order.priority === 'high' ? 'Alta' : order.priority === 'medium' ? 'Média' : 'Baixa'}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Horas Estimadas</p>
              <p className="font-medium">{order.estimatedPrintHours}h</p>
            </div>
          </div>

          <Separator />

          {/* Financeiro */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              Financeiro
            </h3>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {(order.totalValue + (order.discount || 0) - (order.shippingCost || 0)).toFixed(2)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- R$ {order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.shippingCost && order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>R$ {order.shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-bold text-sm sm:text-base">
                <span>Total</span>
                <span>R$ {order.totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status do Pagamento</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs">
                  {order.paymentStatus === 'paid' ? 'Pago' : order.paymentStatus === 'partial' ? 'Parcial' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Histórico de Status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              Histórico
            </h3>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {order.statusHistory.map((history, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                  <div className="text-muted-foreground w-full sm:w-24">
                    {new Date(history.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {statusConfig[history.status as keyof typeof statusConfig]?.label || history.status}
                    </Badge>
                    {history.note && <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{history.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} size="sm" className="w-full sm:w-auto">
              Fechar
            </Button>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  const nextStatus: Record<string, string> = {
                    pending: 'producing',
                    producing: 'ready',
                    ready: 'shipped',
                    shipped: 'delivered'
                  }
                  const currentStatus = order.status
                  if (nextStatus[currentStatus]) {
                    onUpdate(order.id, { status: nextStatus[currentStatus] as any })
                    onClose()
                  }
                }}
              >
                Avançar Status
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}