import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, BadgeCheck, Shield, Heart, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import AsyncLink from '../ui/AsyncLink';
import img from "../../assets/dress.jpg";
import { useGetModalShopQuery } from '@/services/guardService';

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
  const [shouldShow, setShouldShow] = useState(false);
  const {data:shop,isLoading}=useGetModalShopQuery('guard')

  useEffect(() => {
    setShouldShow(true);
  }, []);

  return (
    <AnimatePresence>
      {shouldShow && !isLoading && (
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
              className="w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-xl relative"
            >
              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 h-full">
                {/* Left Column - Visual */}
                <div className="relative">
                  {/* Cover Image */}
                  <div className="h-64 md:h-full relative">
                    <img
                      src={shop.cover.path}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </div>

                  {/* Shop Logo & Basic Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
                        <img
                          src={shop.shop_profile}
                          alt={featuredShop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-semibold text-white">
                            {shop.shop_key}
                          </h2>
                          <BadgeCheck className="w-5 h-5 text-[#ed7e0f]" />
                        </div>
                        <div className="flex items-center gap-3 text-white/90 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {shop.town},{shop.quarter}
                          </div>
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {shop.review_average}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Content */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Premium Badge */}
                  {featuredShop.isPremium && (
                    <div className="mb-6">
                      <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full flex items-center gap-1 w-fit">
                        <Shield className="w-3.5 h-3.5" />
                        Premium
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Followers", value: featuredShop.followers },
                      { label: "Produits", value: shop.products_count },
                      { label: "Satisfaction", value: featuredShop.stats.satisfactionRate }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Catégories</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {shop.categories.map((category:any, index:any) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                        >
                        
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">{category.category_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {shop.shop_description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <AsyncLink to={`/shop/${shop.id}`}>
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
                  </div>
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
