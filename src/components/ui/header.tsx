import React, { useState, useEffect, useMemo, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, X, Menu, Bell } from 'lucide-react'
import logo from '../../assets/logo.png';
import { NavigationMenuLink } from './navigation-menu';
import { cn } from '@/lib/utils';
import AsyncLink from './AsyncLink';
import DropdownAccount from './dropdown-account';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { useGetUserQuery } from '@/services/auth';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import { MobileSidebar } from '../delivery/MobileSidebar'


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






const Header = () => {
  // Regrouper les états liés dans un seul objet pour réduire les re-renderings
  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isSearchOpen: false,
    isScrolled: false,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => {
      setUiState(prev => ({ ...prev, isScrolled: window.scrollY > 300 }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity)

  // Memoize les composants qui peuvent être réutilisés
  const headerActions = useMemo(() => (
    <div className="flex items-center gap-4">
      <button

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
  ), [userData, totalQuantity]);

  return (
    <>
      {/* Header Principal */}
      <header className={`w-full bg-white border-b z-50 sticky top-0 left-0 transition-all duration-300 ${uiState.isScrolled ? 'shadow-md' : ''
        }`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Burger Menu pour Mobile */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <AsyncLink to="/dashboard" className="flex-shrink-0">
              <img src={logo} alt="AKEVAS Delivery" className="h-16 w-auto" />
            </AsyncLink>

            {/* Navigation principale du livreur */}
            <nav className="hidden md:flex items-center space-x-6">
              <AsyncLink
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-[#ed7e0f] transition-colors"
              >
                Tableau de bord
              </AsyncLink>
              <AsyncLink
                to="/deliveries"
                className="text-sm font-medium text-gray-700 hover:text-[#ed7e0f] transition-colors"
              >
                Mes livraisons
              </AsyncLink>
              <AsyncLink
                to="/history"
                className="text-sm font-medium text-gray-700 hover:text-[#ed7e0f] transition-colors"
              >
                Historique
              </AsyncLink>
              <AsyncLink
                to="/earnings"
                className="text-sm font-medium text-gray-700 hover:text-[#ed7e0f] transition-colors"
              >
                Mes gains
              </AsyncLink>
            </nav>

            {/* Actions du livreur */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">En ligne</span>
              </div>

              <DropdownAccount currentUser={userData}>
                {userData && (
                  <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData.profile} />
                      <AvatarFallback>{userData?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {!userData && (
                  <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </DropdownAccount>
              <Bell />
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {uiState.isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
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
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setUiState(prev => ({ ...prev, isMenuOpen: false }))}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="p-4 space-y-4">
                <AsyncLink
                  to="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Tableau de bord
                </AsyncLink>
                <AsyncLink
                  to="/deliveries"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Mes livraisons
                </AsyncLink>
                <AsyncLink
                  to="/history"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Historique
                </AsyncLink>
                <AsyncLink
                  to="/earnings"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Mes gains
                </AsyncLink>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

// Hook personnalisé pour tracer les re-renderings (optionnel)
const useTraceUpdate = (props: any) => {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps: any, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
};

export default React.memo(Header);