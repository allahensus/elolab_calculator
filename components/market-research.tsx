"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  TrendingUp,
  Star,
  ShoppingCart,
  Plus,
  Trash2,
  DollarSign,
  BarChart3,
  Lightbulb,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import type { Filament } from "@/lib/types"

interface MarketProduct {
  id: string
  title: string
  price: number
  sold: number
  rating: number
  reviews: number
  seller: string
  marketplace: "mercadolivre" | "shopee" | "amazon"
  thumbnail: string
  estimatedWeight: number
  estimatedTime: number
  url: string
}

interface ProductIdea {
  id: string
  name: string
  marketPrice: number
  estimatedCost: number
  profit: number
  profitMargin: number
  demand: "alta" | "média" | "baixa"
  addedAt: Date
}

interface MarketResearchProps {
  filaments: Filament[]
}

// Dados simulados baseados em pesquisas reais de produtos 3D
const simulatedProducts: Record<string, MarketProduct[]> = {
  "suporte celular": [
    {
      id: "1",
      title: "Suporte Celular Mesa Articulado Impressão 3D",
      price: 34.90,
      sold: 1250,
      rating: 4.8,
      reviews: 342,
      seller: "3D Print Store",
      marketplace: "mercadolivre",
      thumbnail: "📱",
      estimatedWeight: 45,
      estimatedTime: 2.5,
      url: "#"
    },
    {
      id: "2",
      title: "Suporte Celular Carro Ventilação 3D",
      price: 29.90,
      sold: 890,
      rating: 4.5,
      reviews: 156,
      seller: "MakerShop",
      marketplace: "mercadolivre",
      thumbnail: "🚗",
      estimatedWeight: 35,
      estimatedTime: 2,
      url: "#"
    },
    {
      id: "3",
      title: "Kit 3 Suportes Celular Minimalista",
      price: 49.90,
      sold: 2100,
      rating: 4.9,
      reviews: 567,
      seller: "PrintMaster",
      marketplace: "shopee",
      thumbnail: "📲",
      estimatedWeight: 60,
      estimatedTime: 3,
      url: "#"
    },
  ],
  "organizador": [
    {
      id: "4",
      title: "Organizador Mesa Escritório 3D Premium",
      price: 89.90,
      sold: 456,
      rating: 4.7,
      reviews: 89,
      seller: "Office 3D",
      marketplace: "mercadolivre",
      thumbnail: "🗂️",
      estimatedWeight: 180,
      estimatedTime: 8,
      url: "#"
    },
    {
      id: "5",
      title: "Organizador Cabos USB Impressão 3D",
      price: 24.90,
      sold: 3200,
      rating: 4.6,
      reviews: 890,
      seller: "CableFix",
      marketplace: "shopee",
      thumbnail: "🔌",
      estimatedWeight: 25,
      estimatedTime: 1.5,
      url: "#"
    },
  ],
  "vaso": [
    {
      id: "6",
      title: "Vaso Decorativo Geométrico 3D",
      price: 59.90,
      sold: 780,
      rating: 4.8,
      reviews: 234,
      seller: "Decor3D",
      marketplace: "mercadolivre",
      thumbnail: "🌱",
      estimatedWeight: 120,
      estimatedTime: 6,
      url: "#"
    },
    {
      id: "7",
      title: "Kit 3 Vasos Suculentas Mini 3D",
      price: 45.90,
      sold: 1560,
      rating: 4.9,
      reviews: 445,
      seller: "GreenPrint",
      marketplace: "shopee",
      thumbnail: "🪴",
      estimatedWeight: 90,
      estimatedTime: 4,
      url: "#"
    },
  ],
  "luminaria": [
    {
      id: "8",
      title: "Luminária Lua 3D com LED",
      price: 129.90,
      sold: 2340,
      rating: 4.9,
      reviews: 678,
      seller: "LightMaker",
      marketplace: "mercadolivre",
      thumbnail: "🌙",
      estimatedWeight: 150,
      estimatedTime: 10,
      url: "#"
    },
    {
      id: "9",
      title: "Luminária Lithophane Personalizada",
      price: 89.90,
      sold: 890,
      rating: 4.7,
      reviews: 234,
      seller: "PhotoPrint",
      marketplace: "shopee",
      thumbnail: "💡",
      estimatedWeight: 80,
      estimatedTime: 5,
      url: "#"
    },
  ],
  "chaveiro": [
    {
      id: "10",
      title: "Kit 10 Chaveiros Personalizados 3D",
      price: 39.90,
      sold: 4500,
      rating: 4.6,
      reviews: 1230,
      seller: "KeyMaster",
      marketplace: "mercadolivre",
      thumbnail: "🔑",
      estimatedWeight: 50,
      estimatedTime: 2,
      url: "#"
    },
  ],
  "default": [
    {
      id: "11",
      title: "Produto 3D Personalizado",
      price: 49.90,
      sold: 500,
      rating: 4.5,
      reviews: 100,
      seller: "Print3D",
      marketplace: "mercadolivre",
      thumbnail: "🎨",
      estimatedWeight: 60,
      estimatedTime: 3,
      url: "#"
    },
  ]
}

