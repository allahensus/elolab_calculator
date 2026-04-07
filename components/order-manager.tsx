"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Users,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  Package
} from "lucide-react"
import { useOrderStore } from "@/hooks/use-order-store"
import { OrderForm } from "./order-form"
import { OrderDetails } from "./order-details"
import { ProductionQueue } from "./production-queue"
import type { Order } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
  producing: { label: "Produzindo", color: "bg-blue-500", icon: PackageCheck },
  ready: { label: "Pronto", color: "bg-green-500", icon: CheckCircle },
  shipped: { label: "Enviado", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Entregue", color: "bg-emerald-500", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-500", icon: AlertCircle }
}

export function OrderManager() {
  const { orders, updateOrder, getOrderStats } = useOrderStore()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const stats = getOrderStats()

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white gap-1 text-xs`}>
        <Icon className="h-3 w-3" />
        <span className="hidden sm:inline">{config.label}</span>
      </Badge>
    )
  }

  // Cards de estatísticas responsivos
  const StatCard = ({ title, value, subtitle, color }: any) => (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
            <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cards de Estatísticas - Grid responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Pedidos"
          value={stats.totalOrders}
          subtitle={`${stats.pendingOrders + stats.producingOrders} em andamento`}
        />
        <StatCard
          title="Faturamento"
          value={`R$ ${stats.totalRevenue.toFixed(0)}`}
          subtitle={`R$ ${stats.pendingRevenue.toFixed(0)} a receber`}
          color="text-green-600"
        />
        <StatCard
          title="Produção"
          value={stats.producingOrders}
          subtitle={`${stats.pendingOrders} aguardando`}
        />
        <StatCard
          title="Urgentes"
          value={stats.urgentOrders}
          subtitle="prazo ≤ 2 dias"
          color="text-red-600"
        />
      </div>

      {/* Botão Novo Pedido - Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Gestão de Pedidos</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Fila de Produção - Componente separado */}
      <ProductionQueue />

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Lista de Pedidos</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Gerencie todos os pedidos de marketplaces e clientes particulares
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-3 sm:mb-4 flex flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">Todos</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3">Pendentes</TabsTrigger>
              <TabsTrigger value="producing" className="text-xs sm:text-sm px-2 sm:px-3">Produzindo</TabsTrigger>
              <TabsTrigger value="ready" className="text-xs sm:text-sm px-2 sm:px-3">Prontos</TabsTrigger>
              <TabsTrigger value="shipped" className="text-xs sm:text-sm px-2 sm:px-3">Enviados</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
                  >
                    {/* Cabeçalho do pedido - Responsivo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-medium bg-secondary px-2 py-0.5 rounded">
                          #{order.orderNumber}
                        </span>
                        {getStatusBadge(order.status as keyof typeof statusConfig)}
                        {order.priority === 'high' && (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Urgente
                          </Badge>
                        )}
                      </div>

                      {/* Menu de ações - Desktop e Mobile */}
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 sm:px-3"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Ver</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 sm:px-3"
                          onClick={() => setEditingOrder(order)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 px-2 sm:px-3"
                          onClick={() => {
                            const nextStatus: Record<string, string> = {
                              pending: 'producing',
                              producing: 'ready',
                              ready: 'shipped',
                              shipped: 'delivered'
                            }
                            const currentStatus = order.status
                            if (nextStatus[currentStatus]) {
                              updateOrder(order.id, { status: nextStatus[currentStatus] as any })
                            }
                          }}
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Avançar</span>
                        </Button>
                      </div>
                    </div>

                    {/* Informações do cliente e produto - Layout em coluna no mobile */}
                    <div className="space-y-1 mb-2">
                      <p className="font-medium text-sm sm:text-base">{order.customerName}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                        <span>{order.items.length} item(ns)</span>
                        <span>{order.totalWeight}g</span>
                        <span className="font-medium text-foreground">R$ {order.totalValue.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Prazo - Destacado no mobile */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Prazo:</span>
                      </div>
                      <div className={`font-medium ${
                        order.daysRemaining < 0 ? 'text-red-500' :
                        order.daysRemaining <= 2 ? 'text-yellow-500' : ''
                      }`}>
                        {new Date(order.deliveryDeadline).toLocaleDateString('pt-BR')}
                        {order.daysRemaining > 0 && ` (${order.daysRemaining}d)`}
                        {order.daysRemaining === 0 && ` (hoje)`}
                        {order.daysRemaining < 0 && ` (${Math.abs(order.daysRemaining)}d atrasado)`}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum pedido encontrado</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {showForm && (
        <OrderForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateOrder}
        />
      )}

      {/* Modal de Edição */}
      {editingOrder && (
        <OrderForm
          initialOrder={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={() => setEditingOrder(null)}
        />
      )}
    </div>
  )
}