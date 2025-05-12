import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

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

    const container = containerRef.current
    const scrollAmount = 600
    const startPosition = container.scrollLeft
    const targetPosition = direction === 'left' 
      ? Math.max(0, startPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, startPosition + scrollAmount)
    
    const startTime = performance.now()
    const duration = 300 // Reduced duration for snappier scrolling

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smoother animation
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const currentPosition = startPosition + (targetPosition - startPosition) * easeProgress
      container.scrollLeft = currentPosition

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b -mt-44 from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Header with Navigation Controls */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex-1">
            <span className="inline-block px-4 py-1.5 bg-[#ed7e0f]/10 backdrop-blur-sm rounded-full text-[#ed7e0f]">
              {title}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Explorez nos catégories
            </h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Optimized Categories Grid/Carousel */}
        <div 
          ref={containerRef}
          className="grid grid-flow-col overflow-x-hidden auto-cols-max gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory'
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-[300px] snap-start"
            >
              <Link 
                to={`/categories/${category.category_url}`}
                className="block group relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    category.color || "from-blue-500/30 to-purple-500/30"
                  } opacity-60 transition-opacity group-hover:opacity-80 z-10`} />
                  
                  <img
                    src={category.category_profile|| "/placeholder.svg"}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                    <h3 className="text-2xl font-bold mb-2 transform transition-transform group-hover:-translate-y-2">
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
