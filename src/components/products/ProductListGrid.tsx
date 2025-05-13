import { useState, memo, useRef } from 'react'

import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion'
import { Heart, Star, ShoppingCart, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addItem } from '@/store/cartSlice'
import { normalizeProduct } from '@/lib/normalizeProduct'
import VariationModal from '@/components/ui/VariationModal'
import AsyncLink from '../ui/AsyncLink'
import { toast } from 'sonner'
import OptimizedImage from '@/components/OptimizedImage'

// Ajout des types pour les variations
interface Color {
  id: number;
  name: string;
  hex: string;
}

interface Variant {
  id: number;
  color: Color;
  images?: string[];
  attributes?: Array<{
    id: number;
    value: string;
    quantity: number;
    price: string;
  }>;
}

interface Product {
  id: number;
  product_name: string;
  product_profile: string;
  product_price: string;
  product_quantity: number;
  review_average: number;
  shop_key: string;
  variations?: Variant[];
}

const ProductListGrid = ({ products = [], isLoading }: { products: Product[], isLoading: boolean }) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [showCartButton, setShowCartButton] = useState<Record<string, boolean>>({});
  const [isLoadingCart, setIsLoadingCart] = useState<Record<string, boolean>>({});
  const [showVariationModal, setShowVariationModal] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const controls = useAnimation();
  const safeProducts = products || [];

  // On normalise tous les produits avant de les afficher
  const normalizedProducts = safeProducts.map(normalizeProduct);

  // Fonction pour récupérer les couleurs uniques des variations
  const getColorSwatches = (product: any) => {
    if (!product.variations?.length) return [];
    const seen = new Set();
    const colors = [];
    for (const variation of product.variations) {
      if (
        variation.color?.hex &&
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
  };

  const handleAddToCart = async (product: Product, variation?: any) => {
    setIsLoadingCart(prev => ({ ...prev, [product.id]: true }));
    dispatch(addItem({ 
      product, 
      quantity: 1,
      selectedVariation: variation 
    }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoadingCart(prev => ({ ...prev, [product.id]: false }));
    setShowCartButton(prev => ({ ...prev, [product.id]: true }));

   
  };

  const handleAddToCartClick = (product: Product) => {
    if (product.variations && product.variations.length > 0) {
      setSelectedProduct(product);
      setShowVariationModal(prev => ({ ...prev, [product.id]: true }));
    } else {
      handleAddToCart(product);
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280 + 16;

      // Défilement basé sur la vélocité du swipe
      if (Math.abs(velocity) > 500) {
        const direction = velocity < 0 ? 1 : -1;
        container.scrollBy({
          left: cardWidth * direction,
          behavior: 'smooth'
        });
      } 
      // Défilement basé sur la distance du swipe
      else if (Math.abs(offset) > 50) {
        const direction = offset < 0 ? 1 : -1;
        container.scrollBy({
          left: cardWidth * direction,
          behavior: 'smooth'
        });
      }
    }

    controls.start({ x: 0 });
    setIsDragging(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280 + 16;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="min-h-screen max-sm:min-h-[100%] w-full relative">
      <div className='flex justify-between mb-4 items-start'>
        <div className='flex items-start flex-col'>
          <h2 className='text-2xl hidden max-sm:block font-bold text-gray-900'>
            Produits Premium
          </h2>
        </div>
        
        {/* Boutons de navigation mobile */}
        <div className="md:hidden flex justify-end gap-2 px-4 mb-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              scroll('left');
            }}
            className="p-3 rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-100 flex items-center justify-center group"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              scroll('right');
            }}
            className="p-3 rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-100 flex items-center justify-center group"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>
      </div>

      <motion.div 
        ref={scrollContainerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x: dragX }}
        whileTap={{ cursor: "grabbing" }}
        className="flex flex-row gap-4 overflow-x-hidden overflow-y-hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4 md:pb-0 px-4 max-sm:gap-0 snap-x snap-mandatory md:snap-none touch-pan-x overscroll-x-contain cursor-grab isolate overflow-x-auto scrollbar-hide transition-all duration-300 ease-out"
      >
        {!isLoading ? (
          normalizedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="m-3 cursor-pointer max-sm:w-[259px] transition-transform duration-200 snap-start flex-shrink-0 max-sm:w-full"
            >
              <div className="group  bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image et badges */}
                <AsyncLink to={`produit/${product.product_url}`}>
                <div className="relative  aspect-[4/3] max-sm:aspect-[4/3]">
                
                  <OptimizedImage
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-full  h-full object-cover"
                  />
                 
                  <div className="absolute cursor-pointer inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                      Premium
                    </span>
                    <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-xs font-medium">{product.review_average}</span>
                    </div>
                  </div>

                  {/* Bouton favori */}
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Variations de couleurs */}
                  {product.variations && product.variations.length > 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-full">
                      {getColorSwatches(product).map((color) => (
                        <div
                          key={color.hex}
                          title={color.name}
                          className="w-4 h-4 rounded-full border border-gray-200"
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
                {/* Informations produit */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {product.product_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Stock: {product.product_quantity}
                      </span>
                      <span className="text-lg font-bold text-[#ed7e0f]">
                        {product.product_price} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <div className="flex justify-end">
                    {!showCartButton[product.id] ? (
                      <button 
                        onClick={() => handleAddToCartClick(product)}
                        disabled={isLoadingCart[product.id]}
                        className="w-full px-4 py-2 rounded-lg bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        {isLoadingCart[product.id] ? (
                          <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-white rounded-full">
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Ajouter au panier
                          </>
                        )}
                      </button>
                    ) : (
                      <AsyncLink to="/cart" className="w-full">
                        <button 
                          className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Voir le panier
                        </button>
                      </AsyncLink>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          Array(8).fill(0).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              
              className="
                flex-shrink-0
                w-[280px] md:w-full
                snap-start
                aspect-[4/3] animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 
                rounded-3xl shadow-lg
              "
            />
          ))
        )}
      </motion.div>

      {selectedProduct && (
        <VariationModal
          isOpen={showVariationModal[selectedProduct.id] || false}
          onClose={() => {
            setShowVariationModal(prev => ({ ...prev, [selectedProduct.id]: false }));
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onAddToCart={(variation) => handleAddToCart(selectedProduct, variation)}
        />
      )}
    </section>
  );
}

export default memo(ProductListGrid);
