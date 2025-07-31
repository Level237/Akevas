import { Edit, Eye } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useGetProductsQuery } from '@/services/sellerService'
import { Package } from 'lucide-react'
import { Product } from '@/types/products'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import AsyncLink from '@/components/ui/AsyncLink'
import { formatDate } from '@/lib/formatDate'

export default function ProductListOverview({ products, isLoading }: { products: Product[], isLoading: boolean }) {
  console.log(products)
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
        return "En attente";
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
    <div className="overflow-x-auto mx-12 max-sm:mx-2 max-sm:mb-12">
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
                <a target="_blank" href={`https://akevas.com/produit/${product.product_url}`}> 
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </a>
                <AsyncLink
                to={`/seller/product/edit/${product.product_url}`}
                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                
              >
                <Edit className="w-5 h-5" />
              </AsyncLink>
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
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-20 h-20">
                {getRandomVariationImages(product).slice(0, 3).map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={product.product_name}
                    className="absolute rounded-xl object-cover border-2 border-white shadow-sm"
                    style={{
                      left: `${idx * 16}px`,
                      zIndex: 10 - idx,
                      width: '48px',
                      height: '48px', 
                      top: `${idx * 6}px`,
                      background: '#fff',
                      transition: 'transform 0.2s',
                      transform: `rotate(${idx * -4}deg)`
                    }}
                  />
                ))}
                {getRandomVariationImages(product).length === 0 && (
                  <img
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-20 h-20 rounded-xl object-cover shadow-sm"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.variations && product.variations.length > 0 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-50 text-gray-600'
                  }`}>
                    {product.variations && product.variations.length > 0 ? 'Varié' : 'Simple'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mt-1">{formatDate(product.created_at)}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.product_categories.map((category) => (
                    <span key={category.id} className="px-3 max-sm:px-1 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                      {category.category_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mt-4">
              <div className="text-center">
                <span className="text-sm text-gray-500 block mb-1">Prix</span>
                <div className="font-semibold max-sm:text-xs text-gray-900">
                  {product.variations && product.variations.length > 0 
                    ? "Variable" 
                    : `${product?.product_price?.toLocaleString()} FCFA`}
                </div>
              </div>
              
              <div className="text-center border-x border-gray-200">
                <span className="text-sm text-gray-500 block mb-1">Stock</span>
                <div className="font-semibold text-gray-900">
                  {product.variations && product.variations.length > 0 
                    ? "Variable" 
                    : product.product_quantity}
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-sm text-gray-500 block mb-1">Statut</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status ? 'active' : 'draft')}`}>
                  {getStatusText(product.status ? 'active' : 'draft')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <a 
                href={`https://akevas.com/produit/${product.product_url}`}
                target="_blank"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Voir"
              >
                <Eye className="w-5 h-5" />
              </a>
              <AsyncLink
               to={`/seller/product/edit/${product.product_url}`}
                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                
              >
                <Edit className="w-5 h-5" />
              </AsyncLink>
              <button
                
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
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
