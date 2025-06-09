import { useState, useEffect, useTransition } from 'react';
import StoreHero from '@/components/frontend/StoreHero'
import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import StoreStories from '@/components/stores/store-stories'
import PremiumProducts from '@/components/products/PremiumProducts'
import MobileNav from '@/components/ui/mobile-nav'

import { useGetCategoriesWithParentIdNullQuery, useGetHomeShopsQuery } from '@/services/guardService';
import CategoryShowcaseDual from '@/components/categories/CategoryShowcaseDual';
import GenderNavigationMobile from '@/components/categories/GenderNavigationMobile';
import { Shop } from '@/types/shop';

import PageLoader from '@/components/ui/PageLoader';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialLoading } from '@/store/features/loadingSlice';
import { RootState } from '@/store';
import FloatingHelpButton from '@/components/ui/FloatingHelpButton';
import InstallButton from '@/components/InstallButton';


const Homepage = () => {
  const dispatch = useDispatch();
  const isInitialLoading = useSelector((state: RootState) => state.loading.isInitialLoading);
  const [transition, startTransition] = useTransition();
  console.log(transition)
  const [localShops, setLocalShops] = useState<Shop[]>([])
  const { data: { data: shops } = {}, isLoading: shopsLoading } = useGetHomeShopsQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })
  const { data: { data: categories } = {}, isLoading: categoriesLoading } = useGetCategoriesWithParentIdNullQuery("guard", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: 30
  })

  



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
    
    <div className="relative min-h-screen bg-[#F8F9FC]">
      <TopBar />
      <Header />
      
      <main className="relative">
        <GenderNavigationMobile />
        <div className="relative">
          <StoreHero />
          <StoreStories title="Boutiques en vedette" description="Découvrez les boutiques en vedette" shops={localShops} isLoading={shopsLoading} />
          <PremiumProducts />
          <CategoryShowcaseDual categories={categories} isLoading={categoriesLoading} title="Catégories" titleCategory="Découvrez nos catégories" />
        </div>
      </main>

      <MobileNav/>
      <FloatingHelpButton />
      <InstallButton/>
    </div>
   
  );
};

export default Homepage;
