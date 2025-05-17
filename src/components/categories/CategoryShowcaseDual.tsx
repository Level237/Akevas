import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import OptimizedImage from "@/components/OptimizedImage"

interface Category {
  id: string
  name: string
  description: string
  image: string
  featured?: boolean
  color?: string
}

export default function CategoryShowcase({categories, isLoading, title}: {categories: Category[], isLoading: boolean, title: string}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Optimized smooth scrolling with requestAnimationFrame
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!containerRef.current) return
    console.log('dd')
    const container = containerRef.current
    const cardWidth = 300 // Largeur d'une carte
    const gap = 24 // Espacement entre les cartes (gap-6 = 24px)
    const scrollAmount = cardWidth + gap

    if (direction === 'left') {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      })
    } else {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b  -mt-28 max-sm:-mt-1 from-gray-900 to-black text-white">
      <div className="container ml-auto px-4">
        {/* Header with Navigation Controls */}
        <div className="flex items-center  justify-between mb-16">
          <div className="flex-1">
            <span className="inline-block max-sm:hidden px-4 py-1.5 bg-[#ed7e0f]/10 backdrop-blur-sm rounded-full text-[#ed7e0f]">
              {title}
            </span>
            <h2 className="text-2xl max-sm:text-lg md:text-4xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Explorez nos catégories
            </h2>
          </div>
          <div className="flex  gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-3  rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="w-6 max-sm:w-5 max-sm:h-5 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="w-6 max-sm:w-5 max-sm:h-5 h-6" />
            </button>
          </div>
        </div>

        {/* Optimized Categories Grid/Carousel */}
        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden  overflow-x-auto pb-8 "
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {categories.map((category:any, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-[300px] max-sm:w-[200px] flex-shrink-0"
            >
              <Link 
                to={`/c/${category.category_url}`}
                className="block group relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="relative aspect-[3/3] rounded-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    category.color || "from-blue-500/30 to-purple-500/30"
                  } opacity-60 transition-opacity group-hover:opacity-80 z-10`} />
                  
                  <OptimizedImage
                    src={category.category_profile|| "/placeholder.svg"}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                    <h3 className="text-2xl max-sm:text-lg font-bold mb-2 transform transition-transform group-hover:-translate-y-2">
                      {category.category_name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 transform transition-transform group-hover:-translate-y-2">
                      {category.description}
                    </p>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeCategory === category.id ? 1 : 0 }}
                      className="mt-4 inline-flex items-center text-sm font-medium"
                    >
                      Explorer <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-[10%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 blur-[100px]" />
      </div>
    </section>
  )
}
