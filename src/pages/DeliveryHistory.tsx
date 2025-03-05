import TopBar from '@/components/ui/topBar'
import Header from '@/components/ui/header'
import { Package, MapPin, Clock, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import MobileNav from '@/components/ui/mobile-nav'
const DeliveryHistory = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    // Simulation de l'historique des livraisons (à remplacer par des données réelles)
    const deliveries = [
        {
            id: 1,
            date: '2024-03-15',
            time: '14:30',
            status: 'completed',
            address: '123 Rue du Commerce, Paris',
            products: [
                { name: 'T-shirt Akevas', quantity: 2 },
                { name: 'Pantalon Classic', quantity: 1 },
            ],
            earnings: '15 €'
        },
        // Ajoutez plus de livraisons ici
    ]

    return (
        <div className="min-h-screen bg-[#F8F9FC]">
            <TopBar />
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Historique des livraisons
                    </h1>
                    <p className="text-gray-600">
                        Consultez vos livraisons précédentes
                    </p>
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher une livraison..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <select
                            className="border rounded-lg px-4 py-2 bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="completed">Terminées</option>
                            <option value="cancelled">Annulées</option>
                        </select>
                    </div>
                </div>

                {/* Liste des livraisons */}
                <div className="space-y-4">
                    {deliveries.map((delivery) => (
                        <div key={delivery.id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Package className="text-blue-500" size={24} />
                                    <div>
                                        <h3 className="font-semibold">Livraison #{delivery.id}</h3>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Clock size={16} className="mr-1" />
                                            <span>{delivery.date} - {delivery.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <span className={`px-3 py-1 rounded-full text-sm ${delivery.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {delivery.status === 'completed' ? 'Terminée' : 'Annulée'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-start gap-2 text-gray-600 mb-3">
                                    <MapPin size={16} className="mt-1" />
                                    <span>{delivery.address}</span>
                                </div>
                                <div className="space-y-2">
                                    {delivery.products.map((product, index) => (
                                        <div key={index} className="text-sm text-gray-600">
                                            {product.quantity}x {product.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-right">
                                    <span className="font-medium text-green-600">
                                        Gains: {delivery.earnings}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <MobileNav />
        </div>
    )
}

export default DeliveryHistory 