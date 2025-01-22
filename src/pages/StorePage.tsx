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
  Phone,
  Mail
} from 'lucide-react';
import Header from '@/components/ui/header';

import MobileNav from '@/components/ui/mobile-nav';

import dress from "../assets/dress.jpg"
import shoes from "../assets/shoes1.webp"
import { Link, ScrollRestoration } from 'react-router-dom';
import TopBar from '@/components/ui/topBar';

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

interface StoreCategory {
  id: string;
  name: string;
  count: number;
  products: StoreProduct[];
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

const StorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
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

  const products = store.categories.flatMap(cat => cat.products);
  const displayedProducts = selectedCategory
    ? store.categories.find(cat => cat.id === selectedCategory)?.products || []
    : products;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />
      
      {/* Store Header - Responsive */}
      <div className="relative h-[300px] lg:h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${store?.coverImage || '/default-cover.jpg'})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-6 lg:pb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 lg:gap-8">
            {/* Store Logo */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden border-4 border-white -mt-12 lg:mt-0">
              <img
                src={store?.logo || '/default-logo.jpg'}
                alt="Store logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Store Info */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                {store?.name}
              </h1>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{store?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{store?.rating} (120 avis)</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              <button className="btn-primary w-full lg:w-auto">
                Suivre
              </button>
              <button className="btn-outline w-full lg:w-auto">
                Contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Sticky on Mobile */}
      <div className="sticky top-0 bg-white border-b z-40 lg:relative lg:top-auto">
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
      <div className="container mx-auto px-4 py-6">
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

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default StorePage;
