import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
    Package,
    Truck,
    Calendar,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOrderDetailQuery } from '@/services/auth';

const OrderDetailPage = () => {
    const { id } = useParams();
    const { data: order, isLoading } = useGetOrderDetailQuery(id);
    console.log(order);
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* En-tête de la commande */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        Commande #{order?.id}
                    </h1>
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
                                <span className="text-gray-600">Total</span>
                                <span className="font-medium">{order?.total_amount} XAF</span>
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
                        {!isLoading && order?.order_details.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                                <img
                                    src={item.product.product_profile}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-gray-600">Quantité: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{item.price} XAF</p>
                                    <p className="text-gray-600">Total: {order?.total_amount} XAF</p>
                                </div>
                            </div>
                        ))}
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