import { Edit, Eye } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useGetProductsQuery } from '@/services/sellerService'
import { Package } from 'lucide-react'
import { Product } from '@/types/products'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import AsyncLink from '@/components/ui/AsyncLink'
import { formatDate } from '@/lib/formatDate'

export default function ProductListOverview({ products, isLoading }: { products: Product[], isLoading: boolean }) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'out_of_stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'draft':
        return 'Brouillon';
      case 'out_of_stock':
        return 'Rupture';
      default:
        return status;
    }
  };

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
    <div className="overflow-x-auto mx-12">
      {/* Grid for desktop */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex items-center justify-center py-8">
            <IsLoadingComponents isLoading={isLoading} />
          </div>
        )}
        {!isLoading && products.length === 0 && (
          <div className="col-span-full text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucun produit trouvé</p>
            <AsyncLink
              to="/seller/create-product"
              className="text-[#ed7e0f] hover:underline mt-2 inline-block"
            >
              Ajouter votre premier produit
            </AsyncLink>
          </div>
        )}
        {!isLoading && products.length > 0 && products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-16 h-16">
                {getRandomVariationImages(product).slice(0, 3).map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={product.product_name}
                    className="absolute rounded-lg object-cover border-2 border-white shadow"
                    style={{
                      left: `${idx * 16}px`,
                      zIndex: 10 - idx,
                      width: '48px',
                      height: '48px',
                      top: `${idx * 6}px`,
                      background: '#fff'
                    }}
                  />
                ))}
                {/* Fallback si pas d'image */}
                {getRandomVariationImages(product).length === 0 && (
                  <img
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.product_name}</h3>
                <p className="text-xs text-gray-500">{formatDate(product.created_at)}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.product_categories.map((category) => (
                    <span key={category.id} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                      {category.category_name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Badge simple/varié */}
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${product.variations && product.variations.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                {product.variations && product.variations.length > 0 ? 'Varié' : 'Simple'}
              </span>
            </div>
            <div className="flex-1" />
            {/* Infos en bas */}
            <div className="mt-4 border-t pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Prix :</span>
                <span className="font-medium">{product.variations && product.variations.length > 0 ? 'prix variable' : (product?.product_price?.toLocaleString() + ' FCFA')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Stock :</span>
                <span className="font-medium">{product.variations && product.variations.length > 0 ? 'Quantité variable' : product.product_quantity}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-500">Statut :</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(product.status ? 'active' : 'draft')}`}>{getStatusText(product.status ? 'active' : 'draft')}</span>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <a target="_blank" href={`https://dev.akevas.com/produit/${product.product_url}`}> 
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </a>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Modifier">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Supprimer">
                  <Trash2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table for desktop (hidden) */}
      {/* <table className="w-full hidden md:table"> ... </table> */}

      {/* Mobile view */}
      <div className="md:hidden">
        {isLoading && (
          <div className="flex justify-center p-4">
            <IsLoadingComponents isLoading={isLoading} />
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucun produit trouvé</p>
            <AsyncLink
              to="/seller/create-product"
              className="text-[#ed7e0f] hover:underline mt-2 inline-block"
            >
              Ajouter votre premier produit
            </AsyncLink>
          </div>
        )}

        {!isLoading && products.length > 0 && products.map((product) => (
          <div key={product.id} className="border-b p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="relative w-12 h-12">
                {getRandomVariationImages(product).slice(0, 3).map((img, idx) => (
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
                {/* Fallback si pas d'image */}
                {getRandomVariationImages(product).length === 0 && (
                  <img
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.product_name}</h3>
                <p className="text-sm text-gray-500">{formatDate(product.created_at)}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.product_categories.map((category) => (
                    <span key={category.id} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      {category.category_name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Badge simple/varié mobile */}
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${product.variations && product.variations.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                {product.variations && product.variations.length > 0 ? 'Varié' : 'Simple'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Prix:</span>
                <div className="font-medium max-sm:text-xs"> {product.variations && product.variations.length > 0 ? "prix variable" : product?.product_price?.toLocaleString() + " FCFA"}</div>
              </div>
              <div>
                <span className="text-gray-500">Stock:</span>
                <div className="font-medium max-sm:text-xs">{product.variations && product.variations.length > 0 ? "Quantité variable" : product.product_quantity}</div>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status ? 'active' : 'draft')}`}>
                    {getStatusText(product.status ? 'active' : 'draft')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Modifier">
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Supprimer">
                <Trash2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductListContainer() {
  const { data: { data: products } = {}, isLoading } = useGetProductsQuery('seller')
  return <ProductListOverview products={products} isLoading={isLoading} />
}
