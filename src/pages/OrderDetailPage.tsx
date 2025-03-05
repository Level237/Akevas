import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Package, MapPin, Clock, AlertCircle, ChevronLeft, Box } from 'lucide-react'
import TopBar from '@/components/ui/topBar'
import Header from '@/components/ui/header'
import MobileNav from '@/components/ui/mobile-nav'

const OrderDetailPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [isAccepting, setIsAccepting] = useState(false)

    // Simulation des données de la commande (à remplacer par un appel API)
    const order = {
        id: orderId,
        status: 'En attente',
        pickupAddress: '123 Rue Akevas, 75001 Paris',
        deliveryAddress: '45 Avenue République, 75011 Paris',
        timeLimit: '1 heure',
        products: [
            { id: 1, name: 'T-shirt Akevas', quantity: 2, size: 'M' },
            { id: 2, name: 'Pantalon Classic', quantity: 1, size: 'L' },
        ],
        createdAt: '14:30',
    }

    const handleAccept = async () => {
        setIsAccepting(true)
        try {
            // Appel API pour accepter la commande
            // await acceptOrder(orderId)
            navigate('/dashboard') // Redirection après acceptation
        } catch (error) {
            console.error('Erreur lors de l\'acceptation:', error)
        } finally {
            setIsAccepting(false)
        }
    }

    const handleDecline = async () => {
        try {
            // Appel API pour refuser la commande
            // await declineOrder(orderId)
            navigate('/dashboard')
        } catch (error) {
            console.error('Erreur lors du refus:', error)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FC]">
            <TopBar />
            <Header />

            <div className="max-w-3xl mb-20 mx-auto px-4 py-6">
                {/* En-tête avec bouton retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span>Retour</span>
                </button>

                {/* Informations principales */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Commande #{orderId}
                        </h1>
                        <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {order.status}
                        </span>
                    </div>

                    {/* Alerte de temps */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-orange-700">
                            <AlertCircle size={20} />
                            <span className="font-medium">
                                Vous avez {order.timeLimit} pour récupérer la commande
                            </span>
                        </div>
                    </div>

                    {/* Adresses */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Package className="text-blue-500 mt-1" size={20} />
                            <div>
                                <p className="font-medium">Point de retrait</p>
                                <p className="text-gray-600">{order.pickupAddress}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="text-green-500 mt-1" size={20} />
                            <div>
                                <p className="font-medium">Adresse de livraison</p>
                                <p className="text-gray-600">{order.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Détails des produits */}
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold mb-4">Détails des produits</h2>
                        <div className="space-y-4">
                            {order.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Box className="text-gray-400" size={20} />
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-600">Taille: {product.size}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium">Quantité: {product.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4">
                    <button
                        onClick={handleAccept}
                        disabled={isAccepting}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isAccepting ? 'En cours...' : 'Accepter la livraison'}
                    </button>
                    <button
                        onClick={handleDecline}
                        className="flex-1 bg-white text-gray-600 py-3 rounded-lg font-medium border hover:bg-gray-50"
                    >
                        Refuser
                    </button>
                </div>
            </div>
            <MobileNav />
        </div>
    )
}

export default OrderDetailPage 