import { Search, MapPin, Clock, Package, RefreshCw, CheckCircle2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGetOrderByTownQuery, useGetOrderByPreferencesQuery, useGetUserQuery } from '@/services/auth'
import { formatDate } from '@/lib/formatDate'
import IsLoadingComponents from './ui/isLoadingComponents'
import { motion,AnimatePresence } from 'framer-motion'


const HomeAuth = () => {


  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const { data: ordersCity, isLoading } = useGetOrderByTownQuery('Auth')
  const { data: ordersPreferences, isLoading: isLoadingPreferences } = useGetOrderByPreferencesQuery("Auth")
  const [message, setMessage] = useState(sessionStorage.getItem('message') || '');
  const { data: userData } = useGetUserQuery('Auth', {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  const handleCloseMessage = () => {
    sessionStorage.removeItem('message');
    setMessage('');
  };
  return <div>        <div className="max-w-7xl mx-auto px-4 py-6">

<AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{message}</span>
                  </div>
                  <button
                    onClick={handleCloseMessage}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    {userData?.feedbacks.length >0 && userData?.isDelivery === 0 && (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Documents à mettre à jour</h2>
          <p className="text-gray-600 max-w-md">
            {userData.feedbacks[0].message}
          </p>
          <button 
            className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#d97100] transition-colors"
            onClick={() => navigate('/update-docs')}
          >
            Mettre à jour mes documents
          </button>
        </div>
      </div>
    )}
    {userData?.isDelivery === 0 && userData?.feedbacks.length ===0 && (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="animate-spin absolute inset-0 rounded-full border-t-2 border-[#ed7e0f] border-opacity-20"></div>
            <div className="animate-spin absolute inset-0 rounded-full border-t-2 border-[#ed7e0f] border-opacity-40" style={{ animationDelay: '0.2s' }}></div>
            <div className="animate-spin absolute inset-0 rounded-full border-t-2 border-[#ed7e0f]" style={{ animationDelay: '0.4s' }}></div>
            <div className="h-16 w-16"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Compte en cours d'activation</h2>

          <p className="text-gray-600 max-w-md">
            Notre équipe examine actuellement votre dossier. Cette vérification permet de garantir la qualité de notre service. Vous recevrez une notification dès que votre compte sera activé.
          </p>

          <div className="flex items-center gap-2 text-sm text-[#ed7e0f] font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ed7e0f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ed7e0f]"></span>
            </span>
            Traitement en cours...
          </div>
        </div>
      </div>
    )}
    {userData?.isDelivery === 1 && (
      <div>
        {/* En-tête de la section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Tableau de bord Livreur
            </h1>
            <p className="text-gray-600">
              Retrouvez ici toutes les commandes disponibles
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Rafraîchir la page"
          >
            <RefreshCw size={24} className="text-[#ed7e0f]" />
          </button>
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
        <div className="flex max-sm:text-sm max-sm:gap-2 gap-4 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading && <IsLoadingComponents isLoading={isLoading} />}
          {activeTab === 'all' && !isLoading && ordersCity?.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/order/${order.id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#ed7e0f]/10 text-[#ed7e0f]">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Commande #{order.id}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={16} className="mr-1" />
                      {`Beedi`} - {order.quarter_delivery}
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.isTake == "0" ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {order.isTake == "0" ? "En attente" : "En cours"}
                </span>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-gray-100" />

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-gray-500" />
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ed7e0f] font-medium">Voir les détails →</span>
              </div>
            </div>
          ))}
          {activeTab === "all" && !isLoading && ordersCity?.length === 0 && <div className="text-center text-gray-600">Aucune commande disponible</div>}
          {isLoadingPreferences && <IsLoadingComponents isLoading={isLoadingPreferences} />}
          {activeTab === 'nearby' && !isLoadingPreferences && ordersPreferences?.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/order/${order.id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#ed7e0f]/10 text-[#ed7e0f]">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Commande #{order.id}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={16} className="mr-1" />
                      {`Beedi`} - {order.quarter_delivery}
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.isTake == "0" ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {order.isTake == "0" ? "En attente" : "En cours"}
                </span>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-gray-100" />

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-gray-500" />
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ed7e0f] font-medium">Voir les détails →</span>
              </div>
            </div>
          ))}
          {activeTab === 'nearby' && !isLoadingPreferences && ordersPreferences?.length === 0 && <div className="text-center text-gray-600">Aucune commande disponible</div>}
        </div>
      </div>
    )}
  </div></div>
}

export default HomeAuth