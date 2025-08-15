import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Package, MapPin, ArrowLeft, Receipt, Calendar, Phone, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminDetailOrderQuery } from '@/services/adminService';
import { Button } from '@/components/ui/button';


const formatDateSafely = (dateString: string) => {
    try {
        if (!dateString) return 'Date non disponible';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date non disponible';
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Date non disponible';
    }
};

const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0 XAF';
    return `${numPrice.toLocaleString('fr-FR')} XAF`;
};

const getOrderItems = (order: any) => {
    const allOrderItems: any[] = [];
    console.log(order)
    // Ajouter les produits avec variation (orderVariations)
    if (order.orderVariations && order.orderVariations.length > 0) {
        order.orderVariations.forEach((item: any) => {
            // Cas 1: variation_attribute existe avec product_variation
            if (item.variation_attribute && item.variation_attribute.product_variation) {
                const variation = item.variation_attribute.product_variation;
                const attributeValue = item.variation_attribute.value;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    hex: variation.color?.hex || "",
                    size: attributeValue || '',
                    quantity: parseInt(item.variation_quantity),
                    price: parseFloat(item.variation_price),
                    image: variation.images?.[0]?.path || '',
                    total: parseInt(item.variation_quantity) * parseFloat(item.variation_price),
                    type: 'variation'
                });
            }
            // Cas 2: variation_attribute est null mais product_variation existe directement
            else if (item.product_variation) {
                const variation = item.product_variation;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    hex: variation.color?.hex || "",
                    size: '',
                    quantity: parseInt(item.variation_quantity),
                    price: parseFloat(item.variation_price),
                    image: variation.images?.[0]?.path || '',
                    total: parseInt(item.variation_quantity) * parseFloat(item.variation_price),
                    type: 'variation'
                });
            }
        });
    }

    // Ajouter les produits sans variation (order_details)
    if (order.order_details && order.order_details.length > 0) {
        order.order_details.forEach((item: any) => {
            allOrderItems.push({
                id: item.id,
                name: item.product?.product_name || 'Produit inconnu',
                color: '',
                size: '',
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                image: item.product?.product_profile || '',
                total: parseInt(item.quantity) * parseFloat(item.price),
                type: 'simple'
            });
        });
    }

    return allOrderItems;
};

const getTotalItems = (orderItems: any[]) => {
    return orderItems.reduce((total: number, item: any) => {
        return total + (item.quantity || 0);
    }, 0);
};

const getDeliveryLocation = (order: any) => {
    if (order.quarter_delivery) {
        return order.quarter_delivery;
    }
    if (order.emplacement) {
        return order.emplacement;
    }
    if (order.addresse) {
        return order.addresse;
    }
    return 'Adresse non spécifiée';
};

const getStatusInfo = (status: string) => {
    switch (status) {
        case "0":
            return { text: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock };
        case "1":
            return { text: "En cours", color: "bg-blue-100 text-blue-700", icon: Truck };
        case "2":
            return { text: "Livré", color: "bg-green-100 text-green-700", icon: CheckCircle };
        case "3":
            return { text: "Annulé", color: "bg-red-100 text-red-700", icon: AlertCircle };
        default:
            return { text: "Inconnu", color: "bg-gray-100 text-gray-700", icon: AlertCircle };
    }
};

const getPaymentStatus = (isPay: number) => {
    return isPay === 1 ? { text: "Payé", color: "bg-green-100 text-green-700", icon: CheckCircle } : { text: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock };
};

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading } = useAdminDetailOrderQuery(id);

    console.log('Order data:', order);

    if (isLoading) {
        return <Skeleton className="w-full h-[600px]" />;
    }

    if (!order) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Commande non trouvée</p>
                </div>
            </div>
        );
    }

    const orderItems = getOrderItems(order);
    const totalItems = getTotalItems(orderItems);
    const hasVariations = orderItems.some((item: any) => item.type === 'variation');
    const itemsTotal = orderItems.reduce((total: number, item: any) => total + item.total, 0);
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;
    const paymentStatus = getPaymentStatus(order.isPay);
    const PaymentIcon = paymentStatus.icon;
    const deliveryLocation = getDeliveryLocation(order);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Bouton retour */}
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 mb-2 transition-colors"
                    type="button"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste des commandes
                </button>

                {/* En-tête de la commande */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">
                            Commande #{order?.id}
                        </h1>
                        {hasVariations && (
                            <Badge className="bg-purple-100 text-purple-800">
                                Produits variés
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className={`${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.text}
                        </Badge>
                        <Badge className={`${paymentStatus.color}`}>
                            <PaymentIcon className="h-3 w-3 mr-1" />
                            {paymentStatus.text}
                        </Badge>
                    </div>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Détails de la commande */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Détails de la commande
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Date de commande
                                </span>
                                <span className="font-medium">{formatDateSafely(order?.created_at)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total des articles</span>
                                <span className="font-medium">{formatPrice(itemsTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Frais de livraison</span>
                                <span className="font-medium">{formatPrice(order?.fee_of_shipping || 0)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-semibold">Total</span>
                                <span className="font-bold text-lg">{formatPrice(order?.total_amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Méthode de paiement</span>
                                <span className="font-medium">{order?.payment_method === "0" ? "Mobile Money" : "Carte de crédit"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nombre d'articles</span>
                                <span className="font-medium">{totalItems} article(s)</span>
                            </div>
                        </div>
                    </Card>

                    {/* Adresse de livraison */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Adresse de livraison
                        </h2>
                        <div className="space-y-2">
                            <p className="font-medium">{order?.userName}</p>
                            <p className="text-gray-600 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {order?.userPhone}
                            </p>
                            <p className="text-gray-600">{order?.email}</p>
                            <div className="mt-3 pt-3 border-t">
                                <p className="text-gray-600">{deliveryLocation}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Articles commandés */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Articles commandés</h2>
                    <div className="space-y-4">
                        {orderItems.length > 0 ? (
                            orderItems.map((item: any) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Image';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-gray-600">Quantité: {item.quantity}</p>
                                            {item.color && (
                                                <Badge variant="outline" className="text-xs">
                                                    {item.color}
                                                </Badge>
                                            )}
                                            {item.size && (
                                                <Badge variant="outline" className="text-xs">
                                                    Taille: {item.size}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Prix unitaire: {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatPrice(item.total)}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-2" />
                                <p>Aucun article trouvé pour cette commande</p>
                            </div>
                        )}
                    </div>

                    {/* Résumé des totaux */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sous-total ({totalItems} article(s))</span>
                            <span className="font-medium">{formatPrice(itemsTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Frais de livraison</span>
                            <span className="font-medium">{formatPrice(order?.fee_of_shipping || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-lg font-bold">{formatPrice(order?.total_amount)}</span>
                        </div>
                    </div>
                </Card>

                {/* Actions administrateur */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Actions administrateur</h2>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                            <Truck className="h-4 w-4 mr-2" />
                            Marquer comme expédié
                        </Button>
                        <Button
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer comme livré
                        </Button>
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Annuler la commande
                        </Button>
                        <Button
                            variant="outline"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                            <Receipt className="h-4 w-4 mr-2" />
                            Générer facture
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}