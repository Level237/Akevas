import { useEffect, useState, useMemo, memo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Search, ShoppingBag, TrendingUp, Filter } from 'lucide-react';
import Header from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import AsyncLink from '@/components/ui/AsyncLink';
import { ScrollRestoration } from 'react-router-dom';
import img from "../assets/dress.jpg"
import MobileNav from '@/components/ui/mobile-nav';
import { useGetAllShopsQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { Category } from '@/types/products';
import { Shop } from '@/types/shop';
import OptimizedImage from '@/components/OptimizedImage';
import ShopSearch from '@/components/shop/ShopSearch';
import Footer from '@/components/ui/footer';
import ShopFilters, { ShopSortOption } from '@/components/filters/ShopFilters';


type SortOption = 'rating' | 'allShops' | 'followers' | 'newest';
// Removed legacy CategoryFilter in favor of sidebar category selection

// Memoize skeleton component
const ShopCardSkeleton = memo(() => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    {/* Cover Image Skeleton */}
    <div className="relative h-48 bg-gray-200" />
    
    {/* Shop Logo Skeleton */}
    <div className="absolute -bottom-6 left-6">
      <div className="w-16 h-16 rounded-xl bg-gray-300" />
    </div>

    {/* Content Skeleton */}
    <div className="p-6 pt-8">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-12 bg-gray-200 rounded" />
      </div>

      {/* Categories Skeleton */}
      <div className="flex gap-2 mb-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-6 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-4 w-16 mx-auto bg-gray-200 rounded mb-2" />
            <div className="h-4 w-8 mx-auto bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-10 flex-1 bg-gray-200 rounded-lg" />
        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
));
ShopCardSkeleton.displayName = 'ShopCardSkeleton';

// Memoize error component
const ErrorMessage = memo(() => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
    <div className="text-red-500 mb-4">
      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Une erreur est survenue</h3>
    <p className="text-gray-600 text-center mb-4">Impossible de charger les boutiques. Veuillez réessayer plus tard.</p>
    <Button 
      onClick={() => window.location.reload()} 
      className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90"
    >
      Réessayer
    </Button>
  </div>
));
ErrorMessage.displayName = 'ErrorMessage';

