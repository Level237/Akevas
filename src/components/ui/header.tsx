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
        <NavigationMenu className="mt-4  w-full z-[99999]">
          <NavigationMenuList className="flex justify-center mx-12 w-full">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center w-full gap-2">
                <Tag className="h-4 w-4" />
                Promotion
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <ListItem title="Offres du moment" href="/promotions/offres">
                    Découvrez nos meilleures offres
                  </ListItem>
                  <ListItem title="Ventes Flash" href="/promotions/flash">
                    Promotions limitées dans le temps
                  </ListItem>
                  <ListItem title="Outlet" href="/promotions/outlet">
                    Jusqu'à -70% sur une sélection
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {Object.entries(categories).map(([key, category]) => (
              <NavigationMenuItem key={key}>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-4 p-6">
                    <div className="col-span-1">
                      <h3 className="font-bold mb-4">À la une</h3>
                      <ul className="space-y-2">
                        {category.featured.map((item) => (
                          <li key={item}>
                            <Link 
                              to={`/${key}/${item.toLowerCase()}`}
                              className="text-sm hover:text-orange-500"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-6">
                      {Object.entries(category.sections).map(([section, items]) => (
                        <div key={section}>
                          <h3 className="font-bold mb-4">{section}</h3>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item}>
                                <Link 
                                  to={`/${key}/${item.toLowerCase()}`}
                                  className="text-sm hover:text-orange-500"
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
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {/* Autres catégories qui n'ont pas encore de sous-menus détaillés */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Lingerie
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem title="Nouveautés" href="/lingerie/nouveautes">
                    Découvrez les dernières collections
                  </ListItem>
                  <ListItem title="Collections" href="/lingerie/collections">
                    Explorez nos différentes gammes
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Sport
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem title="Vêtements de sport" href="/sport/vetements">
                    Pour tous vos entraînements
                  </ListItem>
                  <ListItem title="Équipement" href="/sport/equipement">
                    Tout le matériel nécessaire
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Sparkle className="h-4 w-4" />
                Beauté
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem title="Maquillage" href="/beaute/maquillage">
                    Toutes nos marques de cosmétiques
                  </ListItem>
                  <ListItem title="Soins" href="/beaute/soins">
                    Produits de soin pour le visage et le corps
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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