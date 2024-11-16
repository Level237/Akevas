import CategorySlider from '@/components/frontend/category-slider'
import StoreHero from '@/components/frontend/StoreHero'
import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import React from 'react'

export default function Homepage() {
  return (
    <>
      <section className='overflow-hidden'>
        <TopBar/>
        <Header/>
        <StoreHero/>
        <h2 className='text-3xl mx-12 mb-8 font-bold'>
          Shop by Category
        </h2>
        <CategorySlider/>
      </section>
    </>
  )
}
