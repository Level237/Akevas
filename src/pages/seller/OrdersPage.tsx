import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';

const OrdersPage = () => {
    const { data: { data: sellerData } = {}, isLoading } = useCurrentSellerQuery<SellerResponse>('seller');

    const getOrderStatus = (status: string) => {
        switch (status) {
            case "0":
                return {
                    icon: Clock,
                    title: 'En attente',
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                };
            case "1":
                return {
                    icon: Package,
                    title: 'En cours de livraison',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                };
            case "2":
                return {
                    icon: CheckCircle2,
                    title: 'Livré',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                };
            case "3":
                return {
                    icon: XCircle,
                    title: 'Annulé',
                    color: 'text-rose-600',
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                };
            default:
                return null;
        }
    };

    return (
        <div className="transition-all duration-300">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
                    <p className="text-gray-500 mt-2">Gérez vos commandes et suivez leur statut</p>
                </div>

                <IsLoadingComponents isLoading={isLoading} />

                {!sellerData?.shop?.orders?.length ? (
                    <Card className="p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <Package className="w-12 h-12 text-gray-400" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Aucune commande</h3>
                                <p className="text-gray-500 mt-1">Vous n'avez pas encore reçu de commandes.</p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {sellerData?.shop?.orders?.map((order: any) => {
                            const status = getOrderStatus(order.status);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${status?.bgColor}`}>
                                                    {status && <status.icon className={`w-6 h-6 ${status.color}`} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">Commande #{order.id}</h3>
                                                        <span className={`text-sm ${status?.color}`}>
                                                            {status?.title}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {format(new Date(order.created_at), 'PPP à HH:mm', { locale: fr })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col lg:items-end">
                                                <span className="font-semibold">{order.total_amount} FCFA</span>
                                                <span className="text-sm text-gray-500">{order.itemsCount} article(s)</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 border-t pt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Informations client</h4>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <p>{order.userName}</p>
                                                        <p>{order.email}</p>
                                                        <p>{order.userPhone}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Livraison</h4>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <p>Quartier: {order.quarter_delivery}</p>
                                                        <p>Frais de livraison: {order.fee_of_shipping} FCFA</p>
                                                        <p>Durée estimée: {order.duration_of_delivery}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <h4 className="text-sm font-medium text-gray-900 mb-4">Articles commandés</h4>
                                                <div className="space-y-4">
                                                    {order.order_details.map((detail) => (
                                                        <div key={detail.id} className="flex items-center gap-4">
                                                            <img
                                                                src={detail.product.product_profile}
                                                                alt={detail.product.product_name}
                                                                className="w-16 h-16 object-cover rounded"
                                                            />
                                                            <div className="flex-1">
                                                                <h5 className="font-medium">{detail.product.product_name}</h5>
                                                                <p className="text-sm text-gray-500">Quantité: {detail.quantity}</p>
                                                            </div>
                                                            <span className="font-medium">{detail.price} FCFA</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrdersPage; 