import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import StoreCard from './store-card'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';


import { Shop } from '../../types/shop';
import ModalShop from './Modal-Shop';
import { Skeleton } from '@/components/ui/skeleton';







const SlideFeatureShop = ({ shops, isLoading }: { shops: Shop[], isLoading: boolean }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopId, setShopId] = useState<string>("");

    const renderSkeletons = useMemo(() => (
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
    ), []);

    const renderShops = useMemo(() => {
        return !isLoading ? shops.map((shop: Shop, index: number) => (
            <SwiperSlide key={shop.shop_id} virtualIndex={index}>
               
                    <StoreCard shop={shop} openModal={() => { setIsModalOpen(true); setShopId(shop.shop_id) }} />
                
            </SwiperSlide>
        )) : renderSkeletons;
    }, [shops, isLoading]);

    return (
        <div className="relative mt-12">
            <div className="swiper-button-prev" style={{ left: '10px' }}><ArrowLeft /></div>
            <div className="swiper-button-next" style={{ right: '10px' }}><ArrowRight /></div>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
               
                spaceBetween={1}
                slidesPerView={1}
                effect="slide"
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
                
            >
                
                    {renderShops}
                
            </Swiper>
            <div className="flex justify-center items-center">
                <AnimatePresence>
                    <ModalShop isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} shopId={shopId} />
                </AnimatePresence>
            </div>
        </div>
    );
};

SlideFeatureShop.displayName = 'SlideFeatureShop';
export default React.memo(SlideFeatureShop);
