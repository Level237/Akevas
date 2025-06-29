import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
    Package,
    MapPin,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOrderDetailQuery } from '@/services/auth';

const OrderDetailPage = () => {
    const { id } = useParams();
    const { data: order, isLoading } = useGetOrderDetailQuery(id);
    console.log(order);
    
    // Fonction pour détecter si c'est une commande avec produits variés
    const isVariedOrder = (orderDetails: any[]) => {
        return orderDetails.some((detail: any) => detail.product_variation);
    };

    // Fonction pour obtenir les détails des produits
    const getProductDetails = (orderDetails: any[]) => {
        if (isVariedOrder(orderDetails)) {
            // Pour les produits variés
            const variedDetails = orderDetails.filter((detail: any) => detail.product_variation);
            return variedDetails.map((detail: any) => ({
                id: detail.id,
                name: detail.product_variation?.product_name || 'Produit inconnu',
                color: detail.product_variation?.color?.name || '',
                quantity: detail.variation_quantity,
                price: detail.variation_price,
                image: detail.product_variation?.images?.[0]?.path || '',
                total: parseInt(detail.variation_quantity) * parseFloat(detail.variation_price)
            }));
        } else {
            // Pour les produits simples
            return orderDetails.map((detail: any) => ({
                id: detail.id,
                name: detail.product?.name || 'Produit inconnu',
                quantity: detail.quantity || 1,
                price: detail.price || 0,
                image: detail.product?.product_profile || '',
                total: (detail.quantity || 1) * (detail.price || 0)
            }));
        }
    };

    // Fonction pour calculer le total des articles
    const calculateItemsTotal = (orderDetails: any[]) => {
        if (isVariedOrder(orderDetails)) {
            return orderDetails.reduce((total: number, detail: any) => {
                return total + (parseInt(detail.variation_quantity) * parseFloat(detail.variation_price));
            }, 0);
        } else {
            return orderDetails.reduce((total: number, detail: any) => {
                return total + ((detail.quantity || 1) * (detail.price || 0));
            }, 0);
        }
    };

    const getStatusColor = (status: string) => {
        const statusColors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'confirmé': 'bg-blue-100 text-blue-800',
            'en_cours': 'bg-purple-100 text-purple-800',
            'livré': 'bg-green-100 text-green-800',
            'annulé': 'bg-red-100 text-red-800',
        };
        return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    };

    if (isLoading) {
        return <Skeleton className="w-full h-[600px]" />;
    }

    const productDetails = getProductDetails(order?.order_details || []);
    const itemsTotal = calculateItemsTotal(order?.order_details || []);
    const isVaried = isVariedOrder(order?.order_details || []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* En-tête de la commande */}
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
                    <Badge className={getStatusColor(order?.status === "0" ? "en_attente" : order?.status === "1" ? "confirmé" : order?.status === "2" ? "en_cours" : order?.status === "3" ? "livré" : "annulé")}>
                        {order?.status === "0" ? "En attente" : order?.status === "1" ? "En cours de livraison" : order?.status === "2" ? "Livré" : "Annulé"}
                    </Badge>
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
                                <span className="text-gray-600">Date de commande</span>
                                <span className="font-medium">{order?.created_at.split('T')[0]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total des articles</span>
                                <span className="font-medium">{itemsTotal} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Frais de livraison</span>
                                <span className="font-medium">{order?.shipping || 0} XAF</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-semibold">Total</span>
                                <span className="font-bold text-lg">{order?.total_amount} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Méthode de paiement</span>
                                <span className="font-medium">{order?.payment_method === "0" ? "Carte de crédit" : "Mobile Money"}</span>
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
                            <p className="text-gray-600">{order?.residence}</p>
                            <p className="text-gray-600">{order?.userPhone}</p>
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
                            <span className="font-medium">{order?.shipping || 0} XAF</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-lg font-bold">{order?.total_amount} XAF</span>
                        </div>
                    </div>
                </Card>

                {/* Suivi de commande */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Suivi de la commande</h2>
                    <div className="space-y-6">

                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default OrderDetailPage; 