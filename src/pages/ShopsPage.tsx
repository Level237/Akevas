import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Package, Clock, Shield, Search, Filter, ChevronLeft, ChevronRight, Shirt, ShoppingBag, Heart, Users, BadgeCheck } from 'lucide-react';
import Header from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AsyncLink from '@/components/ui/AsyncLink';
import { ScrollRestoration } from 'react-router-dom';
import img from "../assets/dress.jpg"
import { cn } from '@/lib/utils';
import MobileNav from '@/components/ui/mobile-nav';

// Mock data for shops with enhanced information
const shops = Array.from({ length: 50 }, (_, i) => ({
  id: `shop-${i + 1}`,
  name: `Boutique ${i + 1}`,
  logo: img,
  coverImage: img,
  rating: (4 + Math.random()).toFixed(1),
  location: 'Paris, France',
  productsCount: Math.floor(Math.random() * 1000),
  isPremium: i < 10,
  joinDate: '2023',
  description: 'Une boutique de qualité avec des produits exceptionnels',
  followers: Math.floor(Math.random() * 1000),
  categories: ['Mode', 'Accessoires', 'Beauté'].slice(0, Math.floor(Math.random() * 3) + 1),
  stats: {
    totalSales: Math.floor(Math.random() * 10000),
    averageShipping: '2-3 jours',
    satisfactionRate: '98%',
    responseRate: '95%',
    responseTime: '< 1 heure'
  },
  verifiedSeller: Math.random() > 0.5
}));

type SortOption = 'rating' | 'products' | 'followers' | 'newest';
type CategoryFilter = 'all' | 'mode' | 'accessoires' | 'beaute';

const ShopsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const itemsPerPage = 9;

  // Filter and sort shops
  const filteredShops = shops
    .filter(shop => {
      if (searchQuery) {
        return shop.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(shop => {
      if (selectedFilter === 'premium') return shop.isPremium;
      return true;
    })
    .filter(shop => {
      if (categoryFilter === 'all') return true;
      return shop.categories.some(cat => 
        cat.toLowerCase() === categoryFilter
      );
    })
    .sort((a, b) => {
      // Premium shops always first
      if (a.isPremium !== b.isPremium) {
        return a.isPremium ? -1 : 1;
      }
      
      // Then sort by selected criteria
      switch (sortBy) {
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'products':
          return b.productsCount - a.productsCount;
        case 'followers':
          return b.followers - a.followers;
        case 'newest':
          return parseInt(b.joinDate) - parseInt(a.joinDate);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const currentShops = filteredShops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />
      <MobileNav/>
      
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

        {/* Filters and Search */}
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

        {/* Shops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {currentShops.map((shop) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-48">
                <img
                  src={shop.coverImage}
                  alt={`${shop.name} cover`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                
                {/* Premium Badge */}
                {shop.isPremium && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Premium
                    </span>
                  </div>
                )}

                {/* Shop Logo */}
                <div className="absolute -bottom-6 left-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={shop.logo}
                      alt={shop.name}
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
                        {shop.name}
                      </h3>
                      {shop.verifiedSeller && (
                        <BadgeCheck className="w-5 h-5 text-[#ed7e0f]" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {shop.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-gray-900">{shop.rating}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {shop.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                    >
                      {category}
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
                    <p className="font-semibold">{shop.productsCount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Followers</span>
                    </div>
                    <p className="font-semibold">{shop.followers}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Réponse</span>
                    </div>
                    <p className="font-semibold">{shop.stats.responseTime}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <AsyncLink to={`/stores/${shop.id}`} className="flex-1">
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
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopsPage;
