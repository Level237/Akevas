import { Heart, ShoppingCart, User } from 'lucide-react'
import React from 'react'
import { Button } from './button'

export default function Header() {
  return (
    <header>
    <nav className=" border-gray-200   py-2.5 dark:bg-gray-800">
        <div className="flex  justify-between items-center mx-12 ">
          
            <div className="">
                <a href="#" >Log in</a>
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
                <Button>Devenir Vendeur</Button>
            </div>
           </div>
        </div>
    </nav>
</header>
  )
}
