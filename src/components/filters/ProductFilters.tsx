import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryState } from 'nuqs';
import { useGetAttributeByCategoryQuery, useGetAttributeValuesQuery } from '@/services/guardService';


interface Category {
  id: number;
  category_name: string;
  category_profile: string;
  products_count: number;
}

interface ProductFiltersProps {
  // Data sources
  categories: Category[];
  isLoadingCategories?: boolean;

  // Category interop with page
  selectedCategories: number[];
  onCategoryToggle: (categoryId: number) => void;
  onClearAll?: () => void;

  // Color interop with page
  selectedColors?: string[];
  onColorToggle?: (color: string) => void;

  // Attribute interop with page
  selectedAttributes?: number[];
  onAttributeToggle?: (attributeId: number) => void;

  // Gender interop with page
  selectedGenders?: number[];
  onGenderToggle?: (genderId: number) => void;

  // Seller interop with page
  isSellerMode?: boolean;
  onSellerToggle?: (isSeller: boolean) => void;
  selectedBulkPriceRange?: string;
  onBulkPriceRangeChange?: (range: string) => void;

  // Mobile
  isMobile?: boolean;
  onCloseMobile?: () => void;
  
  // Filtering state
  isFiltering?: boolean;
}

const sectionTransition = { duration: 0.2 };



