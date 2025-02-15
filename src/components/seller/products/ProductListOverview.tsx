import { Edit, Eye } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useGetProductsQuery } from '@/services/sellerService'
import { Loader2, Package } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@/types/products'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import AsyncLink from '@/components/ui/AsyncLink'
import { formatDate } from '@/lib/formatDate'

export default function ProductListOverview({products,isLoading}:{products:Product[],isLoading:boolean}) {
  
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
  
    return (
     
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Produit</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Prix</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
             {isLoading && <tr>
              <td colSpan={8} className="text-center">
                <div className="flex items-center justify-center">
                  <IsLoadingComponents isLoading={isLoading}/>
                </div>
              </td>
             </tr>} 
           {!isLoading && products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Aucun produit trouvé</p>
                      <AsyncLink
                        to="/seller/create-product"
                        className="text-[#ed7e0f] hover:underline mt-2 inline-block"
                      >
                        Ajouter votre premier produit
                      </AsyncLink>
                    </td>
                  </tr>
                )}
             {!isLoading && products.length > 0 && (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.product_profile}
                            alt={product.product_name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{product.product_name}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(product.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        <div className="grid grid-cols-3">
                        {product.product_categories.map((category) => (
                          <span key={category.id} className="px-3  py-1 mx-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            {category.category_name}
                          </span>
                        ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">
                          {product.product_price.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">{product.product_quantity}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            product.status ? 'active' : 'draft'
                          )}`}
                        >
                          {getStatusText(product.status ? 'active' : 'draft')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Voir"
                          >
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
  )
}

export function ProductListContainer(){
    const {data :{ data: products } = {},isLoading}=useGetProductsQuery('seller')
    return <ProductListOverview products={products} isLoading={isLoading} />
}
