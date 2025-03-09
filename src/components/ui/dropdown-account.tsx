

import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"
import { Package, ChevronRight, History, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import AsyncLink from "./AsyncLink"
import { logoutUser } from "@/lib/logout"



const DropdownAccount = ({ children, currentUser }: { children: React.ReactNode, currentUser: any | null }) => {
  const [isOpen, setIsOpen] = useState(false)


  const menuItems = [
    { icon: Package, text: "Mes Commandes", link: "/orders" },
    { icon: History, text: "Historique", link: "/delivery/history" },
    { icon: BarChart, text: "Statistiques", link: "/delivery/stats" },
  ]

  const settingsItems = [
    { text: "Mon compte", link: "/account" },

  ]

  const handleMouseEnter = () => {
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }


  return (
    <div className="relative z-[999999] ">
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
            >
              <div className="px-4 py-3 border-b border-gray-100">
                {!currentUser && <><Link to={"/login"}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Se connecter</Button></Link>
                  <Link to={"/register"}><Button variant="ghost" className="w-full text-sm">S&apos;inscrire</Button></Link></>}

                {currentUser && currentUser.role_id === 4 && <><AsyncLink to={"/"}><Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 mb-2">Tableau de bord</Button></AsyncLink>
                  <AsyncLink to={"/account"}><Button variant="ghost" className="w-full text-sm">Mon compte</Button></AsyncLink>
                </>}

              </div>

              <div className="py-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.text}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500">
                  Réglages
                </div>
                {settingsItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.text}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
                <div onClick={() => {
                  logoutUser()
                }}><Button variant="ghost" className="w-full mt-5  text-sm">Déconnexion</Button></div>
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