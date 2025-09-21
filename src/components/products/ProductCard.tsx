import React, { useCallback, useState } from "react";
import VariationModal from "../ui/VariationModal";
import { useDispatch } from "react-redux";
import { Product } from "@/types/products";
import { addItem } from "@/store/cartSlice";
import AsyncLink from "../ui/AsyncLink";
import { Heart, Star } from "lucide-react";
import { motion} from 'framer-motion';
import OptimizedImage from "../OptimizedImage";
import { toast } from "sonner";


const ProductCard = ({ product,viewMode }: { product: Product,viewMode?:string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCartButton, setShowCartButton] = useState(false);
    const [showVariationModal, setShowVariationModal] = useState(false);
    const dispatch = useDispatch();
    // Récupérer jusqu'à 4 couleurs uniques des variations

    const getColorSwatches = useCallback((product: any) => {
      if (!product.variations?.length) return [];
      const seen = new Set();
      const colors = [];
      for (const variation of product.variations) {
        if (variation.color?.hex && !seen.has(variation.color.hex)) {
          colors.push({
            name: variation.color.name,
            hex: variation.color.hex,
          });
          seen.add(variation.color.hex);
        }
        if (colors.length === 4) break;
      }
      return colors;
    }, []);
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

    const variationsCount = product.variations?.length || 0;

    const handleAddToCart = async (product: Product, variation?: any) => {
      
      setIsLoading(true);
      dispatch(addItem({ 
        product, 
        quantity: 1,
        selectedVariation: variation 
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Produit ajouté au panier avec succès", {
        position: "top-center", 
        duration: 6000,
        style: {
          backgroundColor: "#ed7e0f",
          color: "#fff",
          zIndex: 98888000
        },
        action: {
          label: "Voir le panier",
          onClick: () => window.location.href = "/cart"
        }
      })
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
          className={viewMode === 'grid' ? '' : 'flex gap-6 bg-white rounded-2xl shadow-sm p-4 '}
        >
          {viewMode === 'grid' ? (
            <div className="group max-sm:px-1 bg-white  rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              
              <AsyncLink to={`/produit/${product.product_url}`}>
              <div className="relative aspect-[4/3] max-sm:aspect-[4/3] ">
                <OptimizedImage
                  src={product.product_profile}
                  alt={product.product_name}
                  className="w-full h-full object-cover transform  transition-transform duration-300"
                />
                <div className="absolute bottom-0">
                {colorSwatches.length > 0 && (
                  <div className="max-sm:flex items-center max-sm:hidden right-[50%] left-[50%] hidden gap-2 px-4 mt-2 mb-1">
                    {colorSwatches.map((color:any) => (
                      <div
                        key={color.hex}
                        title={color.name}
                        className="w-6 h-6 max-sm:w-5 max-sm:h-5 rounded-full border-2 border-white shadow"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: "0 0 0 1px #ccc"
                        }}
                      />
                    ))}
                    {variationsCount > 4 && (
                      <span className="text-xs text-gray-500 ml-1">+{variationsCount - 4}</span>
                    )}
                  </div>
                )}
                </div>
               
                {/* Affichage des couleurs si variations */}
                {product.variations && product.variations.length > 0 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center max-sm:px-2 max-sm:py-1 gap-2 bg-white/90 px-3 py-2 rounded-full">
                {getColorSwatches(product).map((color) => (
                  <div
                    key={color.hex}
                    title={color.name}
                    className="w-4 h-4 max-sm:w-3 max-sm:h-3 rounded-full border border-gray-200"
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: "0 0 0 1px #ccc"
                    }}
                  />
                ))}
                {product.variations.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.variations.length - 4}
                  </span>
                )}
              </div>
            )}
              </div>

           
              </AsyncLink>
              <div className="p-4">
                <h3 className="font-medium max-sm:text-sm  text-gray-900 mb-1 truncate">
                  {product.product_name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm max-sm:text-xs text-gray-500">
                    Stock: {product.product_quantity} disponibles
                  </span>
                </div>
                <div className="flex items-center max-sm:items-start max-sm:gap-5 max-sm:flex-col justify-between">
                  <span className="text-lg max-sm:text-sm font-bold text-gray-900">
                    {product.product_price} Fcfa
                  </span>
                  {!showCartButton ? (
                    <button 
                      onClick={handleAddToCartClick}
                      disabled={isLoading}
                      className="px-3 py-2 max-sm:text-xs max-sm:px-2 rounded-lg bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90 transition-colors text-sm"
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
                    {colorSwatches.map((color) => (
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
                    {variationsCount > 4 && (
                      <span className="text-xs text-gray-500 ml-1 bg-white/80 px-1 rounded">+{variationsCount - 4}</span>
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