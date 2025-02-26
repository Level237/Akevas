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
  Lock,
} from 'lucide-react';

import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetProductByUrlQuery } from '@/services/guardService';
const ProductDetailPage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { data: { data: product } = {}, isLoading } = useGetProductByUrlQuery(url);
  console.log(product)


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="">
        {/* Fil d'Ariane */}
        <nav className="flex max-sm:mx-9 items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Accueil</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{product?.product_name}</span>
        </nav>

        {!isLoading && product && (
          <div className="grid grid-cols-1 sticky lg:grid-cols-12 gap-2">

            {/* Colonne gauche - Images */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <div className="bg-white flex items-start gap-6 rounded-2xl shadow-sm p-4">
                  <div className="flex flex-col w-56 gap-4">
                    <button
                      className={`aspect-square rounded-lg overflow-hidden border-2
                        ${selectedImage === null ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20' : 'border-transparent'}`}
                      onClick={() => setSelectedImage(null)}
                    >
                      <img
                        src={product.product_profile}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {product.product_images.map((image: { path: string }, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2
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

                </div>
              </div>
            </div>

            {/* Colonne centrale - Informations produit */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                {/* En-tête du produit */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                      Premium
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      En stock
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
                  <span className="text-4xl font-bold text-[#ed7e0f]">
                    {product.product_price} FCFA
                  </span>
                  {/* Description courte */}
                  <p className="text-gray-600 line-clamp-3">{product.product_description}</p>

                  {/* Prix et réduction avec design modernisé */}
                  <div className=" p-4 rounded-xl">
                    <div className="flex items-baseline gap-2">

                      {product.original_price && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            {product.original_price} FCFA
                          </span>
                          <span className="px-2 py-1 text-sm font-bold text-white bg-red-500 rounded">
                            -{Math.round((1 - product.product_price / product.original_price) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center gap-6 py-4 border-b">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">4.8</span>
                      <span className="ml-1 text-gray-500">(128 avis)</span>
                    </div>
                    <div className="text-gray-500">1250+ vendus</div>
                    <div className="text-gray-500">Code: {product.shop_key}</div>
                  </div>

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-6">
                      {Object.entries(product.variants).map(([type, options]) => (
                        <div key={type} className="space-y-3">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-700">{type}</h3>
                            {selectedVariant && (
                              <span className="text-sm text-gray-500">
                                Sélectionné: {options.find((opt: any) => opt.id === selectedVariant)?.name}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {options.map((option: any) => (
                              <button
                                key={option.id}
                                onClick={() => setSelectedVariant(option.id)}
                                className={`relative p-3 rounded-lg border-2 transition-all
                                  ${selectedVariant === option.id
                                    ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                                    : 'border-gray-200 hover:border-[#ed7e0f]/50'
                                  }`}
                              >
                                {option.image && (
                                  <img
                                    src={option.image}
                                    alt={option.name}
                                    className="w-full aspect-square object-cover rounded mb-2"
                                  />
                                )}
                                <span className={`text-sm ${selectedVariant === option.id ? 'text-[#ed7e0f]' : 'text-gray-700'}`}>
                                  {option.name}
                                </span>
                                {selectedVariant === option.id && (
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#ed7e0f] rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantité et Stock */}
                  <div className="flex items-center justify-between py-4 border-t border-b">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Quantité</span>
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center border-x"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {product.stock && (
                      <span className="text-sm text-gray-500">
                        Stock disponible: {product.stock} unités
                      </span>
                    )}
                  </div>
                </div>


                {/* Livraison et garantie */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Livraison gratuite</p>
                      <p className="text-sm text-gray-500">Livraison estimée : 3-5 jours ouvrés</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#ed7e0f] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Garantie premium</p>
                      <p className="text-sm text-gray-500">30 jours satisfait ou remboursé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Sticky avec informations de livraison et CTA */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="space-y-4">
                    {/* Informations essentielles */}
                    <div className="space-y-3 text-sm">
                      {/* Vendeur */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        Vendu par : <img src={product.shop_profile} alt="" className="w-5 h-5 rounded-full" />
                        <span className="text-gray-600">{product.shop_key || "CRTORRS S..."}</span>
                      </div>

                      {/* Livraison */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Livraison: 7-15 jours</span>
                      </div>

                      {/* Prix de livraison */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <span className="text-gray-600">Frais de livraison</span>
                        <span className="font-medium">XAF52,692</span>
                      </div>

                      {/* Sécurité */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Paiement sécurisé</span>
                      </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t my-4"></div>

                    {/* Prix total */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="text-2xl font-bold text-[#ed7e0f] mt-1">
                        {product.product_price} FCFA
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 mt-6">
                      <button className="w-full bg-[#ed7e0f] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors">
                        Acheter maintenant
                      </button>
                      <button className="w-full bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description et avis */}
        {!isLoading && product && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm">
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
                  <div className="space-y-8">
                    {/* Résumé des avis */}
                    <div className="flex gap-8 p-6 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">4.8</div>
                        <div className="flex items-center justify-center text-yellow-400 my-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">Basé sur 128 avis</div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2 mb-2">
                            <span className="w-8 text-sm text-gray-600">{stars}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}` }}
                              />
                            </div>
                            <span className="w-8 text-sm text-gray-600">
                              {stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Liste des avis */}
                    <div className="space-y-6">
                      {/* ... existing reviews ... */}
                    </div>

                    {/* Formulaire d'avis */}
                    <div className="border-t pt-8 mt-8">
                      <h3 className="text-lg font-semibold mb-4">Donnez votre avis</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                          <div className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                className="text-gray-300 hover:text-yellow-400"
                              >
                                <Star className="w-8 h-8 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Votre commentaire
                          </label>
                          <textarea
                            rows={4}
                            className="w-full rounded-lg border-gray-200 resize-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f]"
                            placeholder="Partagez votre expérience avec ce produit..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
                        >
                          Publier mon avis
                        </button>
                      </form>
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

