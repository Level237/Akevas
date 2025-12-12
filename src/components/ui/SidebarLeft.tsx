import { Home, Store, ShoppingBag, ShoppingCart, User, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AsyncLink from './AsyncLink';
import { useCurrentSellerQuery } from '@/services/sellerService';



export default function SidebarLeft() {
  const location = useLocation();
  const { data: { data: seller } = {} } = useCurrentSellerQuery('seller');
  const shopId = seller?.shop?.shop_id;




  const navItems = [
    {
      icon: Home,
      label: 'Tableau de bord',
      path: '/seller/dashboard'
    },
    {
      icon: Store,
      label: 'Ma Boutique',
      path: `/shop/${shopId}`
    },
    {
      icon: ShoppingBag,
      label: 'Produits',
      path: '/seller/products'
    },
    {
      icon: ShoppingCart,
      label: 'Commandes',
      path: '/orders'
    },
    {
      icon: User,
      label: 'Profil',
      path: '/account'
    }
  ];

  return (
    <aside
      className="fixed max-sm:hidden top-0 left-0 h-screen w-16 flex flex-col items-center py-4 bg-white rounded-tr-3xl rounded-br-3xl shadow-xl z-50 border-r border-[#ed7e0f]/10"
      style={{ minWidth: 84 }}
    >
      {/* Logo / Create */}
      <AsyncLink to="/seller/create-product" className="mb-8 mt-2 flex items-center justify-center w-10 h-10 rounded-2xl bg-[#6e0a13] shadow-lg hover:scale-105 transition-transform">
        <Plus className="w-4 h-4 text-white" />
        <span className="sr-only">Créer</span>
      </AsyncLink>
      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1 w-full items-center">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          const linkPath = item.label === 'Ma Boutique' ? `/shop/${shopId}` : item.path;
          
          return (

            <>

            {item.label == "Ma Boutique" ? (
              <a href={`https://akevas.com/shop/${shopId}`} target='_blank' className={`group flex flex-col mb-2 items-center w-full py-2 rounded-xl transition relative ${active ? 'bg-[#6e0a13]/10 text-[#ed7e0f] font-semibold shadow' : 'text-[#ed7e0f]/80 hover:bg-[#6e0a13]/5 hover:text-[#6e0a13]'}`}>
              <Icon className={`w-6 h-6 mb-0.5 transition ${active ? 'text-[#ed7e0f]' : 'text-[#ed7e0f]/60 group-hover:text-[#ed7e0f]'}`} />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ed7e0f] rounded-r-full" />
              )}
            </a>
            ) : (
              <AsyncLink
              key={item.path}
              to={linkPath}
              className={`group flex flex-col mb-2 items-center w-full py-2 rounded-xl transition relative ${active ? 'bg-[#6e0a13]/10 text-[#ed7e0f] font-semibold shadow' : 'text-[#ed7e0f]/80 hover:bg-[#6e0a13]/5 hover:text-[#6e0a13]'}`}
            >
              <Icon className={`w-6 h-6 mb-0.5 transition ${active ? 'text-[#ed7e0f]' : 'text-[#ed7e0f]/60 group-hover:text-[#ed7e0f]'}`} />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ed7e0f] rounded-r-full" />
              )}
            </AsyncLink>
            )}
            </>
          
          );
        })}
      </nav>
      {/* Notifications & Profile */}
      <div className="flex flex-col items-center gap-4 mb-2">

        <button className="w-8 h-8 rounded-full bg-[#ed7e0f]/10 flex items-center justify-center text-[#ed7e0f] text-base font-bold border-2 border-[#ed7e0f]/20 hover:border-[#ed7e0f] transition">
          <User className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
} 