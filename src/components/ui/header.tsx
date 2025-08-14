import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Menu, Clock, TrendingUp, Lock, CheckCircle, User } from 'lucide-react'
import logo from '../../assets/logo.png';
import { NavigationMenuLink } from './navigation-menu';
import { cn } from '@/lib/utils';
import AsyncLink from './AsyncLink';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { useGetUserQuery } from '@/services/auth';
import { CategoryNavigation } from '../categories/CategoryNavigation';
import MobileCategoryMenu from '../categories/MobileCategoryMenu';
import { Badge } from './badge';
import DropdownAccount from './dropdown-account';
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



const Header = () => {
  // Regrouper les états liés dans un seul objet pour réduire les re-renderings
  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isSearchOpen: false,
    isScrolled: false,
    showCategories: false
  });

  const [searchState, setSearchState] = useState({
    query: '',
    selectedCategory: searchCategories[0]
  });



  const handleSearchToggle = useCallback(() => {
    setUiState(prev => ({ ...prev, isSearchOpen: !prev.isSearchOpen }));
  }, []);



  // Optimiser les queries avec les options RTK Query
  const { data: { data: seller } = {}, isLoading } = useCurrentSellerQuery('seller', {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  console.log(seller)
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

  useEffect(() => {
    const handleScroll = () => {
      setUiState(prev => ({ ...prev, isScrolled: window.scrollY > 300 }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Memoize les composants qui peuvent être réutilisés
  const headerActions = (
    <div className="flex items-center gap-4">
      <DropdownAccount currentUser={userData}>
        {!userData && !isLoading && (
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 cursor-pointer group"
          >
            <div className="text-gray-700 hover:text-[#ed7e0f] cursor-pointer">
              <User className="h-6 w-6" />
            </div>
          </motion.div>
        )}
        {userData && userData.role_id === 2 && (
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 cursor-pointer group"
          >
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-gray-200 group-hover:border-[#ed7e0f] transition-colors">
              <AvatarFallback className="bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] text-white">
                {userData.firstName?.charAt(0) || '?'}
              </AvatarFallback>
              <AvatarImage className="object-cover" src={userData.shop?.shop_profile || ''} />
            </Avatar>
          </motion.div>
        )}
        {userData && (userData.role_id === 1 || userData.role_id === 3) && (
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 cursor-pointer group"
          >
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-gray-200 group-hover:border-[#ed7e0f] transition-colors">
              <AvatarFallback className="bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] text-white">
                {userData?.userName?.charAt(0) || '?'}
              </AvatarFallback>
              <AvatarImage className="object-cover" src={userData.profile || ''} />
            </Avatar>
          </motion.div>
        )}
      </DropdownAccount>
      <button
        onClick={handleSearchToggle}
        className="text-gray-700 hover:text-[#ed7e0f]"
      >
        <Search className="w-6 h-6" />
      </button>



    </div>
  );

  return (
    <>
      {/* Sticky Header */}
      <header className={`w-full max-sm:hidden bg-white border-b z-50 fixed top-0 left-0 transition-all duration-300 ${uiState.isScrolled ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <AsyncLink to="/" className="flex-shrink-0">
              <img src={logo} alt="AKEVAS" className="h-16 w-auto" />
            </AsyncLink>

            <div className="flex-1 flex justify-center">
              <CategoryNavigation />
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

              <div className="flex justify-center w-full">
                <CategoryNavigation />
              </div>

              {/* Actions (compte, panier, etc.) */}
              <div className="flex items-center gap-4">
                <DropdownAccount currentUser={userData}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1 cursor-pointer group"
                  >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-gray-200 group-hover:border-[#ed7e0f] transition-colors">
                      <AvatarFallback className="bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] text-white">
                        {seller?.firstName?.charAt(0) || '?'}
                      </AvatarFallback>
                      <AvatarImage className="object-cover" src={seller?.shop?.shop_profile || ''} />
                    </Avatar>

                  </motion.div>
                </DropdownAccount>

                {userData && userData.shop.isSubscribe === 1 ? (
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      className="relative bg-gradient-to-br from-[#ed7e0f] via-orange-500 to-[#d97100] text-white hover:from-[#d97100] hover:via-orange-600 hover:to-[#ed7e0f] rounded-xl px-5 py-2.5 flex items-center gap-3 transition-all duration-500 shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
                    >
                      <Badge
                        variant="secondary"
                        className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold tracking-wider px-2.5"
                      >
                        PRO
                      </Badge>
                      <CheckCircle className="w-5 h-5 text-white/90" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-300 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-400"></span>
                      </span>
                    </Button>
                    <div className="absolute opacity-0 group-hover:opacity-100 -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-[#ed7e0f] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm transition-all duration-300 whitespace-nowrap">
                      Compte vérifié
                    </div>
                  </div>
                ) : (
                  <AsyncLink to="/seller/pro">
                    <Button className="text-sm bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">
                      Devenir vendeur pro <Lock className="w-4 h-4" />
                    </Button>
                  </AsyncLink>
                )}




              </div>
            </div>
          </div>

          {/* Navigation avec menus déroulants */}

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



export default React.memo(Header);