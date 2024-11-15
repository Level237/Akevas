import StoreHero from '@/components/frontend/StoreHero'
import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import React from 'react'

export default function Homepage() {
  return (
    <>
      <section>
        <TopBar/>
        <Header/>
        <StoreHero/>
        <h2 className='text-3xl mx-12 mb-8 font-bold'>
          Shop by Category
        </h2>
        <div className='grid grid-cols-7 mb-20 gap-8'>
        <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/sac.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Bag</h2>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/man.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Man</h2>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/woman.jpeg')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Woman</h2>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/shoes1.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Shoes</h2>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/kids.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Bag</h2>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/traditional.jpeg')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Traditional</h2>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/kids.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                  
                </div>
                <div>
                  <h2 className='text-center text-lg'>Cosmetiques</h2>
                </div>
            </div>
        </div>
      </section>
    </>
  )
}
