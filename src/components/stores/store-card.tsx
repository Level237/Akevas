

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBag } from 'lucide-react'
import { motion } from "framer-motion"
import React, { useState } from "react"
import { Shop } from "../../types/shop"
interface StoreCardProps {
  shop: Shop
  openModal: () => void
}

const StoreCard = ({
  shop,
  openModal
}: StoreCardProps) => {

  const [showOverlay] = useState(false)



  return (
    <motion.div
      className="w-[300px] max-sm:w-[100%] max-sm:h-[300px] h-[400px] relative rounded-2xl overflow-hidden cursor-pointer"
      onClick={openModal}
    >
      {/* Image de fond avec un effet de zoom au hover */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        animate={{ scale: showOverlay ? 1.1 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ backgroundImage: `url(${shop.shop_profile})` }}
      />

      {/* Overlay gradient sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Badges avec animation */}
      <motion.div

      >

        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
          Premium
        </Badge>


      </motion.div>

      {/* Contenu principal */}
      <motion.div
        className="absolute bottom-0 w-full p-6 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">{shop.shop_key}</h3>
          <p className="text-gray-300 text-sm">{shop.categories[0].category_name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{shop.review_average}</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Note moyenne</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">{shop.products_count}</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Ventes totales</p>
          </div>
        </div>

        <Button
          className="w-full bg-[#ed702d] border-0 text-white font-medium"
        >
          Découvrir la boutique
        </Button>
      </motion.div>
    </motion.div>

  )
}
StoreCard.displayName = 'StoreCard';
export default React.memo(StoreCard);
