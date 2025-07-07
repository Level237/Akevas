import { Coins, LogOut, Menu, User, Bell, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Seller } from '@/types/seller'

import { useLogoutMutation } from '@/services/auth'
import AsyncLink from '@/components/ui/AsyncLink'
import { logoutUser } from '@/lib/logout'
import logo from '@/assets/favicon.png'
import { CheckStateSeller } from '@/components/dashboard/seller/CheckStateSeller'
import { Link } from 'react-router-dom'

export default function Header({ isMobile, setIsSidebarOpen, sellerData }: { isMobile: boolean, setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>, sellerData: Seller | null | undefined }) {
  const [logout] = useLogoutMutation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout('Auth');
    logoutUser()
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-20 px-4">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo & menu mobile */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            )}
            <Link to="/">
              <div className="flex items-center group">
                <motion.img 
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  src={logo} 
                  alt="Espace Vendeur" 
                  className="w-12 h-12 object-contain" 
                />
                <h1 className="ml-2 text-xl font-semibold bg-gradient-to-r from-[#ed7e0f] to-[#f19b45] bg-clip-text text-transparent group-hover:from-[#f19b45] group-hover:to-[#ed7e0f] transition-all duration-300">
                  Espace Vendeur
                </h1>
              </div>
            </Link>
          </div>

          {/* Barre de recherche centrée */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent bg-gray-50"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
            </div>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center gap-4 relative">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full transition-colors bg-gray-50 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-[#ed7e0f] rounded-full"></span>
            </motion.button>
            {/* Section coins */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#fff7f0] border border-[#ed7e0f]/20 text-[#ed7e0f] font-semibold text-sm">
              <Coins className="w-4 h-4 mr-1" />
              <span>{sellerData?.shop?.coins ?? 0}</span>
            </div>
            {/* Avatar + menu */}
            <div className="relative">
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 cursor-pointer group"
              >
                <Avatar className="h-9 w-9 border-2 border-gray-200 group-hover:border-[#ed7e0f] transition-colors">
                  <AvatarFallback className="bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] text-white">
                    {sellerData?.firstName?.charAt(0) || '?'}
                  </AvatarFallback>
                  <AvatarImage className="object-cover" src={sellerData?.shop?.shop_profile || ""} />
                </Avatar>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-[#ed7e0f] transition-colors">
                    {sellerData?.shop.shop_name}
                  </p>
              </motion.div>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
                  >
                    <AsyncLink to="/account">
                      <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Mon profil
                      </div>
                    </AsyncLink>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// Composant pour les liens de navigation
const NavLink = ({ children, to, active = false }: { children: React.ReactNode, to: string, active?: boolean }) => {
  return (
    <AsyncLink to={to}>
      <div className={`relative px-2 py-1 ${active ? 'text-[#ed7e0f] font-medium' : 'text-gray-600 hover:text-[#ed7e0f]'} transition-colors cursor-pointer`}>
        {children}
        {active && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ed7e0f] rounded-full"
          />
        )}
      </div>
    </AsyncLink>
  )
}