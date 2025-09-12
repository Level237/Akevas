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
import MobileNav from '@/components/ui/mobile-nav';
import { useGetAllProductsQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { Product } from '@/types/products';
import { normalizeProduct } from '@/lib/normalizeProduct';
import ProductCard from '@/components/products/ProductCard';
import { toast } from "sonner";
import OptimizedImage from '@/components/OptimizedImage';
import ProductFilters from '@/components/filters/ProductFilters';




interface CategoryFilter {
  categories: number[];
  // Ajoutez d'autres types de filtres si nécessaire
}



const sortOptions = [
  { id: 'popular', label: 'Plus populaires' },
  { id: 'newest', label: 'Plus récents' },
  { id: 'price-low', label: 'Prix croissant' },
  { id: 'price-high', label: 'Prix décroissant' },
  { id: 'rating', label: 'Meilleures notes' }
];

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<CategoryFilter>({
    categories: []
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(0);

  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: { productList, totalPagesResponse } = {}, isLoading } = useGetAllProductsQuery(currentPage);
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

  const toggleFilter = useCallback((type: keyof CategoryFilter, id: number) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[type] || [];
      return {
        ...prev,
        [type]: currentFilters.includes(id)
          ? currentFilters.filter(filterId => filterId !== id)
          : [...currentFilters, id]
      };
    });
  }, []);

  const clearCategoryFilters = useCallback(() => {
    setSelectedFilters(prev => ({
      ...prev,
      categories: []
    }));

    // Si vous avez une fonction de recherche/filtrage qui dépend des filtres
    // vous pouvez l'appeler ici
    // handleSearch();

    // Optionnel : Afficher une notification de confirmation
    toast.success("Filtres réinitialisés", {
      duration: 2000,
      position: "top-center",
    });
  }, []);

  const isCategorySelected = useCallback((categoryId: number) => {
    return selectedFilters.categories.includes(categoryId);
  }, [selectedFilters.categories]);

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
            {Object.values(selectedFilters).reduce(
              (acc, curr) => acc + curr.length,
              0
            ) > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {Object.values(selectedFilters).reduce(
                    (acc, curr) => acc + curr.length,
                    0
                  )}
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
              selectedCategories={selectedFilters.categories}
              onCategoryToggle={(categoryId: number) => toggleFilter('categories', categoryId)}
              onClearAll={() => setSelectedFilters({ categories: [] })}
              isMobile={false}
              onCloseMobile={() => setShowMobileFilters(false)}
            />
          </div>

          {/* Liste des produits */}
          <div className="lg:col-span-3">
            <div className={viewMode === 'grid' ? 'grid grid-cols-2   max-sm:items-center sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {!isLoading && normalizedProducts && normalizedProducts.map((product: Product) => (
                <ProductCard product={product} viewMode={viewMode} />
              ))}
              <div>
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
                                className={`group ${isCategorySelected(category.id) ? 'bg-orange-50' : ''}`}
                              >
                                <label className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                                  <div className="flex items-center flex-1">
                                    <input
                                      type="checkbox"
                                      checked={isCategorySelected(category.id)}
                                      onChange={() => toggleFilter('categories', category.id)}
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
                          {selectedFilters.categories.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4 p-3 bg-orange-50 rounded-xl"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-orange-700">
                                  {selectedFilters.categories.length} catégorie(s) sélectionnée(s)
                                </span>
                                <button
                                  onClick={clearCategoryFilters}
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
