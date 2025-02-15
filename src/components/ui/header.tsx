import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search,X, Tag, Shirt, FootprintsIcon as Shoe, ShoppingBagIcon as HandbagSimple, Heart, Dumbbell, Sparkle, ShoppingBag, ChevronDown, Menu, ChevronRight, Clock, TrendingUp } from 'lucide-react'
import logo from '../../assets/logo.png';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './navigation-menu';
import { cn } from '@/lib/utils';
import AsyncLink from './AsyncLink';
import { DropdownAccount } from './dropdown-account';

// Données de démonstration pour l'historique et les suggestions
const searchHistory = [
  'Robe d\'été fleurie',
  'Nike Air Max',
  'Sac à main cuir',
  'Montre connectée'
];

const trendingSearches = [
  'Sneakers tendance',
  'Robes de soirée',
  'Accessoires homme',
  'Bijoux argent'
];

const categories = {
  mode: {
    icon: <Shirt className="h-4 w-4" />,
    title: "Mode",
    featured: ["Nouveautés", "Meilleures ventes", "Tendances"],
    sections: {
      "Vêtements femme": ["Robes", "Tops", "Pantalons", "Jeans", "Vestes", "Manteaux"],
      "Vêtements homme": ["T-shirts", "Chemises", "Pantalons", "Jeans", "Vestes", "Pulls"],
      "Collections": ["Été 2024", "Basiques", "Sport", "Soirée", "Business"]
    }
  },
  chaussures: {
    icon: <Shoe className="h-4 w-4" />,
    title: "Chaussures",
    featured: ["Nouveautés", "Marques populaires", "Outlet"],
    sections: {
      "Femme": ["Sneakers", "Talons", "Bottes", "Sandales", "Sport"],
      "Homme": ["Sneakers", "Chaussures de ville", "Bottes", "Sport"],
      "Par marque": ["Nike", "Adidas", "Puma", "New Balance"]
    }
  },
  accessoires: {
    icon: <HandbagSimple className="h-4 w-4" />,
    title: "Accessoires",
    featured: ["Nouveautés", "Tendances", "Cadeaux"],
    sections: {
      "Sacs": ["Sacs à main", "Sacs à dos", "Pochettes", "Bagages"],
      "Bijoux": ["Colliers", "Bagues", "Bracelets", "Boucles d'oreilles"],
      "Autres": ["Ceintures", "Écharpes", "Lunettes", "Montres"]
    }
  },
  // ... autres catégories
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
const searchCategories = [
  { id: 'all', label: 'Tous' },
  { id: 'products', label: 'Produits' },
  { id: 'stores', label: 'Boutiques' },
  { id: 'cities', label: 'Villes' },
]

const CategoryNavigation = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="relative bg-white">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-8">
          {/* Menu Promotions */}
          <li 
            className="relative group py-4"
            onMouseEnter={() => setActiveCategory('promo')}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
              <Tag className="h-4 w-4" />
              <span>Promotions</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: activeCategory === 'promo' ? 1 : 0,
                y: activeCategory === 'promo' ? 0 : 10 
              }}
              className={`absolute top-full z-50 left-0 w-64 bg-white shadow-xl rounded-lg p-4 ${activeCategory === 'promo' ? 'block' : 'hidden'}`}
            >
              <div className="grid gap-2">
                <Link 
                  to="/promotions/offres"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group"
                >
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Offres du moment</h4>
                    <p className="text-sm text-gray-500">Jusqu'à -50%</p>
                  </div>
                </Link>
                {/* Autres liens promotions... */}
              </div>
            </motion.div>
          </li>
          {/* Menu Catégories Principales */}
          {Object.entries(categories).map(([key, category]) => (
            <li 
              key={key}
              className="relative group py-4"
              onMouseEnter={() => setActiveCategory(key)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                {category.icon}
                <span>{category.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className='relative w-full h-full'>
                   <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: activeCategory === key ? 1 : 0,
                  y: activeCategory === key ? 0 : 10 
                }}
                className={`absolute z-[100] top-full left-1/2 mx-auto flex -translate-x-1/2 w-[800px] bg-white shadow-xl rounded-lg ${activeCategory === key ? 'block' : 'hidden'}`}
              >
                <div className="p-6 grid grid-cols-4 gap-8">
                  {/* Section À la une */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-orange-500">À la une</h3>
                    <div className="space-y-2">
                      {category.featured.map((item) => (
                        <Link
                          key={item}
                          to={`/${key}/${item.toLowerCase()}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-orange-500"
                        >
                          <Sparkle className="h-4 w-4" />
                          <span>{item}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Sections de catégories */}
                  <div className="col-span-3 grid grid-cols-3 gap-8">
                    {Object.entries(category.sections).map(([section, items]) => (
                      <div key={section} className="space-y-4">
                        <h3 className="font-medium">{section}</h3>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/${key}/${item.toLowerCase()}`}
                                className="text-gray-600 hover:text-orange-500 text-sm"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              </div>
             
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchCategories[0])

  const [showCategories, setShowCategories] = useState(false)
  // Fermer le menu et la recherche lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Header Principal */}
      <header className="w-full z-50 bg-white border-b max-sm:sticky top-0">
        <div className="container hidden max-sm:block mx-16 py-3 max-sm:mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Menu Burger (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="Logo" className="h-16 w-auto lg:h-12" />
            </Link>

            {/* Navigation Desktop */}
           

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-[#ed7e0f]"
              >
                <Search className="w-6 h-6" />
              </button>
              
              <Link to="/account" className="hidden lg:block p-2 text-gray-700 hover:text-[#ed7e0f]">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className=" max-sm:hidden block mx-16 px-4 py-3">
        {/* Top bar avec logo, recherche et actions */}
        <div className="flex items-center justify-between gap-4">
          <AsyncLink to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="AKEVAS"
              className="h-28 w-auto"
            />
          </AsyncLink>

          <div className="flex flex-1 max-w-xl items-center gap-2">
          <div className="relative w-full">
          <div className="relative">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="absolute left-0 top-0 h-full px-3 flex items-center gap-1 text-gray-500 hover:text-gray-700 border-r"
                >
                  {selectedCategory.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-32 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Dropdown */}
              {showCategories && (
                <div className="absolute top-full z-[999999] left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border">
                  {searchCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowCategories(false)
                      }}
                      className="w-full  px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
              </div>
          </div>

          <div className="flex items-center justify-between gap-8">

                
                    <DropdownAccount>
                    <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                      <User className="h-7 w-7" />
                      <p className="text-sm">Connexion</p>
                      </div>
                    </DropdownAccount>
                
              

                  <AsyncLink to="/cart">
                  <div
             
             className="relative text-gray-700 hover:text-[#ed7e0f]"
           >
             <ShoppingCart className="w-6 h-6" />
             <span className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
               0
             </span>
           </div>
                  </AsyncLink>

          </div>
        </div>

        {/* Navigation avec menus déroulants */}
        <div className="flex justify-center w-full">
          <CategoryNavigation />
        </div>
      </div>
      </header>

      {/* Menu Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white"
              onClick={e => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="overflow-y-auto h-full pb-20">
              
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="container mx-auto px-4">
              {/* Search Header */}
              <div className="flex items-center gap-4 py-4 border-b">
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Search Content */}
              <div className="py-6">
                {searchQuery ? (
                  <div>
                    {/* Résultats de recherche en direct ici */}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Historique de recherche */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recherches récentes
                      </h3>
                      <div className="space-y-2">
                        {searchHistory.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(search)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tendances */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Tendances
                      </h3>
                      <div className="space-y-2">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(search)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;