import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, TrendingUp, Clock, ShoppingBag, Shield, Award, ArrowRight, BadgeInfo, X, Heart, Badge, ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import shoes from "../../assets/shoes1.webp"
import shirt from "../../assets/dress.jpg"
import TooltipChildren from '../frontend/TooltipChildren';
import { StoreBadges } from '../seller/store-badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';


const categories= [
  { id: 1, name: "LED Lights", productCount: 245 },
  { id: 2, name: "Home Decor", productCount: 189 },
  { id: 3, name: "Garden Tools", productCount: 156 },
  { id: 4, name: "Smart Home", productCount: 98 },
]

const products=[
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

interface Store {
  id: string;
  code: string;
  coverImage: string;
  rating: number;
  totalSales: number;
  productCount: number;
  joinedDate: string;
  badges: string[];
  isVerified: boolean;
  isFeatured: boolean;
  category: string;
}

// Mock data - À remplacer par les données réelles de l'API
const featuredStores: Store[] = [
  {
    id: '1',
    code: 'JP_STORE_8472',
    coverImage: shoes,
    rating: 4.8,
    totalSales: 1250,
    productCount: 89,
    joinedDate: '2024-06',
    badges: ['Premium', 'Top Seller'],
    isVerified: true,
    isFeatured: true,
    category: 'Manga & Anime',
    name: '',
    banner: '',
    products: [],
    followers: 0,
    totalProducts: 0,
    categories: [],
    isPremium: false,
    isWholesale: false,
    isThrift: false,
    joinDate: '',
    location: '',
    responseRate: ''
  },
  {
    id: '2',
    code: 'ANIME_COLL_9234',
    coverImage: shoes,
    rating: 4.9,
    totalSales: 2100,
    productCount: 156,
    joinedDate: '2024-03',
    badges: ['Premium', 'Fast Shipper'],
    isVerified: true,
    isFeatured: true,
    category: 'Figurines',
    name: '',
    banner: '',
    products: [],
    followers: 0,
    totalProducts: 0,
    categories: [],
    isPremium: false,
    isWholesale: false,
    isThrift: false,
    joinDate: '',
    location: '',
    responseRate: ''
  },
  {
    id: '3',
    code: 'COSPLAY_6390',
    coverImage: shoes,
    rating: 4.7,
    totalSales: 890,
    productCount: 67,
    joinedDate: '2024-08',
    badges: ['Premium'],
    isVerified: true,
    isFeatured: true,
    category: 'Cosplay',
    name: '',
    banner: '',
    products: [],
    followers: 0,
    totalProducts: 0,
    categories: [],
    isPremium: false,
    isWholesale: false,
    isThrift: false,
    joinDate: '',
    location: '',
    responseRate: ''
  },
  {
    id: '4',
    code: 'KAWAII_5823',
    coverImage: shoes,
    rating: 4.6,
    totalSales: 750,
    productCount: 94,
    joinedDate: '2024-07',
    badges: ['Premium', 'New Arrival'],
    isVerified: true,
    isFeatured: true,
    category: 'Accessoires',
    name: '',
    banner: '',
    products: [],
    followers: 0,
    totalProducts: 0,
    categories: [],
    isPremium: false,
    isWholesale: false,
    isThrift: false,
    joinDate: '',
    location: '',
    responseRate: ''
  },
  {
    id: '5',
    code: 'OTAKU_7456',
    coverImage: shoes,
    rating: 4.9,
    totalSales: 1800,
    productCount: 123,
    joinedDate: '2024-04',
    badges: ['Premium', 'Top Rated'],
    isVerified: true,
    isFeatured: true,
    category: 'Vêtements',
    name: '',
    banner: '',
    products: [],
    followers: 0,
    totalProducts: 0,
    categories: [],
    isPremium: false,
    isWholesale: false,
    isThrift: false,
    joinDate: '',
    location: '',
    responseRate: ''
  },
  {
    id: '6',
    code: 'SUGOI_4289',
    coverImage: shoes,
    rating: 4.8,
    totalSales: 1400,
    productCount: 78,
    joinedDate: '2024-05',
    badges: ['Premium', 'Trending'],
    isVerified: true,
    isFeatured: true,
    category: 'Lifestyle',
    name: '',
    banner: '',
    products: [],
    followers: 0,
    totalProducts: 0,
    categories: [],
    isPremium: false,
    isWholesale: false,
    isThrift: false,
    joinDate: '',
    location: '',
    responseRate: ''
  }
];
interface Category {
  id: number
  name: string
  productCount: number
}

interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  sales: number
}

interface Store {
  id: string
  name: string
  banner: string
  products: Product[]
  rating: number
  followers: number
  totalProducts: number
  categories: Category[]
  isPremium: boolean
  isWholesale: boolean
  isThrift: boolean
  joinDate: string
  location: string
  responseRate: string
}


const FeaturedStores: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
     <section className="py-16 mx-16 mb-24 border rounded-xl ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className='flex flex-col gap-3 justify-between'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <h2 className="text-3xl font-bold text-black">Boutiques Premium</h2>
            <TooltipChildren title='Decouvrez comment devenir une boutique premium'>
            <BadgeInfo className='text-gray-400' />
            </TooltipChildren>

          </motion.div>
          <div className='flex items-center justify-between'>
            <p className=' text-2xl'>Diverses boutiques populaires sur AKEVAS</p>
            <div className='flex items-center cursor-pointer'><p className="text-[#ed7e0f] font-bold">Voir plus </p><ArrowRight className='text-[#ed7e0f] w-5 h-5 ml-1'></ArrowRight></div>
          </div>
          </div>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
             
                <div className="bg-gray-100 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {/* Image de couverture */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={store.coverImage}
                      alt={store.code}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                      {store.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-900"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    {/* Code boutique */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                          {store.code}
                        </h3>
                        {store.isVerified && (
                          <Shield className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-white mt-1">
                        {store.category}
                      </p>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-black">
                            {store.rating} / 5.0
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-black">
                            {store.productCount} produits
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-black">
                            {store.totalSales} ventes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-black">
                            Depuis {store.joinedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div className="mt-6">
                      <div onClick={() => setIsModalOpen(true)} className=" bg-[#ed7e0f] cursor-pointer text-white rounded-xl py-2.5 px-4 text-center text-sm font-medium transition-colors duration-300">
                        Visiter la boutique
                      </div>
                    </div>
                  </div>
                </div>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <AnimatePresence>
        {isModalOpen && (
          <>
           <div onClick={()=>setIsModalOpen(false)} className='fixed z-[999999999999999999999] backdrop-blur-sm bg-[#5a525263]  inset-0 w-full h-full'>

          </div>

            <div className="flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-x-4 top-[5%] z-[99999999999999999999999999]  mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl md:inset-x-auto"
            >
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="relative">
                  <div className="relative h-72 w-full" style={{ backgroundImage:`url(${shirt})`,backgroundPosition:"cover",backgroundSize:"cover" }}>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
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
                      <h3 className="mb-4 text-lg font-semibold">Store Categories</h3>
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
                        {products.map((product) => (
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
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 gap-2">
                      Visiter la boutique
                      <ExternalLink className="h-4 w-4" />
                    </Button>

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
            </div>
            
          </>
        )}
      </AnimatePresence>
    </>
   
  );
};

export default FeaturedStores;
