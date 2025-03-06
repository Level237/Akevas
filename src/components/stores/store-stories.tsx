


import { ChevronRight } from 'lucide-react'
import AsyncLink from '../ui/AsyncLink'
import SlideFeatureShop from './slide-feature-shop'
import { Shop } from '@/types/shop'
import React from 'react'

const StoreStories = ({ title, description, shops, isLoading }: { title: string, description: string, shops: Shop[], isLoading: boolean }) => {



  return (
    <>
      <section className="w-full overflow-x-hidden max-sm:mt-12 mt-[-3rem]  bg-[#6e0a13] py-8">
        <div className="overflow-x-hidden  px-4">
          <div className="flex justify-between items-baseline mb-6">
            <div className="mx-2">
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
            to="/stores"
            className="flex md:hidden text-white items-center  justify-center mt-6 text-sm hover:underline"
          >
            Voir toutes les boutiques
            <ChevronRight className="ml-1 h-4 w-4" />
          </AsyncLink>
        </div>
      </section>

    </>

  )
}

StoreStories.displayName = 'StoreStories';
export default React.memo(StoreStories);
