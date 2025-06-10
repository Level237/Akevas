import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '../OptimizedImage';


interface Category {
  id: number;
  category_name: string;
  category_profile: string;
  products_count: number;
}

interface FilterProps {
  categories: Category[];
  isLoading: boolean;
  selectedCategories: number[];
  onCategoryToggle: (categoryId: number) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const CategoryFilters = ({
  categories,
  isLoading,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
  isMobile = false,
  onCloseMobile
}: FilterProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const FilterContent = () => (
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
                {!isLoading && categories.map((category) => (
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
                          onChange={() => onCategoryToggle(category.id)}
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
                      onClick={onClearFilters}
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
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween' }}
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl z-50"
      >
       

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Button
            onClick={onCloseMobile}
            className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white"
          >
            Voir les résultats
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
        {selectedCategories.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Réinitialiser
          </button>
        )}
      </div>
      <FilterContent />

      
    </div>
  );
};

export default CategoryFilters; 