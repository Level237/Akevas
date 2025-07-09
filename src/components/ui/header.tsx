import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, X, Menu} from 'lucide-react'
import logo from '../../assets/logo.png';
import { NavigationMenuLink } from './navigation-menu';
import { cn } from '@/lib/utils';
import AsyncLink from './AsyncLink';
import DropdownAccount from './dropdown-account';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { useGetUserQuery } from '@/services/auth';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CategoryNavigation } from '../categories/CategoryNavigation';
import SearchResource from './search';
import OptimizedImage from '@/components/OptimizedImage';
import SearchBar from '@/components/search/SearchBar';
import MegaMenu from './MegaMenu';

// Lazy load du MobileCategoryMenu
const MobileCategoryMenu = lazy(() => import('../categories/MobileCategoryMenu'));

// Données de démonstration pour l'historique et les suggestions


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




// Ajouter cette constante pour les genres
const genders = [
  { id: 'femme', label: 'FEMME', "url": "femme" },
  { id: 'homme', label: 'HOMME', "url": "homme" },
  { id: 'enfant', label: 'ENFANT', "url": "enfant" },
];

const MenuSkeleton = () => (
  <div className="p-4 space-y-6">
    {/* Tabs skeleton */}
    <div className="grid grid-cols-3 gap-4 border-b pb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>

    {/* Grid skeleton */}
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Créer un composant séparé pour le menu mobile
const MobileMenuOverlay = React.memo(({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isContentReady, setIsContentReady] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Reset tous les états quand le menu se ferme
  useEffect(() => {
    if (!isOpen) {
      setIsContentReady(false);
      const timer = setTimeout(() => {
        setIsFirstRender(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const variants = {
    overlay: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 }
      },
    },
    menu: {
      hidden: { x: '-100%' },
      visible: {
        x: 0,
        transition: {
          type: 'tween',
          duration: 0.2,
          ease: 'easeOut'
        }
      },
    }
  };

  const handleAnimationComplete = () => {
    if (isOpen && isFirstRender) {
      setIsContentReady(true);
      setIsFirstRender(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={variants.overlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[9999] bg-black/50  lg:hidden"
          onClick={onClose}
        >
          <motion.div
            variants={variants.menu}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onAnimationComplete={handleAnimationComplete}
            className="absolute  top-0 left-0 bottom-0 w-full max-w-sm bg-white"
            onClick={e => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            {isContentReady ? (
              <Suspense fallback={<MenuSkeleton />}>
                <MobileCategoryMenu key={Date.now()} />
              </Suspense>
            ) : (
              <MenuSkeleton />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileMenuOverlay.displayName = 'MobileMenuOverlay';

const Header = () => {
  // Remplacer useState par useRef pour isScrolled car il n'a pas besoin de déclencher un re-render
  const isScrolledRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);

 

  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isSearchOpen: false,
    showCategories: false
  });

  // Memoize les callbacks



  // Optimiser les queries avec les options RTK Query


  const { data: userData, isLoading } = useGetUserQuery('Auth');

console.log('us')
console.log(userData)


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

  const handleSearchToggle = useCallback(() => {
    setUiState(prev => ({ ...prev, isSearchOpen: !prev.isSearchOpen }));
  }, []);
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity)

  // Memoize les composants qui peuvent être réutilisés
  const headerActions = useMemo(() => (
    <div className="flex items-center gap-4">
      <button
        onClick={handleSearchToggle}
        className="text-gray-700 hover:text-[#ed7e0f]"
      >
        <Search className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
      </button>
      <DropdownAccount currentUser={userData}>
        {!userData && (
          <div className="text-gray-700 hover:text-[#ed7e0f] cursor-pointer">
            <User className="h-6 w-6 max-sm:w-5 max-sm:h-5" />
          </div>
        )}

        {userData && (userData.role_id === 1 || userData.role_id === 3) && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={userData.profile} />
            <AvatarFallback>{userData?.userName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </DropdownAccount>

      {!userData && <AsyncLink to="/cart">

<div

  className="relative text-gray-700 hover:text-[#ed7e0f]"
>
  <ShoppingCart className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
  <span className="absolute -top-2 max-sm:-top-3 -right-2  max-sm:h-[18px] bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 max-sm:text-xs flex items-center justify-center">
    {totalQuantity}
  </span>
</div>
</AsyncLink>}
    </div>
  ), [userData, handleSearchToggle, totalQuantity]);

  const handleCloseMenu = useCallback(() => {
    setUiState(prev => ({ ...prev, isMenuOpen: false }));
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <header
        ref={headerRef}
        className="w-full max-sm:hidden bg-white border-b z-50  fixed top-0 left-0 transition-all duration-300 -translate-y-full"
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <AsyncLink to="/" className="flex-shrink-0">
              <OptimizedImage src={logo} alt="logo AKEVAS" className="h-16 w-auto" />
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
      <header className="w-full  z-50 bg-white border-b max-sm:sticky top-0">
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
              <OptimizedImage src={logo} alt="Logo" className="h-16 w-auto lg:h-12" />
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
              <SearchBar className="hidden md:block" />

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

                  {userData && (userData.role_id === 1 || userData.role_id === 3 || userData.role_id === 4) && <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={userData.profile} />
                      <AvatarFallback>
                        {userData.role_id === 4 ? userData?.firstName.charAt(0) : userData?.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>}
                </DropdownAccount>
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
          <div className="flex justify-center gap-12 items-center w-full">
            <div className='w-12'>
            <MegaMenu />
            </div>
            <div className='flex-1'>
            <CategoryNavigation />
            </div>
            
          </div>
        </div>
      </header>

      <MobileMenuOverlay
        isOpen={uiState.isMenuOpen}
        onClose={handleCloseMenu}
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {uiState.isSearchOpen && (
          <SearchResource open={handleSearchToggle} />
        )}
      </AnimatePresence>
    </>
  );
};

// Optimiser le memo avec une fonction de comparaison
export default React.memo(Header, () => {
  return true; // Le Header n'a pas de props qui changent
});