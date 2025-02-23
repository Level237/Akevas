
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetCurrentHomeByGenderQuery } from '@/services/guardService';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreStories from '@/components/stores/store-stories';
import ProductListGrid from '@/components/products/ProductListGrid';
import { ChevronRight } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';
import CategoryGridList from '@/components/categories/CategoryGridList';
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
      <MobileNav />

      {/* Hero Section */}
      {!isLoading &&       <div className="relative h-[400px]">
        <div className="absolute inset-0">
          <img 
            src={currentGender.gender_profile} 
            alt=                                                                                                                                                    {currentGender.gender_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Collection-{currentGender.gender_name}</h1>
            <p className="text-xl opacity-90">
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
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-2xl font-bold text-black">Tendances du moment</h2>
            <AsyncLink
              to={`/products?g=${currentGender?.gender_name}`}
              className="text-black flex items-center text-sm hover:underline"
            >
              Voir tous les produits
              <ChevronRight className="ml-1 h-4 w-4" />
            </AsyncLink>
          </div>
          <ProductListGrid products={currentGender?.products} isLoading={isLoading} />
        </div>
      </div>
      {/* Catégories populaires */}
      <CategoryGridList title='Catégories populaires' categories={currentGender?.categories} isLoading={isLoading} />



      {/* Newsletter */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Restez informé</h2>
          <p className="text-gray-600 mb-6">
            Inscrivez-vous à notre newsletter pour recevoir nos dernières offres
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Votre email" 
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
            />
            <button className="bg-[#ed7e0f] text-white px-6 py-2 rounded-lg hover:bg-[#ed7e0f]/90">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CurrentHomeByGenderPage; 