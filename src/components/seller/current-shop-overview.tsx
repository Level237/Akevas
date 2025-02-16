import { Seller } from '@/types/seller'

import dress from "../../assets/dress.jpg"
import shoes from "../../assets/shoes1.webp"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Package,
  Clock,
  Shield,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  UserPlus,
  Users,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';


interface StoreProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
}

interface StoreReview {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  date: string;
  rating: number;
  comment: string;
}
interface StoreCategory {
  id: string;
  name: string;
  count: number;
  products: StoreProduct[];
}
export default function CurrentShopOverView({shop}:{shop:Seller}) {
  

  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'|'categories'|'all'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const store = {
    code: 'JP_STORE_8472',
    name: 'Anime Collection Store',
    description: 'Votre boutique spécialisée en figurines et produits dérivés d\'anime.',
    coverImage: dress,
    logo: dress,
    rating: 4.8,
    reviewCount: 256,
    productsCount: 189,
    joinDate: '2024-01',
    location: 'Paris, France',
    isPremium: true,
    categories: [
      {
        id: 'figurines',
        name: 'Figurines',
        count: 78,
        products: Array.from({ length: 12 }, (_, i) => ({
          id: `fig-${i}`,
          name: `Figurine Collector ${i + 1}`,
          price: 99.99 + i * 10,
          image: shoes,
          category: 'Figurines',
          rating: 4.5,
          reviewCount: 24,
          isPremium: i % 3 === 0
        }))
      },
      // Ajoutez plus de catégories
    ] as StoreCategory[],
    stats: {
      totalSales: 1250,
      averageShipping: '2-3 jours',
      satisfactionRate: '98%'
    },
    openingHours: [
      { day: 'Lundi', hours: '10h - 19h' },
      { day: 'Mardi', hours: '10h - 19h' },
      { day: 'Mercredi', hours: '10h - 19h' },
      { day: 'Jeudi', hours: '10h - 19h' },
      { day: 'Vendredi', hours: '10h - 19h' },
      { day: 'Samedi', hours: '10h - 19h' },
      { day: 'Dimanche', hours: 'Fermé' }
    ],
    phone: '+33 6 12 34 56 78',
    email: 'contact@animecollection.store',
    address: '123 rue de la République, 75001 Paris, France'
  };

  const reviews: StoreReview[] = [
    {
      id: 'review-1',
      userId: 'user-1',
      userName: 'John Doe',
      userImage: 'https://picsum.photos/200/300',
      date: '2024-03-12',
      rating: 5,
      comment: 'Très bonne boutique ! Les produits sont de qualité et les prix sont raisonnables.'
    },
    {
      id: 'review-2',
      userId: 'user-2',
      userName: 'Jane Doe',
      userImage: 'https://picsum.photos/200/301',
      date: '2024-03-15',
      rating: 4,
      comment: 'Boutique sympa, mais les délais de livraison sont un peu longs.'
    }
  ];
  const products = store.categories.flatMap(cat => cat.products);
  const displayedProducts = selectedCategory
    ? store.categories.find(cat => cat.id === selectedCategory)?.products || []
    : products;
    
  return (
    <div>
        {/* Couverture et informations de la boutique */}
      <div className="relative block max-sm:hidden h-64 bg-gray-900">
        {shop.shop.images?.[0]?.path && (
          <img
            src={shop.shop.images?.[0]?.path}
            alt="Store cover"
            className="w-full h-full object-cover opacity-50"
          />
        )}
       
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white">
              <img
                src={shop.shop.shop_profile || null || undefined}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{shop.shop.shop_key}</h1>
                {store.isPremium && (
                  <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 text-gray-200">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{store.rating}</span>
                  <span className="ml-1">({store.reviewCount} avis)</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-1" />
                  <span>{shop.shop.products_count} produits</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{shop.shop.town}-{shop.shop.quarter}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>Depuis {new Date(shop.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="relative hidden max-sm:block h-[300px] lg:h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${store?.coverImage || '/default-cover.jpg'})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-6 lg:pb-12">
          <div className="flex flex-col lg:flex-row items-start justify-end lg:items-end gap-4 lg:gap-8">
            {/* Store Logo */}
            <div className="w-24  h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden border-4 border-white  lg:mt-0">
              <img
                src={shop.shop.shop_profile|| '/default-logo.jpg'}
                alt="Store logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Store Info */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                {shop.shop.shop_key}
              </h1>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.shop.town}-{shop.shop.quarter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{store?.rating} (120 avis)</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-row lg:flex-row items-center gap-3 w-full lg:w-auto  lg:mt-0">
            <div className="btn-outline flex items-center w-full lg:w-auto">
              <Users className="w-4 h-4 mr-2 text-[#ed7e0f]" />
                <h2 className='text-gray-200 font-bold'>124 followers</h2>
              </div>
              <Button className=" bg-[#ed7e0f] w-full lg:w-auto">
                Suivre
                <UserPlus className="w-4 h-4 ml-2" />
              </Button>
              
            </div>
          </div>
        </div>
      </div>
      <div className="sticky hidden max-sm:block mt-12 top-0 bg-white border-b z-40 lg:relative lg:top-auto">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button 
              className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'products' ? 'border-[#ed7e0f] text-[#ed7e0f]' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('products')}
            >
              Produits
            </button>
            <button 
              className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'about' ? 'border-[#ed7e0f] text-[#ed7e0f]' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('about')}
            >
              À propos
            </button>
            <button 
              className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-[#ed7e0f] text-[#ed7e0f]' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Avis
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container hidden max-sm:block mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`} className="block aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[#ed7e0f] font-semibold">
                      {product.price} €
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-xl p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">À propos de {store?.name}</h2>
              <p className="text-gray-600">{store?.description}</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Horaires d'ouverture</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {store?.openingHours.map((hour, index) => (
                      <div key={index} className="flex justify-between py-1 border-b">
                        <span className="text-gray-600">{hour.day}</span>
                        <span className="font-medium">{hour.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Contact</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {store?.phone}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {store?.email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {store?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={review.userImage}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{review.userName}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
         <main className="max-w-7xl  max-sm:hidden mx-auto px-4 py-8">
        <div className="grid max-sm:grid-cols-1 max-sm:gap-2 grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3 max-sm::col-span-0">
            <div className="bg-white max-sm:w-full rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  À propos de la boutique
                </h2>
                <p className="text-gray-600 mb-6">
                  {shop.shop.shop_description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t">
                    <span className="text-gray-500">Ventes totales</span>
                    <span className="font-medium">{store.stats.totalSales}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t">
                    <span className="text-gray-500">Délai de livraison</span>
                    <span className="font-medium">{store.stats.averageShipping}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t">
                    <span className="text-gray-500">Satisfaction client</span>
                    <span className="font-medium">{store.stats.satisfactionRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#ed7e0f]" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Boutique vérifiée
                    </h3>
                    <p className="text-sm text-gray-500">
                      Vendeur professionnel certifié
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catégories */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Catégories
                </h2>
                <div className="space-y-2">
                  {store.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(
                        category.id === selectedCategory ? null : category.id
                      )}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-colors ${
                        category.id === selectedCategory
                          ? 'bg-[#ed7e0f] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="col-span-9">
            {/* Barre d'outils */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'all'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Tous les produits
                  </button>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'categories'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Par catégories
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filtres</span>
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  {/* Ajoutez vos filtres ici */}
                </motion.div>
              )}
            </div>

            {/* Grille de produits */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {displayedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === 'grid'
                      ? 'bg-white rounded-2xl shadow-sm overflow-hidden'
                      : 'flex gap-6 bg-white rounded-2xl shadow-sm p-4'
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.isPremium && (
                          <div className="absolute top-4 left-4">
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {product.price} €
                          </span>
                          <button className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                            Voir
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-48 h-48">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {product.name}
                          </h3>
                          {product.isPremium && (
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {product.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-bold text-gray-900">
                            {product.price} €
                          </span>
                          <button className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                            Voir le produit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function CurrentShopOverViewSkeleton() {
  return (
    <div>
      {/* En-tête du magasin - Version desktop */}
      <div className="relative block max-sm:hidden h-64 bg-gray-100 animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            {/* Logo du magasin */}
            <div className="w-32 h-32 rounded-xl bg-gray-200" />
            
            <div className="flex-1">
              {/* Nom du magasin */}
              <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
              
              {/* Statistiques */}
              <div className="flex items-center gap-6">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* En-tête du magasin - Version mobile */}
      <div className="relative hidden max-sm:block h-[300px] bg-gray-100 animate-pulse">
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-6">
          <div className="flex flex-col items-start gap-4">
            {/* Logo */}
            <div className="w-24 h-24 rounded-xl bg-gray-200" />
            
            {/* Informations */}
            <div className="w-full">
              <div className="h-6 w-48 bg-gray-200 rounded mb-3" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 w-full">
              <div className="h-10 w-full bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded" />
                ))}
              </div>
            </div>

            {/* Catégories */}
            <div className="mt-6 bg-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-full bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Grille de produits */}
          <div className="col-span-9">
            {/* Barre d'outils */}
            <div className="bg-gray-100 rounded-2xl p-4 mb-6 animate-pulse">
              <div className="flex justify-between">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="h-8 w-32 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Grille de produits */}
            <div className="grid grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                  {/* Image */}
                  <div className="aspect-square bg-gray-200" />
                  
                  {/* Contenu */}
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                      <div className="h-8 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
