import React from 'react';
import { ChevronRight } from 'lucide-react';
import AsyncLink from '../ui/AsyncLink';
import { useGetHomeProductsQuery } from '@/services/guardService';
import ProductListGrid from './ProductListGrid';



const PremiumProducts: React.FC = () => {
  
  const {data:{data:products}={},isLoading}=useGetHomeProductsQuery("guard")
  console.log(products)
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex justify-between items-baseline mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl max-sm:text-xl font-bold mb-2 text-black">Produits Premium</h2>
              <p className="text-xl md:text-2xl max-sm:text-sm  text-gray-600">Découvrez notre sélection de produits premium 
              </p>
            </div>
            <AsyncLink
              to="/products/" 
              className="hidden md:flex text-black items-center  text-sm hover:underline"
            >
              Voir toutes les produits
              <ChevronRight className="ml-1 h-4 w-4" />
            </AsyncLink>
          </div>
        <ProductListGrid products={products} isLoading={isLoading} />

      </div>


    </section>
  );
};

export default PremiumProducts;
