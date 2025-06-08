import { useState, useRef, useEffect } from 'react';
import { Search,Store, Package2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchByQueryQuery } from '@/services/guardService';
import OptimizedImage from '@/components/OptimizedImage';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  variant?: 'header' | 'standalone';
}

export default function SearchBar({ className = '', variant = 'header' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Gestion du debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fermeture au clic externe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data, isLoading } = useSearchByQueryQuery(
    { query: debouncedQuery, userId: 0 },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  return (
    <div ref={searchBarRef} className={`relative ${className}`}>
      {/* Barre de recherche */}
      <motion.div
        className={`w-full ${variant === 'header' ? 'max-w-[800px]' : 'max-w-3xl'}`}
        initial={false}
        animate={{ scale: isSearchOpen ? 0.98 : 1 }}
      >
        <div className="relative w-full group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Rechercher des boutiques ou produits..."
            className={`
              w-[35rem] pl-12 pr-12 py-3.5 
              rounded-2xl border 
              text-sm transition-all duration-200
              ${variant === 'standalone' 
                ? 'bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15' 
                : 'bg-gray-50 border-gray-200 focus:bg-white'
              }
              focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/30
            `}
          />
          
          {/* Icône de recherche */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <Search className={`w-4 h-4 ${
                variant === 'standalone' ? 'text-white/70' : 'text-gray-400'
              }`} />
            )}
          </div>

          {/* Bouton de fermeture */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`
                absolute right-4 top-1/2 -translate-y-1/2 
                p-1 rounded-full
                transition-colors duration-200
                ${variant === 'standalone' 
                  ? 'text-white/70 hover:bg-white/10' 
                  : 'text-gray-400 hover:bg-gray-100'
                }
              `}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Résultats de recherche */}
      <AnimatePresence>
        {isSearchOpen && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`
              absolute top-full left-0 right-0 mt-2
              bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100
              overflow-hidden z-50 max-h-[85vh] overflow-y-auto
              ${variant === 'standalone' ? 'bg-opacity-95' : ''}
            `}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <p className="text-sm text-gray-500">Recherche en cours...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100/70">
                {/* Boutiques */}
                {data?.shops && data.shops.length > 0 && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Store className="w-4 h-4 text-orange-500" />
                      Boutiques ({data.shops.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {data.shops.map((shop: any) => (
                        <Link
                          key={shop.shop_id}
                          to={`/shop/${shop.shop_id}`}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 transition-all duration-200 group"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <OptimizedImage
                            src={shop.shop_profile}
                            alt={shop.shop_name}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                              {shop.shop_key}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {shop.shop_description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Produits */}
                {data?.products && data.products.length > 0 && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package2 className="w-4 h-4 text-orange-500" />
                      Produits ({data.products.length})
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {data.products.map((product: any) => (
                        <Link
                          key={product.id}
                          to={`/produit/${product.product_url}`}
                          className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <OptimizedImage
                              src={product.product_profile}
                              alt={product.product_name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3 bg-white">
                            <h4 className="font-medium text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                              {product.product_name}
                            </h4>
                            <p className="text-sm font-semibold text-orange-500 mt-1">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XAF'
                              }).format(parseInt(product.product_price))}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aucun résultat */}
                {(!data?.shops?.length && !data?.products?.length) && !isLoading && (
                  <div className="py-12 px-6 text-center">
                    <Package2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">Aucun résultat trouvé pour "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 mt-2">Essayez avec d'autres mots-clés</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 