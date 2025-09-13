import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import Header from '@/components/ui/header';
import { ScrollRestoration, useSearchParams } from 'react-router-dom';
import { useQueryState } from 'nuqs';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetAllProductsQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { Product } from '@/types/products';
import { normalizeProduct } from '@/lib/normalizeProduct';
import ProductCard from '@/components/products/ProductCard';
// Removed toast import - not used anymore
import OptimizedImage from '@/components/OptimizedImage';
import ProductFilters from '@/components/filters/ProductFilters';




// Removed CategoryFilter interface - now using URL state



const sortOptions = [
  { id: 'popular', label: 'Plus populaires' },
  { id: 'newest', label: 'Plus récents' },
  { id: 'price-low', label: 'Prix croissant' },
  { id: 'price-high', label: 'Prix décroissant' },
  { id: 'rating', label: 'Meilleures notes' }
];

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Removed local selectedFilters state - now using URL state with nuqs
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(0);

  // Price filters from URL with debouncing
  const [minPrice] = useQueryState('min_price', {
    defaultValue: 0,
    parse: (value) => parseInt(value, 10) || 0,
    serialize: (value) => value.toString()
  });
  const [maxPrice] = useQueryState('max_price', {
    defaultValue: 500000,
    parse: (value) => parseInt(value, 10) || 500000,
    serialize: (value) => value.toString()
  });

  // Category filters from URL
  const [selectedCategories, setSelectedCategories] = useQueryState('categories', {
    defaultValue: [],
    parse: (value) => {
      if (!value) return [];
      return value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    },
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });

  // Color filters from URL
  const [selectedColors, setSelectedColors] = useQueryState('colors', {
    defaultValue: [],
    parse: (value) => value ? value.split(',') : [],
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });

  // Attribute filters from URL
  const [selectedAttributes, setSelectedAttributes] = useQueryState('attribut', {
    defaultValue: [],
    parse: (value) => {
      if (!value) return [];
      return value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    },
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });

  // Gender filters from URL
  const [selectedGenders, setSelectedGenders] = useQueryState('gender', {
    defaultValue: [],
    parse: (value) => {
      if (!value) return [];
      return value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    },
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });

  // Seller mode from URL
  const [isSellerMode, setIsSellerMode] = useQueryState('seller_mode', {
    defaultValue: false,
    parse: (value) => value === 'true',
    serialize: (value) => value ? 'true' : ''
  });

  
  // Bulk price range from URL
  const [selectedBulkPriceRange, setSelectedBulkPriceRange] = useQueryState('bulk_price_range', {
    defaultValue: '',
    parse: (value) => value || '',
    serialize: (value) => value || ''
  });

  // Debounced filters for API calls
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [debouncedCategories, setDebouncedCategories] = useState(selectedCategories);
  const [debouncedColors, setDebouncedColors] = useState(selectedColors);
  const [debouncedAttributes, setDebouncedAttributes] = useState(selectedAttributes);
  const [debouncedGenders, setDebouncedGenders] = useState(selectedGenders);
  const [debouncedSellerMode, setDebouncedSellerMode] = useState(isSellerMode);
  const [debouncedBulkPriceRange, setDebouncedBulkPriceRange] = useState(selectedBulkPriceRange);
  const [isFiltering, setIsFiltering] = useState(false);

  // Initialize debounced values on first render to avoid initial skeleton
  useEffect(() => {
    setDebouncedMinPrice(minPrice);
    setDebouncedMaxPrice(maxPrice);
    setDebouncedCategories(selectedCategories);
    setDebouncedColors(selectedColors);
    setDebouncedAttributes(selectedAttributes);
    setDebouncedGenders(selectedGenders);
    setDebouncedSellerMode(isSellerMode);
    setDebouncedBulkPriceRange(selectedBulkPriceRange);
  }, []); // Only run once on mount

  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Debouncing effect for filters
  useEffect(() => {
    // Check if values have actually changed to avoid unnecessary debouncing
    const hasPriceChanged = debouncedMinPrice !== minPrice || debouncedMaxPrice !== maxPrice;
    const hasCategoriesChanged = JSON.stringify(debouncedCategories) !== JSON.stringify(selectedCategories);
    const hasColorsChanged = JSON.stringify(debouncedColors) !== JSON.stringify(selectedColors);
    const hasAttributesChanged = JSON.stringify(debouncedAttributes) !== JSON.stringify(selectedAttributes);
    const hasGendersChanged = JSON.stringify(debouncedGenders) !== JSON.stringify(selectedGenders);
    const hasSellerModeChanged = debouncedSellerMode !== isSellerMode;
    const hasBulkPriceRangeChanged = debouncedBulkPriceRange !== selectedBulkPriceRange;
    
    
    if (hasPriceChanged || hasCategoriesChanged || hasColorsChanged || hasAttributesChanged || hasGendersChanged || hasSellerModeChanged || hasBulkPriceRangeChanged) {
      setIsFiltering(true);
      const timeoutId = setTimeout(() => {
        setDebouncedMinPrice(minPrice);
        setDebouncedMaxPrice(maxPrice);
        setDebouncedCategories(selectedCategories);
        setDebouncedColors(selectedColors);
        setDebouncedAttributes(selectedAttributes);
        setDebouncedGenders(selectedGenders);
        setDebouncedSellerMode(isSellerMode);
        setDebouncedBulkPriceRange(selectedBulkPriceRange);
        setIsFiltering(false);
      }, 500); // 500ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [minPrice, maxPrice, selectedCategories, selectedColors, selectedAttributes, selectedGenders, isSellerMode, selectedBulkPriceRange, debouncedMinPrice, debouncedMaxPrice, debouncedCategories, debouncedColors, debouncedAttributes, debouncedGenders, debouncedSellerMode, debouncedBulkPriceRange]);

  const { data: { productList, totalPagesResponse } = {}, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    min_price: debouncedMinPrice,
    max_price: debouncedMaxPrice,
    categories: debouncedCategories,
    colors: debouncedColors,
    attribut: debouncedAttributes,
    gender: debouncedGenders,
    seller_mode: debouncedSellerMode,
    bulk_price_range: debouncedBulkPriceRange
  });
  const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })


  const safeProducts = productList || [];
  const normalizedProducts = safeProducts.map(normalizeProduct);
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const toggleCategory = useCallback((categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const toggleGender = useCallback((genderId: number) => {
    setSelectedGenders(prev => 
      prev.includes(genderId)
        ? [] // Si le genre est déjà sélectionné, on le désélectionne (retour à aucun genre)
        : [genderId] // Sinon, on sélectionne uniquement ce genre (remplace toute sélection précédente)
    );
  }, []);

  const toggleSellerMode = useCallback((isSeller: boolean) => {
    setIsSellerMode(isSeller);
    // Clear bulk price range when disabling seller mode
    if (!isSeller) {
      setSelectedBulkPriceRange('');
    }
  }, []);

  const handleBulkPriceRangeChange = useCallback((range: string) => {
    setSelectedBulkPriceRange(range);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedAttributes([]);
    setSelectedGenders([]);
    setIsSellerMode(false);
    setSelectedBulkPriceRange('');
  }, []);

  // Removed clearCategoryFilters and isCategorySelected - now using URL state

  useEffect(() => {
    if (totalPagesResponse) {
      console.log(totalPagesResponse)
      setTotalPages(totalPagesResponse);
    }
  }, [totalPagesResponse]);

  // Handle invalid page numbers
  useEffect(() => {
    if (totalPages > 0 && (currentPage < 1 || currentPage > totalPages)) {
      // Redirect to page 1 if page is invalid
      setSearchParams({ page: '1' });
    }
  }, [currentPage, totalPages, setSearchParams]);

  // Generate URL for a specific page
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    // Preserve price filters (use current URL values, not debounced)
    if (minPrice > 0) {
      params.set('min_price', minPrice.toString());
    }
    if (maxPrice < 500000) {
      params.set('max_price', maxPrice.toString());
    }
    // Preserve category filters
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    // Preserve color filters
    if (selectedColors.length > 0) {
      params.set('colors', selectedColors.join(','));
    }
    // Preserve attribute filters
    if (selectedAttributes.length > 0) {
      params.set('attribut', selectedAttributes.join(','));
    }
    // Preserve gender filters
    if (selectedGenders.length > 0) {
      params.set('gender', selectedGenders.join(','));
    }
    return `?${params.toString()}`;
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
            {(selectedCategories.length > 0 || selectedGenders.length > 0 || isSellerMode || selectedBulkPriceRange) && (
                <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {selectedCategories.length + selectedGenders.length + (isSellerMode ? 1 : 0) + (selectedBulkPriceRange ? 1 : 0)}
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
                className={`p-2 rounded ${viewMode === 'grid'
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
                className={`p-2 rounded ${viewMode === 'list'
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
            <ProductFilters
              categories={categories}
              isLoadingCategories={categoriesLoading}
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
              onClearAll={clearAllFilters}
              isMobile={false}
              onCloseMobile={() => setShowMobileFilters(false)}
              isFiltering={isFiltering}
              selectedColors={selectedColors}
              onColorToggle={(color) => {
                setSelectedColors(prev => 
                  prev.includes(color)
                    ? prev.filter(c => c !== color)
                    : [...prev, color]
                );
              }}
              selectedAttributes={selectedAttributes}
              onAttributeToggle={(attributeId) => {
                setSelectedAttributes(prev => 
                  prev.includes(attributeId)
                    ? prev.filter(id => id !== attributeId)
                    : [...prev, attributeId]
                );
              }}
              selectedGenders={selectedGenders}
              onGenderToggle={toggleGender}
              isSellerMode={isSellerMode}
              onSellerToggle={toggleSellerMode}
              selectedBulkPriceRange={selectedBulkPriceRange}
              onBulkPriceRangeChange={handleBulkPriceRangeChange}
            />
          </div>

          {/* Liste des produits */}
          <div className="lg:col-span-3">
            <div className={viewMode === 'grid' ? 'grid grid-cols-2   max-sm:items-center sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {isLoading || isFiltering ? (
                // Skeleton loader
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={viewMode === 'grid' ? 'animate-pulse' : 'animate-pulse'}>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Image skeleton */}
                      <div className="aspect-square bg-gray-200 w-full"></div>
                      
                      {/* Content skeleton */}
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : normalizedProducts && normalizedProducts.length > 0 ? (
                normalizedProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))
              ) : (
                // Empty state
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gray-100">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                  </p>
                  <a 
                   href='/products'
                  
                    className="mt-4 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 transition-colors"
                  >
                    Réinitialiser les filtres
                  </a>
                </div>
              )}
            </div>
            
            {/* Pagination - only show if there are products */}
            {normalizedProducts && normalizedProducts.length > 0 && (
              <div className="flex items-center max-sm:w-full justify-center gap-2 max-sm:mt-0 max-sm:mb-24 mx-96 max-sm:mx-12 mt-8">
                  {currentPage > 1 && (
                <a
                  href={getPageUrl(currentPage - 1)}
                  className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50 inline-block"
                    >
                      Précédent
                </a>
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
                      <a
                            key={pageNumber}
                        href={getPageUrl(pageNumber)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === pageNumber
                                ? 'bg-[#ed7e0f] text-white'
                                : 'bg-white hover:bg-gray-50'
                              }`}
                          >
                            {pageNumber}
                      </a>
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
                <a
                  href={getPageUrl(currentPage + 1)}
                  className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50 inline-block"
                    >
                      Suivant
                </a>
                  )}
              </div>
            )}
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
                  {/* Section des catégories */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Catégories</h3>
                      <button
                        onClick={() => toggleSection('categories')}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedSections.includes('categories') ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {expandedSections.includes('categories') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2">
                            {!categoriesLoading && categories.map((category: any) => (
                              <motion.div
                                key={category.id}
                                whileHover={{ x: 4 }}
                                className={`group ${selectedCategories.includes(category.id) ? 'bg-orange-50' : ''}`}
                              >
                                <label className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                                  <div className="flex items-center flex-1">
                                    <input
                                      type="checkbox"
                                      checked={selectedCategories.includes(category.id)}
                                      onChange={() => toggleCategory(category.id)}
                                      className="w-4 h-4 text-orange-500 border-gray-300 rounded-lg focus:ring-orange-500/20"
                                    />
                                    <div className="flex items-center ml-3 gap-3">
                                      <div className="w-8 h-8 rounded-lg overflow-hidden">
                                        <OptimizedImage
                                          src={category.category_profile}
                                          alt={category.category_name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                          {category.category_name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-500">
                                            {category.products_count} produits
                                          </span>
                                          {category.products_count > 0 && (
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ml-auto">
                                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                                        {category.products_count}
                                      </span>
                                    </div>
                                  </div>
                                </label>
                              </motion.div>
                            ))}
                          </div>

                          {/* Résumé des catégories sélectionnées */}
                          {selectedCategories.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4 p-3 bg-orange-50 rounded-xl"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-orange-700">
                                  {selectedCategories.length} catégorie(s) sélectionnée(s)
                                </span>
                                <button
                                  onClick={clearAllFilters}
                                  className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                >
                                  Réinitialiser
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

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
      <MobileNav />
    </div>
  );
};

export default ProductListPage;
