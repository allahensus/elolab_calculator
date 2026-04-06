"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { ConsumptionChart } from "@/components/consumption-chart"
import { FilamentManager } from "@/components/filament-manager"
import { PrintLogger } from "@/components/print-logger"
import { CostCalculator } from "@/components/cost-calculator"
import { PricingCalculator } from "@/components/pricing-calculator"
import { MarketResearch } from "@/components/market-research"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Calculator, DollarSign, Package, TrendingUp } from "lucide-react"
import { useFilamentStore } from "@/hooks/use-filament-store"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const {
    filaments,
    printJobs,
    isLoaded,
    addFilament,
    updateFilament,
    deleteFilament,
    addPrintJob,
  } = useFilamentStore()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-4 sm:p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Estoque</span>
            </TabsTrigger>
            <TabsTrigger
              value="cost"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Custo</span>
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Precificar</span>
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Mercado</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards filaments={filaments} printJobs={printJobs} />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ConsumptionChart />
              </div>
              <div>
                <PrintLogger
                  filaments={filaments}
                  printJobs={printJobs}
                  onAddPrint={addPrintJob}
                />
              </div>
            </div>
          </TabsContent>

          {/* Stock Management Tab */}
          <TabsContent value="stock" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Gerenciar Estoque</h2>
              <p className="mt-1 text-muted-foreground">
                Adicione, edite e controle seus filamentos. O estoque é atualizado automaticamente ao registrar impressões.
              </p>
            </div>
            <FilamentManager
              filaments={filaments}
              onAdd={addFilament}
              onUpdate={updateFilament}
              onDelete={deleteFilament}
            />
          </TabsContent>

          {/* Cost Calculator Tab */}
          <TabsContent value="cost">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-foreground">Quanto custa sua impressão?</h2>
                <p className="mt-2 text-muted-foreground">
                  Preencha os dados abaixo para calcular o custo real. Os valores de energia e desgaste já estão
                  calculados automaticamente.
                </p>
              </div>
              <CostCalculator filaments={filaments} />
            </div>
          </TabsContent>

          {/* Pricing Calculator Tab */}
          <TabsContent value="pricing">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-foreground">Defina o preço de venda</h2>
                <p className="mt-2 text-muted-foreground">
                  Calcule automaticamente o preço ideal considerando custos, complexidade e margem de lucro desejada.
                </p>
              </div>
              <PricingCalculator />
            </div>
          </TabsContent>

          {/* Market Research Tab */}
          <TabsContent value="market">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Pesquisa de Mercado</h2>
              <p className="mt-1 text-muted-foreground">
                Descubra produtos com boa margem de lucro nos marketplaces e salve ideias para produção.
              </p>
            </div>
            <MarketResearch filaments={filaments} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
