import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBag } from 'lucide-react'
import { motion } from "framer-motion"
import React from "react"
import { Shop } from "../../types/shop"
import OptimizedImage from "@/components/OptimizedImage"

interface StoreCardProps {
  shop: Shop
  openModal: () => void
}

const StoreCard = ({
  shop,
  openModal
}: StoreCardProps) => {

  return (
    <motion.div
      className="w-[300px] max-sm:w-[95%] mx-auto max-sm:h-[300px] h-[400px] relative rounded-2xl overflow-hidden cursor-pointer"
      onClick={openModal}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0"
      >
        <OptimizedImage
          src={shop.shop_profile}
          alt={shop.shop_key || 'Shop image'}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <motion.div
        className="absolute top-4 left-4 z-10"
      >
        
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 text-xs sm:text-sm">
            Premium
          </Badge>
        
      </motion.div>

      <motion.div
        className="absolute bottom-0 w-full sm:p-6 p-4 space-y-3 sm:space-y-4 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{shop.shop_key}</h3>
          {shop.categories?.[0]?.category_name && (
            <p className="text-xs sm:text-sm text-gray-300">{shop.categories[0].category_name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/10 rounded-lg p-2 sm:p-3" style={{ backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-1 sm:gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm sm:text-base text-white font-medium">{shop.review_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 sm:mt-1">Note moyenne</p>
          </div>

          <div className="bg-white/10 rounded-lg p-2 sm:p-3" style={{ backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-1 sm:gap-2">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              <span className="text-sm sm:text-base text-white font-medium">{shop.products_count || 0}</span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 sm:mt-1">Ventes totales</p>
          </div>
        </div>

        <Button
          className="w-full bg-[#ed702d] border-0 text-white font-medium text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 mt-2 sm:mt-4"
        >
          Découvrir la boutique
        </Button>
      </motion.div>
    </motion.div>
  )
}
StoreCard.displayName = 'StoreCard';
export default React.memo(StoreCard);
