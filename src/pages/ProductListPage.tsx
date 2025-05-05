import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import Header from '@/components/ui/header';
import { ScrollRestoration } from 'react-router-dom';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetAllProductsQuery } from '@/services/guardService';
import { Product } from '@/types/products';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import AsyncLink from '@/components/ui/AsyncLink';
import { normalizeProduct } from '@/lib/normalizeProduct';
import VariationModal from '@/components/ui/VariationModal';

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

    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: { productList,totalPagesResponse } = {}, isLoading } = useGetAllProductsQuery(currentPage);
  const dispatch = useDispatch();
  const safeProducts = productList || [];

  const normalizedProducts = safeProducts.map(normalizeProduct);
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  useEffect(() => {
    if (totalPagesResponse) {
      console.log(totalPagesResponse)
      setTotalPages(totalPagesResponse);
    }
  }, [totalPagesResponse]);

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



  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Faire défiler vers le haut de la page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  

  const ProductCard = ({ product }: { product: Product }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCartButton, setShowCartButton] = useState(false);
    const [showVariationModal, setShowVariationModal] = useState(false);

    // Récupérer jusqu'à 4 couleurs uniques des variations
    const colorSwatches = React.useMemo(() => {
      if (!product.variations || product.variations.length === 0) return [];
      const seen = new Set();
      const colors = [];
      for (const variation of product.variations) {
        if (
          variation.color &&
          variation.color.hex &&
          !seen.has(variation.color.hex)
        ) {
          colors.push({
            name: variation.color.name,
            hex: variation.color.hex,
          });
          seen.add(variation.color.hex);
        }
        if (colors.length === 4) break;
      }
      return colors;
    }, [product.variations]);

    const handleAddToCart = async (product: Product, variation?: any) => {
      setIsLoading(true);
      dispatch(addItem({ 
        product, 
        quantity: 1,
        selectedVariation: variation 
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setShowCartButton(true);
    };

    const handleAddToCartClick = () => {
      if (product.variations && product.variations.length > 0) {
        setShowVariationModal(true);
      } else {
        handleAddToCart(product);
      }
    };

    return (
      <>
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={viewMode === 'grid' ? '' : 'flex gap-6 bg-white rounded-2xl shadow-sm p-4'}
        >
          {viewMode === 'grid' ? (
            <div className="group bg-white max-sm:w-[20.9rem] rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              
              <AsyncLink to={`/produit/${product.product_url}`}>
              <div className="relative aspect-square">
                <img
                  src={product.product_profile}
                  alt={product.product_name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <button className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                    Premium
                  </span>
                  <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-xs font-medium">12</span>
                  </div>
                </div>
                {/* Affichage des couleurs si variations */}
                {colorSwatches.length > 0 && (
                  <div className="flex items-center gap-2 px-4 mt-2 mb-1">
                    {colorSwatches.map((color:any, idx:any) => (
                      <div
                        key={color.hex}
                        title={color.name}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: "0 0 0 1px #ccc"
                        }}
                      />
                    ))}
                    {product.variations.length > 4 && (
                      <span className="text-xs text-gray-500 ml-1">+{product.variations.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
              </AsyncLink>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">
                  {product.product_name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Stock: {product.product_quantity} disponibles
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {product.product_price} Fcfa
                  </span>
                  {!showCartButton ? (
                    <button 
                      onClick={handleAddToCartClick}
                      disabled={isLoading}
                      className="px-3 py-2 rounded-lg bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90 transition-colors text-sm"
                    >
                      {isLoading ? (
                        <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-white rounded-full">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Ajouter au panier"
                      )}
                    </button>
                  ) : (
                    <AsyncLink 
                      to="/cart"
                      className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                    >
                      Voir le panier
                    </AsyncLink>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-48 h-48">
                <img
                  src={product.product_profile}
                  alt={product.product_name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Affichage des couleurs si variations (mode liste) */}
                {colorSwatches.length > 0 && (
                  <div className="flex items-center gap-2 absolute bottom-2 left-2">
                    {colorSwatches.map((color, idx) => (
                      <div
                        key={color.hex}
                        title={color.name}
                        className="w-5 h-5 rounded-full border-2 border-white shadow"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: "0 0 0 1px #ccc"
                        }}
                      />
                    ))}
                    {product.variations.length > 4 && (
                      <span className="text-xs text-gray-500 ml-1 bg-white/80 px-1 rounded">+{product.variations.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.product_name}
                  </h3>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      12
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Code: {product.shop_key}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      {product.product_price} Fcfa
                    </span>
                  </div>
                  {
                    !showCartButton ? (
                         <button  onClick={handleAddToCartClick} className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                       {isLoading ? (
                          <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-white rounded-full">
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Ajouter au panier"
                        )}
                    </button>
                    
                      ): (
                    <AsyncLink 
                      to="/cart"
                      className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                    >
                      Voir le panier
                    </AsyncLink>
                  )}
                 
                </div>
              </div>
            </>
          )}
        </motion.div>

        <VariationModal
          isOpen={showVariationModal}
          onClose={() => setShowVariationModal(false)}
          product={product}
          onAddToCart={(variation) => handleAddToCart(product, variation)}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      <Header />
      
        <ScrollRestoration />
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
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 max-sm:flex max-sm:flex-col max-sm:items-center sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              { !isLoading && normalizedProducts && normalizedProducts.map((product:Product) => (
                <ProductCard product={product} />
              ))}
              <div>
                <div className="flex items-center justify-center gap-2 max-sm:mt-0 max-sm:mb-24 max-sm:mx-12 mt-8">
                    {currentPage > 1 && (
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
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
                                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`w-10 h-10 rounded-lg ${
                                            currentPage === pageNumber
                                                ? 'bg-[#ed7e0f] text-white'
                                                : 'bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 3 ||
                                pageNumber === currentPage + 3
                            ) {
                                return <span key={pageNumber}>...</span>;
                            }
                            return null;
                        })}
                    </div>

                    {currentPage < totalPages && (
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            Suivant
                        </button>
                    )}
                </div>
            </div>
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
      <MobileNav/>
    </div>
  );
};

export default ProductListPage;
