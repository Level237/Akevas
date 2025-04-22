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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
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
              <div className="flex max-sm:hidden items-center group">
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
            
            <nav className="hidden lg:flex space-x-6">
              <NavLink to="/">Accueil</NavLink>
              <NavLink to="/seller/dashboard" active>Tableau de bord</NavLink>
              {sellerData?.shop.level !== "1" ? 
                <NavLink to="/seller/products">Produits</NavLink> : 
                <span className="text-gray-400 cursor-not-allowed px-2 py-1">Produits</span>
              }
              <NavLink to="/orders">Commandes</NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full transition-colors bg-gray-50 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-[#ed7e0f] rounded-full"></span>
            </motion.button>

            <AsyncLink to="/account">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 flex items-center gap-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors bg-gray-50 hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">Mon compte</span>
              </motion.button>
            </AsyncLink>

            
            
            <div className="relative">
              <motion.div 
                whileTap={{ scale: 0.97 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 pl-3 border-l cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-[#ed7e0f] transition-colors">
                    {sellerData?.shop.shop_name}
                  </p>
                  {sellerData?.shop.state !== "1" && 
                    <CheckStateSeller state={sellerData?.shop.state || null} />
                  }
                  <p className="text-md text-[#ed7e0f] flex items-center gap-1 font-medium">
                    {sellerData?.shop.coins} <Coins className="w-4 h-4 text-[#ed7e0f]" />
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Avatar className="h-9 w-9 border-2 border-gray-200 group-hover:border-[#ed7e0f] transition-colors">
                    <AvatarFallback className="bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] text-white">
                      {sellerData?.firstName.charAt(0)}
                    </AvatarFallback>
                    <AvatarImage className="object-cover" src={sellerData?.shop.shop_profile || ""} />
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </motion.div>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-semibold">{sellerData?.firstName} {sellerData?.lastName}</p>
                      <p className="text-xs text-gray-500">{sellerData?.email}</p>
                    </div>
                    <div className="py-1">
                      <AsyncLink to="/account">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profil
                        </div>
                      </AsyncLink>
                      <AsyncLink to="/seller/settings">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Paramètres
                        </div>
                      </AsyncLink>
                    </div>
                    <div className="border-t border-gray-100">
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
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