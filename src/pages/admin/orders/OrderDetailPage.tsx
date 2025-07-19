import { useParams, useNavigate } from 'react-router-dom';
 // À adapter selon ton service
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Package, MapPin, User, ArrowLeft } from 'lucide-react';
import { useAdminDetailOrderQuery } from '@/services/adminService';

const getStatusColor = (status: string) => {
    const statusColors = {
        '0': 'bg-yellow-100 text-yellow-800',
        '1': 'bg-blue-100 text-blue-800',
        '2': 'bg-purple-100 text-purple-800',
        '3': 'bg-green-100 text-green-800',
        '4': 'bg-red-100 text-red-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
    const statusText = {
        '0': 'En attente',
        '1': 'En cours de livraison',
        '2': 'Livré',
        '3': 'Annulé',
    };
    return statusText[status as keyof typeof statusText] || 'Inconnu';
};

const isVariedOrder = (orderDetails: any[]) => {
    return orderDetails.some(
        (detail: any) => detail.variation_attribute || detail.product_variation
    );
};

const getProductDetails = (orderDetails: any[]) => {
    return orderDetails.map((detail: any) => {
        // Cas 1: variation_attribute (couleur + taille/pointure)
        if (detail.variation_attribute && detail.variation_attribute.product_variation) {
            const variation = detail.variation_attribute.product_variation;
            return {
                id: detail.id,
                name: variation.product_name || 'Produit inconnu',
                color: variation.color?.name || '',
                size: detail.variation_attribute.value || '', // taille/pointure
                quantity: detail.variation_quantity,
                price: detail.variation_price,
                image: variation.images?.[0]?.path || '',
                total: parseInt(detail.variation_quantity) * parseFloat(detail.variation_price)
            };
        }
        // Cas 2: product_variation (couleur seule)
        else if (detail.product_variation) {
            return {
                id: detail.id,
                name: detail.product_variation.product_name || 'Produit inconnu',
                color: detail.product_variation.color?.name || '',
                size: '', // pas de taille
                quantity: detail.variation_quantity,
                price: detail.variation_price,
                image: detail.product_variation.images?.[0]?.path || '',
                total: parseInt(detail.variation_quantity) * parseFloat(detail.variation_price)
            };
        }
        // Cas 3: produit simple
        else {
            return {
                id: detail.id,
                name: detail.product?.name || 'Produit inconnu',
                color: '',
                size: '',
                quantity: detail.quantity || 1,
                price: detail.price || 0,
                image: detail.product?.product_profile || '',
                total: (detail.quantity || 1) * (detail.price || 0)
            };
        }
    });
};

const calculateItemsTotal = (orderDetails: any[]) => {
    return orderDetails.reduce((total: number, detail: any) => {
        if (detail.variation_attribute || detail.product_variation) {
            return total + (parseInt(detail.variation_quantity) * parseFloat(detail.variation_price));
        } else {
            return total + ((detail.quantity || 1) * (detail.price || 0));
        }
    }, 0);
};

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, isLoading } = useAdminDetailOrderQuery(id);
    console.log(order)

    if (isLoading || !order) {
        return <Skeleton className="w-full h-[600px]" />;
    }

    const productDetails = getProductDetails(order?.order_details || []);
    const itemsTotal = calculateItemsTotal(order?.order_details || []);
    const isVaried = isVariedOrder(order?.order_details || []);

    return (
        <div className="max-w-7xl mt-12 mx-auto px-4 py-12">
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
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">
                            Commande #{order?.id}
                        </h1>
                        {isVaried && (
                            <Badge className="bg-purple-100 text-purple-800">
                                Produits variés
                            </Badge>
                        )}
                    </div>
                    <Badge className={getStatusColor(order?.status)}>
                        {getStatusText(order?.status)}
                    </Badge>
                </div>

                {/* Infos principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Détails commande */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Détails de la commande
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date de commande</span>
                                <span className="font-medium">{order?.created_at?.split('T')[0]}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Quantité</span>
                                <span className="font-medium">{productDetails[0].quantity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total des articles</span>
                                <span className="font-medium">{itemsTotal} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Frais de livraison</span>
                                <span className="font-medium">{order?.fee_of_shipping || 0} XAF</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-semibold">Total</span>
                                <span className="font-bold text-lg">{order?.total_amount} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Méthode de paiement</span>
                                <span className="font-medium">{order?.payment_method === "0" && "Mobile Money"}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Client & livraison */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Client
                        </h2>
                        <div className="space-y-2">
                            <p className="font-medium">{order?.userName}</p>
                            <p className="text-gray-600">{order?.userPhone}</p>
                            <p className="text-gray-600">{order?.email}</p>
                        </div>
                        <h2 className="text-xl font-semibold flex items-center gap-2 mt-4">
                            <MapPin className="w-5 h-5" />
                            Livraison
                        </h2>
                        <div className="space-y-2">
                            <p className="text-gray-600"> {order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}
                            {order.emplacement == null && order.addresse}</p>
                        </div>
                    </Card>
                </div>

                {/* Articles commandés */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Articles commandés</h2>
                    <div className="space-y-4">
                        {productDetails.map((item: any) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
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
                                                {item.size}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Prix unitaire: {item.price} XAF
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{item.total} XAF</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Résumé des totaux */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sous-total ({productDetails.length} article(s))</span>
                            <span className="font-medium">{itemsTotal} XAF</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Frais de livraison</span>
                            <span className="font-medium">{order?.fee_of_shipping || 0} XAF</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-lg font-bold">{order?.total_amount} XAF</span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}