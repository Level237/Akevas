import { LogOut, Menu } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Bell, Settings } from 'lucide-react'
import { Store } from 'lucide-react'
import React from 'react'

import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/authSlice'
import { Seller } from '@/types/seller'
import { CheckStateSeller } from '../../admin/seller/list-sellers'
import { useLogoutMutation } from '@/services/auth'
import AsyncLink from '@/components/ui/AsyncLink'


export default function Header({isMobile,setIsSidebarOpen,sellerData}:{isMobile:boolean,setIsSidebarOpen:React.Dispatch<React.SetStateAction<boolean>>,sellerData:Seller | null | undefined}) {

 

 const [logout]=useLogoutMutation() 
 const dispatch=useDispatch();
const handleLogout=async()=>{
    await logout('Auth');
    dispatch(logoutUser())
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
              <div className="flex max-sm:hidden items-center">
                <Store className="w-8 h-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">
                  Espace Vendeur
                </h1>
              </div>
              <nav className="hidden lg:flex space-x-6">
                <AsyncLink to='/seller/dashboard'><span className="text-[#ed7e0f] font-medium">Tableau de bord</span></AsyncLink>
                {sellerData?.shop.level!=="1" && <AsyncLink to='/seller/products'><span className="text-gray-400 cursor-pointer">Produits</span></AsyncLink>}
                {sellerData?.shop.level==="1" && <span className="text-gray-400 cursor-not-allowed">Produits</span>}
                
                <span className="text-gray-400 cursor-not-allowed">Commandes</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
               <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{sellerData?.shop.shop_name}</p>
                  <CheckStateSeller state={sellerData?.shop.state || null}/>
                 
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
