import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { useGetAllProductsQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { useQueryState } from 'nuqs';
import { normalizeProduct } from '@/lib/normalizeProduct';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/products';
import ProductFilters from '@/components/filters/ProductFilters';

type ProductListContainerProps = {
  presetCategoryIds?: number[];
  hero?: React.ReactNode;
  products?: Product[];
  isLoadingOverride?: boolean;
  totalPagesOverride?: number;
  currentPageOverride?: number;
  getPageUrlOverride?: (pageNumber: number) => string;
  showCategories?: boolean;
};

const sortOptions = [
  { id: 'popular', label: 'Plus populaires' },
  { id: 'newest', label: 'Plus récents' },
  { id: 'price-low', label: 'Prix croissant' },
  { id: 'price-high', label: 'Prix décroissant' },
  { id: 'rating', label: 'Meilleures notes' }
];

const ProductListContainer: React.FC<ProductListContainerProps> = ({ presetCategoryIds = [], hero, products: productsProp, isLoadingOverride, totalPagesOverride, currentPageOverride, getPageUrlOverride, showCategories = true }) => {
  const [searchParams] = useQueryState('page', {
    defaultValue: '1',
    parse: (v) => v || '1',
    serialize: (v) => v
  });
  const currentPage = currentPageOverride ?? parseInt(searchParams || '1', 10);
  const [totalPages, setTotalPages] = useState(0);

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

  const [selectedCategories, setSelectedCategories] = useQueryState('categories', {
    defaultValue: presetCategoryIds,
    parse: (value) => {
      if (!value) return presetCategoryIds;
      return value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    },
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const effectiveCategories = useMemo(() => {
    // If a preset is provided, enforce it (lock) by merging and deduping, prioritizing preset
    if (presetCategoryIds.length === 0) return selectedCategories;
    const set = new Set<number>([...presetCategoryIds, ...selectedCategories]);
    return Array.from(set);
  }, [presetCategoryIds, selectedCategories]);

  const [selectedColors, setSelectedColors] = useQueryState('colors', {
    defaultValue: [],
    parse: (value) => value ? value.split(',') : [],
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [selectedAttributes, setSelectedAttributes] = useQueryState('attribut', {
    defaultValue: [],
    parse: (value) => {
      if (!value) return [];
      return value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    },
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [selectedGenders, setSelectedGenders] = useQueryState('gender', {
    defaultValue: [],
    parse: (value) => {
      if (!value) return [];
      return value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    },
    serialize: (value) => value.length > 0 ? value.join(',') : ''
  });
  const [isSellerMode, setIsSellerMode] = useQueryState('seller_mode', {
    defaultValue: false,
    parse: (value) => value === 'true',
    serialize: (value) => value ? 'true' : ''
  });
  const [selectedBulkPriceRange, setSelectedBulkPriceRange] = useQueryState('bulk_price_range', {
    defaultValue: '',
    parse: (value) => value || '',
    serialize: (value) => value || ''
  });

  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [debouncedCategories, setDebouncedCategories] = useState(effectiveCategories);
  const [debouncedColors, setDebouncedColors] = useState(selectedColors);
  const [debouncedAttributes, setDebouncedAttributes] = useState(selectedAttributes);
  const [debouncedGenders, setDebouncedGenders] = useState(selectedGenders);
  const [debouncedSellerMode, setDebouncedSellerMode] = useState(isSellerMode);
  const [debouncedBulkPriceRange, setDebouncedBulkPriceRange] = useState(selectedBulkPriceRange);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setDebouncedMinPrice(minPrice);
    setDebouncedMaxPrice(maxPrice);
    setDebouncedCategories(effectiveCategories);
    setDebouncedColors(selectedColors);
    setDebouncedAttributes(selectedAttributes);
    setDebouncedGenders(selectedGenders);
    setDebouncedSellerMode(isSellerMode);
    setDebouncedBulkPriceRange(selectedBulkPriceRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasPriceChanged = debouncedMinPrice !== minPrice || debouncedMaxPrice !== maxPrice;
    const hasCategoriesChanged = JSON.stringify(debouncedCategories) !== JSON.stringify(effectiveCategories);
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
        setDebouncedCategories(effectiveCategories);
        setDebouncedColors(selectedColors);
        setDebouncedAttributes(selectedAttributes);
        setDebouncedGenders(selectedGenders);
        setDebouncedSellerMode(isSellerMode);
        setDebouncedBulkPriceRange(selectedBulkPriceRange);
        setIsFiltering(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [minPrice, maxPrice, effectiveCategories, selectedColors, selectedAttributes, selectedGenders, isSellerMode, selectedBulkPriceRange, debouncedMinPrice, debouncedMaxPrice, debouncedCategories, debouncedColors, debouncedAttributes, debouncedGenders, debouncedSellerMode, debouncedBulkPriceRange]);

  const shouldSkipQuery = productsProp !== undefined;
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
  }, { skip: shouldSkipQuery });
  const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery('guard', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  });

  const safeProducts = (productsProp !== undefined ? productsProp : (productList || []));
  const normalizedProducts = safeProducts.map(normalizeProduct);

  useEffect(() => {
    const pages = totalPagesOverride ?? totalPagesResponse;
    if (pages !== undefined) {
      setTotalPages(pages);
    }
  }, [totalPagesResponse, totalPagesOverride]);

  useEffect(() => {
    if (totalPages > 0 && (currentPage < 1 || currentPage > totalPages)) {
      // redirect to 1; we can rely on URL param managed above
      window.history.replaceState(null, '', updatePageInSearchParams(1));
    }
  }, [currentPage, totalPages]);

  const updatePageInSearchParams = (pageNumber: number) => {
    if (getPageUrlOverride) return getPageUrlOverride(pageNumber);
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber.toString());
    if (minPrice > 0) params.set('min_price', minPrice.toString());
    if (maxPrice < 500000) params.set('max_price', maxPrice.toString());
    if (effectiveCategories.length > 0) params.set('categories', effectiveCategories.join(','));
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (selectedAttributes.length > 0) params.set('attribut', selectedAttributes.join(','));
    if (selectedGenders.length > 0) params.set('gender', selectedGenders.join(','));
    return `?${params.toString()}`;
  };

  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleCategory = useCallback((categoryId: number) => {
    // If preset categories are enforced, keep them always selected
    if (presetCategoryIds.includes(categoryId)) return;
    setSelectedCategories(prev => {
      const ids = prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId];
      return ids;
    });
  }, [presetCategoryIds, setSelectedCategories]);

  const toggleColor = useCallback((color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  }, [setSelectedColors]);

  const toggleAttribute = useCallback((attributeId: number) => {
    setSelectedAttributes(prev => prev.includes(attributeId) ? prev.filter(id => id !== attributeId) : [...prev, attributeId]);
  }, [setSelectedAttributes]);

  const toggleGender = useCallback((genderId: number) => {
    setSelectedGenders(prev => prev.includes(genderId) ? [] : [genderId]);
  }, [setSelectedGenders]);

  const toggleSellerMode = useCallback((isSeller: boolean) => {
    setIsSellerMode(isSeller);
    if (!isSeller) setSelectedBulkPriceRange('');
  }, [setIsSellerMode, setSelectedBulkPriceRange]);

  const handleBulkPriceRangeChange = useCallback((range: string) => {
    setSelectedBulkPriceRange(range);
  }, [setSelectedBulkPriceRange]);

  const clearAllFilters = useCallback(() => {
    // Keep preset categories if any
    setSelectedCategories(presetCategoryIds);
    setSelectedColors([]);
    setSelectedAttributes([]);
    setSelectedGenders([]);
    setIsSellerMode(false);
    setSelectedBulkPriceRange('');
  }, [presetCategoryIds, setSelectedAttributes, setSelectedBulkPriceRange, setSelectedCategories, setSelectedColors, setSelectedGenders, setIsSellerMode]);

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      {hero}
    
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
            <Filter className="w-5 h-5" />
            <span className="max-sm:text-sm">Filtres</span>
            {(effectiveCategories.length > 0 || selectedGenders.length > 0 || isSellerMode || selectedBulkPriceRange) && (
              <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                {effectiveCategories.length + selectedGenders.length + (isSellerMode ? 1 : 0) + (selectedBulkPriceRange ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none max-sm:text-sm bg-white px-4 py-2 pr-8 rounded-lg shadow-sm cursor-pointer">
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="hidden lg:block">
            <ProductFilters
              categories={categories || []}
              isLoadingCategories={categoriesLoading}
              showCategories={showCategories}
              selectedCategories={effectiveCategories}
              onCategoryToggle={toggleCategory}
              onClearAll={clearAllFilters}
              isMobile={false}
              onCloseMobile={() => setShowMobileFilters(false)}
              isFiltering={isFiltering}
              selectedColors={selectedColors}
              onColorToggle={toggleColor}
              selectedAttributes={selectedAttributes}
              onAttributeToggle={toggleAttribute}
              selectedGenders={selectedGenders}
              onGenderToggle={toggleGender}
              isSellerMode={isSellerMode}
              onSellerToggle={toggleSellerMode}
              selectedBulkPriceRange={selectedBulkPriceRange}
              onBulkPriceRangeChange={handleBulkPriceRangeChange}
            />
          </div>

          <div className="lg:col-span-3">
            <div className={viewMode === 'grid' ? 'grid grid-cols-2   max-sm:items-center sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {(isLoadingOverride ?? isLoading) || isFiltering ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={viewMode === 'grid' ? 'animate-pulse' : 'animate-pulse'}>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="aspect-square bg-gray-200 w-full"></div>
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
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gray-100">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500 text-center max-w-sm">Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres.</p>
                  <a href={'/products'} className="mt-4 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 transition-colors">Réinitialiser les filtres</a>
                </div>
              )}
            </div>

            {normalizedProducts && normalizedProducts.length > 0 && (
              <div className="flex items-center max-sm:w-full justify-center gap-2 max-sm:mt-0 max-sm:mt-12  max-sm:mb-24 mx-96 max-sm:mx-1 mt-8">
                {currentPage > 1 && (
                  <a href={updatePageInSearchParams(currentPage - 1)} className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50 inline-block">Précédent</a>
                )}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)) {
                      return (
                        <a key={pageNumber} href={updatePageInSearchParams(pageNumber)} className={`w-10 h-10 max-sm:text-xs rounded-lg flex items-center justify-center ${currentPage === pageNumber ? 'bg-[#ed7e0f] text-white' : 'bg-white hover:bg-gray-50'}`}>
                          {pageNumber}
                        </a>
                      );
                    } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                      return <span key={pageNumber}>...</span>;
                    }
                    return null;
                  })}
                </div>
                {currentPage < totalPages && (
                  <a href={updatePageInSearchParams(currentPage + 1)} className="px-3 py-2 max-sm:hidden rounded-lg border border-gray-300 hover:bg-gray-50 inline-block">Suivant</a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showMobileFilters && (
          <ProductFilters
            isMobile={true}
            onCloseMobile={() => setShowMobileFilters(false)}
            categories={categories || []}
            isLoadingCategories={categoriesLoading}
            showCategories={showCategories}
            selectedCategories={effectiveCategories}
            onCategoryToggle={toggleCategory}
            selectedColors={selectedColors}
            onColorToggle={toggleColor}
            selectedAttributes={selectedAttributes}
            onAttributeToggle={toggleAttribute}
            selectedGenders={selectedGenders}
            onGenderToggle={toggleGender}
            isSellerMode={isSellerMode}
            onSellerToggle={toggleSellerMode}
            selectedBulkPriceRange={selectedBulkPriceRange}
            onBulkPriceRangeChange={handleBulkPriceRangeChange}
            onClearAll={clearAllFilters}
            isFiltering={isFiltering}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ProductListContainer;


