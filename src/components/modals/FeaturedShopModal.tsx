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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999999]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[99999999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed left-1/2 max-md:inset-x-0 right-1/2 inset-0 top-[5%] z-[999] h-[86%] mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl md:inset-x-auto"
            >
              <div className="grid max-sm:flex max-sm:flex-col md:grid-cols-2 h-full">
                {/* Left Column - Cover and Products */}
                <div className="relative h-full bg-gray-100">
                  {/* Cover Image */}
                  <div className="relative max-h-[100%] h-[100%]">
                    <img
                      src={featuredShop.coverImage}
                      alt={featuredShop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    
                    {featuredShop.isPremium && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Boutique Premium
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Featured Products */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-6">
                    <h3 className="text-white font-medium mb-4">Produits populaires</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {featuredShop.featuredProducts.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                          <div className="relative aspect-square rounded-lg overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                          </div>
                          <div className="mt-2">
                            <p className="text-white text-sm truncate">{product.name}</p>
                            <p className="text-white/80 text-sm font-medium">{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Shop Info */}
                <div className="p-8 overflow-y-auto">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 max-sm:bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Shop Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                      <img
                        src={featuredShop.logo}
                        alt={featuredShop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {featuredShop.name}
                        </h2>
                        <BadgeCheck className="w-6 h-6 text-[#ed7e0f]" />
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {featuredShop.location}
                      </div>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-lg font-bold text-gray-900">{featuredShop.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">Note</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="font-semibold">{featuredShop.productsCount}</p>
                      <p className="text-xs text-gray-500">Produits</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="font-semibold">{featuredShop.followers}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="font-semibold">{featuredShop.stats.satisfactionRate}</p>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    {featuredShop.description}
                  </p>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredShop.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3">
                    <AsyncLink to={`/stores/${featuredShop.id}`} className="flex-1">
                      <Button 
                        size="lg"
                        className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-lg group"
                      >
                        Visiter la boutique
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </AsyncLink>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Heart className="w-5 h-5" />
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
