import OptimizedImage from "@/components/OptimizedImage";
import { useGetHistorySearchQuery, useGetUserQuery } from "@/services/auth";
import { useSearchByQueryQuery } from "@/services/guardService";
import {motion} from "framer-motion"
import { Clock, Search, X } from "lucide-react"
import { useState, useEffect, Suspense, useCallback } from "react";
import { Link} from "react-router-dom";

// Composant pour les résultats de recherche
const SearchResults = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
  if (isLoading) {
    return <SearchSkeleton />;
  }
  const getProductThumbnail = useCallback((product: any): string => {
    try {
      const variations: any[] | undefined = product?.variations;
      if (Array.isArray(variations) && variations.length > 0) {
        // Trouver la première variation qui a au moins une image
        for (const variation of variations) {
          const images: string[] | undefined = variation?.images;
          if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
            return images[0];
          }
        }
      }
    } catch (_) {
      // ignore and fallback
    }
    return product?.product_profile as string;
  }, []);

  // Prix affiché: min prix parmi attributs/variations sinon prix du produit
  const getDisplayPrice = useCallback((product: any): number => {
    const toNumber = (val: unknown): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9.,-]/g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        return Number.isNaN(num) ? NaN : num;
      }
      return NaN;
    };

    try {
      const candidates: number[] = [];

      const variations: any[] | undefined = product?.variations;
      if (Array.isArray(variations) && variations.length > 0) {
        for (const variation of variations) {
          // prix au niveau de la variation
          const vPrice = toNumber(variation?.price);
          if (Number.isFinite(vPrice)) candidates.push(vPrice);

          // prix au niveau des attributs
          const attributes: any[] | undefined = variation?.attributes;
          if (Array.isArray(attributes)) {
            for (const attr of attributes) {
              const p = toNumber(attr?.price);
              if (Number.isFinite(p)) candidates.push(p);
            }
          }
        }
      }

      // fallback aux champs prix du produit potentiels
      const baseCandidates = [
        toNumber(product?.product_price),
        toNumber(product?.min_price),
        toNumber(product?.minimum_price),
      ].filter((n) => Number.isFinite(n)) as number[];

      candidates.push(...baseCandidates);

      if (candidates.length > 0) {
        return Math.min(...candidates);
      }
    } catch (_) {
      // ignore and fallback
    }

    return 0;
  }, []);

  const getColorSwatches = useCallback((product: any) => {
    if (!product?.variations?.length) return [] as Array<{ name: string; hex: string }>;
    const seen = new Set<string>();
    const colors: Array<{ name: string; hex: string }> = [];
    for (const variation of product.variations) {
      if (variation?.color?.hex && !seen.has(variation.color.hex)) {
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
  return (
    <div className="space-y-8">

{/* Produits */}
      {data?.products && data.products.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Produits</h3>
          <div className="grid grid-cols-3 mb-12 gap-4">
          {data.products.map((product: any) => (
                        <Link
                          key={product.id}
                          to={`/produit/${product.product_url}`}
                          className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                          
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <OptimizedImage
                              src={getProductThumbnail(product)}
                              alt={product.product_name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Affichage des couleurs si variations */}
                            {product?.variations?.length > 0 && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-full shadow-sm">
                                {getColorSwatches(product).map((color: any) => (
                                  <div
                                    key={color.hex}
                                    title={color.name}
                                    className="w-3.5 h-3.5 rounded-full border border-gray-200"
                                    style={{
                                      backgroundColor: color.hex,
                                      boxShadow: '0 0 0 1px #ccc',
                                    }}
                                  />
                                ))}
                                {product.variations.length > 4 && (
                                  <span className="text-[10px] text-gray-600">+{product.variations.length - 4}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="p-3 bg-white">
                            <h4 className="font-medium text-xs text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                              {product.product_name}
                            </h4>
                            <p className="text-sm font-semibold text-orange-500 mt-1 text-sm">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'XAF'
                              }).format(getDisplayPrice(product))}
                            </p>
                          </div>
                        </Link>
                      ))}
          </div>
        </div>
      )}
      {/* Boutiques */}
      {data?.shops && data.shops.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Boutiques</h3>
          <div className="space-y-4">
            {data.shops.map((shop: any) => (
              <Link key={shop.shop_id} to={`/shop/${shop.shop_id}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <OptimizedImage
                  src={`${shop.shop_profile}`}
                  alt={shop.shop_name}
                  className="w-16 h-16 flex-shrink-0 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{shop.shop_name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{shop.shop_description}</p>
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
  
      const { data: userData} = useGetUserQuery('Auth');
      const [searchState, setSearchState] = useState({
        query: '',
      });

      // État séparé pour la requête soumise
      const [submittedQuery, setSubmittedQuery] = useState(searchState.query);

      // Reset submittedQuery quand l'input est vide pour réafficher l'historique
      useEffect(() => {
        if (!searchState.query) {
          setSubmittedQuery('');
        }
      }, [searchState.query]);

      // Utiliser submittedQuery au lieu de debouncedQuery
      const {data, isLoading} = useSearchByQueryQuery(
        {query: submittedQuery, userId: userData?.id ? userData.id : 0},
        { skip: !submittedQuery } // Skip la requête si la recherche soumise est vide
      );

      const {data:history,isLoading:isLoadingSearch} = useGetHistorySearchQuery('auth')

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

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmittedQuery(searchState.query);
                  }}
                  className="flex-1 relative"
                >
                  <input
                    type="text"
                    value={searchState.query}
                    onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                    autoFocus
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Search Content avec défilement */}
              <div className="flex-1 overflow-y-auto py-6">
                {submittedQuery ? (
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
                        {!isLoadingSearch && history && history?.map((search:any, index:number) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchState(prev => ({ ...prev, query: search.search_term }));
                              setSubmittedQuery(search.search_term);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search.search_term}
                          </button>
                        ))}

                        {isLoadingSearch && <p>Chargement...</p>}
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