
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetCurrentHomeByGenderQuery } from '@/services/guardService';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
const CurrentHomeByGenderPage = () => {
    const [currentGenderId,setCurrentGenderId]=useState<number>(0)
    const {data:{data:currentGender}={},isLoading,isError}=useGetCurrentHomeByGenderQuery(currentGenderId)
    const [searchParams]=useSearchParams();
    const searchGenderId=searchParams.get("g");
    
    console.log(searchGenderId)
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


      {/* Catégories populaires */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Catégories populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {!isLoading && currentGender.categories.map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <img 
                  src={category.category_profile} 
                  alt={category.category_name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{category.category_name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tendances du moment */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Tendances du moment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative aspect-[3/4] mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir le produit
                  </button>
                </div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">{product.price} €</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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

const categories = [
  { name: 'Vestes', image: '/images/mens-jackets.jpg' },
  { name: 'Chemises', image: '/images/mens-shirts.jpg' },
  { name: 'Chaussures', image: '/images/mens-shoes.jpg' },
  { name: 'Accessoires', image: '/images/mens-accessories.jpg' },
];

const trendingProducts = [
  { id: 1, name: 'Veste en cuir premium', price: 199.99, image: '/images/leather-jacket.jpg' },
  { id: 2, name: 'Chemise oxford bleue', price: 59.99, image: '/images/oxford-shirt.jpg' },
  { id: 3, name: 'Jean slim noir', price: 79.99, image: '/images/black-jeans.jpg' },
  { id: 4, name: 'Sneakers urbaines', price: 89.99, image: '/images/sneakers.jpg' },
];

export default CurrentHomeByGenderPage; 