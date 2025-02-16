
import AsyncLink from "@/components/ui/AsyncLink"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import IsLoadingComponents from "@/components/ui/isLoadingComponents"
import { Product } from "@/types/products"


interface RecentProductsProps {
  products: Product[]
  isLoading: boolean
}

export function RecentProducts({ products,isLoading }: RecentProductsProps) {
  if(isLoading){
    return <IsLoadingComponents isLoading={isLoading}/>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between font-bold">Produits récents 
         <AsyncLink to="/admin/products"> <Button className=" bg-transparent border-[1px] hover:bg-[#ed7e0f]/20 text-[#ed7e0f] border-[#ed7e0f]/90">Voir plus</Button></AsyncLink>
          </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <img
                  src={product.product_profile || "/placeholder.svg"}
                  alt={product.product_name}
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{product.product_name}</p>
                <p className="text-sm text-muted-foreground">{parseFloat(product.product_price).toFixed(2)} FCFA</p>
                <p className="text-xs text-muted-foreground">Added {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

