import React, { useState, useMemo, Suspense } from 'react';
import { useGetCategoriesWithParentIdNullQuery, useGetCategoriesWithParentIdQuery } from '@/services/guardService';
import { ChevronDown, Sparkle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import AsyncLink from '../ui/AsyncLink';
import { Category } from '@/types/products';
import OptimizedImage from '../OptimizedImage';

// Composant pour le skeleton loading global
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

// Composant isolé pour une seule catégorie. 
// Cela empêche le re-rendu de TOUTE la liste quand une seule catégorie change d'état.
const CategoryItem = React.memo(({ 
  category, 
  isActive, 
  onEnter, 
  onLeave, 
  childrenData, 
  isLoadingChildren 
}: {
  category: any;
  isActive: boolean;
  onEnter: (id: number) => void;
  onLeave: () => void;
  childrenData: any;
  isLoadingChildren: boolean;
}) => {
  return (
    <li
      className="relative py-4"
      onMouseEnter={() => onEnter(category.id)}
      onMouseLeave={onLeave}
    >
      <button className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
        <span>{category.category_name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Le Dropdown est rendu, mais son contenu est conditionnel */}
      <CategoryDropdown
        category={category}
        isActive={isActive}
        categoriesChildren={childrenData}
        isLoadingChildren={isLoadingChildren}
      />
    </li>
  );
});
CategoryItem.displayName = 'CategoryItem';

// Composant pour le menu déroulant
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
  // On affiche le conteneur même si ça charge, pour éviter le "saut" visuel
  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="fixed mt-3 left-0 right-0 z-50 mx-auto w-full bg-white shadow-xl overflow-hidden"
      >
        <div className="container mx-auto">
          {isLoadingChildren ? (
            // Skeleton à l'intérieur du dropdown pour une sensation de rapidité
            <div className="grid grid-cols-4 gap-8 p-8">
              <div className="col-span-3 grid grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(j => <div key={j} className="h-4 w-full bg-gray-100 animate-pulse rounded" />)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-span-1">
                <div className="h-[200px] w-full bg-gray-200 animate-pulse rounded-lg" />
              </div>
            </div>
          ) : !categoriesChildren || Object.keys(categoriesChildren).length === 0 ? null : (
            // Contenu réel quand les données sont là
            <div className="grid grid-cols-4 gap-8 p-8">
              <div className="col-span-3 grid grid-cols-3 gap-8">
                {Object.entries(categoriesChildren).map(([key, categories]: any) => {
                  if (key === 'sans_genre') {
                    const parentCategories = categories.filter((cat: any) => cat.children && cat.children.length > 0);
                    return parentCategories.map((parentCat: any) => (
                      <div key={parentCat.id} className="space-y-4">
                        <h3 className="font-medium text-lg">{parentCat.category_name}</h3>
                        <ul className="space-y-2">
                          {parentCat.children.map((childCat: any) => (
                            <li key={childCat.id}>
                              <AsyncLink to={`/c/${childCat.category_url}`} className="text-sm text-gray-600 hover:text-orange-500">
                                {childCat.category_name}
                              </AsyncLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  }
                  return (
                    <div key={key} className="space-y-4">
                      <h3 className="font-medium text-lg">{key}</h3>
                      <ul className="space-y-2">
                        {categories.map((item: any) => (
                          <li key={item.id}>
                            <AsyncLink to={`/c/${item.category_url}`} className="text-sm text-gray-600 hover:text-orange-500">
                              {item.category_name} {key}
                            </AsyncLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

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
                    <AsyncLink to={`/c/${category.category_url}`} className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors">
                      Découvrir <Sparkle className="w-4 h-4" />
                    </AsyncLink>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Offre Spéciale</h4>
                  <p className="text-sm text-orange-700 mb-3">Jusqu'à -50% sur la nouvelle collection</p>
                  <AsyncLink to="" className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1">
                    Voir les offres <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </AsyncLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
CategoryDropdown.displayName = 'CategoryDropdown';

// Composant principal
const CategoryNavigationContent = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  
  const gender = searchParams.get('g');

  // Calcul mémorisé du genderId. Plus besoin de useEffect !
  const currentGenderId = useMemo(() => {
    const g = gender?.toLowerCase();
    if (g === 'homme') return 1;
    if (g === 'femme') return 2;
    if (g === 'enfant') return 3;
    return 4;
  }, [gender]);

  // Requête 1 : Catégories parentes
  const { data: { data: categoriesParent } = {}, isLoading } = useGetCategoriesWithParentIdNullQuery(currentGenderId, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: true
  });

  // Requête 2 : Catégories enfants
  const { data: categoriesChildren, isLoading: isLoadingChildren } = useGetCategoriesWithParentIdQuery(
    { id: activeCategory, genderId: currentGenderId },
    {
      skip: !activeCategory,
      refetchOnMountOrArgChange: false, // CRITIQUE : Utilise le cache, ne force pas le réseau !
      refetchOnFocus: false,
    }
  );

  if (isLoading) return <LoadingSkeleton />;
  if (!categoriesParent) return null;

  return (
    <nav className="relative bg-white">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-8">
          {/* Mapping direct vers le composant mémoïsé. Seul l'élément survolé se re-rend. */}
          {Object.entries(categoriesParent).map(([key, category]: any) => (
            <CategoryItem
              key={key}
              category={category}
              isActive={activeCategory === category.id}
              onEnter={setActiveCategory}
              onLeave={() => setActiveCategory(null)}
              childrenData={categoriesChildren}
              isLoadingChildren={isLoadingChildren}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export const CategoryNavigation = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoryNavigationContent />
    </Suspense>
  );
};

export default React.memo(CategoryNavigation);

