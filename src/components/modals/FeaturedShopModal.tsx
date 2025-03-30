import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, BadgeCheck, Shield, Heart, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import AsyncLink from '../ui/AsyncLink';
import img from "../../assets/dress.jpg";

interface FeaturedShopModalProps {
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

const FeaturedShopModal: React.FC<FeaturedShopModalProps> = ({ onClose }) => {
  

  return (
    
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999999]"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-[99999999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 30 }}
              className="w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-xl relative"
            >
              {/* Header */}
              <div className="relative">
                {/* Cover Image with Gradient Overlay */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={featuredShop.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Shop Info Card */}
                <div className="absolute -bottom-20 w-full px-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo with Border Gradient */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-br from-orange-400 to-pink-500">
                        <div className="w-full h-full rounded-2xl overflow-hidden">
                          <img
                            src={featuredShop.logo}
                            alt={featuredShop.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Shop Info */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {featuredShop.name}
                          </h2>
                          <BadgeCheck className="w-5 h-5 text-[#ed7e0f]" />
                          {featuredShop.isPremium && (
                            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5" />
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {featuredShop.location}
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {featuredShop.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 pt-28 pb-8">
                {/* Stats with Hover Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-3 gap-6 mb-8"
                >
                  {[
                    { label: "Followers", value: featuredShop.followers },
                    { label: "Produits", value: featuredShop.productsCount },
                    { label: "Satisfaction", value: featuredShop.stats.satisfactionRate }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {featuredShop.description}
                  </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-3"
                >
                  <AsyncLink to={`/stores/${featuredShop.id}`}>
                    <Button 
                      size="lg"
                      className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white group px-6"
                    >
                      <span className="flex items-center justify-center">
                        Visiter la boutique
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </AsyncLink>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 border-2 hover:bg-pink-50 group"
                  >
                    <Heart className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
    
  );
};

export default FeaturedShopModal;
