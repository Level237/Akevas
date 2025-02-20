import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowRight,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react';
import shoes from "../assets/shoes1.webp"
import dress from "../assets/dress.jpg"
import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetProductByUrlQuery } from '@/services/guardService';
const ProductDetailPage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
   const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const { data:{data:product}={},isLoading } = useGetProductByUrlQuery(url);
  console.log(product)


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto max-sm:mx-0 px-4 max-sm:px-0 py-8">
        {/* Fil d'Ariane */}
        <nav className="flex max-sm:mx-9 items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Accueil</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <a href="/category/figurines" className="hover:text-gray-900">Figurines</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">Demon Slayer</span>
        </nav>

        {/* Section principale */}

        {!isLoading && product && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-8 p-8">
            {/* Galerie d'images */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <motion.img
                  key={selectedImage}
                 src={selectedImage === null ? product.product_profile : product.product_images[selectedImage].path}
                  alt={product.product_name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                 <button
                      className={`aspect-square rounded-lg overflow-hidden border-2 shadow-sm hover:shadow-md transition-all
                        ${selectedImage === null ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20' : 'border-transparent'}`}
                      onClick={() => setSelectedImage(null)}
                    >
                      <img
                        src={product.product_profile}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                {product.product_images.map((image:string, idx:number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors
                      ${selectedImage === idx ? 'border-[#ed7e0f]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img
                      src={image.path}
                      alt={`${product.product_name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informations produit */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                    Premium
                  </span>
                  <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.product_name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 font-medium">12</span>
                    <span className="ml-1 text-gray-500">
                      (12 avis)
                    </span>
                  </div>
                  <span className="text-gray-500">
                    Code: {product.shop_key}
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.product_price} FCFA
                  </span>
                
                </div>


                {/* Quantité et ajout au panier */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">
                      {product.product_quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>

                  <button className="flex-1 bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
                    Ajouter au panier
                  </button>
                </div>

                {/* Informations de livraison */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Livraison gratuite
                      </p>
                      <p className="text-sm text-gray-500">
                        Livraison estimée : 3-5 jours ouvrés
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#ed7e0f]" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Garantie premium
                      </p>
                      <p className="text-sm text-gray-500">
                        30 jours satisfait ou remboursé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets d'information */}
          <div className="border-t">
            <div className="flex border-b">
              <button
                onClick={() => setSelectedTab('description')}
                className={`px-8 py-4 font-medium text-sm transition-colors relative
                  ${selectedTab === 'description' ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Description
                {selectedTab === 'description' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                  />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('specifications')}
                className={`px-8 py-4 font-medium text-sm transition-colors relative
                  ${selectedTab === 'specifications' ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Spécifications
                {selectedTab === 'specifications' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                  />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`px-8 py-4 font-medium text-sm transition-colors relative
                  ${selectedTab === 'reviews' ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Avis ({product.reviewCount})
                {selectedTab === 'reviews' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                  />
                )}
              </button>
            </div>

            <div className="p-8">
              {selectedTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">
                    {product.product_description}
                  </p>
                </div>
              )}

              {selectedTab === 'specifications' && (
                <div className="grid grid-cols-2 gap-6">
                 
                    <div
                      
                      className="flex items-center justify-between py-3 border-b"
                    >
                      <span className="text-gray-600">12</span>
                      <span className="font-medium text-gray-900">
                        12
                      </span>
                    </div>

                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
            
                    <div
                      key={12}
                      className="border-b last:border-0 pb-6 mb-6 last:pb-0 last:mb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              level
                            </span>
                            <div className="flex items-center text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            12
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900">
                            <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">12</span>
                          </button>
                          <button className="text-gray-500 hover:text-gray-900">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">12</p>

                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </main>
      <MobileNav />
    </div>
  );
};

export default ProductDetailPage;
