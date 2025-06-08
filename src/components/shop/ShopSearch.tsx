import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Store, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';
import { useSearchByQueryQuery } from '@/services/guardService';

interface ShopSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopSearchResults = ({ shops, isLoading }: { shops: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!shops?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Aucune boutique trouvée</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-4 p-4"
    >
      {shops.map((shop) => (
        <motion.div
          key={shop.shop_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <Link
            to={`/shop/${shop.shop_id}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
              <OptimizedImage
                src={shop.shop_profile}
                alt={shop.shop_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                {shop.shop_key}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {shop.shop_description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-orange-400">
                  {shop.products_count} produits
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function ShopSearch({ isOpen, onClose }: ShopSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useSearchByQueryQuery(
    { query: debouncedQuery, userId: 0 },
    { skip: !debouncedQuery }
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
        >
          <div className="container mx-auto h-full flex flex-col">
            {/* Header de recherche */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une boutique..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-2xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Contenu de recherche */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery ? (
                <ShopSearchResults
                  shops={data?.shops || []}
                  isLoading={isLoading}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Store className="w-16 h-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Recherchez parmi nos boutiques
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    Trouvez les meilleures boutiques et découvrez des produits uniques
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 