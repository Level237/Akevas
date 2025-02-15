
import Header from '@/components/ui/header';

import { Link, ScrollRestoration, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileNav from '@/components/ui/mobile-nav';
import CurrentShopOverView, { CurrentShopOverViewSkeleton } from '@/components/seller/current-shop-overview';
import { useGetShopQuery } from '@/services/guardService';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';



const StorePage: React.FC = () => {

  const {id}=useParams()
  const { data: { data: shop } = {}, isLoading }=useGetShopQuery(id)
  console.log(shop)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />
    
    {isLoading && <CurrentShopOverViewSkeleton/>}
     {!isLoading && <CurrentShopOverView shop={shop}/>}

      {/* Mobile Bottom Navigation */}
      <MobileNav />
   
    </div>
  );
};

export default StorePage;