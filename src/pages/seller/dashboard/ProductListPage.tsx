import { useState } from 'react';

import {
  Plus,
  Search,
} from 'lucide-react';

import AsyncLink from '@/components/ui/AsyncLink';
import { ProductListContainer } from '@/components/seller/products/ProductListOverview';


const DashboardProductListPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

 



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes produits</h1>
        <p className="text-gray-600 mt-1">
          Gérez votre catalogue de produits
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="out_of_stock">Rupture</option>
              </select>
              <AsyncLink
                to="/seller/create-product"
                className="flex items-center gap-2 max-sm:px-2 max-sm:py-1 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 transition-colors"
              >
                <Plus className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                <span className="max-sm:text-xs">Nouveau produit</span>
              </AsyncLink>
            </div>
          </div>

        <ProductListContainer/>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductListPage;
