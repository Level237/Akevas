import { useState, useEffect, useTransition } from 'react';
import StoreHero from '@/components/frontend/StoreHero'
import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import StoreStories from '@/components/stores/store-stories'
import PremiumProducts from '@/components/products/PremiumProducts'
import MobileNav from '@/components/ui/mobile-nav'
import FeaturedShopModal from '@/components/modals/FeaturedShopModal';
import { useGetCategoriesWithParentIdNullQuery, useGetHomeShopsQuery } from '@/services/guardService';
import CategoryShowcaseDual from '@/components/categories/CategoryShowcaseDual';
import GenderNavigationMobile from '@/components/categories/GenderNavigationMobile';
import { Shop } from '@/types/shop';

import PageLoader from '@/components/ui/PageLoader';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialLoading } from '@/store/features/loadingSlice';
import { RootState } from '@/store';
import { AnimatePresence } from 'framer-motion';
import FloatingHelpButton from '@/components/ui/FloatingHelpButton';
import ErrorBoundary from '@/components/ui/error-boundary';


const Homepage = () => {
  const dispatch = useDispatch();
  const isInitialLoading = useSelector((state: RootState) => state.loading.isInitialLoading);
  const [transition, startTransition] = useTransition();
  console.log(transition)
  const [localShops, setLocalShops] = useState<Shop[]>([])
  const [shouldShow, setShouldShow] = useState(false);
  const { data: { data: shops } = {}, isLoading: shopsLoading } = useGetHomeShopsQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })
  const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })
  console.log(shops)
  
  const closePopup=()=>{
    setShouldShow(false)
  }

  useEffect(() => {
    // Check if modal has been shown before
    const hasModalBeenShown = localStorage.getItem('featuredShopModalShown');
    
    if (!hasModalBeenShown) {
      // Set timer for 4 minutes
      const timer = setTimeout(() => {
        setShouldShow(true);
        // Mark modal as shown
        localStorage.setItem('featuredShopModalShown', 'true');
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    if (shops) {
      startTransition(() => {
        setLocalShops(shops);
      });
    }
  }, [shops]);

  useEffect(() => {
    if (!shopsLoading && !categoriesLoading) {
      // Ajouter un petit délai pour une transition fluide
      const timer = setTimeout(() => {
        dispatch(setInitialLoading(false));
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [shopsLoading, categoriesLoading, dispatch]);

  if (isInitialLoading || shopsLoading || categoriesLoading) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#F8F9FC]">
      <section className=''>
        <TopBar />

          <Header />
    
        <GenderNavigationMobile />
        <StoreHero />



       
          <StoreStories title="Boutiques en vedette" description="Découvrez les boutiques en vedette" shops={localShops} isLoading={shopsLoading} />
        

        
        
          <PremiumProducts />
        
        
          <CategoryShowcaseDual categories={categories} isLoading={categoriesLoading} title="Catégories" />
        

      </section>
       
      <FloatingHelpButton />
      
      <MobileNav />
     
    </div>
    </ErrorBoundary>
  );
};

export default Homepage;
