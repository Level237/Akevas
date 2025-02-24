import { useState, useEffect } from 'react';



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
const Homepage = () => {
  //t [loading, setLoading] = useState(true);
  const [showFeaturedShop, setShowFeaturedShop] = useState(false);
  const {data:{data:shops}={},isLoading}=useGetHomeShopsQuery("guard")
  const {data:{data:categories}={},isLoading:isLoadingCategories}=useGetCategoriesWithParentIdNullQuery("guard")
    console.log(shops)
  useEffect(() => {
    // Simulate loading delay 
    //const timer = setTimeout(() => {
    //setLoading(false);
    //}, 4000);

    //return () => clearTimeout(timer);
  }, []);




  //if (loading) {
  //  return (
  //    <div className="flex flex-col">
  //      {/* Hero Section Skeleton */}
  //      <div className="mb-12">
  //        <Skeleton className="py-8 w-full" />
  //      </div>
  //      {/* Header */}
  //      <div className='flex mx-16 items-center justify-between gap-4'>
  //        <Skeleton className="w-16 h-16 rounded-full" />
  //        <Skeleton className=" h-14 w-96 pr-12" />
  //        <Skeleton className="h-8 w-48" />
  //        </div>

  {/* Hero Skeleton */ }
  //<div className='flex items-start mt-28 gap-4 mx-16 h-[30rem]'>
  //  <Skeleton className="w-[75%] rounded-3xl  relative h-96" />
  //  <Skeleton className="flex w-[25%] h-96 gap-4" />
  //</div>
  {/* Categories Skeleton */ }
  //<div className="mb-12 ">
  //  <Skeleton className="h-8 w-48 mb-6" />
  //  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  //    {[1, 2, 3, 4, 5, 6].map((item) => (
  //      <Skeleton key={item} className="h-24 w-full rounded-xl" />
  //    ))}
  //  </div>
  //</div>

  {/* Featured Products Skeleton */ }
  //<div className="mb-12">
  //  <Skeleton className="h-8 w-48 mb-6" />
  //  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
  //      <div key={item} className="space-y-4">
  //        <Skeleton className="h-64 w-full rounded-xl" />
  //        <Skeleton className="h-4 w-3/4" />
  //<Skeleton className="h-4 w-1/2" />
  //<Skeleton className="h-8 w-32" />
  //</div>
  //))}
  //</div>
  //</div>

  {/* Featured Stores Skeleton */ }
  //<div>
  //  <Skeleton className="h-8 w-48 mb-6" />
  //  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //    {[1, 2, 3].map((item) => (
  //      <div key={item} className="space-y-4">
  //        <Skeleton className="h-40 w-full rounded-xl" />
  //        <Skeleton className="h-16 w-16 rounded-full -mt-8 ml-6" />
  //        <div className="space-y-2">
  //          <Skeleton className="h-4 w-3/4" />
  //          <Skeleton className="h-4 w-1/2" />
  //        </div>
  //</div>
  //))}
  //</div>
  //</div>
  //</div>
  //);
  //}

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <section className='overflow-hidden'>
         <TopBar />
        
        <Header />
        <GenderNavigationMobile />
        <StoreHero />

        <StoreStories title={`Boutiques`} description={`Découvrez nos meilleures boutiques`} shops={shops} isLoading={isLoading} />
        <PremiumProducts />
        <CategoryGridList categories={categories} isLoading={isLoadingCategories} title={`Navigation par catégorie`} />
      
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
