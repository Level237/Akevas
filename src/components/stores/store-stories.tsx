import { ChevronRight } from 'lucide-react'
import AsyncLink from '../ui/AsyncLink'
import SlideFeatureShop from './slide-feature-shop'
import { Shop } from '@/types/shop'
import React from 'react'

const StoreStories = React.memo(({ title, description, shops, isLoading }: { title: string, description: string, shops: Shop[], isLoading: boolean }) => {

  return (
    <>
      <section className="w-full max-sm:p-2 max-sm:py-12  overflow-x-hidden  mt-[-1rem]   bg-[#6e0a13] py-12">
        <div className="overflow-x-hidden  max-sm:py-5  ">
          <div className="flex  justify-between items-baseline mb-6">
            <div className="mx-12 max-sm:mx-0">
              <h2 className="text-2xl md:text-3xl max-sm:text-xl font-bold mb-2 text-white">{title}</h2>
              <p className="text-xl md:text-2xl max-sm:text-sm  text-gray-200">{description}</p>
            </div>
            <AsyncLink
              to="/shops"
              className="hidden md:flex text-white items-center  text-sm hover:underline"
            >
              Voir toutes les boutiques
              <ChevronRight className="ml-1 h-4 w-4" />
            </AsyncLink>
          </div>

          <SlideFeatureShop shops={shops} isLoading={isLoading} />
          <AsyncLink
            to="/shops"
            className="flex md:hidden text-white items-center  justify-center mt-6 text-sm max-sm:text-xs hover:underline"
          >
            Voir toutes les boutiques
            <ChevronRight className="ml-1 h-4 w-4" />
          </AsyncLink>
        </div>
      </section>

    </>

  )
}, (prevProps, nextProps) => {
  return prevProps.isLoading === nextProps.isLoading &&
    prevProps.shops === nextProps.shops;
});

export default StoreStories;
