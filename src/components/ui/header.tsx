import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search,X, Tag, Shirt, FootprintsIcon as Shoe, ShoppingBagIcon as HandbagSimple,Sparkle,ChevronDown, Menu,Clock, TrendingUp, Lock, Loader2 } from 'lucide-react'
import logo from '../../assets/logo.png';
import dress from "../../assets/dress.jpg"
import { NavigationMenuLink } from './navigation-menu';
import { cn } from '@/lib/utils';
import AsyncLink from './AsyncLink';
import { DropdownAccount } from './dropdown-account';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { useGetUserQuery } from '@/services/auth';
import { useGetCategoriesWithParentIdNullQuery, useGetCategoriesWithParentIdQuery } from '@/services/guardService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
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
  const [activeCategory, setActiveCategory] = useState<number | null>(0);
  const {data:{data:categoriesParent}={},isLoading}=useGetCategoriesWithParentIdNullQuery('guard')
  const {data:categoriesChildren,isLoading:isLoadingChildren}=useGetCategoriesWithParentIdQuery(activeCategory)

  if(isLoading){
    return (
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item} className="py-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md" />
                <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <nav className="relative bg-white">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-8">


          {/* Catégories Principales */}
         
          {!isLoading && Object.entries(categoriesParent).map(([key, category]) => (
            <li 
              key={key}
              className="relative py-4"
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(0)}
            >
              <button className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
               
                <span>{category.category_name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeCategory === category.id ? 'rotate-180' : ''}`} />
              </button>

              
              {activeCategory === category.id && categoriesChildren && Object.keys(categoriesChildren).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed left-0 right-0 z-50 mx-auto w-full bg-white shadow-xl overflow-hidden"
                >
                  <div className="container mx-auto">
                    <div className="grid grid-cols-4 gap-8 p-8">
                      {/* Sections Principales */}
                      <div className="col-span-3 grid grid-cols-3 gap-8">
                        {!isLoadingChildren && Object.entries(categoriesChildren).map(([key, categories]) => {
                          if (key === 'sans_genre') {
                            // Grouper les catégories par parent_id
                            const parentCategories = categories.filter(cat => cat.children && cat.children.length > 0);
                            
                            return parentCategories.map(parentCat => (
                              <div key={parentCat.id} className="space-y-4">
                                <h3 className="font-medium text-lg">{parentCat.category_name}</h3>
                                <ul className="space-y-2">
                                  {parentCat.children.map((childCat: any) => (
                                    <li key={childCat.id}>
                                      <AsyncLink 
                                        to={`/category/${childCat.category_url}`}
                                        className="text-sm text-gray-600 hover:text-orange-500"
                                      >
                                        {childCat.category_name}
                                      </AsyncLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ));
                          }
                          
                          // Comportement existant pour les autres cas
                          return (
                            <div key={key} className="space-y-4">
                              <h3 className="font-medium text-lg">{key}</h3>
                              <ul className="space-y-2">
                                {categories.map((item: any) => (
                                  <li key={item.id}>
                                    <AsyncLink 
                                      to={`/category/${item.category_url}`}
                                      className="text-sm text-gray-600 hover:text-orange-500"
                                    >
                                      {item.category_name} {key}
                                    </AsyncLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>

                      {/* Nouvelle section promotionnelle */}
                      <div className="col-span-1 space-y-6">
                        <div className="relative group overflow-hidden rounded-lg">
                          <img 
                            src={category.category_profile}
                            alt={category.category_name} 
                            className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">Collection {category.category_name}</h3>
                            <p className="text-sm mb-4">Découvrez nos nouveautés</p>
                            <AsyncLink 
                              to={`/category/${category.category_name}`}
                              className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors"
                            >
                              Découvrir
                              <Sparkle className="w-4 h-4" />
                            </AsyncLink>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium text-orange-800 mb-2">Offre Spéciale</h4>
                          <p className="text-sm text-orange-700 mb-3">Jusqu'à -50% sur la nouvelle collection</p>
                          <AsyncLink 
                            to="/promotions"
                            className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1"
                          >
                            Voir les offres
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                          </AsyncLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Ajouter cette constante pour les genres
const genders = [
  { id: 'femme', label: 'FEMME',"url":"femme" },
  { id: 'homme', label: 'HOMME',"url":"homme" },
  { id: 'enfant', label: 'ENFANT',"url":"enfant" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchCategories[0])
  const {data:{data:seller}={},isLoading}=useCurrentSellerQuery('seller')
  let userData=null;
  const {data:userDataAuth}=useGetUserQuery('Auth')
  const [showCategories, setShowCategories] = useState(false)
 
  console.log(userDataAuth)

  if(userDataAuth?.role_id===2){
      userData=seller;
  }else if(userDataAuth?.role_id===1 || userDataAuth?.role_id===3){
    userData=userDataAuth;
  }
  console.log(userData)
  // Fermer le menu et la recherche lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const totalQuantity=useSelector((state:RootState)=>state.cart.totalQuantity)
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
        <div className="max-sm:hidden block mx-16 px-4 py-3">
          {/* Top bar avec logo, recherche et actions */}
          <div className="flex items-center justify-between gap-4">
            <AsyncLink to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="AKEVAS"
                className="h-28 w-auto"
              />
            </AsyncLink>

            <div className="flex flex-1 items-center justify-end gap-8">
              {/* Barre de recherche redimensionnable */}
              <div className={`transition-all duration-300 ease-in-out 
                 w-[500px] 
              `}>
                <div className="relative w-full">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="absolute left-0 top-0 h-full px-2 flex items-center gap-1 text-gray-500 hover:text-gray-700 border-r"
                  >
                    {selectedCategory.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-24 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent text-sm"
                   
                  />
                  <button className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700">
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories Dropdown */}
                {showCategories && (
                  <div className="absolute top-full z-[999999] left-0 w-48 mt-1 bg-white rounded-lg shadow-lg border">
                    {searchCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowCategories(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation par genre */}
              <nav className="flex items-center gap-6">
                {genders.map((gender) => (
                  <AsyncLink
                    key={gender.id}
                    to={`/home?g=${gender.url}`}
                    className="text-sm font-medium text-gray-700 hover:text-[#ed7e0f] transition-colors whitespace-nowrap"
                  >
                    {gender.label}
                  </AsyncLink>
                ))}
              </nav>

              {/* Actions (compte, panier, etc.) */}
              <div className="flex items-center gap-4">
                <DropdownAccount currentUser={userData}>
                  {!userData && !isLoading && <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                  <User className="h-7 w-7" />
                  
                  </div>}
                    {userData && userData.role_id===2 && <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                  
                  <Avatar>
                    <AvatarImage src={userData.shop.shop_profile} />
                    <AvatarFallback>
                      {userData.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  </div>}
                   {userData && (userData.role_id===1 || userData.role_id===3) && <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={userData.profile} />
                    <AvatarFallback>
                      {userData?.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  </div>}
                </DropdownAccount>

                    {userData && userData.role_id===2 && <AsyncLink to="/seller/pro">
                      <Button  className="text-sm bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">Devenir vendeur pro <Lock className="w-4 h-4" /></Button>
                    </AsyncLink>}

                    {!userData && <AsyncLink to="/cart">

                       <div
                 
                 className="relative text-gray-700 hover:text-[#ed7e0f]"
               >
                 <ShoppingCart className="w-6 h-6" />
                 <span className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                   {totalQuantity}
                 </span>
               </div>
                    </AsyncLink>}
                    
                    {userData && (userData.role_id===1 || userData.role_id===3) &&  <AsyncLink to="/cart">

                       <div
                 
                 className="relative text-gray-700 hover:text-[#ed7e0f]"
               >
                 <ShoppingCart className="w-6 h-6" />
                 <span className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                   0
                 </span>
               </div>
                    </AsyncLink>}
              </div>
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