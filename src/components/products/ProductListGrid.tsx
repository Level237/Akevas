import { useState, memo, useRef} from 'react'
import { Product } from '@/types/products'
import { motion, useMotionValue,useAnimation, PanInfo } from 'framer-motion'
import { Heart, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductModal from './ProductModal'




// Composant pour l'image (sans lazy loading)
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transform transition-all duration-300 ${
          isLoaded ? 'opacity-1' : 'opacity-1'
        } ${isLoaded ? '' : ''}`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

const ProductListGrid = ({ products = [], isLoading }: { products: Product[], isLoading: boolean }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const controls = useAnimation();
  const safeProducts = products || [];

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      e.preventDefault();
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
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
    <section className="min-h-screen w-full relative">
      {/* Boutons de navigation repositionnés */}

      <div className='flex justify-between mb-4 items-start'>
        <h2 className='text-2xl hidden max-sm:block font-bold text-gray-900'>
          Produits Premium
        </h2>
        <div className="md:hidden flex justify-end gap-2 px-4 mb-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            scroll('left');
          }}
          className="
            p-3 rounded-xl bg-white shadow-lg
            transition-all duration-300
            hover:shadow-xl hover:scale-105
            active:scale-95
            border border-gray-100
            flex items-center justify-center
            group
          "
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            scroll('right');
          }}
          className="
            p-3 rounded-xl bg-white shadow-lg
            transition-all duration-300
            hover:shadow-xl hover:scale-105
            active:scale-95
            border border-gray-100
            flex items-center justify-center
            group
          "
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
        className="
          flex flex-row gap-4 overflow-x-hidden overflow-y-hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          pb-4 md:pb-0 px-4
          max-sm:gap-0
          snap-x snap-mandatory md:snap-none
          touch-pan-x
          overscroll-x-contain
          cursor-grab
          isolate
          overflow-x-auto scrollbar-hide
          transition-all duration-300 ease-out
        "
      >
        {!isLoading ? (
          safeProducts.map((product) => (
            <motion.div
              key={product.id}
              className="m-3 max-sm:w-[275px] transition-transform duration-200  snap-start flex-shrink-0 max-sm:w-full"
            >
              <div
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative aspect-square max-sm:aspect-[4/3]">
                  <LazyImage
                    src={product.product_profile}
                    alt={product.product_name}
                    className="w-full h-full"
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

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{product.review_average}</span>
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
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

export default memo(ProductListGrid);
