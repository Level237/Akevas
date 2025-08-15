import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Package, MapPin, AlertCircle, ChevronLeft, Box } from 'lucide-react'
import MobileNav from '@/components/ui/mobile-nav'
import { useShowOrderQuery } from '@/services/auth'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import ModalAlert from '@/components/ui/modal-alert'

const getOrderItems = (order: any) => {
    const allOrderItems: any[] = [];
    console.log(order)
    // Vérifier si order existe
    if (!order) {
        console.log('Order is null or undefined');
        return allOrderItems;
    }

    console.log('Processing order:', order);
    console.log('orderVariations:', order.orderVariations);
    console.log('order_details:', order.order_details);
    console.log('order_details type:', typeof order.order_details);
    console.log('order_details isArray:', Array.isArray(order.order_details));

    // Ajouter les produits avec variation (orderVariations)
    if (order.orderVariations && Array.isArray(order.orderVariations) && order.orderVariations.length > 0) {
        console.log('Processing orderVariations...');
        order.orderVariations.forEach((item: any) => {
            console.log('Processing variation item:', item);

            // Cas 1: variation_attribute existe avec product_variation
            if (item && item.variation_attribute && item.variation_attribute.product_variation) {
                const variation = item.variation_attribute.product_variation;
                const attributeValue = item.variation_attribute.value;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    size: attributeValue || '',
                    quantity: parseInt(item.variation_quantity) || 0,
                    price: parseFloat(item.variation_price) || 0,
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(item.variation_quantity) || 0) * (parseFloat(item.variation_price) || 0),
                    type: 'variation'
                });
            }
            // Cas 2: variation_attribute est null mais product_variation existe directement
            else if (item && item.product_variation) {
                const variation = item.product_variation;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    size: '',
                    quantity: parseInt(item.variation_quantity) || 0,
                    price: parseFloat(item.variation_price) || 0,
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(item.variation_quantity) || 0) * (parseFloat(item.variation_price) || 0),
                    type: 'variation'
                });
            }
        });
    }

    // Ajouter les produits sans variation (order_details)
    if (order.order_details && order.order_details.length > 0) {
        console.log('Processing order_details...');
        order.order_details.forEach((item: any) => {
            console.log('Processing order_detail item:', item);
            if (item && item.product) {
                allOrderItems.push({
                    id: item.id,
                    name: item.product?.product_name || 'Produit inconnu',
                    color: '',
                    size: '',
                    quantity: parseInt(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    image: item.product?.product_profile || '',
                    total: (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0),
                    type: 'simple'
                });
            }
        });
    }

    console.log('Final allOrderItems:', allOrderItems);
    return allOrderItems;
};

const OrderDetailPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [isAccepting, setIsAccepting] = useState(false)
    const { data: orderData, isLoading } = useShowOrderQuery(orderId)
    console.log(orderData)
    const [activeDelivery, setActiveDelivery] = useState<string | null>(null)
    const [showWarningModal, setShowWarningModal] = useState(false)
    console.log(orderData)
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


    const handleAccept = async () => {
        setIsAccepting(true)
        try {
            if (activeDelivery) {
                setShowWarningModal(true)
                setIsAccepting(false)
                return;
            }
            navigate(`/delivery/countdown/${orderId}`)
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
            navigate('/')
        } catch (error) {
            console.error('Erreur lors du refus:', error)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FC]">


            <div className="max-w-3xl mb-20 mx-auto px-4 py-6">
                {/* En-tête avec bouton retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span>Retour</span>
                </button>

                {isLoading ? <IsLoadingComponents isLoading={isLoading} /> : (
                    <>

                        {/* Informations principales */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Commande #{orderId}
                                </h1>
                                <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    {orderData.status === '0' ? 'En attente' : orderData.status === 'accepted' ? 'Acceptée' : orderData.status === 'rejected' ? 'Refusée' : 'En cours'}
                                </span>
                            </div>

                            {/* Gain du livreur */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Box size={20} />
                                    <span className="font-medium">
                                        Gain pour cette livraison : {orderData.fee_of_shipping || 0} FCFA
                                    </span>
                                </div>
                            </div>

                            {/* Alerte de temps */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-orange-700">
                                    <AlertCircle size={20} />
                                    <span className="font-medium">
                                        Vous avez 1 heure pour récupérer la commande et la livrer
                                    </span>
                                </div>
                            </div>

                            {/* Adresses */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <Package className="text-[#007BFF] mt-1" size={20} />
                                    <div>
                                        <p className="font-medium">Point de retrait</p>
                                        <p className="text-gray-600">Beedi</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-green-500 mt-1" size={20} />
                                    <div>
                                        <p className="font-medium">Adresse de livraison</p>
                                        <p className="text-gray-600">{orderData.order.quarter_delivery} - {orderData.order.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="text-green-500 mt-1" size={20} />
                                    <div>
                                        <p className="font-medium">Numéro de téléphone du client</p>
                                        <p className="text-gray-600">{orderData.order.userPhone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Détails des produits */}
                            <div className="border-t pt-6">
                                <h2 className="text-lg font-semibold mb-4">Détails des produits</h2>
                                <div className="space-y-4">
                                    {getOrderItems(orderData?.order).map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {item.name}
                                                    </p>
                                                    {item.type === 'variation' && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            {item.color && <span>Couleur: {item.color}</span>}
                                                            {item.size && <span>Taille: {item.size}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-medium">
                                                    Quantité: {item.quantity}
                                                </span>
                                                <p className="text-sm text-gray-600">
                                                    Total: {item.total} FCFA
                                                </p>
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
                                className="flex-1 bg-[#ed7e0f] text-white py-3 rounded-lg font-medium hover:bg-[#ed7e0f]/90 disabled:bg-[#ed7e0f] disabled:opacity-50"
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
                    </>
                )}
            </div>
            <MobileNav />
            <ModalAlert showWarningModal={showWarningModal} setShowWarningModal={setShowWarningModal} />
        </div>
    )
}

export default OrderDetailPage 