import { useState, memo, useRef, useMemo, useCallback } from 'react'
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion'
import {Star, ShoppingCart, ChevronLeft, ChevronRight} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addItem } from '@/store/cartSlice'
import { normalizeProduct } from '@/lib/normalizeProduct'
import VariationModal from '@/components/ui/VariationModal'
import AsyncLink from '../ui/AsyncLink'
import OptimizedImage from '@/components/OptimizedImage'
import { Product } from '@/types/products'
import { toast } from 'sonner'

const ProductCard = memo(({ 
  product, 
  showCartButton,
  isLoadingCart,
  onAddToCartClick,
  getColorSwatches
}: {
  product: Product,
  showCartButton: Record<string, boolean>,
  isLoadingCart: Record<string, boolean>,
  onAddToCartClick: (product: Product) => void,
  getColorSwatches: (product: any) => any[]
}) => {

  
  return (
    <motion.div
      className="m-3 w-[290px] cursor-pointer max-sm:max-w-56 transition-transform duration-200 snap-start flex-shrink-0 max-sm:w-full"
      layout
    >
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <AsyncLink to={`/produit/${product.product_url}`}>
          <div className="relative aspect-[4/3] max-sm:aspect-[4/3]">
            <OptimizedImage
              src={product.product_profile}
              alt={product.product_name}
              className="w-full h-full object-cover"
             
            />
            <div className="absolute cursor-pointer inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              
              <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="ml-1 text-xs font-medium">{product.review_average}</span>
              </div>
            </div>

           

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

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium max-sm:text-sm text-gray-900 mb-1 truncate">
              {product.product_name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm max-sm:hidden text-gray-500">
                Stock: {product.product_quantity}
              </span>
              <span className="text-lg max-sm:text-sm font-bold text-[#ed7e0f]">
                {product.product_price} FCFA
              </span>
            </div>
          </div>

          <div className="flex max-sm:hidden justify-end">
            {!showCartButton[product.id] ? (
              <button 
                onClick={() => onAddToCartClick(product)}
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
  );
});

const ProductListGrid = ({ products = [], isLoading, gridColumn, type }: { products: Product[], isLoading: boolean, gridColumn?: any, type?: string }) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  console.log(isDragging)
  const [showCartButton, setShowCartButton] = useState<Record<string, boolean>>({});
  const [isLoadingCart, setIsLoadingCart] = useState<Record<string, boolean>>({});
  const [showVariationModal, setShowVariationModal] = useState<Record<string, boolean>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const controls = useAnimation();
  
  const normalizedProducts = useMemo(() => 
    (products || []).map(normalizeProduct),
    [products]
  );

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

  const handleAddToCart = useCallback(async (product: Product, variation?: any) => {
    setIsLoadingCart(prev => ({ ...prev, [product.id]: true }));
    dispatch(addItem({ 
      product, 
      quantity: 1,
      selectedVariation: variation 
    }));
   
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Produit ajouté au panier avec succès", {
      position: "bottom-center", 
      duration: 6000,
      action: {
        label: "Voir le panier",
        onClick: () => window.location.href = "/cart"
      }
    })
    setIsLoadingCart(prev => ({ ...prev, [product.id]: false }));
    setShowCartButton(prev => ({ ...prev, [product.id]: true }));
  }, [dispatch]);

  const handleAddToCartClick = useCallback((product: any) => {
    if (product.variations && product.variations.length > 0) {
      setSelectedProduct(product);
      setShowVariationModal(prev => ({ ...prev, [product.id]: true }));
    } else {
      handleAddToCart(product);
    }
  }, [handleAddToCart]);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280 + 16;

      if (Math.abs(velocity) > 500) {
        const direction = velocity < 0 ? 1 : -1;
        container.scrollBy({
          left: cardWidth * direction,
          behavior: 'smooth'
        });
      } 
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
  }, [controls]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280 + 16;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <section className="lg:min-h-screen max-sm:min-h-[100%] max-sm:m-1 w-full relative">
      <div className='flex justify-between mb-4 items-center'>
        <div className='flex items-start flex-col'>
          <h2 className='text-2xl max-sm:text-xl  hidden max-sm:block font-bold text-gray-900'>
            Produits Premium
          </h2>
          
        </div>
        
        <div className={`${!isLoading && normalizedProducts.length > 3 ? "flex" : "max-sm:hidden"} justify-end gap-2 px-4 mb-4`}>
          
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
        className={`flex flex-row gap-4 overflow-x-hidden overflow-y-hidden ${type!=="grid" || !type && "md:grid"}  md:grid-cols-2 lg:grid-cols-3 ${gridColumn ? `xl:grid-cols-${gridColumn}` : "xl:grid-cols-4"} pb-4 md:pb-0 px-4 max-sm:gap-0 snap-x snap-mandatory md:snap-none touch-pan-x overscroll-x-contain cursor-grab isolate overflow-x-auto scrollbar-hide transition-all duration-300 ease-out`}
      >
        {!isLoading ? (
          normalizedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showCartButton={showCartButton}
              isLoadingCart={isLoadingCart}
              onAddToCartClick={handleAddToCartClick}
              getColorSwatches={getColorSwatches}
            />
          ))
        ) : (
          Array(8).fill(0).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              className="flex-shrink-0 w-[280px] md:w-full snap-start aspect-[4/3] animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl shadow-lg"
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
