import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit,Package, Eye} from 'lucide-react'
import { Product } from '@/types/products'
import { Badge } from '@/components/ui/badge'
import { useAdminListProductsQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OptimizedImage from '@/components/OptimizedImage'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

// Helper function to get "time ago" string
function timeAgo(dateString: string) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? "il y a 1 an" : `il y a ${interval} ans`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? "il y a 1 mois" : `il y a ${interval} mois`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? "il y a 1 jour" : `il y a ${interval} jours`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? "il y a 1 heure" : `il y a ${interval} heures`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? "il y a 1 minute" : `il y a ${interval} minutes`;
  return "à l’instant";
}

export default function ListProducts({ products, isLoading }: { products: Product[], isLoading: boolean }) {
  const navigate = useNavigate()


  if (isLoading) {
    return <IsLoadingComponents isLoading={isLoading} />
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    {product.variations && product.variations.length > 0 && product.variations[0].images && product.variations[0].images.length > 0
                      ? <OptimizedImage
                        src={product.variations[0].images[0]}
                        alt={product.product_name}
                        className="h-full w-full object-cover"
                      />
                      : <AvatarImage
                        src={product.product_profile}
                        className="object-cover"
                      />
                    }
                    <AvatarFallback className="text-sm font-medium">
                      {product.product_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium truncate w-64">{product.product_name}</span>
                    {product.variations && product.variations.length > 0 && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                        Variations
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {product.product_categories[0]?.category_name || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  {product.variations && product.variations.length > 0 ? (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Variable
                    </span>
                  ) : (
                    <span className="font-medium">
                      {parseFloat(product.product_price).toFixed(2)} XAF
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {product.variations && product.variations.length > 0 ? (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Variable
                    </span>
                  ) : (
                    <span className="font-medium">{product.product_quantity}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={product.status ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                    {product.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-500">
                    {product.created_at ? timeAgo(product.created_at) : 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                  
                    
                    <Button
                      onClick={() => navigate(`/admin/products/${product.product_url}`)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {products.map((product: any) => (
          <Card key={product.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative h-48 w-full bg-gray-100">
                {product.variations && product.variations.length > 0 && product.variations[0].images && product.variations[0].images.length > 0 ? (
                  <OptimizedImage
                    src={product.variations[0].images[0]}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <OptimizedImage
                    src={product.product_profile}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={product.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {product.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {product.variations && product.variations.length > 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-100 text-blue-700">
                      Variations
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {product.product_categories[0]?.category_name || 'N/A'}
                  </p>
                </div>

                {/* Price, Stock, and Date */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Prix</p>
                    {product.variations && product.variations.length > 0 ? (
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Variable
                      </span>
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {parseFloat(product.product_price).toFixed(2)} XAF
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Stock</p>
                    {product.variations && product.variations.length > 0 ? (
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Variable
                      </span>
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {product.product_quantity}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Ajouté</p>
                    <span className="text-xs text-gray-500">
                      {product.created_at ? timeAgo(product.created_at) : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => navigate(`/admin/products/${product.product_url}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </div>

                  
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && products?.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  )
}

export function ListProductsContainer() {
  const { data: { data: products } = {}, isLoading } = useAdminListProductsQuery('admin')
  console.log(products)
  return <ListProducts products={products} isLoading={isLoading} />
}
