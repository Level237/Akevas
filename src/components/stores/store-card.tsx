'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBag, Clock } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import shoes from "../../assets/shoes1.webp"
import { useState } from "react"
interface StoreCardProps {
  name: string
  category: string
  rating: number
  sales: number
  products: number
  since: string
  image: string
  isPremium?: boolean
  isTopSeller?: boolean
}

export function StoreCard({
  name,
  category,
  rating,
  sales,
  products,
  since,
  image,
  isPremium,
  isTopSeller
}: StoreCardProps) {

    const [showOverlay,setShowOverlay]=useState(false)
    const [showStore,setShowStore]=useState(false)

  return (
    <motion.div 
      className="relative bg-gray-500 rounded-xl overflow-hidden shadow-lg w-[300px] h-[400px] group"
      whileHover={{ scale: 1.02 }}
      onHoverStart={()=>{setShowOverlay(true);setShowStore(true)}}
      onHoverEnd={()=>{setShowOverlay(false);setShowStore(false)}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${shoes})` }}
      />
      
      {/* Overlay gradient */}
      <motion.div 
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0.3 }}
        whileHover={{ opacity: 0.7 }}
        transition={{ duration: 0.3 }}
      />

      {/* Badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {isPremium && (
          <Badge variant="secondary" className="bg-white/90 text-black">
            Premium
          </Badge>
        )}
        {isTopSeller && (
          <Badge variant="secondary" className="bg-white/90 text-black">
            Top Seller
          </Badge>
        )}
      </div>

      {/* Contenu */}
      <AnimatePresence>

        
     {showOverlay && (
        <motion.div className='absolute inset-0 z-10 flex justify-center items-center'
        initial={{ 
            opacity:0
         }}
         animate={{ 
            opacity:1
          }}

          exit={{ 
            opacity:1
           }}

        >
            <div className='absolute bg-black pointer-events-none opacity-50 h-full w-full'></div>
            
            {showStore &&  <motion.div 
        className="absolute inset-x-0 bottom-0 p-6 text-white"
        initial={{ y: 0 }}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h3 className="font-bold  text-xl mb-2">{name}</h3>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-200 text-sm mb-4">{category}</p>
          
          <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-100">{rating.toFixed(1)}/5.0</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4 text-gray-300" />
              <span className="text-gray-100">{sales} ventes</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4 text-gray-300" />
              <span className="text-gray-100">{products} produits</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-300" />
              <span className="text-gray-100">Depuis {since}</span>
            </div>
          </div>

          <motion.div
            initial={{ y: 0 }}
            whileHover={{  y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Visiter la boutique
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>}
      
        </motion.div>
     )}</AnimatePresence>
     <AnimatePresence>
        {!showOverlay && <div className="absolute inset-x-0 bottom-0 p-6 text-white"><h3 className="font-bold  text-xl mb-2">{name}</h3></div>}
     
     </AnimatePresence>
    </motion.div>
  )
}

