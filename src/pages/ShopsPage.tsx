import { useEffect, useState, useMemo, memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Package, Clock, Shield, Search, Heart, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import Header from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import AsyncLink from '@/components/ui/AsyncLink';
import { ScrollRestoration } from 'react-router-dom';
import img from "../assets/dress.jpg"
import MobileNav from '@/components/ui/mobile-nav';
import { useGetAllShopsQuery } from '@/services/guardService';
import { Category } from '@/types/products';
import { Shop } from '@/types/shop';
import OptimizedImage from '@/components/OptimizedImage';
import ShopSearch from '@/components/shop/ShopSearch';
import Footer from '@/components/ui/footer';
import SidebarCanvas from '@/components/ui/SidebarCanvas';


type SortOption = 'rating' | 'allShops' | 'followers' | 'newest';
type CategoryFilter = 'all' | 'mode' | 'accessoires' | 'beaute';

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
        <OptimizedImage
          src={shop.images[0].path}
          alt={`${shop.shop_name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Premium Badge */}
        
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Premium
            </span>
          </div>
        

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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm">Produits</span>
            </div>
            <p className="font-semibold">{shop.products.length}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Followers</span>
            </div>
            <p className="font-semibold">12</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Réponse</span>
            </div>
            <p className="font-semibold">12</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <AsyncLink to={`/shop/${shop.shop_id}`} className="flex-1">
            <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90">
              Voir la boutique
            </Button>
          </AsyncLink>
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
});
ShopCard.displayName = 'ShopCard';

// Memoize filters component
const Filters = memo(({ 
  sortBy, 
  setSortBy, 
  categoryFilter, 
  setCategoryFilter, 
  selectedFilter, 
  setSelectedFilter 
}: any) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3 flex-wrap">

      <Button
          variant="outline" 
          className={`flex items-center gap-2 transition-all ${
            sortBy === 'allShops' ? 'bg-orange-50 text-[#ed7e0f] border-[#ed7e0f]' : ''
          }`}
          onClick={() => setSortBy('allShops')}
        >
          <Package className="w-4 h-4" />
          Toutes les boutiques
        </Button>
        <Button
          variant="outline"
          className={`flex items-center gap-2 transition-all ${
            sortBy === 'rating' ? 'bg-orange-50 text-[#ed7e0f] border-[#ed7e0f]' : ''
          }`}
          onClick={() => setSortBy('rating')}
        >
          <Star className="w-4 h-4" />
          Mieux notés
        </Button>

     

        <Button
          variant="outline"
          className={`flex items-center gap-2 transition-all ${
            sortBy === 'followers' ? 'bg-orange-50 text-[#ed7e0f] border-[#ed7e0f]' : ''
          }`}
          onClick={() => setSortBy('followers')}
        >
          <Users className="w-4 h-4" />
          Plus suivis
        </Button>

        <Button
          variant="outline"
          className={`flex items-center gap-2 transition-all ${
            sortBy === 'newest' ? 'bg-orange-50 text-[#ed7e0f] border-[#ed7e0f]' : ''
          }`}
          onClick={() => setSortBy('newest')}
        >
          <TrendingUp className="w-4 h-4" />
          Plus récents
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <select
          className="px-4 py-2 border rounded-lg bg-white hover:border-[#ed7e0f] transition-colors"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
        >
          <option value="all">Toutes catégories</option>
          <option value="mode">Mode</option>
          <option value="accessoires">Accessoires</option>
          <option value="beaute">Beauté</option>
        </select>

        <Button
          variant={selectedFilter === 'premium' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter(selectedFilter === 'premium' ? 'all' : 'premium')}
          className={`flex items-center gap-2 transition-all ${
            selectedFilter === 'premium' ? 'bg-[#ed7e0f] hover:bg-[#ed7e0f]/90' : ''
          }`}
        >
          <Shield className="w-4 h-4" />
          Premium
        </Button>
      </div>
    </div>
  </div>
));
Filters.displayName = 'Filters';

const ShopsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('allShops');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const params = new URLSearchParams(window.location.search);
  const currentPage = params.get("page") || "1";
  const [totalPages, setTotalPages] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { data: { shopList, totalPagesResponse } = {}, isLoading, isError } = useGetAllShopsQuery(currentPage);

  useEffect(() => {
    if (totalPagesResponse) {
      setTotalPages(totalPagesResponse);
    }
  }, [totalPagesResponse]);

  // Memoize filtered and sorted shops
  const filteredShops = useMemo(() => {
    if (!shopList) return [];
    
    return shopList.filter(shop => {
      const matchesSearch = shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.shop_key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || 
                            shop.categories.some(cat => cat.category_name.toLowerCase() === categoryFilter);
      const matchesFilter = selectedFilter === 'all' || 
                          (selectedFilter === 'premium' && "");
      
      return matchesSearch && matchesCategory && matchesFilter;
    }).sort(() => {
      switch (sortBy) {
       
        default: return 0;
      }
    });
  }, [shopList, searchQuery, categoryFilter, selectedFilter, sortBy]);

  // Memoize pagination handler
  const handlePageChange = useCallback((pageNumber: number) => {
    window.location.href = `/shops?page=${pageNumber}`;
  }, []);

  return (
    <div className="min-h-screen ml-12 bg-gray-50">
      <Header />
      <ScrollRestoration />
      <SidebarCanvas/>
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
        {/* Hero Section */}
       
        

        {/* Filters */}
        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Shops Grid - Correction de la hauteur */}
        <div className="mb-8"> {/* Remplacer la hauteur fixe par une marge en bas */}
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

        {/* Pagination - Maintenant correctement positionnée */}
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
        
      </main>
      <Footer />
    </div>
  );
};

export default memo(ShopsPage);