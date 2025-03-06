import { useState } from 'react'
import TopBar from '@/components/ui/topBar'
import Header from '@/components/ui/header'
import MobileNav from '@/components/ui/mobile-nav'
import {
    Package,
    Search,
    Filter,
    MapPin,
    Clock,
    ChevronRight,
    Calendar,
    AlertCircle
} from 'lucide-react'
import { useGetOrderByTownQuery } from '@/services/auth'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { formatDate } from '@/lib/formatDate'

const DeliveryOrders = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const { data: ordersCity, isLoading, error } = useGetOrderByTownQuery('Auth')
    // Simulation des données de commandes (à remplacer par les données réelles)
    const orders = [
        {
            id: "CMD-001",
            pickupAddress: "123 Rue Akevas, Paris",
            deliveryAddress: "45 Avenue République, Paris",
            status: "pending",
            products: [
                { name: "T-shirt Akevas", quantity: 2 },
                { name: "Pantalon Classic", quantity: 1 }
            ],
            timeLimit: "1h",
            createdAt: "2024-03-20 14:30",
            price: "15€"
        },
        {
            id: "CMD-002",
            pickupAddress: "123 Rue Akevas, Paris",
            deliveryAddress: "78 Boulevard Voltaire, Paris",
            status: "in_progress",
            products: [
                { name: "Sweat Akevas", quantity: 1 }
            ],
            timeLimit: "45min",
            createdAt: "2024-03-20 15:00",
            price: "12€"
        },
        // Ajoutez plus de commandes ici
    ]

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
            in_progress: { color: 'bg-blue-100 text-blue-800', text: 'En cours' },
            completed: { color: 'bg-green-100 text-green-800', text: 'Terminée' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Annulée' }
        }
        return statusConfig[status as keyof typeof statusConfig]
    }

    return (
        <div className="min-h-screen mb-20 bg-[#F8F9FC]">
            <TopBar />
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Mes Commandes
                    </h1>
                    <p className="text-gray-600">
                        Gérez vos commandes et suivez leur statut
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
                                    placeholder="Rechercher une commande..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="border rounded-lg px-4 py-2 bg-white"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="in_progress">En cours</option>
                                <option value="completed">Terminées</option>
                                <option value="cancelled">Annulées</option>
                            </select>
                            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                <Filter size={20} />
                                <span className="hidden md:inline">Filtres</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des commandes */}
                <div className="space-y-4">
                    {!isLoading && ordersCity?.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Package className="text-blue-500" size={24} />
                                            <h3 className="font-semibold text-lg">
                                                Commande {order.id}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={16} />
                                            <span>{formatDate(order.created_at)}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(order.status == "0" ? "pending" : order.status == "1" ? "in_progress" : order.status == "2" ? "completed" : "cancelled").color}`}>
                                        {getStatusBadge(order.status == "0" ? "pending" : order.status == "1" ? "in_progress" : order.status == "2" ? "completed" : "cancelled").text}
                                    </span>
                                </div>

                                {/* Détails de la commande */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Point de retrait</p>
                                            <p className="text-gray-700">Beedi</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Livraison</p>
                                            <p className="text-gray-700">{order.quarter_delivery}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Produits */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Produits</p>
                                            {!isLoading && order.order_details?.map((order_detail) =>

                                                <div className='flex items-center gap-4'>
                                                    <img className='w-14 h-14' src={order_detail.product.product_profile} alt="" />
                                                    <p key={order_detail.product.id} className="text-gray-700">
                                                        {order_detail.quantity} x {order_detail.product.product_name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Rémunération</p>
                                            <p className="text-lg font-semibold text-green-600">{order.fee_of_shipping} FCFA</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Temps limite et action */}
                                {order.status == "0" && (
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <AlertCircle size={20} />
                                            <span>Temps restant: {order.timeLimit}</span>
                                        </div>
                                        <button className="px-4 max-sm:px-3 max-sm:py-3 max-sm:text-sm py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f] transition-colors">
                                            Accepter la livraison
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && <IsLoadingComponents isLoading={isLoading} />}
                </div>
            </div>

            <MobileNav />
        </div>
    )
}

export default DeliveryOrders 