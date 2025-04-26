import { useState, useRef, useEffect, useMemo, useCallback } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronRight, ChevronLeft, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { FixedSizeList as List } from 'react-window'

interface Category {
  id: string
  name: string
  description: string
  image: string
  featured?: boolean
  color?: string
}

export default function CategoryShowcasePremium({categories, isLoading,title}: {categories: Category[], isLoading: boolean,title:string}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Ces données seraient normalement récupérées depuis une API
 

  // Effet de suivi de la souris pour les effets interactifs


  // Fonction pour faire défiler horizontalement avec la molette de la souris
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        scrollContainer.scrollLeft += e.deltaY
      }
    }

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel)
    }
  }, [])

 





  // Fonctions de gestion du défilement manuel
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }, [])

  const handleMouseLeave = useCallback(() => setIsDragging(false), [])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  // Nouvelle fonction de contrôle pour react-window
  const scrollToPosition = (position: 'start' | 'center' | 'end') => {
    if (!listRef.current) return
    let index = 0
    if (position === 'center') {
      index = Math.floor(categories.length / 2)
    } else if (position === 'end') {
      index = categories.length - 1
    }
    listRef.current.scrollToItem(index, 'center')
  }

  // Mettre à jour ModernControls pour utiliser scrollToPosition
  const ModernControls = () => {
    const [activeControl, setActiveControl] = useState('center')

    return (
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="relative">
          <motion.div
            className="flex items-center gap-4 bg-black/50 backdrop-blur-lg rounded-full p-3 border border-white/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                scrollToPosition('start')
                setActiveControl('start')
              }}
              className={`p-2 rounded-full transition-colors ${
                activeControl === 'start' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>

            <div className="w-[1px] h-6 bg-white/10" />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                scrollToPosition('center')
                setActiveControl('center')
              }}
              className={`p-2 rounded-full transition-colors ${
                activeControl === 'center' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-8 h-1 bg-white rounded-full" />
            </motion.button>

            <div className="w-[1px] h-6 bg-white/10" />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                scrollToPosition('end')
                setActiveControl('end')
              }}
              className={`p-2 rounded-full transition-colors ${
                activeControl === 'end' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // OPTIMISATION : useMemo pour la liste des catégories
  const renderedCategories = useMemo(() => (
    !isLoading && categories.map((category:any, index:number) => (
      <div
        key={`${category.id}-${index}`}
        className="min-w-[300px] max-w-[300px] flex-shrink-0"
        style={{
          transform: isDragging ? 'scale(0.98)' : 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <Link 
          to={`/categories/${category.category_name}`} 
          className="group block h-full"
          onClick={(e) => isDragging && e.preventDefault()}
        >
          <div
            className="relative h-[350px] rounded-2xl overflow-hidden mb-4 border border-white/10 transform transition-transform duration-300 hover:scale-[1.02]"
            style={{
              boxShadow: "0 15px 30px -10px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${category.color || "from-blue-500/20 to-purple-500/20"} opacity-40 z-10`}
            />
            <img
              src={category.category_profile || "/placeholder.svg"}
              alt={category.category_name}
              className="object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-110 z-0"
              draggable="false"
              loading="lazy" // OPTIMISATION
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
              <h3 className="text-xl font-semibold text-white mb-2">{category.category_name}</h3>
              <p className="text-white/70 text-sm line-clamp-2">{category.category_description}</p>
            </div>
            <div
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2.5 z-20 border border-white/20"
            >
              <Plus className="h-5 w-5 text-white" />
            </div>
          </div>
        </Link>
      </div>
    ))
  ), [categories, isLoading, isDragging])

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const category = categories[index] as any
    return (
      <div
        key={`${category.id}-${index}`}
        className="min-w-[300px] max-w-[300px] flex-shrink-0"
        style={{
          ...style,
          transform: isDragging ? 'scale(0.98)' : 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <Link 
          to={`/categories/${category.category_name}`} 
          className="group block h-full"
          onClick={(e) => isDragging && e.preventDefault()}
        >
          <div
            className="relative h-[350px] rounded-2xl overflow-hidden mb-4 border border-white/10 transform transition-transform duration-300 hover:scale-[1.02]"
            style={{
              boxShadow: "0 15px 30px -10px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${category.color || "from-blue-500/20 to-purple-500/20"} opacity-40 z-10`}
            />
            <img
              src={category.category_profile || "/placeholder.svg"}
              alt={category.category_name}
              className="object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-110 z-0"
              draggable="false"
              loading="lazy" // OPTIMISATION
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
              <h3 className="text-xl font-semibold text-white mb-2">{category.category_name}</h3>
              <p className="text-white/70 text-sm line-clamp-2">{category.category_description}</p>
            </div>
            <div
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2.5 z-20 border border-white/20"
            >
              <Plus className="h-5 w-5 text-white" />
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <section className="w-full py-16 overflow-hidden bg-black text-white relative">
      {/* Éléments de design d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-[10%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[20rem] h-[20rem] rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-[80px]" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-gradient-to-r from-primary/30 to-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary-foreground border border-white/10"
          >
            Explorez nos catégories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
          >
            Découvrez notre sélection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-[700px] text-gray-400 md:text-xl"
          >
            Parcourez nos catégories soigneusement sélectionnées pour trouver exactement ce que vous cherchez.
          </motion.p>
        </div>

        {/* Section des catégories standard - Défilement horizontal amélioré */}
        <div className="relative pb-20">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl font-semibold mb-8 flex items-center"
          >
            <span className="mr-2 inline-block w-1.5 h-6 bg-primary rounded-full"></span>
            Toutes les catégories
            <span className="text-sm text-gray-500 ml-3 flex items-center">
              <span className="mr-1">glissez pour découvrir</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          </motion.h3>

          <motion.div
            ref={scrollContainerRef}
            className={`
              flex pb-10 space-x-6 
              cursor-grab select-none no-scrollbar 
              scroll-smooth transition-all duration-200
              w-full overflow-x-hidden
              ${isDragging ? 'cursor-grabbing' : ''}
            `}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <List
              ref={listRef}
              height={370}
              width={scrollContainerRef.current?.clientWidth || 1200}
              itemCount={categories.length}
              itemSize={320}
              layout="horizontal"
              style={{ width: "100%", overflowX: "hidden" }}
            >
              {Row}
            </List>
          </motion.div>

          {/* Ajouter le composant de contrôle ici */}
          <ModernControls />

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-20 w-40 bg-gradient-to-r from-black via-black/80 to-transparent opacity-40 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-20 w-40 bg-gradient-to-l from-black via-black/80 to-transparent opacity-40 pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
