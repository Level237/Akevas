import { useState } from 'react';

import {
  Plus,
  Search,
} from 'lucide-react';

import AsyncLink from '@/components/ui/AsyncLink';
import { ProductListContainer } from '@/components/seller/products/ProductListOverview';
import { useSearchParams } from 'react-router-dom';
import { useCurrentSellerQuery } from '@/services/sellerService';
import SidebarLeft from '@/components/ui/SidebarLeft';
import MobileNav from '@/components/ui/mobile-nav';
import AccountNotActivated from '@/components/seller/AccountNotActivated';
import RejectedProductAlert from '@/components/seller/RejectedProductAlert';


const DashboardProductListPage = () => {
  const [searchParams] = useSearchParams();
  const isTrashView = searchParams.get('s') === '1';
  const isRejectedView = searchParams.get('r') === '1';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');


  const { data: { data: sellerData } = {}, isLoading } = useCurrentSellerQuery('seller');

  if (sellerData?.isSeller === 0) {
    return <>
      <SidebarLeft />

      <MobileNav />
      <AccountNotActivated />
    </>;
  }

  return (
    <div className="container max-w-[1440px] mx-auto mx-24 w-92  max-sm:mx-auto px-4 py-8">
      
      <div className='mb-6 mr-24'>
        {!isLoading && sellerData?.last_feedbacks_product_verification != 0 && !isTrashView && !isRejectedView  && <RejectedProductAlert rejectedCount={sellerData?.last_feedbacks_product_verification as number}/>}
      </div>
      <div className="mb-6 ">
        <h1 className="text-2xl  font-bold text-gray-900">{isTrashView ? "Corbeille des produits" : isRejectedView ? "Produits rejetés" : "Mes produits"}</h1>
        <p className="text-gray-600 mt-1">
          {isTrashView ? '' : isRejectedView ? '' : "Gérez votre catalogue de produits"}

        </p>
      </div>

      <div className="bg-white overflow-x-hidden max-sm:o rounded-2xl shadow-sm">
        <div className="p-6">
          {/* Actions Bar */}
          <div className="flex flex-col   items-center justify-start md:flex-row gap-4 mb-6">
            <div className="w-[50%] max-sm:w-[100%]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full  pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex max-sm:items-start gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border max-sm:px-1 rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="out_of_stock">Rupture</option>
              </select>
              <AsyncLink
                to="/seller/create-product"
                className="flex items-center gap-2 max-sm:px-2 max-sm:py-3 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 transition-colors"
              >
                <Plus className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                <span className="max-sm:text-xs">Nouveau produit</span>
              </AsyncLink>
            </div>
          </div>

          <ProductListContainer searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default DashboardProductListPage;
