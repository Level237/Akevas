import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import AsyncLink from '../ui/AsyncLink';
import { useGetHomeProductsQuery } from '@/services/guardService';
import ProductListGrid from './ProductListGrid';

// Extraire l'en-tête dans un composant séparé mémoïsé
export const SectionHeader = React.memo(({title,description}: {title: string,description:string}) => (
  <div className="flex  max-sm:hidden justify-between items-baseline mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl max-sm:text-xl font-bold mb-2 text-black">
        {title}
      </h2>
      <p className="text-xl md:text-2xl max-sm:text-sm text-gray-600">
        {description}
      </p>
    </div>
    <AsyncLink
      to="/products/"
      className="hidden md:flex text-black items-center text-sm hover:underline"
    >
      Voir toutes les produits
      <ChevronRight className="ml-1 h-4 w-4" />
    </AsyncLink>
  </div>
));

SectionHeader.displayName = 'SectionHeader';

const PremiumProducts: React.FC = () => {
  const {
    data: { data: products } = {},
    isLoading
  } = useGetHomeProductsQuery("guard", {
    // Optimiser la requête RTK Query
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  // Mémoiser les produits pour éviter des re-renders inutiles
  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <section className="pt-24 max-sm:pt-12  bg-gray-200">
      <div className="max-w-8xl ml-12 max-sm:ml-2 mx-auto px-4 max-sm:pr-0 sm:px-6 lg:px-8">
        <SectionHeader title='Produits Premium' description='Découvrez notre sélection de produits premium'/>
        <ProductListGrid
          products={memoizedProducts}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

// Mémoiser le composant principal
export default React.memo(PremiumProducts);
