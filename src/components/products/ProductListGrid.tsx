import { useState, useEffect, useRef, memo } from 'react'
import { Product } from '@/types/products'
import { motion } from 'framer-motion'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import ProductModal from './ProductModal'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

// Hook personnalisé pour l'intersection observer
const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
      }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};

// Composant pour l'image lazy-loadée
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(imgRef);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transform transition-all duration-300 ${
            isLoaded ? 'opacity-1' : 'opacity-1'
          } ${isLoaded ? 'group-hover:scale-105' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

const ProductListGrid=({ products = [], isLoading }: { products: Product[], isLoading: boolean }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Si products est undefined ou null, on utilise un tableau vide
  const safeProducts = products || [];

  return (
    <section className="min-h-screen w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isLoading ? (
          safeProducts.map((product) => (
            <motion.div
              key={product.id}
              className="m-3"
            >
              <div
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative aspect-square">
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
                      <span className="ml-1 text-sm text-gray-600">3</span>
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
            <div key={index} className="animate-pulse bg-gray-200 rounded-2xl aspect-square" />
          ))
        )}
      </div>

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
