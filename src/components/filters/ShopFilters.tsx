import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Users, TrendingUp, Filter, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ShopSortOption = 'allShops' | 'rating' | 'followers' | 'newest';

export interface ApiCategory {
  id: number;
  category_name: string;
  products_count: number;
  category_profile: string;
  category_url: string;
  parent: any;
}

interface ShopFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;

  availableCategories: ApiCategory[];
  selectedCategoryIds: number[];
  onToggleCategory: (categoryId: number) => void;
  onSelectCategory?: (categoryId: number | null) => void;
  onClearAll?: () => void;

  isPremiumOnly: boolean;
  onTogglePremium: (value: boolean) => void;

  sortBy: ShopSortOption;
  onChangeSort: (value: ShopSortOption) => void;
}

const sectionTransition = { duration: 0.2 };

const ShopFilters = ({
  searchQuery,
  onSearchChange,
  availableCategories,
  selectedCategoryIds,
  onToggleCategory,
  onSelectCategory,
  onClearAll,
  isPremiumOnly,
  onTogglePremium,
  sortBy,
  onChangeSort
}: ShopFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'search', 'sort', 'premium', 'categories'
  ]);

  const totalSelectedCount = useMemo(() => {
    return (
      (searchQuery ? 1 : 0) +
      selectedCategoryIds.length +
      (isPremiumOnly ? 1 : 0) +
      (sortBy !== 'allShops' ? 1 : 0)
    );
  }, [searchQuery, selectedCategoryIds.length, isPremiumOnly, sortBy]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  const SectionHeader = ({ id, title, icon }: { id: string; title: string; icon?: React.ReactNode }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-md font-medium text-gray-900">{title}</h3>
      </div>
      <button onClick={() => toggleSection(id)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
        {expandedSections.includes(id) ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
        </div>
        {totalSelectedCount > 0 && (
          <button onClick={onClearAll} className="text-sm text-blue-600 hover:text-blue-700">Réinitialiser</button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-3">
          <SectionHeader id="categories" title="Catégories" />
          <AnimatePresence>
            {expandedSections.includes('categories') && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={sectionTransition} className="overflow-hidden">
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">Sélectionner une catégorie</label>
                  <select
                    value={selectedCategoryIds[0] ? String(selectedCategoryIds[0]) : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) {
                        if (onSelectCategory) onSelectCategory(null);
                        else if (selectedCategoryIds.length > 0) onToggleCategory(selectedCategoryIds[0]);
                        return;
                      }
                      const id = parseInt(value, 10);
                      if (onSelectCategory) onSelectCategory(id);
                      else onToggleCategory(id);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="">Toutes catégories</option>
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <SectionHeader id="sort" title="Trier par" icon={<Filter className="w-4 h-4 text-gray-500" />} />
          <AnimatePresence>
            {expandedSections.includes('sort') && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={sectionTransition} className="overflow-hidden">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant={sortBy === 'allShops' ? 'default' : 'outline'} onClick={() => onChangeSort('allShops')}>
                    Toutes
                  </Button>
                  <Button variant={sortBy === 'rating' ? 'default' : 'outline'} onClick={() => onChangeSort('rating')} className="flex items-center gap-2">
                    <Star className="w-4 h-4" /> Notées
                  </Button>
                  <Button variant={sortBy === 'followers' ? 'default' : 'outline'} onClick={() => onChangeSort('followers')} className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Suivis
                  </Button>
                  <Button variant={sortBy === 'newest' ? 'default' : 'outline'} onClick={() => onChangeSort('newest')} className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Récents
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium */}
        <div className="space-y-3">
          <SectionHeader id="premium" title="Premium" icon={<Shield className="w-4 h-4 text-gray-500" />} />
          <AnimatePresence>
            {expandedSections.includes('premium') && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={sectionTransition} className="overflow-hidden">
                <div className="mt-2">
                  <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-150 ${isPremiumOnly ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-800">Afficher uniquement les boutiques Premium</span>
                    </div>
                    <input type="checkbox" checked={isPremiumOnly} onChange={(e) => onTogglePremium(e.target.checked)} className="w-4 h-4" />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories */}
       
      </div>
    </div>
  );
};

export default ShopFilters;


