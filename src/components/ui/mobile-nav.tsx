import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = useMemo(() => [
    {
      icon: Home,
      label: 'Accueil',
      path: '/'
    },
    {
      icon: Store, 
      label: 'Boutiques',
      path: '/shops'
    },
    {
      icon: ShoppingBag,
      label: 'Produits', 
      path: '/products'
    },
    {
      icon: ShoppingCart,
      label: 'Panier',
      path: '/cart'
    },
    {
      icon: User,
      label: 'Compte',
      path: '/account'
    }
  ], []);

  const isActive = useMemo(() => 
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
   
    <nav className="fixed  w-[100vw] bottom-0 left-0 right-0 bg-white border-t md:hidden z-[9999999999999999999999]">
      <div className="flex justify-around   items-center h-14 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                active ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs mt-0.5 font-medium">{item.label}</span>
              {active && (
                <div className="absolute top-0 h-0.5 w-10 sm:w-12 bg-[#ed7e0f] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default React.memo(MobileNav);
