import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, BadgeCheck, Shield, Heart, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import AsyncLink from '../ui/AsyncLink';
import img from "../../assets/dress.jpg";

interface FeaturedShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const featuredShop = {
  id: 'featured-1',
  name: 'Fashion Hub',
  logo: img,
  coverImage: img,
  rating: '4.8',
  location: 'Paris, France',
  productsCount: 1250,
  isPremium: true,
  description: 'Découvrez notre collection exclusive de vêtements et accessoires tendance. Des pièces uniques sélectionnées avec soin pour vous démarquer.',
  followers: 2800,
  categories: ['Mode', 'Accessoires', 'Luxe'],
  stats: {
    totalSales: 15000,
    responseTime: '< 1 heure',
    satisfactionRate: '98%'
  },
  featuredProducts: [
    { id: 1, name: 'Robe d\'été fleurie', price: '89,99 €', image: img },
    { id: 2, name: 'Sac à main en cuir', price: '129,99 €', image: img },
    { id: 3, name: 'Escarpins noirs', price: '99,99 €', image: img },
    { id: 4, name: 'Blazer blanc', price: '149,99 €', image: img },
  ]
};

const FeaturedShopModal: React.FC<FeaturedShopModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[99999999]"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[99999999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-3xl mx-auto bg-white rounded-[2rem] overflow-hidden shadow-2xl relative"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Column - Shop Identity */}
                <div className="md:w-[45%] relative bg-gradient-to-br from-[#ed7e0f]/10 to-orange-50 p-8">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  {/* Shop Logo and Basic Info */}
                  <div className="flex flex-col items-center text-center pt-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6"
                    >
                      <img
                        src={featuredShop.logo}
                        alt={featuredShop.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {featuredShop.name}
                        </h2>
                        <BadgeCheck className="w-6 h-6 text-[#ed7e0f]" />
                      </div>

                      <div className="flex items-center justify-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {featuredShop.location}
                      </div>

                      {featuredShop.isPremium && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 rounded-full">
                          <Shield className="w-3.5 h-3.5" />
                          Premium
                        </span>
                      )}
                    </motion.div>
                  </div>

                  {/* Rating Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-8 bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-2xl font-bold text-gray-900">{featuredShop.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Note moyenne</p>
                  </motion.div>
                </div>

                {/* Right Column - Shop Details */}
                <div className="md:w-[55%] p-8 bg-white">
                  {/* Stats Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                  >
                    <div className="text-center p-4 rounded-2xl bg-gray-50">
                      <p className="text-lg font-bold text-gray-900">{featuredShop.followers}</p>
                      <p className="text-sm text-gray-500">Followers</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gray-50">
                      <p className="text-lg font-bold text-gray-900">{featuredShop.productsCount}</p>
                      <p className="text-sm text-gray-500">Produits</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gray-50">
                      <p className="text-lg font-bold text-gray-900">{featuredShop.stats.satisfactionRate}</p>
                      <p className="text-sm text-gray-500">Satisfaction</p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">À propos</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {featuredShop.description}
                    </p>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mt-8"
                  >
                    <AsyncLink to={`/stores/${featuredShop.id}`} className="flex-1">
                      <Button 
                        size="lg"
                        className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Visiter la boutique
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </AsyncLink>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 border-2 hover:bg-pink-50 group"
                      >
                        <Heart className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeaturedShopModal;