export function MarketResearch({ filaments }: MarketResearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<MarketProduct[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [productIdeas, setProductIdeas] = useState<ProductIdea[]>([])
  const [selectedFilament, setSelectedFilament] = useState<string>("")

  // Calcular custo estimado de produção
  const calculateProductionCost = (weight: number, time: number) => {
    const filament = filaments.find(f => f.id === selectedFilament) || filaments[0]
    if (!filament) return 0

    const filamentCostPerGram = filament.price / filament.weight
    const filamentCost = weight * filamentCostPerGram
    const energyCost = time * 0.15 * 0.75 // 150W médio, R$0.75/kWh
    const wearCost = time * 0.50 // Desgaste estimado
    
    return filamentCost + energyCost + wearCost
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) return
    
    setHasSearched(true)
    
    // Buscar nos dados simulados
    const term = searchTerm.toLowerCase()
    let results: MarketProduct[] = []
    
    for (const [key, products] of Object.entries(simulatedProducts)) {
      if (key !== "default" && term.includes(key)) {
        results = [...results, ...products]
      }
    }
    
    // Se não encontrou nada específico, mostrar resultados genéricos
    if (results.length === 0) {
      results = simulatedProducts.default.map(p => ({
        ...p,
        title: `${searchTerm} - Impressão 3D`,
      }))
    }
    
    setSearchResults(results)
  }

  const addToIdeas = (product: MarketProduct) => {
    const cost = calculateProductionCost(product.estimatedWeight, product.estimatedTime)
    const profit = product.price - cost
    const profitMargin = (profit / product.price) * 100
    
    const idea: ProductIdea = {
      id: crypto.randomUUID(),
      name: product.title,
      marketPrice: product.price,
      estimatedCost: cost,
      profit,
      profitMargin,
      demand: product.sold > 1000 ? "alta" : product.sold > 500 ? "média" : "baixa",
      addedAt: new Date(),
    }
    
    setProductIdeas(prev => [idea, ...prev])
  }

  const removeIdea = (id: string) => {
    setProductIdeas(prev => prev.filter(i => i.id !== id))
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "alta": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "média": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "baixa": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace) {
      case "mercadolivre": return "bg-yellow-500/20 text-yellow-400"
      case "shopee": return "bg-orange-500/20 text-orange-400"
      case "amazon": return "bg-blue-500/20 text-blue-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Aviso sobre dados simulados */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-4">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Dados Simulados</p>
            <p className="text-muted-foreground">
              Esta pesquisa usa dados de exemplo para demonstrar a funcionalidade. 
              Para dados reais do Mercado Livre, você pode criar uma conta de desenvolvedor gratuita em{" "}
              <a 
                href="https://developers.mercadolivre.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                developers.mercadolivre.com.br
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Busca */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Pesquisar Produtos no Mercado
          </CardTitle>
          <CardDescription>
            Pesquise produtos 3D nos marketplaces e descubra oportunidades de produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Termo de busca</Label>
              <Input
                id="search"
                placeholder="Ex: suporte celular, organizador, vaso, luminaria, chaveiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-secondary border-border"
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="filament-select" className="sr-only">Filamento para cálculo</Label>
              <select
                id="filament-select"
                value={selectedFilament}
                onChange={(e) => setSelectedFilament(e.target.value)}
                className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-foreground text-sm"
              >
                <option value="">Filamento p/ cálculo</option>
                {filaments.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} - R${(f.price / f.weight).toFixed(2)}/g
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleSearch} className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Busca */}
      {hasSearched && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Resultados da Pesquisa
            </CardTitle>
            <CardDescription>
              {searchResults.length} produtos encontrados para &quot;{searchTerm}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum produto encontrado. Tente outros termos como: suporte, organizador, vaso, luminaria.
              </p>
            ) : (
              <div className="space-y-4">
                {searchResults.map((product) => {
                  const cost = calculateProductionCost(product.estimatedWeight, product.estimatedTime)
                  const profit = product.price - cost
                  const profitMargin = (profit / product.price) * 100
                  const isViable = profitMargin > 40

                  return (
                    <div
                      key={product.id}
                      className={`p-4 rounded-lg border ${
                        isViable ? "border-green-500/30 bg-green-500/5" : "border-border bg-secondary/50"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Info do Produto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{product.thumbnail}</span>
                            <div className="min-w-0">
                              <h4 className="font-medium text-foreground truncate">{product.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="outline" className={getMarketplaceColor(product.marketplace)}>
                                  {product.marketplace === "mercadolivre" ? "Mercado Livre" : 
                                   product.marketplace === "shopee" ? "Shopee" : "Amazon"}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {product.rating} ({product.reviews})
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <ShoppingCart className="h-3 w-3" />
                                  {product.sold.toLocaleString()} vendidos
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Análise de Preço */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Preço Venda</p>
                            <p className="text-lg font-bold text-foreground">
                              R${product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Custo Est.</p>
                            <p className="text-lg font-bold text-muted-foreground">
                              R${cost.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Lucro</p>
                            <p className={`text-lg font-bold ${profit > 0 ? "text-green-400" : "text-red-400"}`}>
                              R${profit.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Margem</p>
                            <p className={`text-lg font-bold ${profitMargin > 40 ? "text-green-400" : profitMargin > 20 ? "text-yellow-400" : "text-red-400"}`}>
                              {profitMargin.toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex gap-2 lg:flex-col">
                          <Button
                            size="sm"
                            onClick={() => addToIdeas(product)}
                            className="flex-1 lg:flex-none"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Salvar Ideia
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 lg:flex-none"
                            asChild
                          >
                            <a href={product.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Estimativas */}
                      <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Peso estimado: ~{product.estimatedWeight}g</span>
                        <span>Tempo estimado: ~{product.estimatedTime}h</span>
                        {isViable && (
                          <span className="text-green-400 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Boa margem de lucro!
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Ideias */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Ideias para Produzir
          </CardTitle>
          <CardDescription>
            Produtos salvos para considerar na sua produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productIdeas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma ideia salva ainda</p>
              <p className="text-sm">Pesquise produtos e salve os que tiverem boa margem de lucro</p>
            </div>
          ) : (
            <div className="space-y-3">
              {productIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{idea.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                      <span className="text-muted-foreground">
                        Venda: <span className="text-foreground">R${idea.marketPrice.toFixed(2)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Custo: <span className="text-foreground">R${idea.estimatedCost.toFixed(2)}</span>
                      </span>
                      <span className="text-green-400 font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Lucro: R${idea.profit.toFixed(2)} ({idea.profitMargin.toFixed(0)}%)
                      </span>
                      <Badge variant="outline" className={getDemandColor(idea.demand)}>
                        Demanda {idea.demand}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeIdea(idea.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Resumo */}
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="font-medium text-foreground mb-2">Resumo das Ideias</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total de ideias</p>
                    <p className="text-lg font-bold text-foreground">{productIdeas.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lucro potencial médio</p>
                    <p className="text-lg font-bold text-green-400">
                      R${(productIdeas.reduce((acc, i) => acc + i.profit, 0) / productIdeas.length).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margem média</p>
                    <p className="text-lg font-bold text-foreground">
                      {(productIdeas.reduce((acc, i) => acc + i.profitMargin, 0) / productIdeas.length).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Alta demanda</p>
                    <p className="text-lg font-bold text-foreground">
                      {productIdeas.filter(i => i.demand === "alta").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
