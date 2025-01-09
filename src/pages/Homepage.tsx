
import { CategorySlider } from '@/components/frontend/category-slider'
import ProductList from '@/components/frontend/product-list'
import StoreHero from '@/components/frontend/StoreHero'
import FeaturedStores from '@/components/stores/FeaturedStores'
import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import banner1 from "../assets/banner-7.webp"
import banner2 from "../assets/banner-8.webp"
import banner3 from "../assets/banner-9.webp"
import StoreStories from '@/components/stores/store-stories'
import PremiumProducts from '@/components/products/PremiumProducts'
export default function Homepage() {
  return (
    <>
      <section className='overflow-hidden'>
        <TopBar/>
        <Header/>
        <StoreHero/>
      
        
        <StoreStories/>
        <CategorySlider />
        <PremiumProducts/>
        
      </section>
    </>
  )
}
