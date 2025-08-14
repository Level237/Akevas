import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
    Package,
    MapPin,
    Receipt,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOrderDetailQuery } from '@/services/auth';
import AsyncLink from '@/components/ui/AsyncLink';

const TAX_RATE = 0.05; // 5% de TVA

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

const getTotalItems = (orderItems: any[]) => {
    return orderItems.reduce((total: number, item: any) => {
        return total + (item.quantity || 0);
    }, 0);
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const { data: payment, isLoading } = useGetOrderDetailQuery(id);
    console.log('Payment data:', payment);

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

    // Extraire les données de commande depuis le paiement
    const order = payment?.order;
    console.log('Extracted order:', order);
    const orderItems = getOrderItems(order);
    console.log('Final orderItems in component:', orderItems);
    const totalItems = getTotalItems(orderItems);
    const hasVariations = orderItems.some((item: any) => item.type === 'variation');
    const itemsTotal = orderItems.reduce((total: number, item: any) => total + item.total, 0);
    const shippingFee = Number(order?.fee_of_shipping || 0);
    const taxAmount = (itemsTotal + shippingFee) * TAX_RATE;
    const totalWithTax = itemsTotal + shippingFee + taxAmount;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* En-tête de la commande */}
                <div className="flex max-sm:flex-col max-sm:justify-between max-sm:gap-4 justify-between items-center">
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
                        <Badge className={getStatusColor(order?.status === "0" ? "en_attente" : order?.status === "1" ? "confirmé" : order?.status === "2" ? "en_cours" : order?.status === "3" ? "livré" : "annulé")}>
                            {order?.status === "0" ? "En attente" : order?.status === "1" ? "En cours de livraison" : order?.status === "2" ? "Livré" : "Annulé"}
                        </Badge>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                            <AsyncLink to={`/user/payment/${payment?.transaction_ref}`}>
                                <Receipt className="w-4 h-4 mr-2" /> Voir le ticket
                            </AsyncLink>
                        </Button>
                    </div>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Détails de la commande */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-xl max-sm:text-lg font-semibold flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Détails de la commande
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 max-sm:text-sm">Date de commande</span>
                                <span className="font-medium max-sm:text-sm">{order?.created_at ? order.created_at.split('T')[0] : 'Date non disponible'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 max-sm:text-sm">Total des articles</span>
                                <span className="font-medium max-sm:text-sm">{itemsTotal} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 max-sm:text-sm">Frais de livraison</span>
                                <span className="font-medium max-sm:text-sm">{order?.fee_of_shipping || 0} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 max-sm:text-sm">TVA (5%)</span>
                                <span className="font-medium max-sm:text-sm">{taxAmount.toFixed(2)} XAF</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-semibold max-sm:text-sm">Total (TTC)</span>
                                <span className="font-bold text-lg max-sm:text-sm">{totalWithTax.toFixed(2)} XAF</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 max-sm:text-sm">Méthode de paiement</span>
                                <span className="font-medium max-sm:text-sm">{order?.payment_method === "0" ? "Carte de crédit" : "Mobile Money"}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Adresse de livraison */}
                    <Card className="p-6 space-y-4">
                        <h2 className="text-xl max-sm:text-lg font-semibold flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Adresse de livraison
                        </h2>
                        <div className="space-y-2">
                            <p className="font-medium max-sm:text-sm">{order?.userName}</p>
                            <p className="text-gray-600 max-sm:text-sm">{order?.emplacement}</p>
                            <p className="text-gray-600 max-sm:text-sm">{order?.userPhone}</p>
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
                                    className="flex max-sm:flex-col  max-sm:items-center max-sm:gap-4 items-center gap-4 p-4 bg-gray-50 rounded-lg"
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
                                        <h3 className="font-medium max-sm:mb-2">{item.name}</h3>
                                        <div className="flex max-sm:mb-2  items-center gap-2 mt-1">
                                            <p className="text-gray-600  max-sm:text-sm">Quantité: {item.quantity}</p>
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
                                        <p className="text-sm  text-gray-500 mt-1">
                                            Prix unitaire: {item.price} XAF
                                        </p>
                                    </div>
                                    <div className="text-right max-sm:hidden">
                                        <p className="font-medium">{item.total} XAF</p>
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
                            <span className="text-gray-600 max-sm:text-sm">Sous-total ({totalItems} article(s))</span>
                            <span className="font-medium max-sm:text-sm">{itemsTotal} XAF</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600 max-sm:text-sm">Frais de livraison</span>
                            <span className="font-medium max-sm:text-sm">{order?.fee_of_shipping || 0} XAF</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">TVA (5%)</span>
                            <span className="font-medium">{taxAmount.toFixed(2)} XAF</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <span className="text-lg max-sm:text-sm font-semibold">Total (TTC)</span>
                            <span className="text-lg max-sm:text-sm font-bold">{totalWithTax.toFixed(2)} XAF</span>
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