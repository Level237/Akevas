import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Clock, ShoppingBag, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import shoes from "../../assets/shoes1.webp"
interface Store {
  id: string;
  code: string;
  coverImage: string;
  rating: number;
  totalSales: number;
  productCount: number;
  joinedDate: string;
  badges: string[];
  isVerified: boolean;
  isFeatured: boolean;
  category: string;
}

// Mock data - À remplacer par les données réelles de l'API
const featuredStores: Store[] = [
  {
    id: '1',
    code: 'JP_STORE_8472',
    coverImage: shoes,
    rating: 4.8,
    totalSales: 1250,
    productCount: 89,
    joinedDate: '2024-06',
    badges: ['Premium', 'Top Seller'],
    isVerified: true,
    isFeatured: true,
    category: 'Manga & Anime'
  },
  {
    id: '2',
    code: 'ANIME_COLL_9234',
    coverImage: shoes,
    rating: 4.9,
    totalSales: 2100,
    productCount: 156,
    joinedDate: '2024-03',
    badges: ['Premium', 'Fast Shipper'],
    isVerified: true,
    isFeatured: true,
    category: 'Figurines'
  },
  {
    id: '3',
    code: 'COSPLAY_6390',
    coverImage: shoes,
    rating: 4.7,
    totalSales: 890,
    productCount: 67,
    joinedDate: '2024-08',
    badges: ['Premium'],
    isVerified: true,
    isFeatured: true,
    category: 'Cosplay'
  },
  {
    id: '4',
    code: 'KAWAII_5823',
    coverImage: shoes,
    rating: 4.6,
    totalSales: 750,
    productCount: 94,
    joinedDate: '2024-07',
    badges: ['Premium', 'New Arrival'],
    isVerified: true,
    isFeatured: true,
    category: 'Accessoires'
  },
  {
    id: '5',
    code: 'OTAKU_7456',
    coverImage: shoes,
    rating: 4.9,
    totalSales: 1800,
    productCount: 123,
    joinedDate: '2024-04',
    badges: ['Premium', 'Top Rated'],
    isVerified: true,
    isFeatured: true,
    category: 'Vêtements'
  },
  {
    id: '6',
    code: 'SUGOI_4289',
    coverImage: shoes,
    rating: 4.8,
    totalSales: 1400,
    productCount: 78,
    joinedDate: '2024-05',
    badges: ['Premium', 'Trending'],
    isVerified: true,
    isFeatured: true,
    category: 'Lifestyle'
  }
];

const FeaturedStores: React.FC = () => {
  return (
    <section className="py-16 bg-[#6e0a13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Boutiques Premium
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              Découvrez notre sélection de boutiques premium, reconnues pour leur excellence 
              et leur engagement envers la qualité.
            </p>
          </motion.div>
        </div>

        {/* Grille des boutiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/store/${store.code}`}
                className="block group"
              >
                <div className="bg-gray-600 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {/* Image de couverture */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={store.coverImage}
                      alt={store.code}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                      {store.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-900"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    {/* Code boutique */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                          {store.code}
                        </h3>
                        {store.isVerified && (
                          <Shield className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-white mt-1">
                        {store.category}
                      </p>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white">
                            {store.rating} / 5.0
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-white">
                            {store.productCount} produits
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-white">
                            {store.totalSales} ventes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-white">
                            Depuis {store.joinedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div className="mt-6">
                      <div className=" bg-[#ed7e0f] text-white rounded-xl py-2.5 px-4 text-center text-sm font-medium transition-colors duration-300">
                        Visiter la boutique
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bannière d'inscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-[#ed7e0f] rounded-2xl overflow-hidden"
        >
          <div className="px-8 py-12 text-center text-white">
            <Award className="w-12 h-12 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">
              Devenez une boutique Premium
            </h3>
            <p className="mb-8 max-w-2xl mx-auto">
              Rejoignez nos boutiques premium et bénéficiez d'une visibilité accrue, 
              d'outils exclusifs et d'un support prioritaire.
            </p>
            <Link
              to="/seller/premium"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              En savoir plus
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedStores;
