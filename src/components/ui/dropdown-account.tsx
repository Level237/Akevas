

import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"
import { Package, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import AsyncLink from "./AsyncLink"



const DropdownAccount = ({ children, currentUser }: { children: React.ReactNode, currentUser: any | null }) => {
  const [isOpen, setIsOpen] = useState(false)


  const menuItems = [
    { icon: Package, text: "Commandes", link: "/user/orders" },
    { icon: User, text: "Mon Compte", link: "/account" },
  ]

  const settingsItems = [
    { text: "Contactez le support", link: "/contact" },
    { text: "Conditions d'utilisation", link: "/terms-of-use" },
    { text: "Politique de confidentialité", link: "/privacy-policy" },
  ]

  const handleMouseEnter = () => {
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }


  return (
    <div className="relative z-[99999] ">
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
              className="absolute z-[99999]  right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 "
            >
              <div className="px-4 py-3  border-b border-gray-100">
                {!currentUser && <><Link to={"/login"}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Se connecter</Button></Link>
                  <Link to={"/register"}><Button variant="ghost" className="w-full text-sm">S&apos;inscrire</Button></Link></>}
                {currentUser && currentUser.role_id === 2 && <><AsyncLink to={"/shop/" + currentUser.shop.shop_id}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Voir ma boutique</Button></AsyncLink>
                  <AsyncLink to={"/seller/dashboard"}><Button variant="ghost" className="w-full text-sm">Tableau de bord</Button></AsyncLink></>}
                {currentUser && currentUser.role_id === 4 && <><AsyncLink to={"/delivery/dashboard"}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Tableau de bord</Button></AsyncLink>
                  <AsyncLink to={"/delivery/profile"}><Button variant="ghost" className="w-full text-sm">Mon profil</Button></AsyncLink>
                </>}
                {currentUser && currentUser.role_id === 1 && <AsyncLink to={"/admin/dashboard"}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Tableau de bord</Button></AsyncLink>}
                {currentUser && currentUser.role_id === 3 && <AsyncLink to={"/user/dashboard"}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Tableau de bord</Button></AsyncLink>}
              </div>

              <div className="py-2">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.text}
                  </motion.a>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500">
                  Réglages
                </div>
                {settingsItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (menuItems.length + index) * 0.05 }}
                  >
                    {item.text}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
DropdownAccount.displayName = 'DropdownAccount';
export default React.memo(DropdownAccount);