import { Button } from '@/components/ui/button'
import { Package, Eye} from 'lucide-react'
import { Product } from '@/types/products'
import { Badge } from '@/components/ui/badge'
import { useAdminListProductsQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
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
      {/* Responsive Modern Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <Card key={product.id} className="overflow-hidden border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Product Image */}
              <div className="relative h-56 w-full bg-gray-50 overflow-hidden">
                {product.variations && product.variations.length > 0 && product.variations[0].images && product.variations[0].images.length > 0 ? (
                  <OptimizedImage
                    src={product.variations[0].images[0]}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <OptimizedImage
                    src={product.product_profile}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  {product.isRejet == 0 ? (
                    <Badge className={`shadow-sm border-0 font-medium ${product.status ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}>
                      {product.status ? "Active" : "Inactive"}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-sm border-0 font-medium">
                      Rejeté
                    </Badge>
                  )}
                </div>

                {/* Variation Badge */}
                {product.variations && product.variations.length > 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/95 text-blue-700 shadow-sm hover:bg-white font-medium">
                      Variations
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#ed7e0f] transition-colors leading-tight" title={product.product_name}>
                    {product.product_name}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mt-1.5">
                    {product.product_categories && product.product_categories.length > 0 ? product.product_categories[0].category_name : 'Sans catégorie'}
                  </p>
                </div>

                {/* Price and Stock Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                  <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Prix</p>
                    {product.variations && product.variations.length > 0 ? (
                      <span className="text-sm font-bold text-blue-600">
                        Variable
                      </span>
                    ) : (
                      <p className="font-bold text-gray-900 truncate" title={`${parseFloat(product.product_price).toLocaleString()} XAF`}>
                        {parseFloat(product.product_price).toLocaleString()} <span className="text-xs text-gray-500 font-medium">XAF</span>
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Stock</p>
                    {product.variations && product.variations.length > 0 ? (
                      <span className="text-sm font-bold text-blue-600">
                        Variable
                      </span>
                    ) : (
                      <p className="font-bold text-gray-900">
                        {product.product_quantity} <span className="text-xs text-gray-500 font-medium">unités</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="text-xs text-gray-400 font-medium flex items-center">
                    Ajouté {product.created_at ? timeAgo(product.created_at) : 'N/A'}
                  </span>
                  <Button
                    onClick={() => navigate(`/admin/products/${product.product_url}`)}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-[#ed7e0f] bg-[#ed7e0f]/10 hover:bg-[#ed7e0f]/20 hover:text-[#ed7e0f] rounded-lg transition-colors font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
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
