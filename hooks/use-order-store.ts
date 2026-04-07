"use client"

import { useState, useEffect, useCallback } from "react"
import type { Order, OrderItem, ProductionTask } from "@/lib/types"

const STORAGE_KEY_ORDERS = "elolab-orders"

// Dados de exemplo
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "P-001",
    source: "private",
    customerName: "João Silva",
    customerPhone: "(11) 99999-9999",
    items: [
      {
        productName: "Suporte de Celular",
        quantity: 2,
        weightGrams: 45,
        filamentId: "pla-white",
        pricePerUnit: 25.90,
        totalPrice: 51.80
      }
    ],
    totalWeight: 90,
    totalValue: 51.80,
    orderDate: new Date().toISOString(),
    deliveryDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 5,
    status: "producing",
    statusHistory: [
      { status: "pending", date: new Date().toISOString(), note: "Pedido recebido" },
      { status: "producing", date: new Date().toISOString(), note: "Iniciado produção" }
    ],
    priority: "high",
    estimatedPrintHours: 6,
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    orderNumber: "ML-001",
    source: "marketplace",
    marketplace: "mercadolivre",
    customerName: "Maria Santos",
    items: [
      {
        productName: "Vaso Decorativo",
        quantity: 1,
        weightGrams: 120,
        filamentId: "pla-terracota",
        pricePerUnit: 89.90,
        totalPrice: 89.90
      }
    ],
    totalWeight: 120,
    totalValue: 89.90,
    shippingCost: 15.00,
    orderDate: new Date().toISOString(),
    deliveryDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 3,
    status: "pending",
    statusHistory: [
      { status: "pending", date: new Date().toISOString(), note: "Pedido aguardando produção" }
    ],
    priority: "medium",
    estimatedPrintHours: 8,
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function useOrderStore() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega pedidos do localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS)
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    } else {
      setOrders(sampleOrders)
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(sampleOrders))
    }
    setIsLoaded(true)
  }, [])

  // Salva pedidos quando mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders))
    }
  }, [orders, isLoaded])

  // Adicionar novo pedido
  const addOrder = useCallback((order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "daysRemaining">) => {
    const now = new Date().toISOString()
    const deadline = new Date(order.deliveryDeadline)
    const today = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Gerar número do pedido
    const prefix = order.source === 'marketplace' ? 'ML' : 'P'
    const nextNumber = orders.filter(o => o.orderNumber.startsWith(prefix)).length + 1
    const orderNumber = `${prefix}-${String(nextNumber).padStart(3, '0')}`

    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      orderNumber,
      daysRemaining,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: order.status, date: now, note: "Pedido criado" }]
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }, [orders])

  // Atualizar pedido
  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === id) {
          const updatedOrder = {
            ...order,
            ...updates,
            updatedAt: new Date().toISOString()
          }

          // Se o status mudou, adicionar ao histórico
          if (updates.status && updates.status !== order.status) {
            updatedOrder.statusHistory = [
              ...order.statusHistory,
              { status: updates.status, date: new Date().toISOString(), note: `Status alterado para ${updates.status}` }
            ]
          }

          // Recalcular dias restantes se o prazo mudou
          if (updates.deliveryDeadline) {
            const deadline = new Date(updates.deliveryDeadline)
            const today = new Date()
            updatedOrder.daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          }

          return updatedOrder
        }
        return order
      })
    )
  }, [])

  // Deletar pedido
  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id))
  }, [])

  // Obter fila de produção (ordenada por prioridade e prazo)
  const getProductionQueue = useCallback((): ProductionTask[] => {
    const activeOrders = orders.filter(o =>
      o.status === 'pending' || o.status === 'producing'
    )

    const priorityWeight = { high: 1, medium: 2, low: 3 }

    const sorted = [...activeOrders].sort((a, b) => {
      // Primeiro por prioridade
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[a.priority] - priorityWeight[b.priority]
      }
      // Depois por prazo (mais próximo primeiro)
      return a.daysRemaining - b.daysRemaining
    })

    return sorted.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalWeight: order.totalWeight,
      estimatedHours: order.estimatedPrintHours,
      priority: order.priority,
      deadline: order.deliveryDeadline,
      daysRemaining: order.daysRemaining,
      status: order.status,
      items: order.items
    }))
  }, [orders])

  // Estatísticas de pedidos
  const getOrderStats = useCallback(() => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const producingOrders = orders.filter(o => o.status === 'producing').length
    const readyOrders = orders.filter(o => o.status === 'ready').length
    const shippedOrders = orders.filter(o => o.status === 'shipped').length
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalValue, 0)
    const pendingRevenue = orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'delivered')
      .reduce((sum, o) => sum + o.totalValue, 0)

    const urgentOrders = orders.filter(o =>
      (o.status === 'pending' || o.status === 'producing') &&
      o.daysRemaining <= 2
    ).length

    return {
      totalOrders,
      pendingOrders,
      producingOrders,
      readyOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      pendingRevenue,
      urgentOrders
    }
  }, [orders])

  return {
    orders,
    isLoaded,
    addOrder,
    updateOrder,
    deleteOrder,
    getProductionQueue,
    getOrderStats
  }
}