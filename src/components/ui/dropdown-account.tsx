

import { motion, AnimatePresence } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"
import { Package, ChevronRight, LogOut, User, Store, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import AsyncLink from "./AsyncLink"
import { useLogoutMutation } from "@/services/auth"
import { logoutUser } from "@/lib/logout"

const DropdownAccount = ({ children, currentUser }: { children: React.ReactNode, currentUser: any | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [logout] = useLogoutMutation()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout('Auth');
    logoutUser()
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  // Nettoyer le timeout quand le composant se démonte
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Menu items pour utilisateurs connectés
  const getMenuItems = () => {
    if (!currentUser) return []

    if (currentUser.role_id === 2) { // Vendeur
      return [
        { icon: Store, text: "Tableau de bord", href: `/seller/dashboard`, disabled: currentUser.isSeller === 0 },
        { icon: Package, text: "Mes produits", href: "/seller/products", disabled: currentUser.isSeller === 1 },
        { icon: Package, text: "Mes commandes", href: "/orders", disabled: currentUser.isSeller === 1 },
      ]
    }

    return []
  }

  // Settings items pour utilisateurs connectés
  const getSettingsItems = () => {
    if (!currentUser) return []

    return [
      { icon: User, text: "Mon compte", href: "/account" },
      { icon: HelpCircle, text: "Aide", href: "/help" },
    ]
  }

  const menuItems = getMenuItems()
  const settingsItems = getSettingsItems()

  return (
    <div className="relative z-[999999]" ref={dropdownRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Header avec infos utilisateur ou CTA pour non connectés */}
              <div className="px-4 py-3 border-b border-gray-100">
                {!currentUser ? (
                  // Utilisateur non connecté
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Connectez-vous pour accéder à votre compte</p>
                    <div className="space-y-2">
                      <AsyncLink to="/login">
                        <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80">
                          Se connecter
                        </Button>
                      </AsyncLink>
                      <Link to="/seller/guide">
                        <Button variant="ghost" className="w-full text-sm">
                          S'inscrire
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Utilisateur connecté
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] flex items-center justify-center text-white font-semibold">
                      {currentUser.firstName?.charAt(0) || currentUser.userName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {currentUser.role_id === 2 ? currentUser.shop?.shop_name : currentUser.firstName || currentUser.userName}
                      </p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                )}

                {/* Bouton principal pour utilisateurs connectés */}
                {currentUser && currentUser.role_id === 2 && currentUser.isSeller === 1 && (
                  <AsyncLink to={`/shop/${currentUser.shop?.shop_id}`}>
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 text-sm">
                      Voir ma boutique
                    </Button>
                  </AsyncLink>
                )}
                {currentUser && currentUser.role_id === 4 && (
                  <AsyncLink to="/delivery/dashboard">
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 text-sm">
                      Tableau de bord
                    </Button>
                  </AsyncLink>
                )}


              </div>

              {/* Menu principal (seulement pour utilisateurs connectés) */}
              {currentUser && menuItems.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500">
                    Navigation
                  </div>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AsyncLink to={item.href} className={!item.disabled ? 'hidden' : ''}>
                        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-gray-500" />
                            {item.text}
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </AsyncLink>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Réglages (seulement pour utilisateurs connectés) */}
              {currentUser && settingsItems.length > 0 && (
                <div className="border-t border-gray-100 pt-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500">
                    Réglages
                  </div>
                  {settingsItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (menuItems.length + index) * 0.05 }}
                    >
                      <AsyncLink to={item.href}>
                        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-gray-500" />
                            {item.text}
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </AsyncLink>
                    </motion.div>
                  ))}

                  {/* Déconnexion */}
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (menuItems.length + settingsItems.length) * 0.05 }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Se déconnecter
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  )
}

DropdownAccount.displayName = 'DropdownAccount';
export default React.memo(DropdownAccount);