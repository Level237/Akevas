import { useSearchByQueryQuery } from "@/services/guardService";
import {motion} from "framer-motion"
import { Clock, Search, TrendingUp, X } from "lucide-react"
import { useState, useEffect, Suspense } from "react";
import { Link} from "react-router-dom";

// Composant pour les résultats de recherche
const SearchResults = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
  if (isLoading) {
    return <SearchSkeleton />;
  }

  
  return (
    <div className="space-y-8">
      {/* Boutiques */}
      {data?.shops && data.shops.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Boutiques</h3>
          <div className="space-y-4">
            {data.shops.map((shop: any) => (
              <Link key={shop.shop_id} to={`/shop/${shop.shop_id}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={`${shop.shop_profile}`}
                  alt={shop.shop_name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{shop.shop_name}</h4>
                  <p className="text-sm text-gray-500">{shop.shop_description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Produits */}
      {data?.products && data.products.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Produits</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.products.map((product: any) => (
              <Link key={product.id} to={`/produit/${product.product_url}`} className="bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={`${product.product_profile}`}
                  alt={product.product_name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-medium">{product.product_name}</h4>
                  <p className="text-sm text-gray-500">
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

      {(!data?.shops?.length && !data?.products?.length) && !isLoading && (
        <div className="text-center text-gray-500 py-8">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
};

// Composant pour le skeleton
const SearchSkeleton = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Boutiques</h3>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Produits</h3>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function SearchResource({open}:{open:()=>void}){
  

      const [searchState, setSearchState] = useState({
        query: '',
      });

      // État séparé pour la requête debounced
      const [debouncedQuery, setDebouncedQuery] = useState(searchState.query);

      // Effet pour gérer le debounce
      useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedQuery(searchState.query);
        }, 400); // Attendre 400ms après la dernière frappe

        return () => {
          clearTimeout(timer);
        };
      }, [searchState.query]);

      // Utiliser debouncedQuery au lieu de searchState.query
      const {data, isLoading} = useSearchByQueryQuery(
        {query: debouncedQuery, userId: 0},
        { skip: debouncedQuery === '' } // Skip la requête si la recherche est vide
      );
      const searchHistory = [
        'Robe d\'été fleurie',
        'Nike Air Max',
        'Sac à main cuir',
        'Montre connectée'
      ];
      
      const trendingSearches = [
        'Sneakers tendance',
        'Robes de soirée',
        'Accessoires homme',
        'Bijoux argent'
      ];

    return (
        <>
                             <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="container mx-auto px-4 h-full flex flex-col">
              {/* Search Header */}
              <div className="flex items-center gap-4 py-4 border-b">
                <button onClick={open}>
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchState.query}
                    onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Search Content avec défilement */}
              <div className="flex-1 overflow-y-auto py-6">
                {searchState.query ? (
                  <Suspense fallback={<SearchSkeleton />}>
                    <SearchResults data={data} isLoading={isLoading} />
                  </Suspense>
                ) : (
                  <div className="space-y-8">
                    {/* Historique de recherche */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recherches récentes
                      </h3>
                      <div className="space-y-2">
                        {searchHistory.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchState(prev => ({ ...prev, query: search }))}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tendances */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Tendances
                      </h3>
                      <div className="space-y-2">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchState(prev => ({ ...prev, query: search }))}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </>
    )
}