// Memoize individual shop card
const ShopCard = memo(({ shop }: { shop: Shop }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return <div ref={cardRef} className="h-[500px] bg-gray-100 rounded-2xl" />;
  }

  return (
    <div ref={cardRef} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      {/* Cover Image */}
      
      <div className="relative h-48">
        {shop.images.length > 0 && <OptimizedImage
          src={shop?.images[0]?.path || ""}
          alt={`${shop.shop_name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        /> }
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Premium Badge */}
        
        

        {/* Shop Logo */}
        <div className="absolute -bottom-6 left-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-lg">
            <OptimizedImage
              src={shop.shop_profile}
              alt={shop.shop_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-6 pt-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {shop.shop_key}
              </h3>
              
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {shop.town}-{shop.quarter}
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold text-gray-900">{shop.review_average}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {shop.categories.map((category:Category, index:number) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
            >
              {category.category_name}
            </span>
          ))}
        </div>

        {/* Stats */}
        

        {/* Actions */}
        <div className="flex items-center gap-3">
          <AsyncLink to={`/shop/${shop.shop_id}`} className="flex-1">
            <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90">
              Voir la boutique
            </Button>
          </AsyncLink>
         
        </div>

      </div>
    </div>
  );
});
ShopCard.displayName = 'ShopCard';

// Removed legacy inline Filters component

const ShopsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('allShops');
  const [selectedShopCategoryIds, setSelectedShopCategoryIds] = useState<number[]>([]);
  const params = new URLSearchParams(window.location.search);
  const currentPage = params.get("page") || "1";
  const [totalPages, setTotalPages] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { data: { shopList, totalPagesResponse } = {}, isLoading, isError } = useGetAllShopsQuery(currentPage);
  const { data: { data: apiCategories } = {} } = useGetCategoriesWithParentIdNullQuery('guard');

  useEffect(() => {
    if (totalPagesResponse) {
      setTotalPages(totalPagesResponse);
    }
  }, [totalPagesResponse]);

  // Use API categories for filter display
  const availableCategories = useMemo(() => apiCategories || [], [apiCategories]);

  // Map selected category ids -> lowercased names for matching with shop categories
  const selectedCategoryNames = useMemo(() => {
    if (!availableCategories || selectedShopCategoryIds.length === 0) return new Set<string>();
    const idToName = new Map<number, string>();
    availableCategories.forEach((c: any) => idToName.set(c.id, (c.category_name || '').toLowerCase()));
    return new Set(
      selectedShopCategoryIds
        .map((id) => idToName.get(id) || '')
        .filter((n) => n)
    );
  }, [availableCategories, selectedShopCategoryIds]);

  // Memoize filtered and sorted shops
  const filteredShops = useMemo(() => {
    if (!shopList) return [];
    
    return shopList.filter(shop => {
      const matchesSearch = shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.shop_key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategoryNew = selectedCategoryNames.size === 0 ||
                            shop.categories.some(cat => selectedCategoryNames.has(cat.category_name.toLowerCase()));
      const matchesCategory = matchesCategoryNew;
      // Premium flag unknown in type; keep all when premium filter toggled for now
      const matchesFilter = selectedFilter === 'all' ? true : true;
      
      return matchesSearch && matchesCategory && matchesFilter;
    }).sort(() => {
      switch (sortBy) {
       
        default: return 0;
      }
    });
  }, [shopList, searchQuery, selectedCategoryNames, selectedFilter, sortBy]);

  // Memoize pagination handler
  const handlePageChange = useCallback((pageNumber: number) => {
    window.location.href = `/shops?page=${pageNumber}`;
  }, []);

  return (
    <div className="min-h-screen  max-sm:ml-0 bg-gray-50">
      <Header />
      <ScrollRestoration />
      
      <MobileNav />
      <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full relative overflow-hidden bg-black min-h-[70vh] flex items-center"
        >
          {/* Fond dynamique avec overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-10" />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={img} 
                alt="background" 
                className="w-full h-full object-cover object-center filter brightness-50"
              />
            </motion.div>
          </div>

          {/* Contenu principal */}
          <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 relative z-30">
            <div className="flex flex-col items-center justify-center">
              {/* Texte et recherche */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-3xl space-y-8"
              >
                <div className="space-y-4">
                  <h1 
                    className="text-4xl sm:text-5xl md:text-6xl text-center font-bold bg-gradient-to-r from-white via-white to-orange-400 text-transparent bg-clip-text"
                    
                  >
                    Marketplace
                  </h1>
                  <p 
                    className="text-lg max-sm:text-sm sm:text-xl text-center text-gray-300 max-w-2xl mx-auto leading-relaxed"
                   
                  >
                    Découvrez nos meilleures boutiques et trouvez des produits uniques qui correspondent à votre style
                  </p>
                </div>

                {/* Barre de recherche stylisée */}
                <div
                  className="relative max-w-2xl  mx-auto w-full"
                >
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full px-6 py-4 max-sm:py-2.5  rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-left text-gray-400 hover:border-orange-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5" />
                      <span className='max-sm:text-sm'>Rechercher une boutique...</span>
                    </div>
                  </button>
                </div>

                {/* Statistiques */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-8 pt-4 flex-wrap"
                >
                  {[
                    { icon: ShoppingBag, value: '2000+', label: 'Boutiques' },
                    { icon: TrendingUp, value: '50k+', label: 'Produits' },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                        <stat.icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-2xl max-sm:text-sm font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Effet de particules ou de lumière */}
          <div className="absolute inset-0 bg-[url('/particles.png')] opacity-30 animate-pulse" />
        </motion.div>

      {/* Composant de recherche */}
      <ShopSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <main className="max-w-7xl mx-auto py-8">
        {/* Mobile filters trigger */}
        <div className="flex items-center justify-between mb-6 px-4 lg:px-0">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <Filter className="w-5 h-5" />
            <span className="text-sm">Filtres</span>
            {(selectedShopCategoryIds.length > 0 || selectedFilter === 'premium' || (searchQuery && searchQuery.length > 0)) && (
              <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                {selectedShopCategoryIds.length + (selectedFilter === 'premium' ? 1 : 0) + (searchQuery ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Left sidebar filters */}
          <div className="hidden lg:block">
            <ShopFilters
              searchQuery={searchQuery}
             
              availableCategories={availableCategories}
              selectedCategoryIds={selectedShopCategoryIds}
              onToggleCategory={(id) => {
                setSelectedShopCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
              }}
              onSelectCategory={(id) => {
                if (id === null) {
                  setSelectedShopCategoryIds([]);
                } else {
                  setSelectedShopCategoryIds([id]);
                }
              }}
              onClearAll={() => {
                setSearchQuery('');
                setSelectedShopCategoryIds([]);
                setSelectedFilter('all');
                setSortBy('allShops');
              }}
              isPremiumOnly={selectedFilter === 'premium'}
              onTogglePremium={(val) => setSelectedFilter(val ? 'premium' : 'all')}
              sortBy={sortBy as ShopSortOption}
              onChangeSort={(val) => setSortBy(val)}
            />
          </div>

          {/* Shops Grid */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(null).map((_, index) => (
                    <ShopCardSkeleton key={`skeleton-${index}`} />
                  ))}
                </div>
              )}
              {isError && <ErrorMessage />}
              {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShops.map((shop) => (
                    <motion.div
                      key={shop.shop_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ShopCard shop={shop} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && !isError && (
              <div className="py-8 border-t">
                <div className="flex items-center justify-center gap-2">
                  {parseInt(currentPage) > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(parseInt(currentPage) - 1)}
                      className="hidden sm:flex"
                    >
                      Précédent
                    </Button>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= parseInt(currentPage) - 2 && pageNumber <= parseInt(currentPage) + 2)
                      ) {
                        return (
                          <Button
                            key={pageNumber}
                            variant={parseInt(currentPage) === pageNumber ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`w-10 h-10 ${
                              parseInt(currentPage) === pageNumber
                                ? 'bg-[#ed7e0f] text-white'
                                : ''
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        );
                      } else if (
                        pageNumber === parseInt(currentPage) - 3 ||
                        pageNumber === parseInt(currentPage) + 3
                      ) {
                        return <span key={pageNumber} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  {parseInt(currentPage) < totalPages && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(parseInt(currentPage) + 1)}
                      className="hidden sm:flex"
                    >
                      Suivant
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Slide-over */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }} 
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[9999] flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <Filter className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedShopCategoryIds([]);
                        setSelectedFilter('all');
                        setSortBy('allShops');
                      }}
                      className="text-xs text-orange-600 hover:text-orange-800 font-medium px-2 py-1 rounded-md hover:bg-orange-100"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ShopFilters
                    searchQuery={searchQuery}
                   
                    availableCategories={availableCategories}
                    selectedCategoryIds={selectedShopCategoryIds}
                    onToggleCategory={(id) => {
                      setSelectedShopCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
                    }}
                    onSelectCategory={(id) => {
                      if (id === null) {
                        setSelectedShopCategoryIds([]);
                      } else {
                        setSelectedShopCategoryIds([id]);
                      }
                    }}
                    onClearAll={() => {
                      setSearchQuery('');
                      setSelectedShopCategoryIds([]);
                      setSelectedFilter('all');
                      setSortBy('allShops');
                    }}
                    isPremiumOnly={selectedFilter === 'premium'}
                    onTogglePremium={(val) => setSelectedFilter(val ? 'premium' : 'all')}
                    sortBy={sortBy as ShopSortOption}
                    onChangeSort={(val) => setSortBy(val)}
                  />
                </div>
                <div className="border-t bg-white p-4">
                  <Button 
                    onClick={() => setShowMobileFilters(false)} 
                    className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white py-3 text-base font-medium"
                  >
                    Voir les résultats
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
};

export default memo(ShopsPage);