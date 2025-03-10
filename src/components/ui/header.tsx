import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, X, ChevronDown, Menu, Clock, TrendingUp, Lock } from 'lucide-react'
import logo from '../../assets/logo.png';
import { NavigationMenuLink } from './navigation-menu';
import { cn } from '@/lib/utils';
import AsyncLink from './AsyncLink';
import DropdownAccount from './dropdown-account';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { useGetUserQuery } from '@/services/auth';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CategoryNavigation } from '../categories/CategoryNavigation';
import MobileCategoryMenu from '../categories/MobileCategoryMenu';
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



// Ajouter cette constante pour les genres
const genders = [
  { id: 'femme', label: 'FEMME', "url": "femme" },
  { id: 'homme', label: 'HOMME', "url": "homme" },
  { id: 'enfant', label: 'ENFANT', "url": "enfant" },
];

const Header = () => {
  // Remplacer useState par useRef pour isScrolled car il n'a pas besoin de déclencher un re-render
  const isScrolledRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);

  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isSearchOpen: false,
    showCategories: false
  });

  const [searchState, setSearchState] = useState({
    query: '',
    selectedCategory: searchCategories[0]
  });

  // Memoize les callbacks


  const handleSearchToggle = useCallback(() => {
    setUiState(prev => ({ ...prev, isSearchOpen: !prev.isSearchOpen }));
  }, []);

  const handleCategorySelect = useCallback((category: typeof searchCategories[0]) => {
    setSearchState(prev => ({ ...prev, selectedCategory: category }));
    setUiState(prev => ({ ...prev, showCategories: false }));
  }, []);

  // Optimiser les queries avec les options RTK Query
  const { data: { data: seller } = {}, isLoading } = useCurrentSellerQuery('seller', {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  const { data: userDataAuth } = useGetUserQuery('Auth', {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  // Memoize userData avec des dépendances plus précises
  const userData = useMemo(() => {
    const roleId = userDataAuth?.role_id;

    if (!userDataAuth || !roleId) return null;

    if (roleId === 2 && seller) {
      return seller;
    }
    if (roleId === 1 || roleId === 3 || roleId === 4) {
      return userDataAuth;
    }
    return null;
  }, [userDataAuth?.role_id, seller?.id, userDataAuth?.id]);

  // Pour déboguer, ajoutez un useEffect temporaire pour tracer les changements
  useEffect(() => {
    console.log('userData changed because:', {
      roleId: userDataAuth?.role_id,
      sellerId: seller?.id,
      userId: userDataAuth?.id
    });
  }, [userDataAuth?.role_id, seller?.id, userDataAuth?.id]);


  // Optimiser les effets
  useEffect(() => {
    setUiState(prev => ({ ...prev, isMenuOpen: false, isSearchOpen: false }));
  }, [location.pathname]);

  // Optimiser l'effet de scroll
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      const shouldBeVisible = window.scrollY > 300;
      if (isScrolledRef.current !== shouldBeVisible) {
        isScrolledRef.current = shouldBeVisible;
        // Manipuler directement le DOM au lieu de déclencher un re-render
        header.style.transform = shouldBeVisible ? 'translateY(0)' : 'translateY(-100%)';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity)

  // Memoize les composants qui peuvent être réutilisés
  const headerActions = useMemo(() => (
    <div className="flex items-center gap-4">
      <button
        onClick={handleSearchToggle}
        className="text-gray-700 hover:text-[#ed7e0f]"
      >
        <Search className="w-6 h-6" />
      </button>
      <DropdownAccount currentUser={userData}>
        {!userData && !isLoading && (
          <div className="text-gray-700 hover:text-[#ed7e0f] cursor-pointer">
            <User className="h-6 w-6" />
          </div>
        )}
        {userData && userData.role_id === 2 && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={userData.shop.shop_profile} />
            <AvatarFallback>{userData.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        {userData && (userData.role_id === 1 || userData.role_id === 3) && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={userData.profile} />
            <AvatarFallback>{userData?.userName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </DropdownAccount>


    </div>
  ), [userData, handleSearchToggle, totalQuantity]);

  return (
    <>
      {/* Sticky Header */}
      <header
        ref={headerRef}
        className="w-full max-sm:hidden bg-white border-b z-50 fixed top-0 left-0 transition-all duration-300 -translate-y-full"
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <AsyncLink to="/" className="flex-shrink-0">
              <img src={logo} alt="AKEVAS" className="h-16 w-auto" />
            </AsyncLink>

            <div className="flex-1 flex justify-center">
              <React.Profiler id="CategoryNavigation" onRender={(id, phase, actualDuration) => {
                console.log("CategoryNavigation rendered", id, phase, actualDuration)
              }}>
                <CategoryNavigation />
              </React.Profiler>
            </div>

            {headerActions}
          </div>
        </div>
      </header>

      {/* Main Header */}
      <header className="w-full z-50 bg-white border-b max-sm:sticky top-0">
        <div className="container hidden max-sm:block mx-16 py-3 max-sm:mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Menu Burger (Mobile) */}
            <button
              onClick={() => setUiState(prev => ({ ...prev, isMenuOpen: true }))}
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
              {headerActions}
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
                    onClick={() => setUiState(prev => ({ ...prev, showCategories: !prev.showCategories }))}
                    className="absolute left-0 top-0 h-full px-2 flex items-center gap-1 text-gray-500 hover:text-gray-700 border-r"
                  >
                    {searchState.selectedCategory.label}
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
                {uiState.showCategories && (
                  <div className="absolute top-full z-[999999] left-0 w-48 mt-1 bg-white rounded-lg shadow-lg border">
                    {searchCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
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
                  {userData && userData.role_id === 2 && <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">

                    <Avatar>
                      <AvatarImage src={userData.shop.shop_profile} />
                      <AvatarFallback>
                        {userData.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>}
                  {userData && (userData.role_id === 1 || userData.role_id === 3 || userData.role_id === 4) && <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={userData.profile} />
                      <AvatarFallback>
                        {userData.role_id === 4 ? userData?.firstName.charAt(0) : userData?.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>}
                </DropdownAccount>

                {userData && userData.role_id === 2 && <AsyncLink to="/seller/pro">
                  <Button className="text-sm bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">Devenir vendeur pro <Lock className="w-4 h-4" /></Button>
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

                {userData && (userData.role_id === 1 || userData.role_id === 3) && <AsyncLink to="/cart">

                  <div

                    className="relative text-gray-700 hover:text-[#ed7e0f]"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalQuantity}
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
        {uiState.isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setUiState(prev => ({ ...prev, isMenuOpen: false }))}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="absolute top-0 left-0 bottom-0 w-full max-w-sm bg-white"
              onClick={e => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setUiState(prev => ({ ...prev, isMenuOpen: false }))}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <MobileCategoryMenu />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {uiState.isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="container mx-auto px-4">
              {/* Search Header */}
              <div className="flex items-center gap-4 py-4 border-b">
                <button onClick={() => setUiState(prev => ({ ...prev, isSearchOpen: false }))}>
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchState.query}
                    onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Search Content */}
              <div className="py-6">
                {searchState.query ? (
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
                            onClick={() => setSearchState(prev => ({ ...prev, query: search }))}
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
                            onClick={() => setSearchState(prev => ({ ...prev, query: search }))}
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

// Optimiser le memo avec une fonction de comparaison
export default React.memo(Header, (prevProps, nextProps) => {
  return true; // Le Header n'a pas de props qui changent
});