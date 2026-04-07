"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle, Package, Play, CheckCircle } from "lucide-react"
import { useOrderStore } from "@/hooks/use-order-store"
import { Progress } from "@/components/ui/progress"

export function ProductionQueue() {
  const { getProductionQueue, updateOrder } = useOrderStore()
  const queue = getProductionQueue()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      default: return 'text-blue-500 bg-blue-500/10'
    }
  }

  const getDaysRemainingColor = (days: number) => {
    if (days <= 0) return 'text-red-500'
    if (days <= 2) return 'text-yellow-500'
    return 'text-green-500'
  }

  if (queue.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 sm:py-8 text-center text-muted-foreground">
          <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhum pedido na fila de produção</p>
          <p className="text-xs">Registre novos pedidos para aparecerem aqui</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-xl flex items-center gap-2">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          Fila de Produção
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Pedidos organizados por prioridade e prazo de entrega
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {queue.map((task, index) => (
            <div
              key={task.orderId}
              className="p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
            >
              {/* Cabeçalho */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                    #{task.orderNumber}
                  </span>
                  <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                    {task.priority === 'high' ? 'Urgente' : task.priority === 'medium' ? 'Média' : 'Normal'}
                  </Badge>
                  {task.daysRemaining <= 2 && task.daysRemaining > 0 && (
                    <Badge variant="outline" className="gap-1 text-yellow-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      Prazo próximo
                    </Badge>
                  )}
                  {task.daysRemaining <= 0 && (
                    <Badge variant="destructive" className="gap-1 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      Atrasado
                    </Badge>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className={`text-xs sm:text-sm font-medium ${getDaysRemainingColor(task.daysRemaining)}`}>
                    {task.daysRemaining > 0
                      ? `${task.daysRemaining} dias restantes`
                      : task.daysRemaining === 0
                        ? 'Entrega hoje'
                        : `${Math.abs(task.daysRemaining)} dias atrasado`}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Informações do cliente */}
              <div className="mb-2">
                <p className="font-medium text-sm sm:text-base">{task.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {task.items.length} produto(s) • {task.totalWeight}g total
                </p>
              </div>

              {/* Progresso */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span>Tempo estimado</span>
                  <span className="font-medium">{task.estimatedHours.toFixed(1)} horas</span>
                </div>
                <Progress value={Math.min(100, (task.estimatedHours / 24) * 100)} className="h-1.5 sm:h-2" />
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                {task.status === 'pending' && (
                  <Button
                    size="sm"
                    className="gap-1 h-8 text-xs sm:h-9 sm:text-sm"
                    onClick={() => updateOrder(task.orderId, { status: 'producing' })}
                  >
                    <Play className="h-3 w-3" />
                    Iniciar
                  </Button>
                )}
                {task.status === 'producing' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-green-600 h-8 text-xs sm:h-9 sm:text-sm"
                    onClick={() => updateOrder(task.orderId, { status: 'ready' })}
                  >
                    <CheckCircle className="h-3 w-3" />
                    Concluir
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}