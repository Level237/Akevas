
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  image: string
  addedAt: string
}

interface RecentProductsProps {
  products: Product[]
}

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Added {new Date(product.addedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

