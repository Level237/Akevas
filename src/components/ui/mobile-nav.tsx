import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const MobileNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
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
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                active ? 'text-[#ed7e0f]' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
              {active && (
                <div className="absolute top-0 h-0.5 w-12 bg-[#ed7e0f] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
