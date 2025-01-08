


import { ChevronRight } from 'lucide-react'
import { useRef } from "react"
import { Link } from 'react-router-dom'
import shoes from "../../assets/shoes1.webp"
import { AnimatePresence,motion } from 'framer-motion'
import { StoreCard } from './store-card'
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
  
  export default function StoreStories() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
  
    const scroll = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const scrollAmount = 320
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        })
      }
    }
  
    return (
      <section className="w-full overflow-x-hidden  bg-[#6e0a13] py-8">
        <div className="container overflow-x-hidden  mx-auto px-4">
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Nos Boutiques</h2>
              <p className="text-xl md:text-2xl  text-gray-200">Découvrez nos meilleures boutiques</p>
            </div>
            <Link 
              to="/stores" 
              className="hidden md:flex text-white items-center  text-sm hover:underline"
            >
              Voir toutes les boutiques
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
  
          <div className="relative">
            <motion.div 
              ref={scrollContainerRef}
              className="flex gap-4  overflow-x-hidden snap-x snap-mandatory scrollbar-hide pb-4"
            >
              <AnimatePresence>
                {stores.map((store) => (
                  <motion.div
                    key={store.id}
                    className="snap-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={store.link}>
                      <StoreCard {...store} />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
  
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hidden md:block"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hidden md:block"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
  
          <Link 
            to="/stores" 
            className="flex md:hidden items-center  justify-center mt-6 text-sm hover:underline"
          >
            Voir toutes les boutiques
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    )
  }

