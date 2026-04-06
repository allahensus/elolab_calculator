import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const limit = searchParams.get("limit") || "20"

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  try {
    // API pública do Mercado Livre - não precisa de autenticação para busca
    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          "Accept": "application/json",
        },
        next: { revalidate: 300 } // Cache por 5 minutos
      }
    )

    if (!response.ok) {
      throw new Error(`Mercado Livre API error: ${response.status}`)
    }

    const data = await response.json()

    // Transformar os dados para o formato que precisamos
    const products = data.results.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
      permalink: item.permalink,
      condition: item.condition === "new" ? "Novo" : "Usado",
      soldQuantity: item.sold_quantity || 0,
      availableQuantity: item.available_quantity || 0,
      seller: {
        id: item.seller?.id,
        nickname: item.seller?.nickname,
      },
      shipping: {
        freeShipping: item.shipping?.free_shipping || false,
      },
      rating: item.reviews?.rating_average || null,
      totalReviews: item.reviews?.total || 0,
      categoryId: item.category_id,
      // Calcular métricas úteis
      popularity: calculatePopularity(item),
    }))

    // Calcular estatísticas gerais
    const stats = {
      totalResults: data.paging.total,
      avgPrice: products.length > 0 
        ? products.reduce((sum: number, p: any) => sum + p.price, 0) / products.length 
        : 0,
      minPrice: products.length > 0 
        ? Math.min(...products.map((p: any) => p.price)) 
        : 0,
      maxPrice: products.length > 0 
        ? Math.max(...products.map((p: any) => p.price)) 
        : 0,
      avgSoldQuantity: products.length > 0
        ? products.reduce((sum: number, p: any) => sum + p.soldQuantity, 0) / products.length
        : 0,
    }

    return NextResponse.json({
      products,
      stats,
      query,
    })
  } catch (error) {
    console.error("Error fetching from Mercado Livre:", error)
    return NextResponse.json(
      { error: "Failed to fetch products from Mercado Livre" },
      { status: 500 }
    )
  }
}

function calculatePopularity(item: any): "alta" | "média" | "baixa" {
  const sold = item.sold_quantity || 0
  if (sold > 100) return "alta"
  if (sold > 20) return "média"
  return "baixa"
}
