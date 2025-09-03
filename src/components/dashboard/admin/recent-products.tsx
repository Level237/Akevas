
import AsyncLink from "@/components/ui/AsyncLink"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import IsLoadingComponents from "@/components/ui/isLoadingComponents"
import { Product } from "@/types/products"


interface RecentProductsProps {
  products: Product[]
  isLoading: boolean
}

export function RecentProducts({ products, isLoading }: RecentProductsProps) {
  if (isLoading) {
    return <IsLoadingComponents isLoading={isLoading} />
  }


  const getRandomVariationImages = (product: any) => {
    if (!product.variations || product.variations.length === 0) return [];
    // Prendre une variation au hasard
    const randomVariation = product.variations[Math.floor(Math.random() * product.variations.length)];
    // Mélanger les images de cette variation
    const images = [...randomVariation.images];
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
    console.log(images)
    return images;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between font-bold">Produits récents
          <AsyncLink to="/admin/products"> <Button className=" bg-transparent border-[1px] hover:bg-[#ed7e0f]/20 text-[#ed7e0f] border-[#ed7e0f]/90">Voir plus</Button></AsyncLink>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isLoading && products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16">

                {getRandomVariationImages(product).slice(0,).map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={product.product_name}
                    className="absolute rounded-lg object-cover border-2 border-white shadow"
                    style={{
                      left: `${idx * 12}px`,
                      zIndex: 10 - idx,
                      width: '36px',
                      height: '36px',
                      top: `${idx * 4}px`,
                      background: '#fff'
                    }}
                  />
                ))}
                {getRandomVariationImages(product).length === 0 && (
                  <img
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs truncate w-64">{product.product_name}</p>
                <p className="text-sm text-muted-foreground">{product.variations && product.variations.length > 0 ? "prix variable" : product?.product_price?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Added {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

