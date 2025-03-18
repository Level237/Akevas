import { useEffect, useState, useMemo, memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Package, Clock, Shield, Search,Heart, Users } from 'lucide-react';
import Header from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AsyncLink from '@/components/ui/AsyncLink';
import { ScrollRestoration } from 'react-router-dom';
import img from "../assets/dress.jpg"
import MobileNav from '@/components/ui/mobile-nav';
import { useGetAllShopsQuery } from '@/services/guardService';
import { Category } from '@/types/products';
import { Shop } from '@/types/shop';



type SortOption = 'rating' | 'products' | 'followers' | 'newest';
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

// Optimiser le chargement des images avec un composant dédié
const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imageRef.current) {
            imageRef.current.src = src;
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imageRef}
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // Placeholder
        data-src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
    </div>
  );
});
OptimizedImage.displayName = 'OptimizedImage';

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
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
    >
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
    </motion.div>
  );
});
ShopCard.displayName = 'ShopCard';

// Memoize filters component
const Filters = memo(({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  categoryFilter, 
  setCategoryFilter, 
  selectedFilter, 
  setSelectedFilter 
}: any) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Rechercher une boutique..."
            className="pl-10 py-6 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <select
          className="px-4 py-2 border rounded-lg bg-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="rating">Mieux notés</option>
          <option value="products">Plus de produits</option>
          <option value="followers">Plus suivis</option>
          <option value="newest">Plus récents</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg bg-white"
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
          className="flex items-center py-6 gap-2"
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
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const params = new URLSearchParams(window.location.search);
  const currentPage = params.get("page") || "1";
  const [totalPages, setTotalPages] = useState(0);
  
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
                          (selectedFilter === 'premium' && shop.is_premium);
      
      return matchesSearch && matchesCategory && matchesFilter;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.review_average - a.review_average;
        case 'products': return b.products.length - a.products.length;
        case 'followers': return b.followers - a.followers;
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
  }, [shopList, searchQuery, categoryFilter, selectedFilter, sortBy]);

  // Ajouter la gestion du scroll virtualisé
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 12 });

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight > documentHeight - 1000) {
        setVisibleRange(prev => ({
          start: prev.start,
          end: Math.min(prev.end + 6, filteredShops.length)
        }));
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredShops.length]);

  const visibleShops = useMemo(() => {
    return filteredShops.slice(visibleRange.start, visibleRange.end);
  }, [filteredShops, visibleRange]);

  // Memoize pagination handler
  const handlePageChange = useCallback((pageNumber: number) => {
    window.location.href = `/shops?page=${pageNumber}`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />
      <MobileNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white">
          <div className="absolute inset-0 opacity-10">
            <img src={img} alt="background" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 p-8 lg:p-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Marketplace</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Découvrez nos meilleures boutiques et trouvez des produits uniques
            </p>
          </div>
        </div>

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

        {/* Shops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {isLoading && (
            Array(6).fill(null).map((_, index) => (
              <ShopCardSkeleton key={`skeleton-${index}`} />
            ))
          )}
          
          {isError && <ErrorMessage />}

          {!isLoading && !isError && visibleShops.map((shop: Shop) => (
            <ShopCard key={shop.shop_id} shop={shop} />
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && (
          <div className="flex items-center justify-center gap-2 max-sm:mt-0 max-sm:mb-24 max-sm:mx-12 mt-8">
            {parseInt(currentPage) > 1 && (
                <button 
                  onClick={() => handlePageChange(parseInt(currentPage) - 1)}
                  className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    Précédent
                </button>
            )}
            
            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    
                    // Afficher seulement les pages proches de la page courante
                    if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= parseInt(currentPage) - 2 && pageNumber <= parseInt(currentPage) + 2)
                    ) {
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-10 h-10 rounded-lg ${
                                    parseInt(currentPage) === pageNumber
                                        ? 'bg-[#ed7e0f] text-white'
                                        : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    } else if (
                        pageNumber === parseInt(currentPage) - 3 ||
                        pageNumber === parseInt(currentPage) + 3
                    ) {
                        return <span key={pageNumber}>...</span>;
                    }
                    return null;
                })}
            </div>

            {parseInt(currentPage) < totalPages && (
                <button
                onClick={() => handlePageChange(parseInt(currentPage) + 1)}
                className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    Suivant
                </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Fonction utilitaire pour le throttle
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function(...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export default memo(ShopsPage);
