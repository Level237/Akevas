import React, { useState } from 'react';
import {
  Home,
  Package,
  Clock,
  MapPin,
  Wallet,
  Settings,
  Bell,
  User,
  ChevronRight,
  TrendingUp,
  Truck,
  DollarSign
} from 'lucide-react';

const deliveries = [
  {
    id: 1,
    orderNumber: 'CMD-001',
    status: 'En attente',
    pickupAddress: 'Cocody, Rue des Jardins',
    deliveryAddress: 'Marcory, Zone 4',
    amount: 2500,
    time: '10:30'
  },
  {
    id: 2,
    orderNumber: 'CMD-002',
    status: 'En cours',
    pickupAddress: 'Plateau, Avenue de la République',
    deliveryAddress: 'Yopougon, Rue Principale',
    amount: 3000,
    time: '11:15'
  }
];

const stats = [
  {
    id: 1,
    title: 'Livraisons du jour',
    value: '8',
    icon: Package,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Gains du jour',
    value: '15,000 FCFA',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Temps moyen',
    value: '25 min',
    icon: Clock,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Note',
    value: '4.8/5',
    icon: TrendingUp,
    color: 'bg-yellow-500'
  }
];

const DeliveryDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <div>
                <h2 className="font-semibold">Bonjour, John</h2>
                <p className="text-sm text-gray-500">Livreur #12345</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-colors ${
              isOnline
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-1">{stat.value}</h3>
                <p className="text-gray-500">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Current Deliveries */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Livraisons en cours</h2>
            <div className="space-y-6">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border rounded-xl p-4 hover:border-[#ed7e0f] transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-500">
                        {delivery.orderNumber}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            delivery.status === 'En cours'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {delivery.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {delivery.time}
                        </span>
                      </div>
                    </div>
                    <span className="font-medium">
                      {delivery.amount} FCFA
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Récupération</span>
                        <p className="text-gray-700">{delivery.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Livraison</span>
                        <p className="text-gray-700">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 border rounded-lg text-[#ed7e0f] border-[#ed7e0f] hover:bg-[#ed7e0f] hover:text-white transition-colors flex items-center justify-center gap-2">
                    Voir les détails
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Wallet className="w-8 h-8 text-[#ed7e0f] mb-4" />
            <h3 className="font-medium mb-2">Mes gains</h3>
            <p className="text-sm text-gray-500">
              Consultez vos revenus et retraits
            </p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Clock className="w-8 h-8 text-[#ed7e0f] mb-4" />
            <h3 className="font-medium mb-2">Historique</h3>
            <p className="text-sm text-gray-500">
              Voir vos livraisons passées
            </p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Settings className="w-8 h-8 text-[#ed7e0f] mb-4" />
            <h3 className="font-medium mb-2">Paramètres</h3>
            <p className="text-sm text-gray-500">
              Gérez votre compte et préférences
            </p>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center text-[#ed7e0f]">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Accueil</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <Package className="w-6 h-6" />
            <span className="text-xs mt-1">Livraisons</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <Wallet className="w-6 h-6" />
            <span className="text-xs mt-1">Gains</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