const ProductFilters = ({
  categories,
  isLoadingCategories = false,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  selectedColors = [],
  onColorToggle,
  selectedAttributes = [],
  onAttributeToggle,
  selectedGenders = [],
  onGenderToggle,
  isSellerMode = false,
  onSellerToggle,
  selectedBulkPriceRange = '',
  onBulkPriceRangeChange,
  isMobile = false,
  onCloseMobile,
  isFiltering = false
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'seller', 'bulk-price', 'categories', 'price', 'color', 'gender', 'attributes'
  ]);

  // Price filtering with URL state
  const PRICE_MAX = 500000;
  const [minPrice, setMinPrice] = useQueryState('min_price', {
    defaultValue: 0,
    parse: (value) => parseInt(value, 10) || 0,
    serialize: (value) => value.toString()
  });
  const [maxPrice, setMaxPrice] = useQueryState('max_price', {
    defaultValue: PRICE_MAX,
    parse: (value) => parseInt(value, 10) || PRICE_MAX,
    serialize: (value) => value.toString()
  });

  const { data: { data: getAttributes } = {} } = useGetAttributeValuesQuery("1");
  const { data: availableAttributes } = useGetAttributeByCategoryQuery('guard');
  console.log(availableAttributes)
  const setClampedMinPrice = (value: number) => {
    const safeMax = maxPrice;
    const newMin = Math.max(0, Math.min(value, safeMax));
    setMinPrice(newMin);
    if (maxPrice < newMin) {
      setMaxPrice(newMin);
    }
  };

  const setClampedMaxPrice = (value: number) => {
    const safeMin = minPrice;
    const newMax = Math.min(PRICE_MAX, Math.max(value, safeMin));
    setMaxPrice(newMax);
    if (minPrice > newMax) {
      setMinPrice(newMax);
    }
  };
  // Colors are now managed by parent component via props
  
  // Attributes state - now managed by parent component via props
  const [selectedAttributeType, setSelectedAttributeType] = useState<string>('');
  
  // Get available attributes based on selected categories
  const getAvailableAttributes = () => {
    if (!availableAttributes || selectedCategories.length === 0) return [];
    
    return availableAttributes.filter((attr: any) => 
      selectedCategories.includes(attr.category_id)
    );
  };

  const totalSelectedCount = useMemo(() => {
    return (
      selectedCategories.length +
      selectedColors.length +
      selectedAttributes.length +
      selectedGenders.length +
      (isSellerMode ? 1 : 0) +
      (selectedBulkPriceRange ? 1 : 0) +
      (minPrice > 0 || maxPrice < PRICE_MAX ? 1 : 0)
    );
  }, [selectedCategories.length, selectedColors.length, selectedAttributes.length, selectedGenders.length, isSellerMode, selectedBulkPriceRange, minPrice, maxPrice]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  // Removed toggleString - colors are now managed by parent component
  
  const toggleAttributeValue = (value: string | number) => {
    // Convert value to number if it's a string that represents a number
    const attributeId = typeof value === 'string' ? parseInt(value, 10) : value;
    if (!isNaN(attributeId)) {
      onAttributeToggle?.(attributeId);
    }
  };
  
  const handleAttributeTypeChange = (type: string) => {
    setSelectedAttributeType(type);
    // Clear selected attributes when changing type - this will be handled by parent component
  };

  const clearLocal = () => {
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setSelectedAttributeType('');
    // Colors and attributes are cleared by parent component via onClearAll
  };

  const handleClearAll = () => {
    clearLocal();
    onClearAll && onClearAll();
  };

  const SectionHeader = ({ id, title }: { id: string; title: string }) => (
    <div className="flex items-center justify-between">
      <h3 className="text-md font-medium text-gray-900">{title}</h3>
      <button onClick={() => toggleSection(id)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
        {expandedSections.includes(id) ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );

  const Seller = (
    <div className="space-y-4">
      <SectionHeader id="seller" title="Mode de vente" />
      <AnimatePresence>
        {expandedSections.includes('seller') && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={sectionTransition} 
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: false, label: 'Prix normal' },
                { value: true, label: 'Prix de gros' }
              ].map((option) => (
                <label
                  key={option.value.toString()}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-all duration-150
                    ${isSellerMode === option.value
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="priceType"
                    checked={isSellerMode === option.value}
                    onChange={() => onSellerToggle?.(option.value)}
                    className="sr-only"
                  />
                  <span className={`text-xs font-medium transition-colors
                    ${isSellerMode === option.value ? 'text-orange-700' : 'text-gray-900 group-hover:text-orange-700'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const BulkPrice = (
    <div className="space-y-4">
      <SectionHeader id="bulk-price" title="Paliers de prix de gros" />
      <AnimatePresence>
        {expandedSections.includes('bulk-price') && isSellerMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={sectionTransition} 
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {/* Price Range Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '500-1000', label: '500 - 1 000', min: 500, max: 1000, color: 'from-blue-500 to-blue-600' },
                  { value: '1000-5000', label: '1 000 - 5 000', min: 1000, max: 5000, color: 'from-green-500 to-green-600' },
                  { value: '5000-10000', label: '5 000 - 10 000', min: 5000, max: 10000, color: 'from-purple-500 to-purple-600' },
                  { value: '10000-25000', label: '10 000 - 25 000', min: 10000, max: 25000, color: 'from-orange-500 to-orange-600' },
                  { value: '25000-50000', label: '25 000 - 50 000', min: 25000, max: 50000, color: 'from-red-500 to-red-600' },
                  { value: '50000+', label: '50 000+', min: 50000, max: 500000, color: 'from-gray-600 to-gray-700' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => onBulkPriceRangeChange?.(range.value)}
                    className={`group relative p-1 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                      selectedBulkPriceRange === range.value
                        ? 'border-orange-300 bg-orange-50 ring-2 ring-orange-200'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {/* Gradient Circle */}
                     
                      
                      {/* Range Label */}
                      <div className="text-center">
                        <span className={`text-xs font-semibold transition-colors ${
                          selectedBulkPriceRange === range.value ? 'text-orange-700' : 'text-gray-900'
                        }`}>
                          {range.label}
                        </span>
                        <p className={`text-xs transition-colors ${
                          selectedBulkPriceRange === range.value ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          XAF
                        </p>
                      </div>
                      
                      
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Range Summary */}
              {selectedBulkPriceRange && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      
                      <div>
                        <span className="text-xs font-medium text-orange-800">
                          Paliers sélectionné : {[
                            { value: '500-1000', label: '500 - 1 000 CFA' },
                            { value: '1000-5000', label: '1 000 - 5 000 CFA' },
                            { value: '5000-10000', label: '5 000 - 10 000 CFA' },
                            { value: '10000-25000', label: '10 000 - 25 000 CFA' },
                            { value: '25000-50000', label: '25 000 - 50 000 CFA' },
                            { value: '50000+', label: '50 000+ CFA' }
                          ].find(r => r.value === selectedBulkPriceRange)?.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onBulkPriceRangeChange?.('')}
                      className="text-xs text-orange-600 hover:text-orange-800 font-medium transition-colors px-2 py-1 rounded hover:bg-orange-200"
                    >
                      Effacer
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const Categories = (
    <div className="space-y-4">
      <SectionHeader id="categories" title="Catégories" />
      <AnimatePresence>
        {expandedSections.includes('categories') && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={sectionTransition} 
            className="overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
              <div className="space-y-1">
              {!isLoadingCategories && categories.map(category => (
                  <motion.div 
                    key={category.id} 
                    whileHover={{ x: 2 }} 
                    className={`group rounded-lg transition-all duration-200 ${selectedCategories.includes(category.id) ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'}`}
                  >
                    <label className="flex items-center p-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category.id)} 
                        onChange={() => onCategoryToggle(category.id)} 
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500/20 focus:ring-2" 
                      />
                      <div className="flex items-center ml-3 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0" />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-700 transition-colors">
                            {category.category_name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-500">{category.products_count} produits</span>
                            {category.products_count > 0 && (
                              <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                            {category.products_count}
                          </span>
                      </div>
                    </div>
                  </label>
                </motion.div>
              ))}
              </div>
            </div>
            {selectedCategories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">
                    {selectedCategories.length} catégorie{selectedCategories.length > 1 ? 's' : ''} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
                  </span>
                  <button 
                    onClick={onClearAll} 
                    className="text-xs font-medium text-orange-600 hover:text-orange-800 transition-colors underline decoration-orange-300 hover:decoration-orange-500"
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
  );

  const Price = (
    <div className="space-y-4">
      <SectionHeader id="price" title="Prix" />
      <AnimatePresence>
        {expandedSections.includes('price') && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={sectionTransition} className="overflow-hidden">
            <div className="space-y-4">
              {/* Range Slider Container */}
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>0 CFA</span>
                  <span>500 000 CFA</span>
                </div>
                
                {/* Slider Track */}
                <div className="relative h-2 bg-gray-200 rounded-full">
                  {/* Active Range */}
                  <div 
                    className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                    style={{
                      left: `${(minPrice / PRICE_MAX) * 100}%`,
                      width: `${(maxPrice - minPrice) / PRICE_MAX * 100}%`
                    }}
                  />
                  
                  {/* Min Handle */}
                  <input
                    type="range"
                    min="0"
                    max={PRICE_MAX}
                    step="1000"
                    value={minPrice}
                    onChange={(e) => setClampedMinPrice(Number(e.target.value))}
                    className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                  
                  {/* Max Handle */}
                  <input
                    type="range"
                    min="0"
                    max={PRICE_MAX}
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setClampedMaxPrice(Number(e.target.value))}
                    className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="px-2 py-1 rounded-md bg-white border border-orange-300 text-orange-700 shadow-sm text-center text-sm">
                    {minPrice.toLocaleString()} CFA
                  </div>
                  <div className="px-2 py-1 rounded-md bg-white border border-orange-300 text-orange-700 shadow-sm text-center text-sm">
                    {maxPrice.toLocaleString()} CFA
                  </div>
                </div>
                {/* Value Display with +/- buttons */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Min:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setClampedMinPrice(Math.max(0, minPrice - 1000))}
                        className="w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-medium shadow-sm"
                        aria-label="Diminuer le prix minimum"
                      >
                        −
                      </button>
                    
                      
                      <button
                        onClick={() => setClampedMinPrice(Math.min(PRICE_MAX, minPrice + 1000))}
                        className="w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-medium shadow-sm"
                        aria-label="Augmenter le prix minimum"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Max:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setClampedMaxPrice(Math.max(0, maxPrice - 1000))}
                        className="w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-medium shadow-sm"
                        aria-label="Diminuer le prix maximum"
                      >
                        −
                      </button>
                     
                      <button
                        onClick={() => setClampedMaxPrice(Math.min(PRICE_MAX, maxPrice + 1000))}
                        className="w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-medium shadow-sm"
                        aria-label="Augmenter le prix maximum"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Price Buttons */}
              <div className="grid grid-cols-2 flex-wrap gap-2">
                {[
                  { label: '0 – 10k CFA', min: 0, max: 10000 },
                  { label: '10k – 25k CFA', min: 10000, max: 25000 },
                  { label: '25k – 50k CFA', min: 25000, max: 50000 },
                  { label: '50k – 100k CFA', min: 50000, max: 100000 },
                  { label: '100k – 250k CFA', min: 100000, max: 250000 },
                  { label: '250k – 500k CFA', min: 250000, max: 500000 },
                  { label: '+ 500k CFA ', min: 500000, max: 500000 }
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setClampedMinPrice(range.min);
                      setClampedMaxPrice(range.max);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                      minPrice === range.min && maxPrice === range.max
                        ? 'border-orange-400 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );


  const Colors = (
    <div className="space-y-4">
      <SectionHeader id="color" title="Couleur" />
      <AnimatePresence>
        {expandedSections.includes('color') && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={sectionTransition} className="overflow-hidden">
            <div className="flex mt-4 ml-4 mb-4 flex-wrap gap-3">
              {getAttributes && getAttributes.length > 0 ? (
                getAttributes
                  .find((attr:any)=> attr.name === 'Couleur')
                  ?.values.map((color:any) => (
                    <button 
                      key={color.id} 
                      onClick={() => onColorToggle?.(color.value)} 
                      className={`relative h-7 w-7 rounded-full border ${selectedColors.includes(color.value) ? 'ring-2 ring-offset-2 ring-[#ed7e0f]' : 'border-gray-300'}`} 
                      style={{ backgroundColor: color.hex_color }}
                      title={color.value}
                    >
                      {color.hex_color === '#FFFFFF' && <span className="absolute inset-0 rounded-full border border-gray-300" />}
                </button>
                  ))
              ) : (
                // Fallback to static colors if API data is not available
               <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                    Veuillez d'abord sélectionner une catégorie pour voir les attributs disponibles.
            </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const Gender = (
    <div className="space-y-4">
      <SectionHeader id="gender" title="Genre" />
      <AnimatePresence>
        {expandedSections.includes('gender') && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={sectionTransition} 
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {/* Gender Options - Radio Button Style */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 1, name: 'Homme', icon: '👨' },
                  { id: 2, name: 'Femme', icon: '👩' },
                  { id: 3, name: 'Enfant', icon: '👶' },
                  { id: 4, name: 'Mixte', icon: '👥' }
                ].map((gender) => (
                  <button
                    key={gender.id}
                    onClick={() => onGenderToggle?.(gender.id)}
                    className={`w-full flex items-center justify-center p-1 rounded-lg border-2 transition-all duration-200 ${
                      selectedGenders.includes(gender.id)
                        ? 'bg-orange-50 border-orange-300 text-orange-700 ring-2 ring-orange-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      
                      <span className="text-xs font-medium">{gender.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              
             
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );



  const Attributes = (
    <div className="space-y-4">
      <SectionHeader id="attributes" title="Attributs" />
      <AnimatePresence>
        {expandedSections.includes('attributes') && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={sectionTransition} className="overflow-hidden">
            <div className="space-y-4">
              {/* Attribute Type Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Type d'attribut</label>
                {selectedCategories.length === 0 ? (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                    Veuillez d'abord sélectionner une catégorie pour voir les attributs disponibles.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {getAvailableAttributes().map((attr: any) => (
                      <button
                        key={attr.attribute_id}
                        onClick={() => handleAttributeTypeChange(attr.attribute_id.toString())}
                        className={`p-1 text-xs rounded-lg border text-center transition-colors ${
                          selectedAttributeType === attr.attribute_id.toString()
                            ? 'border-orange-400 bg-orange-50 text-orange-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{attr.attribute_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Attribute Values Selection */}
              {selectedAttributeType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-medium text-gray-700">
                    Valeurs {getAvailableAttributes().find((attr: any) => attr.attribute_id.toString() === selectedAttributeType)?.attribute_name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAttributes && getAttributes.length > 0 ? (
                      getAttributes
                        .find((attr: any) => attr.id.toString() === selectedAttributeType)
                        ?.values.map((value: any) => (
                          <button
                            key={value.id}
                            onClick={() => toggleAttributeValue(value.id)}
                            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                              selectedAttributes.includes(value.id)
                                ? 'border-orange-400 bg-orange-50 text-orange-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {value.value}{value.label ? ` ${value.label}` : ''}
                          </button>
                        ))
                    ) : (
                      <div className="text-sm text-gray-500">Chargement des valeurs...</div>
                    )}
                  </div>
                  
                  {/* Selected values summary */}
                  {selectedAttributes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-orange-700">
                          {selectedAttributes.length} valeur{selectedAttributes.length > 1 ? 's' : ''} sélectionnée{selectedAttributes.length > 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => {
                            // Clear all selected attributes
                            selectedAttributes.forEach(attrId => onAttributeToggle?.(attrId));
                          }}
                          className="text-xs text-orange-600 hover:text-orange-800 font-medium transition-colors"
                        >
                          Effacer
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {Seller}
      {isSellerMode && BulkPrice}
      {Gender}
      {!isSellerMode && Price}
      {Categories}
      {Colors}
      {Attributes}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40"
        />
        
        {/* Mobile Filter Panel */}
        <motion.div 
          initial={{ x: '100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '100%' }} 
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[9999999] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                {isFiltering && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600">Filtrage...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {totalSelectedCount > 0 && (
                <button 
                  onClick={handleClearAll} 
                  className="text-xs text-orange-600 hover:text-orange-800 font-medium px-2 py-1 rounded-md hover:bg-orange-100 transition-colors"
                >
                  Réinitialiser
                </button>
              )}
              <button
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Count Badge */}
          {totalSelectedCount > 0 && (
            <div className="px-4 py-2 bg-blue-50 border-b">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">
                  {totalSelectedCount} filtre{totalSelectedCount > 1 ? 's' : ''} actif{totalSelectedCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {content}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-4 space-y-3">
            <Button 
              onClick={onCloseMobile} 
              className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white py-3 text-base font-medium shadow-lg"
            >
              Voir les résultats
            </Button>
            {totalSelectedCount > 0 && (
              <button 
                onClick={handleClearAll}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
              >
                Effacer tous les filtres
              </button>
            )}
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
          {isFiltering && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-orange-600">Filtrage...</span>
            </div>
          )}
        </div>
        {totalSelectedCount > 0 && (
          <button onClick={handleClearAll} className="text-sm text-blue-600 hover:text-blue-700">Réinitialiser</button>
        )}
      </div>
      {content}
    </div>
  );
};

export default ProductFilters;


