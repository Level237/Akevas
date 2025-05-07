import { normalizeProduct } from "@/lib/normalizeProduct"
import { Product } from "@/types/products"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import React from "react"

const SimilarProducts = ({ similarProducts, isLoadingSimilarProducts }: { similarProducts: Product[], isLoadingSimilarProducts: boolean }) => {
    
    const safeProducts = similarProducts || [];

    // Fonction utilitaire pour normaliser un produit
    
  
    // On normalise tous les produits avant de les afficher
    const normalizedProducts = safeProducts.map(normalizeProduct);
    return (
        <>
            {
                !isLoadingSimilarProducts && similarProducts && similarProducts.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm p-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Produits similaires</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {normalizedProducts.slice(0, 5).map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <a
                                        href={`/produit/${product.product_url}`}
                                        className="block h-full p-2 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                            <img
                                                src={product.product_profile}
                                                alt={product.product_name}
                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                            />

                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {product.product_name}
                                            </h3>

                                            <div className="flex items-center gap-1">
                                                <span className="text-base font-bold text-[#ed7e0f]">
                                                    {product.product_price} FCFA
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                <span>{product.review_average}</span>
                                                <span className="mx-0.5">•</span>
                                                <span>{product.count_seller} vendus</span>
                                            </div>
                                        </div>
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
        </>
    )
}

export default React.memo(SimilarProducts)