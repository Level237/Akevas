import { useEffect, useState } from 'react'
import MobileNav from '@/components/ui/mobile-nav'
import {
    Package,
    Filter,
    MapPin,
    Calendar,
    AlertCircle
} from 'lucide-react'
import { useGetOrderByTownQuery, useGetOrdersByQuarterQuery, useGetUserQuery } from '@/services/auth'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { formatDate } from '@/lib/formatDate'
import { useGetQuartersQuery } from '@/services/guardService'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import AsyncLink from '@/components/ui/AsyncLink'
import ModalAlert from '@/components/ui/modal-alert'
import { useNavigate } from 'react-router-dom'
export const getStatusBadge = (status: string) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
        in_progress: { color: 'bg-blue-100 text-blue-800', text: 'En cours' },
        completed: { color: 'bg-green-100 text-green-800', text: 'Terminée' },
        cancelled: { color: 'bg-red-100 text-red-800', text: 'Annulée' }
    }
    return statusConfig[status as keyof typeof statusConfig]
}
const DeliveryOrders = () => {

    const [filterStatus, setFilterStatus] = useState('all')
    const [quarterId, setQuarterId] = useState('0')
    const { data: ordersCity, isLoading } = useGetOrderByTownQuery('Auth')
    const { data: ordersQuarter, isLoading: ordersQuarterLoading } = useGetOrdersByQuarterQuery(quarterId)


    const { data: userData } = useGetUserQuery('Auth', {
        refetchOnFocus: false,
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
        pollingInterval: 0,
    });
    const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');
    const filteredQuarters = quarters?.quarters.filter((quarter: { town_id: number }) => quarter.town_id === parseInt(userData?.residence_id));

    const [activeDelivery, setActiveDelivery] = useState<string | null>(null)
    const [showWarningModal, setShowWarningModal] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        // Vérifier s'il y a une livraison active en cherchant dans le localStorage
        const checkActiveDelivery = () => {
            const allKeys = Object.keys(localStorage)
            const deliveryKey = allKeys.find(key => key.startsWith('countdown_end_'))

            if (deliveryKey) {
                const orderId = deliveryKey.replace('countdown_end_', '')
                const endTime = parseInt(localStorage.getItem(deliveryKey) || '0')

                if (endTime > new Date().getTime()) {
                    setActiveDelivery(orderId)
                } else {
                    setActiveDelivery(null)
                }
            } else {
                setActiveDelivery(null)
            }
        }

        checkActiveDelivery()
        // Vérifier toutes les 30 secondes
        const interval = setInterval(checkActiveDelivery, 30000)

        return () => clearInterval(interval)
    }, [])
    return (
        <div className="min-h-screen mb-20 bg-[#F8F9FC]">


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

                                <Select
                                    name="quarter"
                                    onValueChange={(value) => {
                                        setQuarterId(value)
                                    }}
                                    disabled={quartersLoading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rechercher une commande par quartier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {quartersLoading ? (
                                            <SelectItem value="loading">Chargement des quartiers...</SelectItem>
                                        ) : (
                                            filteredQuarters?.map((quarter: { id: string, quarter_name: string }) => (
                                                <SelectItem key={quarter.id} value={String(quarter.id)}>
                                                    {quarter.quarter_name}
                                                </SelectItem>
                                            ))
                                        )}
                                        {filteredQuarters?.length === 0 && (
                                            <SelectItem value="no-quarters">Aucun quartier trouvé,veuillez verifier votre ville</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
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
                    {!isLoading && ordersCity?.length === 0 && !ordersQuarter && (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <Package className="mx-auto text-gray-400 mb-3" size={40} />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Aucune commande disponible dans vos quartiers de livraison
                            </h3>
                            <button className="px-4 mt-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                                changer vos quartiers de livraison
                            </button>
                        </div>
                    )}
                    {!isLoading && ordersCity?.length > 0 && quarterId == "0" && ordersCity?.map((order: any) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Package className="text-[#ed7e0f]" size={24} />
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
                                            {!isLoading && order.order_details?.map((order_detail: any) =>

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
                                        <AsyncLink to={`/delivery/countdown/${order.id}`}>
                                            <button className="px-4 max-sm:px-3 max-sm:py-3 max-sm:text-sm py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f] transition-colors">
                                                Accepter la livraison
                                            </button>
                                        </AsyncLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && <IsLoadingComponents isLoading={isLoading} />}
                    {ordersQuarterLoading && <IsLoadingComponents isLoading={ordersQuarterLoading} />}
                    {!ordersQuarterLoading && quarterId !== "0" && ordersQuarter?.length > 0 && ordersQuarter?.map((order: any) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Package className="text-[#ed7e0f]" size={24} />
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
                                            {!isLoading && order.order_details?.map((order_detail: any) =>

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

                                        <button onClick={
                                            () => {
                                                if (activeDelivery) {
                                                    setShowWarningModal(true)
                                                } else {
                                                    navigate(`/delivery/countdown/${order.id}`)
                                                }
                                            }
                                        } className="px-4 max-sm:px-3 max-sm:py-3 max-sm:text-sm py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f] transition-colors">
                                            Accepter la livraison
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {!ordersQuarterLoading && ordersQuarter?.length === 0 && quarterId !== "0" && (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <Package className="mx-auto text-gray-400 mb-3" size={40} />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Aucune commande disponible dans ce quartier
                            </h3>
                            <button onClick={() => window.location.reload()} className="px-4 mt-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors">
                                Rafraichir la page
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ModalAlert showWarningModal={showWarningModal} setShowWarningModal={setShowWarningModal} />
            <MobileNav />
        </div>
    )
}

export default DeliveryOrders 