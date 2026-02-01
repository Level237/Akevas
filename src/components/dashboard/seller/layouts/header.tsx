import { Coins, Menu, Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Seller } from '@/types/seller'


import logo from '@/assets/favicon.png'
import DropdownAccount from './dropdown-account'

import { Link } from 'react-router-dom'
import NotificationDropdown from '@/components/ui/NotificationDropdown'

export default function Header({
  setIsSidebarOpen,
  sellerData,
}: {
  isMobile: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  sellerData: Seller | null | undefined
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  // Responsive: show search as overlay on mobile
  const SearchBar = () => (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Rechercher..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent bg-gray-50"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
    </div>
  )

  return (
    <header className="bg-white  border-b border-gray-100 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-24 max-sm:mx-0 px-2 sm:px-4">
        <div className="flex justify-between items-center h-16 gap-2 sm:gap-4">
          {/* Left: Logo & menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <Link to="/">
              <div className="flex items-center group">
                <motion.img
                  whileHover={{ rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  src={logo}
                  alt="Espace Vendeur"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
                <h1 className="ml-2 hidden xs:inline text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#ed7e0f] to-[#f19b45] bg-clip-text text-transparent group-hover:from-[#f19b45] group-hover:to-[#ed7e0f] transition-all duration-300">
                  Espace Vendeur
                </h1>
              </div>
            </Link>
          </div>

          {/* Center: Search (hidden on mobile, replaced by icon) */}
          <div className="flex-1 flex justify-center">
            <div className="hidden sm:block w-full">
              <SearchBar />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 relative">
            {/* Mobile search icon */}
            <button
              className="sm:hidden p-2 rounded-full text-gray-500 hover:text-[#ed7e0f] transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {/* Notifications */}
            <div
              className="relative cursor-pointer"
              ref={notificationRef}
              onMouseLeave={() => setIsNotificationsOpen(false)}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500  hover:text-gray-700 relative rounded-full transition-colors bg-gray-50 hover:bg-gray-100"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                onMouseEnter={() => setIsNotificationsOpen(true)}
              >
                <Bell className="w-5 cursor-pointer h-5" />
                {sellerData?.notifications_is_count != 0 && <span className="absolute top-1 p-1 right-1.5 w-2 h-2 bg-[#ed7e0f] rounded-full"></span>}

              </motion.button>
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>
            {/* Coins */}
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-[#fff7f0] border border-[#ed7e0f]/20 text-[#ed7e0f] font-semibold text-xs sm:text-sm">
              <Coins className="w-4 h-4 mr-1" />
              <span>{sellerData?.shop?.coins ?? 0}</span>
            </div>

            {/* Avatar + DropdownAccount */}
            <DropdownAccount sellerData={sellerData}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 cursor-pointer group"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-gray-200 group-hover:border-[#ed7e0f] transition-colors">
                  <AvatarFallback className="bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] text-white">
                    {sellerData?.firstName?.charAt(0) || '?'}
                  </AvatarFallback>
                  <AvatarImage className="object-cover" src={sellerData?.shop?.shop_profile || ''} />
                </Avatar>
                <p className="hidden sm:block text-sm font-medium text-gray-900 group-hover:text-[#ed7e0f] transition-colors truncate max-w-[120px]">
                  {sellerData?.shop?.shop_name}
                </p>
              </motion.div>
            </DropdownAccount>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white/95 flex flex-col"
          >
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <button
                className="p-2 mr-2 rounded-full text-gray-500 hover:text-[#ed7e0f] transition-colors"
                onClick={() => setSearchOpen(false)}
                aria-label="Fermer la recherche"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="flex-1">
                <SearchBar />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
