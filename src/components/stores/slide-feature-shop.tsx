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
interface Store {
    id: number
    name: string
    category: string
    rating: number
    sales: number
    products: number
    since: string
    image: string
    isPremium: boolean
    isTopSeller: boolean
    link: string
  }
  const stores: Store[] = [
    {
      id: 1,
      name: "JP_STORE_8472",
      category: "Manga & Anime",
      rating: 4.8,
      sales: 1250,
      products: 89,
      since: "2024-06",
      image: "/placeholder.svg?height=600&width=400",
      isPremium: true,
      isTopSeller: true,
      link: "/stores/jp-store-8472"
    },
    {
      id: 2,
      name: "FASHION_HUB_2024",
      category: "Mode Urbaine",
      rating: 4.6,
      sales: 850,
      products: 120,
      since: "2024-01",
      image: "/placeholder.svg?height=600&width=400",
      isPremium: true,
      isTopSeller: false,
      link: "/stores/fashion-hub"
    },
    {
      id: 3,
      name: "SNEAKER_WORLD",
      category: "Chaussures",
      rating: 4.9,
      sales: 2100,
      products: 75,
      since: "2023-12",
      image: "/placeholder.svg?height=600&width=400",
      isPremium: false,
      isTopSeller: true,
      link: "/stores/sneaker-world"
    },
    {
      id: 4,
      name: "LUXURY_ITEMS",
      category: "Accessoires Luxe",
      rating: 4.7,
      sales: 450,
      products: 45,
      since: "2024-03",
      image: "/placeholder.svg?height=600&width=400",
      isPremium: true,
      isTopSeller: false,
      link: "/stores/luxury-items"
    },
    {
        id: 4,
        name: "LUXURY_ITEMS",
        category: "Accessoires Luxe",
        rating: 4.7,
        sales: 450,
        products: 45,
        since: "2024-03",
        image: "/placeholder.svg?height=600&width=400",
        isPremium: true,
        isTopSeller: false,
        link: "/stores/luxury-items"
      }
  ]

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
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const CustomPrevButton = ({ onClick }: { onClick: () => void }) => (
    <ArrowLeft className="custom-prev" onClick={onClick}>
        Précédent
    </ArrowLeft>
);

const CustomNextButton = ({ onClick }: { onClick: () => void }) => (
    <ArrowRight className="custom-next" onClick={onClick}>
        Suivant
    </ArrowRight>
);
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
                {stores.map((store,index) => (
                     <SwiperSlide key={index}>

                  <motion.div
                    key={store.id}
                    className="snap-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    
                      <StoreCard {...store}  openModal={() => setIsModalOpen(true)} />
                   
                  </motion.div>
                  </SwiperSlide>
                ))}
              </AnimatePresence>
            </motion.div>
  
            
            </Swiper>
                    <div className="flex justify-center items-center"><AnimatePresence>
        {isModalOpen && (
          <>
           <div onClick={()=>setIsModalOpen(false)} className='fixed top-0 z-[999999999999999999999] backdrop-blur-sm bg-[#5a525263]  inset-0 w-full h-full'>

          </div>

            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-0 top-[5%]  z-[99999999999999999999999999]  mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl md:inset-x-auto"
            >
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="relative">
                  <div className="relative h-72 w-full" style={{ backgroundImage:`url(${shirt})`,backgroundPosition:"cover",backgroundSize:"cover" }}>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className='flex items-end justify-between'>
                            <div>
                            <h2 className="text-3xl font-bold">Shoe Store</h2>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg">4.8</span>
                        </div>
                        <span className="text-white/60">•</span>
                        <span className="text-white/90">
                          15234 followers
                        </span>
                        <span className="text-white/60">•</span>
                        <span className="text-white/90">
                          15234 products
                        </span>
                      </div>
                      <div className="mt-4">
                        <StoreBadges
                          isPremium={true}
                          isWholesale={true}
                          isThrift={true}
                        />
                      </div>
                            </div>

                            <div className='max-sm:hidden'>
                              <Button className='bg-transparent max-sm:text-sm hover:bg-black hover:text-white' variant={'outline'}>Suivre la boutique<UserPlus/></Button>
                            </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white  transition-colors hover:bg-black/70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
                  <div className="md:col-span-3">
                    <div className="mb-6">
                      <div className='flex max-sm:mb-6 items-center justify-between'>
                      <h3 className="mb-4 max-sm:mb-0 text-lg font-semibold">Store Categories</h3>
                      <Link to={'/stores/fashion-hub'}>
                      <Button className="px-12 ma max-sm:flex hidden bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 gap-2">
                        Visiter
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      </Link>
                     
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="rounded-lg border bg-gray-50 p-3 text-center"
                          >
                            <div className="text-sm font-medium">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.productCount} products</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Featured Products</h3>
                        <Button variant="outline">View All Products</Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {productsWhole.map((product) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: product.id * 0.1 }}
                            className="group relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                          >
                            <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <button className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100">
                                <Heart className="h-4 w-4" />
                              </button>
                            </div>
                            <h4 className="mb-2 line-clamp-2 text-sm font-medium">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">${product.price}</span>
                              <Badge className="text-xs">
                                {product.sales} sold
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 rounded-xl border bg-gray-50 p-4">
                    <AsyncLink to="/stores/shoe-store">
                      <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 gap-2">
                        Visiter la boutique
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </AsyncLink>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <ShoppingBag className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Total Products</div>
                          <div className="text-sm text-gray-500">120</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Member Since</div>
                          <div className="text-sm text-gray-500">2021</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-gray-500">Douala Cameroun</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="mb-2 font-medium">Response Rate</div>
                        <div className="text-2xl font-bold text-green-600">97.8%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
           
            
          </>
        )}
      </AnimatePresence>
  
      </div>
          </div>
  )
}
