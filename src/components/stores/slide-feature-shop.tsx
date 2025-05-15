import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import StoreCard from './store-card'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination, Autoplay, Virtual } from 'swiper/modules';
import { Shop } from '../../types/shop';
import ModalShop from './Modal-Shop';
import { Skeleton } from '@/components/ui/skeleton';

const SlideFeatureShop = ({ shops, isLoading }: { shops: Shop[], isLoading: boolean }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopId, setShopId] = useState<string>("");

    const handleModalOpen = useCallback((id: string) => {
        setIsModalOpen(true);
        setShopId(id);
    }, []);

    const renderSkeletons = useMemo(() => (
        Array(4).fill(0).map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`} virtualIndex={index}>
                <motion.div 
                    className="snap-start p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
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
        if (isLoading) return renderSkeletons;
        
        return shops.map((shop: Shop, index: number) => (
            <SwiperSlide key={shop.shop_id} virtualIndex={index}>
                <StoreCard 
                    shop={shop} 
                    openModal={() => handleModalOpen(shop.shop_id)} 
                />
            </SwiperSlide>
        ));
    }, [shops, isLoading, handleModalOpen]);

    const swiperConfig = useMemo(() => ({
        modules: [Navigation, Pagination, Autoplay, Virtual],
        spaceBetween: 1,
        slidesPerView: 1,
        effect: "slide",
        virtual: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: { clickable: true },
        autoplay: { 
            delay: 3000,
            disableOnInteraction: false
        },
        breakpoints: {
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 4 },
        },
        preloadImages: false,
        lazy: true,
        watchSlidesProgress: true,
        updateOnWindowResize: true
    }), []);

    return (
        <div className="relative max-sm:mt-0 mt-12">
            <div className="swiper-button-prev" style={{ left: '10px' }}>
                <ArrowLeft />
            </div>
            <div className="swiper-button-next" style={{ right: '10px' }}>
                <ArrowRight />
            </div>
            
            <Swiper
                {...swiperConfig}
                style={{ width: '100%' }}
                className='h-[450px] max-sm:h-[350px]'
            >
                {renderShops}
            </Swiper>

            <div className="flex justify-center items-center">
                <AnimatePresence>
                    <ModalShop 
                        isModalOpen={isModalOpen} 
                        setIsModalOpen={setIsModalOpen} 
                        shopId={shopId} 
                    />
                </AnimatePresence>
            </div>
        </div>
    );
};

SlideFeatureShop.displayName = 'SlideFeatureShop';
export default React.memo(SlideFeatureShop);
