import { LogOut, Menu, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Bell, Settings } from 'lucide-react'
import { Store } from 'lucide-react'
import React from 'react'

import { useDispatch } from 'react-redux'
import { Seller } from '@/types/seller'

import { useLogoutMutation } from '@/services/auth'
import AsyncLink from '@/components/ui/AsyncLink'
import { logoutUser } from '@/lib/logout'
import logo from '@/assets/favicon.png'
import { CheckStateSeller } from '@/components/dashboard/seller/CheckStateSeller'
import { Link } from 'react-router-dom'
export default function Header({ isMobile, setIsSidebarOpen, sellerData }: { isMobile: boolean, setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>, sellerData: Seller | null | undefined }) {



  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    await logout('Auth');
    logoutUser()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to="/">
              <div className="flex max-sm:hidden items-center">

                <img src={logo} alt="Espace Vendeur" className="w-16 h-16" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">
                  Espace Vendeur
                </h1>
              </div>
            </Link>
            <nav className="hidden lg:flex space-x-6">
              <AsyncLink to='/'>Accueil</AsyncLink>
              <AsyncLink to='/seller/dashboard'><span className="text-[#ed7e0f] font-medium">Tableau de bord</span></AsyncLink>
              {sellerData?.shop.level !== "1" && <AsyncLink to='/seller/products'><span className="text-gray-400 cursor-pointer">Produits</span></AsyncLink>}
              {sellerData?.shop.level === "1" && <span className="text-gray-400 cursor-not-allowed">Produits</span>}

              <span className="text-gray-400 cursor-not-allowed">Commandes</span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <AsyncLink to="/account">
              <button className="p-2 flex items-center gap-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Mon compte</span>
              </button>
            </AsyncLink>

            <button onClick={handleLogout} className="p-2 flex items-center gap-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Déconnexion</span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{sellerData?.shop.shop_name}</p>
                <CheckStateSeller state={sellerData?.shop.state || null} />

              </div>
              <div className="h-8 w-8  rounded-full flex items-center justify-center">
                <Avatar>
                  <AvatarImage src={sellerData?.shop.shop_profile || ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}