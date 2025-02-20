import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ShoppingBag, Clock, Heart, MapPin, Badge, X, UserPlus, ArrowLeft, ArrowRight } from 'lucide-react'
import { StoreCard } from './store-card'    
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Separator } from '@/components/ui/separator';
import shoes from "../../assets/shoes1.webp"
import shirt from "../../assets/dress.jpg"
import { Button } from '@/components/ui/button';
import AsyncLink from '@/components/ui/AsyncLink';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { StoreBadges } from '../seller/store-badge';
import { useGetHomeShopsQuery } from '../../services/guardService';
import { Shop } from '../../types/shop';
import ModalShop from './Modal-Shop';
import { Skeleton } from '@/components/ui/skeleton';





  

export default function SlideFeatureShop({shops,isLoading}:{shops:Shop[],isLoading:boolean}) {
    
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [shopId, setShopId] = useState<string>("")

    const renderSkeletons = () => (
        Array(4).fill(0).map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
                <motion.div className="snap-start p-4">
                    <div className="border rounded-lg border-none p-4 space-y-3">
                        <Skeleton className="h-[200px] bg-gray-200 w-full rounded-lg" />
                        <Skeleton className="h-4 w-2/3 bg-gray-200" />
                        <Skeleton className="h-4 w-1/2 bg-gray-200" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 bg-gray-200 rounded-full" />
                            <Skeleton className="h-8 w-24 bg-gray-200" />
                        </div>
                    </div>
                </motion.div>
            </SwiperSlide>
        ))
    )

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
                        {isLoading ? renderSkeletons() : shops?.map((store:Shop,index:number) => (
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
