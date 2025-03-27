import { useState, useEffect, useTransition } from 'react';
import StoreHero from '@/components/frontend/StoreHero'
import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import StoreStories from '@/components/stores/store-stories'
import PremiumProducts from '@/components/products/PremiumProducts'
import MobileNav from '@/components/ui/mobile-nav'
import FeaturedShopModal from '@/components/modals/FeaturedShopModal';
import { useGetCategoriesWithParentIdNullQuery, useGetHomeShopsQuery } from '@/services/guardService';
import CategoryGridList from '@/components/categories/CategoryGridList';
import GenderNavigationMobile from '@/components/categories/GenderNavigationMobile';
import { Shop } from '@/types/shop';
import InstallButton from '@/components/InstallButton';
import PageLoader from '@/components/ui/PageLoader';

const Homepage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [transition, startTransition] = useTransition();
  const [localShops, setLocalShops] = useState<Shop[]>([])
  const [showFeaturedShop, setShowFeaturedShop] = useState(false);
  const { data: { data: shops } = {}, isLoading: shopsLoading } = useGetHomeShopsQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })
  const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })
  console.log(shops)

  useEffect(() => {
    if (shops) {
      startTransition(() => {
        setLocalShops(shops);
      });
    }
  }, [shops]);

  useEffect(() => {
    // Vérifier si toutes les données sont chargées
    if (!shopsLoading && !categoriesLoading) {
      // Ajouter un petit délai pour assurer une transition fluide
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shopsLoading, categoriesLoading]);

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <section className=''>
        <TopBar />

          <Header />
    
        <GenderNavigationMobile />
        <StoreHero />



       
          <StoreStories title="Boutiques en vedette" description="Découvrez les boutiques en vedette" shops={localShops} isLoading={shopsLoading} />
        

        
        
          <PremiumProducts />
        
        
          <CategoryGridList categories={categories} isLoading={categoriesLoading} title={`Navigation par catégorie`} />
        

      </section>
       
      <MobileNav />
      <FeaturedShopModal
        isOpen={showFeaturedShop}
        onClose={() => setShowFeaturedShop(false)}
      />
    </div>
  );
};

export default Homepage;
