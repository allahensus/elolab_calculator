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

// Configurações globais da aplicação
export interface AppSettings {
  printerPower: number // Watts
  kwhPrice: number // Preço do kWh em R$
  machineValue: number // Valor da impressora em R$
  expectedMachineLifeHours: number // Vida útil esperada em horas
  printerName: string // Nome da impressora
}

// Estado ativo do cálculo de custo
export interface ActiveCalculation {
  filamentPrice: number
  weightGrams: number
  printTimeHours: number
  printTimeMinutes: number
  includeDepreciation: boolean
}

// NOVOS TIPOS PARA GESTÃO DE PEDIDOS

export type OrderSource = 'marketplace' | 'private'
export type MarketplaceName = 'mercadolivre' | 'shopee' | 'olx' | 'enjoei' | 'other'
export type OrderStatus = 'pending' | 'producing' | 'ready' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productName: string
  quantity: number
  weightGrams: number // peso por unidade
  filamentId: string
  pricePerUnit: number // preço cobrado por unidade
  totalPrice: number // preço total do item
}

export interface Order {
  id: string
  orderNumber: string // Número do pedido (automático ou manual)

  // Origem do pedido
  source: OrderSource
  marketplace?: MarketplaceName // se source = 'marketplace'
  customerName: string
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string

  // Itens do pedido
  items: OrderItem[]

  // Totais
  totalWeight: number // peso total em gramas
  totalValue: number // valor total do pedido
  shippingCost?: number // custo de envio
  discount?: number // desconto aplicado

  // Prazos
  orderDate: string // data do pedido
  deliveryDeadline: string // prazo de entrega
  daysRemaining: number // dias restantes para entrega

  // Status
  status: OrderStatus
  statusHistory: { status: OrderStatus; date: string; note?: string }[]

  // Produção
  priority: 'high' | 'medium' | 'low' // prioridade na fila
  estimatedPrintHours: number // horas estimadas de impressão
  actualPrintHours?: number // horas reais de impressão
  productionNotes?: string

  // Pagamento
  paymentStatus: 'pending' | 'paid' | 'partial'
  paymentMethod?: string

  // Entrega
  trackingCode?: string
  shippedDate?: string
  deliveredDate?: string

  createdAt: string
  updatedAt: string
}

export interface ProductionTask {
  orderId: string
  orderNumber: string
  customerName: string
  totalWeight: number
  estimatedHours: number
  priority: 'high' | 'medium' | 'low'
  deadline: string
  daysRemaining: number
  status: OrderStatus
  items: OrderItem[]
}