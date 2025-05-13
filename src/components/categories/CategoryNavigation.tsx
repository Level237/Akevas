import React, { useState, useMemo, Suspense } from 'react';
import { useGetCategoriesWithParentIdNullQuery, useGetCategoriesWithParentIdQuery } from '@/services/guardService';

import { ChevronDown, Sparkle } from 'lucide-react';
import { motion } from 'framer-motion';
import AsyncLink from '../ui/AsyncLink';
import { Category } from '@/types/products';
import OptimizedImage from '../OptimizedImage';


// Composant pour le skeleton loading
const LoadingSkeleton = () => (
  <div className="container mx-auto">
    <ul className="flex justify-center items-center gap-8">
      {[1, 2, 3, 4, 5].map((item) => (
        <li key={item} className="py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md" />
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// Composant pour le menu déroulant des catégories
const CategoryDropdown = React.memo(({
  category,
  isActive,
  categoriesChildren,
  isLoadingChildren
}: {
  category: Category;
  isActive: boolean;
  categoriesChildren: any;
  isLoadingChildren: boolean;
}) => {
  if (!isActive || !categoriesChildren || Object.keys(categoriesChildren).length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="fixed mt-6 left-0 right-0 z-50 mx-auto w-full bg-white shadow-xl overflow-hidden"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-4 gap-8 p-8">
          {/* Sections Principales */}
          <div className="col-span-3 grid grid-cols-3 gap-8">
            {!isLoadingChildren && Object.entries(categoriesChildren).map(([key, categories]: any) => {
              if (key === 'sans_genre') {
                // Grouper les catégories par parent_id
                const parentCategories = categories.filter((cat: any) => cat.children && cat.children.length > 0);

                return parentCategories.map((parentCat: any) => (
                  <div key={parentCat.id} className="space-y-4">
                    <h3 className="font-medium text-lg">{parentCat.category_name}</h3>
                    <ul className="space-y-2">
                      {parentCat.children.map((childCat: any) => (
                        <li key={childCat.id}>
                          <AsyncLink
                            to={`/c/${childCat.category_url}`}
                            className="text-sm text-gray-600 hover:text-orange-500"
                          >
                            {childCat.category_name}
                          </AsyncLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ));
              }

              // Comportement existant pour les autres cas
              return (
                <div key={key} className="space-y-4">
                  <h3 className="font-medium text-lg">{key}</h3>
                  <ul className="space-y-2">
                    {categories.map((item: any) => (
                      <li key={item.id}>
                        <AsyncLink
                          to={`/c/${item.category_url}`}
                          className="text-sm text-gray-600 hover:text-orange-500"
                        >
                          {item.category_name} {key}
                        </AsyncLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Nouvelle section promotionnelle */}
          <div className="col-span-1 space-y-6">
            <div className="relative group overflow-hidden rounded-lg">
              <OptimizedImage
                src={category.category_profile}
                alt={category.category_name}
                className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Collection {category.category_name}</h3>
                <p className="text-sm mb-4">Découvrez nos nouveautés</p>
                <AsyncLink
                  to={`/c/${category.category_url}`}
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Découvrir
                  <Sparkle className="w-4 h-4" />
                </AsyncLink>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Offre Spéciale</h4>
              <p className="text-sm text-orange-700 mb-3">Jusqu'à -50% sur la nouvelle collection</p>
              <AsyncLink
                to="/promotions"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1"
              >
                Voir les offres
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </AsyncLink>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CategoryDropdown.displayName = 'CategoryDropdown';

// Séparation du contenu principal dans un composant distinct
const CategoryNavigationContent = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(0);

  const {
    data: { data: categoriesParent } = {},
    isLoading
  } = useGetCategoriesWithParentIdNullQuery('guard', {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false
  });

  const {
    data: categoriesChildren,
    isLoading: isLoadingChildren
  } = useGetCategoriesWithParentIdQuery(activeCategory, {
    skip: !activeCategory,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false
  });

  const handleMouseEnter = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveCategory(0);
  };

  const renderCategories = useMemo(() => {
    if (!categoriesParent) return null;
    console.log(categoriesChildren);
    return Object.entries(categoriesParent).map(([key, category]: any) => (
      <li
        key={key}
        className="relative py-4"
        onMouseEnter={() => handleMouseEnter(category.id)}
        onMouseLeave={handleMouseLeave}
      >
        <button className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
          <span>{category.category_name}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${activeCategory === category.id ? 'rotate-180' : ''
              }`}
          />
        </button>

        <CategoryDropdown
          category={category}
          isActive={activeCategory === category.id}
          categoriesChildren={categoriesChildren}
          isLoadingChildren={isLoadingChildren}
        />
      </li>
    ));
  }, [categoriesParent, activeCategory, categoriesChildren, isLoadingChildren]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <nav className="relative bg-white">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-8">
          {renderCategories}
        </ul>
      </div>
    </nav>
  );
};

// Composant principal avec Suspense
export const CategoryNavigation = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoryNavigationContent />
    </Suspense>
  );
};

// Export du composant mémoïsé
export default React.memo(CategoryNavigation);

