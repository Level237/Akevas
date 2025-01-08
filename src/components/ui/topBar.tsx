import React from 'react'
import { Button } from './button'

export default function TopBar() {
  return (
    <div className=' bg-[#6E0A13] py-3'>
        <div className='flex items-center gap-3 justify-center mx-16'>
            <div>
            <h2 className='text-lg font-bold text-white'>DEVENEZ VENDEUR SUR AKEVAS</h2>
          </div>
      <div>
        <Button className='bg-[#ed7e0f] text-md font-bold'>Créer votre boutique</Button>
      </div>
        </div>
     
    </div>
  )
}
