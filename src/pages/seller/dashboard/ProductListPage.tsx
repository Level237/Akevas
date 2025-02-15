import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Package
} from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import AsyncLink from '@/components/ui/AsyncLink';
import { ProductListContainer } from '@/components/seller/products/ProductListOverview';
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  image: string;
  category: string;
  createdAt: string;
}

const DashboardProductListPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'T-shirt Premium',
          price: 15000,
          stock: 50,
          status: 'active',
          image: '/product1.jpg',
          category: 'Vêtements',
          createdAt: '2025-01-20'
        },
        // Add more mock products
      ]);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);




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
                className="flex items-center gap-2 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nouveau produit
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
