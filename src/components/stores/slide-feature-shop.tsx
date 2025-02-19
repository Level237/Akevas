import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ShoppingBag, Clock, Heart, MapPin, Badge, X, UserPlus, ArrowLeft, ArrowRight } from 'lucide-react'
import { StoreCard } from './store-card'    
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Separator } from '../ui/separator';
import shoes from "../../assets/shoes1.webp"
import shirt from "../../assets/dress.jpg"
import { Button } from '../ui/button';
import AsyncLink from '../ui/AsyncLink';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { StoreBadges } from '../seller/store-badge';
import { useGetHomeShopsQuery } from '../../services/guardService';
import { Shop } from '../../types/shop';
import ModalShop from './Modal-Shop';



  const productsWhole=[
    {
      id: 1,
      name: "LED Moon Lamp with Wooden Stand",
      price: 24.99,
      image: shoes,
      rating: 4.5,
      sales: 285
    },
    {
      id: 2,
      name: "Smart LED Strip Lights",
      price: 19.99,
      image: shoes,
      rating: 4.3,
      sales: 152
    },
    {
      id: 3,
      name: "Modern Desk Lamp",
      price: 34.99,
      image: shoes,
      rating: 4.7,
      sales: 98
    },
    {
      id: 4,
      name: "Crystal Table Lamp",
      price: 45.99,
      image: shoes,
      rating: 4.6,
      sales: 167
    }
  ]

  const categories= [
    { id: 1, name: "LED Lights", productCount: 245 },
    { id: 2, name: "Home Decor", productCount: 189 },
    { id: 3, name: "Garden Tools", productCount: 156 },
    { id: 4, name: "Smart Home", productCount: 98 },
  ]
  

export default function SlideFeatureShop() {
    const {data:{data:shops}={},isLoading}=useGetHomeShopsQuery("guard")
    console.log(shops)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [shopId, setShopId] = useState<string>("")
  return (
      
          <div className="relative mt-12">
                   <div className="swiper-button-prev" style={{ left: '10px' }}><ArrowLeft/></div>  
      <div className="swiper-button-next" style={{ right: '10px' }}><ArrowRight/></div>
             <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={1}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 4 },
            }}
            style={{ width: '100%', height: '450px' }}
            className="project-slider"
          >
            <motion.div 
              ref={scrollContainerRef}
              className="flex   overflow-x-hidden snap-x snap-mandatory scrollbar-hide pb-4"
            >
              <AnimatePresence>
                { !isLoading && shops?.map((store:Shop,index:number) => (
                     <SwiperSlide key={index}>

                  <motion.div
                    key={store.shop_id}
                    className="snap-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    
                      <StoreCard shop={store}  openModal={() => { setIsModalOpen(true);setShopId(store.shop_id)}} />
                   
                  </motion.div>
                  </SwiperSlide>
                ))}
              </AnimatePresence>
            </motion.div>
  
            
            </Swiper>
                    <div className="flex justify-center items-center"><AnimatePresence>
<ModalShop isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} shopId={shopId}/>
        
      </AnimatePresence>
  
      </div>
          </div>
  )
}
