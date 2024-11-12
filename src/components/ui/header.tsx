import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import React from 'react'
import { Button } from './button'
import Preferences from '../frontend/preferences'
import CategoryHeader from '../frontend/category-header'

export default function Header() {
  return (
    <header>
    <nav className=" border-gray-200 mx-12  py-2.5 dark:bg-gray-800">
        <div className="flex  justify-between items-center  ">
          
            <div className="">
               <Preferences/>
            </div>
            <div className=''>
           <a href="/" className="flex items-center">
                
                <span className="text-4xl font-semibold text-red-600">Akiba</span>
            </a>
           </div>
           <div className='flex items-center gap-3'>
            <div>
                <User/>
            </div>
            <div>
                <Heart/>
            </div>
            <div>
                <ShoppingCart/>
            </div>
            <div>
               <Search/>
            </div>
           </div>
        </div>
        <CategoryHeader/>
    </nav>
</header>
  )
}