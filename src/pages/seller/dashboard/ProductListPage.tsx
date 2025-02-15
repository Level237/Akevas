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
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'out_of_stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'draft':
        return 'Brouillon';
      case 'out_of_stock':
        return 'Rupture';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Produit</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Prix</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Aucun produit trouvé</p>
                      <Link
                        to="/seller/create-product"
                        className="text-[#ed7e0f] hover:underline mt-2 inline-block"
                      >
                        Ajouter votre premier produit
                      </Link>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">
                              {product.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">
                          {product.price.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">{product.stock}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Voir"
                          >
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductListPage;
