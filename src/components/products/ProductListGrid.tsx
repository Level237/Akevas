import React, { useState } from 'react'
import { Product } from '@/types/products'
import { motion } from 'framer-motion'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import ProductModal from './ProductModal';

export default function ProductListGrid({products,isLoading}:{products:Product[],isLoading:boolean}) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  return (
    <section>
      
        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!isLoading && products.map((product:Product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <img
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                        Premium
                      </span>
                    </div>
                  
                </div>

                {/* Informations */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                       3
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Boutique: {product.shop_key}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {product.product_price} FCFA
                      </span>
                      
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
                {/* Modal */}
      <ProductModal
        product={selectedProduct!}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
        </div>
    </section>
  )
}
