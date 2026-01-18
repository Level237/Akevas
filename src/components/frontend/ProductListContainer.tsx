import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { useGetAllProductsQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { useQueryState } from 'nuqs';
import { normalizeProduct } from '@/lib/normalizeProduct';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/products';
import ProductFilters from '@/components/filters/ProductFilters';
import { useInView } from 'react-intersection-observer';
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

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
      {/* Zone Image */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Zone Infos */}
      <div className="p-4 space-y-3">
        {/* Titre */}
        <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        {/* Catégorie/Vendeur */}
        <div className="h-3 bg-gray-100 rounded-md w-1/2" />
        
        <div className="flex items-center justify-between mt-4">
          {/* Prix */}
          <div className="h-6 bg-gray-200 rounded-md w-1/4" />
          {/* Bouton */}
          <div className="h-8 bg-gray-100 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
};
const ProductListContainer: React.FC<ProductListContainerProps> = ({ presetCategoryIds = [], hero, showCategories = true }) => {
  
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);



const { ref: lastItemRef, inView: lastItemInView } = useInView({ threshold: 0.1 });

 
  
  

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
  

 
  const { data, isLoading, isFetching } = useGetAllProductsQuery({
    page: page,
    min_price: debouncedMinPrice,
    max_price: debouncedMaxPrice,
    categories: debouncedCategories,
    colors: debouncedColors,
    attribut: debouncedAttributes,
    gender: debouncedGenders,
    seller_mode: debouncedSellerMode,
    bulk_price_range: debouncedBulkPriceRange
  });

 

  useEffect(() => {
    if (data?.productList) {
      if (page === 1) {
        // Si c'est la page 1 (nouveau filtre), on remplace tout
        setAllProducts(data.productList);
      } else {
        // Sinon, on ajoute à la suite sans doublons
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newUnique = data.productList.filter((p:any) => !existingIds.has(p.id));
          return [...prev, ...newUnique];
        });
      }
    }
  }, [data?.productList, page]);

  useEffect(() => {
    // On ne charge la suite que si le dernier élément de la page courante est visible ET qu'il reste des pages
    if (lastItemInView && data?.hasMore && !isFetching && !isLoading) {
      setPage(prev => prev + 1);
      console.log('level1')
    }
    console.log(page)
  }, [lastItemInView, data?.hasMore, isFetching, isLoading]);

  const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery('guard', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  });


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

  
  const normalizedProducts = useMemo(() => allProducts.map(normalizeProduct), [allProducts]);

  
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

             {normalizedProducts.map((product, idx) => {
                // On observe le dernier élément de chaque page de 18
                const isLastOfBatch = (idx + 1) % 18 === 0 || idx === normalizedProducts.length - 1;
                return (
                  <div
                    key={product.id}
                    ref={isLastOfBatch ? lastItemRef : undefined}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </div>
                );
              })}

          {(isLoading || isFiltering) && normalizedProducts.length === 0 && (
      Array.from({ length: 6 }).map((_, index) => (
        <ProductSkeleton key={`initial-loader-${index}`} />
      ))
    )}


 

              <div ref={lastItemRef} className="h-20 flex flex-col items-center justify-center mt-8 w-full col-span-full">
                {isFetching && data?.hasMore && (
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-8 h-8 border-4 border-[#ed7e0f] border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-sm text-gray-500 font-medium">Chargement des produits suivants...</p>
                  </div>
                )}
                {!data?.hasMore && allProducts.length > 0 && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <p className="text-gray-400 text-sm font-medium">
                      Vous avez exploré tout le catalogue Akevas
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination removed for infinite scroll */}
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


