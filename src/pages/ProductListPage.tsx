import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import shoes from "../assets/shoes1.webp"
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import Header from '@/components/ui/header';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterSection {
  id: string;
  name: string;
  options: FilterOption[];
}

const filters: FilterSection[] = [
  {
    id: 'categories',
    name: 'Catégories',
    options: [
      { id: 'figurines', label: 'Figurines', count: 156 },
      { id: 'manga', label: 'Manga', count: 89 },
      { id: 'cosplay', label: 'Cosplay', count: 45 },
      { id: 'accessories', label: 'Accessoires', count: 78 }
    ]
  },
  {
    id: 'price',
    name: 'Prix',
    options: [
      { id: 'under-50', label: 'Moins de 50€', count: 124 },
      { id: '50-100', label: '50€ - 100€', count: 78 },
      { id: '100-200', label: '100€ - 200€', count: 45 },
      { id: 'over-200', label: 'Plus de 200€', count: 23 }
    ]
  },
  {
    id: 'rating',
    name: 'Note',
    options: [
      { id: '4-up', label: '4★ & plus', count: 156 },
      { id: '3-up', label: '3★ & plus', count: 245 },
      { id: '2-up', label: '2★ & plus', count: 289 }
    ]
  },
  {
    id: 'shipping',
    name: 'Livraison',
    options: [
      { id: 'free', label: 'Livraison gratuite', count: 156 },
      { id: 'express', label: 'Livraison express', count: 89 }
    ]
  }
];

const sortOptions = [
  { id: 'popular', label: 'Plus populaires' },
  { id: 'newest', label: 'Plus récents' },
  { id: 'price-low', label: 'Prix croissant' },
  { id: 'price-high', label: 'Prix décroissant' },
  { id: 'rating', label: 'Meilleures notes' }
];

const ProductListPage: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleFilter = (sectionId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const current = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const getSelectedFiltersCount = () => {
    return Object.values(selectedFilters).reduce(
      (acc, curr) => acc + curr.length,
      0
    );
  };

  // Mock products data
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Figurine Collector ${i + 1}`,
    price: 99.99 + i * 10,
    originalPrice: i % 2 === 0 ? 129.99 + i * 10 : undefined,
    image: shoes,
    rating: 4.5,
    reviewCount: 128,
    storeCode: `JP_STORE_${8472 + i}`,
    isPremium: i % 3 === 0
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête avec filtres mobiles et tri */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
            {getSelectedFiltersCount() > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                {getSelectedFiltersCount()}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white px-4 py-2 pr-8 rounded-lg shadow-sm cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filtres desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
                {getSelectedFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {filters.map(section => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {section.name}
                      </span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 mt-4">
                            {section.options.map(option => (
                              <label
                                key={option.id}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={(selectedFilters[section.id] || []).includes(option.id)}
                                  onChange={() => toggleFilter(section.id, option.id)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-600">
                                  {option.label}
                                </span>
                                <span className="ml-auto text-sm text-gray-400">
                                  {option.count}
                                </span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="lg:col-span-3">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid' ? '' : 'flex gap-6 bg-white rounded-2xl shadow-sm p-4'}
                >
                  {viewMode === 'grid' ? (
                    // Vue grille
                    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="relative aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <button className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                        {product.isPremium && (
                          <div className="absolute top-4 left-4">
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">
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
                            Code: {product.storeCode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              {product.price} €
                            </span>
                            {product.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {product.originalPrice} €
                              </span>
                            )}
                          </div>
                          <button className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Vue liste
                    <>
                      <div className="relative w-48 h-48">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {product.isPremium && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <button className="p-2 rounded-full hover:bg-gray-100">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Code: {product.storeCode}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="text-xl font-bold text-gray-900">
                              {product.price} €
                            </span>
                            {product.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {product.originalPrice} €
                              </span>
                            )}
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Ajouter au panier
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

      {/* Modal filtres mobile */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-25" />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="space-y-6">
                  {filters.map(section => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {section.name}
                        </span>
                        {expandedSections.includes(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedSections.includes(section.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 mt-4">
                              {section.options.map(option => (
                                <label
                                  key={option.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={(selectedFilters[section.id] || []).includes(option.id)}
                                    onChange={() => toggleFilter(section.id, option.id)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="ml-3 text-sm text-gray-600">
                                    {option.label}
                                  </span>
                                  <span className="ml-auto text-sm text-gray-400">
                                    {option.count}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Voir les résultats
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListPage;
