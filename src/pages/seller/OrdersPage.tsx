import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useGetOrdersQuery } from '@/services/sellerService';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';


const OrdersPage = () => {
    const { data: ordersData, isLoading } = useGetOrdersQuery('seller');
    console.log(ordersData)
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
        <div className="transition-all mx-24 max-sm:mx-2 max-sm:px-2 duration-300">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
                    <p className="text-gray-500 mt-2">Gérez vos commandes et suivez leur statut</p>
                </div>

                <IsLoadingComponents isLoading={isLoading} />


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ordersData?.map((order: any) => {
                        const status = getOrderStatus(order.order.status);
                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full"
                            >
                                <Card className="p-6 flex flex-col h-full">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 pb-4 border-b">
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
                                                    {format(new Date(order.order.created_at), 'PPP à HH:mm', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:items-end">
                                            <span className="font-semibold text-xl">{order.order.total_amount} FCFA</span>
                                            <span className="text-sm text-gray-500">{order.order.itemsCount} article(s)</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Détails de livraison</h4>
                                        <div className="text-sm text-gray-500 space-y-1 bg-gray-50 p-3 rounded-md mb-6">
                                            <p><strong>Quartier:</strong> {order.order.quarter_delivery || 'Non spécifié'}</p>
                                            <p><strong>Frais:</strong> {order.order.fee_of_shipping} FCFA</p>
                                            <p><strong>Estimé:</strong> {order.order.duration_of_delivery || 'Non spécifiée'}</p>
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Articles commandés</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Afficher les produits variés */}
                                            {order.order.orderVariations && order.order.orderVariations.map((variation: any) => (
                                                <div key={variation.id} className="flex flex-col p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                                    <img
                                                        src={variation.product_variation?.images?.[0]?.path}
                                                        alt={variation.product_variation?.product_name}
                                                        className="w-full h-28 object-cover rounded mb-3"
                                                    />
                                                    <h5 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                                        {variation.product_variation?.product_name}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Quantité: {variation.variation_quantity}
                                                    </p>
                                                    <div className="text-xs text-gray-500 space-y-1">
                                                        <p>Couleur: {variation.product_variation?.color?.name}</p>
                                                        {variation.variation_attribute && (
                                                            <p>Taille: {variation.variation_attribute.value}</p>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-lg text-[#ed7e0f] mt-auto pt-2">{variation.variation_price} FCFA</span>
                                                </div>
                                            ))}

                                            {/* Afficher les produits non variés */}
                                            {order.order.order_details && order.order.order_details.map((detail: any) => (
                                                <div key={detail.id} className="flex flex-col p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                                    <img
                                                        src={detail.product.product_profile}
                                                        alt={detail.product.product_name}
                                                        className="w-full h-28 object-cover rounded mb-3"
                                                    />
                                                    <h5 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                                        {detail.product.product_name}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Quantité: {detail.quantity}
                                                    </p>
                                                    <span className="font-bold text-lg text-[#ed7e0f] mt-auto pt-2">{detail.price} FCFA</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
                {ordersData?.length == 0 && (
                    <Card className="p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <Package className="w-12 h-12 text-gray-400" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Aucune commande</h3>
                                <p className="text-gray-500 mt-1">Vous n'avez pas encore reçu de commandes.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default OrdersPage; 