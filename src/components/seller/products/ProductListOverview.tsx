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

  // Fonction pour déterminer le type de vente
  const getSaleTypeInfo = (product: Product) => {
    if (product.isWholeSale) {
      return {
        type: 'wholesale',
        label: 'Vente en Gros',
        color: 'bg-purple-100 text-purple-700',
        icon: '🏪',
        description: 'Prix de gros disponible'
      };
    } else {
      return {
        type: 'retail',
        label: 'Vente au Détail',
        color: 'bg-blue-100 text-blue-700',
        icon: '🛍️',
        description: 'Prix unitaire'
      };
    }
  };

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
        {!isLoading && products.length > 0 && products.map((product) => {
          const saleInfo = getSaleTypeInfo(product);
          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Header avec image et badges */}
              <div className="relative">
                {/* Image principale */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                  {getRandomVariationImages(product).length > 0 ? (
                    <img
                      src={getRandomVariationImages(product)[0]}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={product.product_profile}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Badges flottants */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {/* Badge type de vente */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${saleInfo.color}`}>
                      {saleInfo.icon} {saleInfo.label}
                    </span>

                    {/* Badge simple/varié */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${product.variations && product.variations.length > 0
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-white'
                      }`}>
                      {product.variations && product.variations.length > 0 ? 'Varié' : 'Simple'}
                    </span>
                  </div>

                  {/* Badge statut */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(product.status ? 'active' : 'draft')}`}>
                      {getStatusText(product.status ? 'active' : 'draft')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-5">
                {/* Titre et date */}
                <div className="mb-3 flex items-center gap-2 justify-between">
                  <h3 className="font-bold   text-lg text-gray-900  line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.product_name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    {formatDate(product.created_at)}
                  </p>
                </div>

                {/* Catégories */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.product_categories.slice(0, 3).map((category) => (
                      <span key={category.id} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {category.category_name}
                      </span>
                    ))}
                    {product.product_categories.length > 3 && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                        +{product.product_categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Informations clés */}
                <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Prix</div>
                    <div className="font-bold text-sm  text-gray-900">
                      {product.variations && product.variations.length > 0
                        ? "Variable"
                        : `${product?.product_price?.toLocaleString()} FCFA`}
                    </div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Stock</div>
                    <div className="font-bold text-sm text-gray-900">
                      {product.variations && product.variations.length > 0
                        ? "Variable"
                        : product.product_quantity}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    target="_blank"
                    href={`https://akevas.com/produit/${product.product_url}`}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 py-2.5 px-4 rounded-lg text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />

                  </a>
                  <AsyncLink
                    to={`/seller/product/edit/${product.product_url}`}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 py-2.5 px-4 rounded-lg text-sm font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />

                  </AsyncLink>
                  <button className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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

        {!isLoading && products.length > 0 && products.map((product) => {
          const saleInfo = getSaleTypeInfo(product);
          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-4 overflow-hidden group">
              {/* Header avec image et badges */}
              <div className="relative">
                {/* Image principale */}
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                  {getRandomVariationImages(product).length > 0 ? (
                    <img
                      src={getRandomVariationImages(product)[0]}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={product.product_profile}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Badges flottants */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {/* Badge type de vente */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg ${saleInfo.color}`}>
                      {saleInfo.icon} {saleInfo.label}
                    </span>

                    {/* Badge simple/varié */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg ${product.variations && product.variations.length > 0
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-white'
                      }`}>
                      {product.variations && product.variations.length > 0 ? 'Varié' : 'Simple'}
                    </span>
                  </div>

                  {/* Badge statut */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(product.status ? 'active' : 'draft')}`}>
                      {getStatusText(product.status ? 'active' : 'draft')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-4">
                {/* Titre et date */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.product_name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    {formatDate(product.created_at)}
                  </p>
                </div>

                {/* Catégories */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {product.product_categories.slice(0, 2).map((category) => (
                      <span key={category.id} className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {category.category_name}
                      </span>
                    ))}
                    {product.product_categories.length > 2 && (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                        +{product.product_categories.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Informations clés */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Prix</div>
                    <div className="font-bold text-sm text-gray-900">
                      {product.variations && product.variations.length > 0
                        ? "Variable"
                        : `${product?.product_price?.toLocaleString()} FCFA`}
                    </div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Stock</div>
                    <div className="font-bold text-sm text-gray-900">
                      {product.variations && product.variations.length > 0
                        ? "Variable"
                        : product.product_quantity}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    target="_blank"
                    href={`https://akevas.com/produit/${product.product_url}`}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 py-2 px-3 rounded-lg text-xs font-medium text-center transition-colors duration-200 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Voir
                  </a>
                  <AsyncLink
                    to={`/seller/product/edit/${product.product_url}`}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 py-2 px-3 rounded-lg text-xs font-medium text-center transition-colors duration-200 flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Modifier
                  </AsyncLink>
                  <button className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export function ProductListContainer() {
  const { data: { data: products } = {}, isLoading } = useGetProductsQuery('seller')
  return <ProductListOverview products={products} isLoading={isLoading} />
}
