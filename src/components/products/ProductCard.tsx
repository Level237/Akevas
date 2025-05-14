import React, { useState } from "react";
import VariationModal from "../ui/VariationModal";
import { useDispatch } from "react-redux";
import { Product } from "@/types/products";
import { addItem } from "@/store/cartSlice";
import AsyncLink from "../ui/AsyncLink";
import { Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';


const ProductCard = ({ product,viewMode }: { product: Product,viewMode?:string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCartButton, setShowCartButton] = useState(false);
    const [showVariationModal, setShowVariationModal] = useState(false);
    const dispatch = useDispatch();
    // Récupérer jusqu'à 4 couleurs uniques des variations
    const colorSwatches = React.useMemo(() => {
      if (!product.variations || product.variations.length === 0) return [];
      const seen = new Set();
      const colors = [];
      for (const variation of product.variations) {
        if (
          variation.color &&
          variation.color.hex &&
          !seen.has(variation.color.hex)
        ) {
          colors.push({
            name: variation.color.name,
            hex: variation.color.hex,
          });
          seen.add(variation.color.hex);
        }
        if (colors.length === 4) break;
      }
      return colors;
    }, [product.variations]);

    const handleAddToCart = async (product: Product, variation?: any) => {
      setIsLoading(true);
      dispatch(addItem({ 
        product, 
        quantity: 1,
        selectedVariation: variation 
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setShowCartButton(true);
    };

    const handleAddToCartClick = () => {
      if (product.variations && product.variations.length > 0) {
        setShowVariationModal(true);
      } else {
        handleAddToCart(product);
      }
    };

    return (
      <>
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={viewMode === 'grid' ? '' : 'flex gap-6 bg-white rounded-2xl shadow-sm p-4'}
        >
          {viewMode === 'grid' ? (
            <div className="group bg-white max-sm:w-[20.9rem] rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              
              <AsyncLink to={`/produit/${product.product_url}`}>
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
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                    Premium
                  </span>
                  <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-xs font-medium">12</span>
                  </div>
                </div>
                {/* Affichage des couleurs si variations */}
                {colorSwatches.length > 0 && (
                  <div className="flex items-center gap-2 px-4 mt-2 mb-1">
                    {colorSwatches.map((color:any, idx:any) => (
                      <div
                        key={color.hex}
                        title={color.name}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: "0 0 0 1px #ccc"
                        }}
                      />
                    ))}
                    {product.variations.length > 4 && (
                      <span className="text-xs text-gray-500 ml-1">+{product.variations.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
              </AsyncLink>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">
                  {product.product_name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Stock: {product.product_quantity} disponibles
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {product.product_price} Fcfa
                  </span>
                  {!showCartButton ? (
                    <button 
                      onClick={handleAddToCartClick}
                      disabled={isLoading}
                      className="px-3 py-2 rounded-lg bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90 transition-colors text-sm"
                    >
                      {isLoading ? (
                        <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-white rounded-full">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Ajouter au panier"
                      )}
                    </button>
                  ) : (
                    <AsyncLink 
                      to="/cart"
                      className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                    >
                      Voir le panier
                    </AsyncLink>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-48 h-48">
                <img
                  src={product.product_profile}
                  alt={product.product_name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Affichage des couleurs si variations (mode liste) */}
                {colorSwatches.length > 0 && (
                  <div className="flex items-center gap-2 absolute bottom-2 left-2">
                    {colorSwatches.map((color, idx) => (
                      <div
                        key={color.hex}
                        title={color.name}
                        className="w-5 h-5 rounded-full border-2 border-white shadow"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: "0 0 0 1px #ccc"
                        }}
                      />
                    ))}
                    {product.variations.length > 4 && (
                      <span className="text-xs text-gray-500 ml-1 bg-white/80 px-1 rounded">+{product.variations.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.product_name}
                  </h3>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      12
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Code: {product.shop_key}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      {product.product_price} Fcfa
                    </span>
                  </div>
                  {
                    !showCartButton ? (
                         <button  onClick={handleAddToCartClick} className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                       {isLoading ? (
                          <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-white rounded-full">
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Ajouter au panier"
                        )}
                    </button>
                    
                      ): (
                    <AsyncLink 
                      to="/cart"
                      className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                    >
                      Voir le panier
                    </AsyncLink>
                  )}
                 
                </div>
              </div>
            </>
          )}
        </motion.div>

        <VariationModal
          isOpen={showVariationModal}
          onClose={() => setShowVariationModal(false)}
          product={product}
          onAddToCart={(variation) => handleAddToCart(product, variation)}
        />
      </>
    );
  };

  export default ProductCard