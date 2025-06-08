
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetCurrentHomeByGenderQuery } from '@/services/guardService';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreStories from '@/components/stores/store-stories';
import ProductListGrid from '@/components/products/ProductListGrid';
import GenderNavigationMobile from '@/components/categories/GenderNavigationMobile';
import CategoryShowcaseDual from '@/components/categories/CategoryShowcaseDual';
import OptimizedImage from '@/components/OptimizedImage';
import { SectionHeader } from '@/components/products/PremiumProducts';
import FloatingHelpButton from '@/components/ui/FloatingHelpButton';
import InstallButton from '@/components/InstallButton';
  const CurrentHomeByGenderPage = () => {
    const [currentGenderId,setCurrentGenderId]=useState<number>(0)
    const {data:{data:currentGender}={},isLoading}=useGetCurrentHomeByGenderQuery(currentGenderId)
    console.log(currentGender)
    const [searchParams]=useSearchParams();
    const searchGenderId=searchParams.get("g");
    
    useEffect(()=>{
        if(searchGenderId==="homme"){
            setCurrentGenderId(1)
        }else if(searchGenderId==="femme"){
        setCurrentGenderId(2)
    }else{
        setCurrentGenderId(3)
    }
    },[searchGenderId])
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />
      <GenderNavigationMobile />
      <MobileNav />

      {/* Hero Section */}
      {!isLoading &&       <div className="relative h-[400px]">
        <div className="absolute inset-0">
          <OptimizedImage 
            src={currentGender?.gender_profile}
            alt=                                                                                                                                                    {currentGender.gender_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl max-sm:text-3xl font-bold mb-4">Collection {currentGender.gender_name}</h1>
            <p className="text-xl max-sm:text-sm opacity-90">
              {currentGender.gender_description}
            </p>
          </div>
        </div>
      </div>}
        <div className='mt-12'>
            <StoreStories shops={currentGender?.shops} isLoading={isLoading} title={`Boutiques ${currentGender?.gender_name}`} description={`Découvrez nos meilleures boutiques ${currentGender?.gender_name}`} />
        </div>  
              {/* Tendances du moment */}
      <div className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
        <SectionHeader title={`Produits ${currentGender?.gender_name}`} description={`Découvrez nos meilleurs produits ${currentGender?.gender_name}`} />
          
          <ProductListGrid products={currentGender?.products} isLoading={isLoading} />
        </div>
      </div>
      {/* Catégories populaires */}
      <CategoryShowcaseDual categories={currentGender?.categories} isLoading={isLoading} title="Catégories" titleCategory={`Découvrez nos catégories ${currentGender?.gender_name}`} />

      <InstallButton/>

      {/* Newsletter */}
      <FloatingHelpButton />
    </div>
  );
};


export default CurrentHomeByGenderPage; 