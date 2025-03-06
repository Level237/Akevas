import { Search, MapPin, Clock, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGetOrderByTownQuery, useGetOrderByPreferencesQuery } from '@/services/auth'
import { formatDate } from '@/lib/formatDate'
import IsLoadingComponents from './ui/isLoadingComponents'


const HomeAuth = () => {


  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const { data: ordersCity, isLoading, error } = useGetOrderByTownQuery('Auth')
  const { data: ordersPreferences, isLoading: isLoadingPreferences, error: errorPreferences } = useGetOrderByPreferencesQuery("Auth")
  return <div>        <div className="max-w-7xl mx-auto px-4 py-6">
    {/* En-tête de la section */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Tableau de bord Livreur
      </h1>
      <p className="text-gray-600">
        Retrouvez ici toutes les commandes disponibles
      </p>
    </div>

    {/* Barre de recherche */}
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex max-sm:flex-col gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par ville ou quartier..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <select className="border rounded-lg px-4 py-2 bg-white">
          <option value="">Toutes les villes</option>
          <option value="paris">Paris</option>
          <option value="lyon">Lyon</option>
          {/* Ajoutez d'autres villes */}
        </select>
      </div>
    </div>

    {/* Onglets */}
    <div className="flex gap-4 mb-6">
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-[#ed7e0f] text-white' : 'bg-white text-gray-600'
          }`}
        onClick={() => setActiveTab('all')}
      >
        Toutes les commandes
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'nearby' ? 'bg-[#ed7e0f] text-white' : 'bg-white text-gray-600'
          }`}
        onClick={() => setActiveTab('nearby')}
      >
        Selon vos préférences
      </button>
    </div>

    {/* Liste des commandes */}
    <div className="grid gap-4">
      {isLoading && <IsLoadingComponents isLoading={isLoading} />}
      {activeTab === 'all' && !isLoading && ordersCity?.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/order/${order.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="text-[#ed7e0f]" size={24} />
              <div>
                <h3 className="font-semibold">Commande #{order.id}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={16} className="mr-1" />
                  {`Beedi`} - {order.quarter_delivery}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{formatDate(order.created_at)}</span>
              </div>
              <span className="text-sm font-medium text-[#ed7e0f]">
                {order.isTake == "0" ? "En attente" : "En cours"}
              </span>
            </div>
          </div>
        </div>
      ))}
      {activeTab === "all" && !isLoading && ordersCity?.length === 0 && <div className="text-center text-gray-600">Aucune commande disponible</div>}
      {isLoadingPreferences && <IsLoadingComponents isLoading={isLoadingPreferences} />}
      {activeTab === 'nearby' && !isLoadingPreferences && ordersPreferences?.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/order/${order.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="text-[#ed7e0f]" size={24} />
              <div>
                <h3 className="font-semibold">Commande #{order.id}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={16} className="mr-1" />
                  {`Beedi`} - {order.quarter_delivery}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{formatDate(order.created_at)}</span>
              </div>
              <span className="text-sm font-medium text-[#ed7e0f]">
                {order.isTake == "0" ? "En attente" : "En cours"}
              </span>
            </div>
          </div>
        </div>
      ))}
      {activeTab === 'nearby' && !isLoadingPreferences && ordersPreferences?.length === 0 && <div className="text-center text-gray-600">Aucune commande disponible</div>}
    </div>
  </div></div>
}

export default HomeAuth