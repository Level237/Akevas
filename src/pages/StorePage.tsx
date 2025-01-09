import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Package,
  Clock,
  Shield,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import Header from '@/components/ui/header';
import dress from "../assets/dress.jpg"
import shoes from "../assets/shoes1.webp"
import { ScrollRestoration } from 'react-router-dom';

interface StoreProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
}

interface StoreCategory {
  id: string;
  name: string;
  count: number;
  products: StoreProduct[];
}

const StorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const store = {
    code: 'JP_STORE_8472',
    name: 'Anime Collection Store',
    description: 'Votre boutique spécialisée en figurines et produits dérivés d\'anime.',
    coverImage: dress,
    logo: dress,
    rating: 4.8,
    reviewCount: 256,
    productsCount: 189,
    joinDate: '2024-01',
    location: 'Paris, France',
    isPremium: true,
    categories: [
      {
        id: 'figurines',
        name: 'Figurines',
        count: 78,
        products: Array.from({ length: 12 }, (_, i) => ({
          id: `fig-${i}`,
          name: `Figurine Collector ${i + 1}`,
          price: 99.99 + i * 10,
          image: shoes,
          category: 'Figurines',
          rating: 4.5,
          reviewCount: 24,
          isPremium: i % 3 === 0
        }))
      },
      // Ajoutez plus de catégories
    ] as StoreCategory[],
    stats: {
      totalSales: 1250,
      averageShipping: '2-3 jours',
      satisfactionRate: '98%'
    }
  };

  const products = store.categories.flatMap(cat => cat.products);
  const displayedProducts = selectedCategory
    ? store.categories.find(cat => cat.id === selectedCategory)?.products || []
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />
      {/* Couverture et informations de la boutique */}
      <div className="relative h-64 bg-gray-900">
        <img
          src={store.coverImage}
          alt="Store cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white">
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                {store.isPremium && (
                  <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 text-gray-200">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{store.rating}</span>
                  <span className="ml-1">({store.reviewCount} avis)</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-1" />
                  <span>{store.productsCount} produits</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{store.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>Depuis {store.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  À propos de la boutique
                </h2>
                <p className="text-gray-600 mb-6">
                  {store.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t">
                    <span className="text-gray-500">Ventes totales</span>
                    <span className="font-medium">{store.stats.totalSales}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t">
                    <span className="text-gray-500">Délai de livraison</span>
                    <span className="font-medium">{store.stats.averageShipping}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t">
                    <span className="text-gray-500">Satisfaction client</span>
                    <span className="font-medium">{store.stats.satisfactionRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#ed7e0f]" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Boutique vérifiée
                    </h3>
                    <p className="text-sm text-gray-500">
                      Vendeur professionnel certifié
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catégories */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Catégories
                </h2>
                <div className="space-y-2">
                  {store.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(
                        category.id === selectedCategory ? null : category.id
                      )}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-colors ${
                        category.id === selectedCategory
                          ? 'bg-[#ed7e0f] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="col-span-9">
            {/* Barre d'outils */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'all'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Tous les produits
                  </button>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'categories'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Par catégories
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filtres</span>
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  {/* Ajoutez vos filtres ici */}
                </motion.div>
              )}
            </div>

            {/* Grille de produits */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {displayedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === 'grid'
                      ? 'bg-white rounded-2xl shadow-sm overflow-hidden'
                      : 'flex gap-6 bg-white rounded-2xl shadow-sm p-4'
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.isPremium && (
                          <div className="absolute top-4 left-4">
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {product.price} €
                          </span>
                          <button className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                            Voir
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-48 h-48">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {product.name}
                          </h3>
                          {product.isPremium && (
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {product.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-bold text-gray-900">
                            {product.price} €
                          </span>
                          <button className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                            Voir le produit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StorePage;
