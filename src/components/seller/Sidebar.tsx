import React from 'react';
import { motion } from 'framer-motion';
import logo from "../../assets/logo.png"
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  HelpCircle,
  ChevronRight,
  User,
} from 'lucide-react';
import AsyncLink from '../ui/AsyncLink';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Tableau de bord",
      active: true,
      disabled: false,
      href: "/seller/dashboard"
    },
    {
      icon: Package,
      label: "Produits",
      active: false,
      disabled: false,
      href: "/seller/products"
    },
    {
      icon: ShoppingCart,
      label: "Commandes",
      active: false,
      disabled: false,
      href: "/orders"
    },
    {
      icon: User,
      label: "Mon compte",
      active: false,
      disabled: false,
      href: "/account"
    },
    {
      icon: HelpCircle,
      label: "Aide",
      active: false,
      disabled: false
    }
  ];

  const sidebar = (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`fixed inset-y-0  left-0 w-64 bg-white shadow-lg z-50 
        ${isMobile ? 'block' : 'hidden lg:block'} 
        ${isOpen ? 'block' : 'lg:block hidden'}`}
    >
      <div className="flex flex-col h-full">
        {/* En-tête Sidebar */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <AsyncLink to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="AKEVAS"
                className="h-20 w-auto"
              />
            </AsyncLink>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors
                    ${item.active
                      ? 'bg-[#ed7e0f]/10 text-[#ed7e0f]'
                      : item.disabled
                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-[#ed7e0f]' : 'text-gray-400'
                    }`} />
                  <span className="ml-3 font-medium">{item.label}</span>
                  {!item.disabled && (
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <button className="w-full px-4 py-2 text-sm text-white bg-[#ed7e0f] rounded-lg hover:bg-[#ed7e0f]/90 transition-colors">
            Support
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Overlay sur mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 z-40"
        />
      )}
      {sidebar}
    </>
  );
};

export default Sidebar;
