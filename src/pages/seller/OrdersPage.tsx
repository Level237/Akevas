import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useGetOrdersQuery } from '@/services/sellerService';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0 XAF';
    return `${numPrice.toLocaleString('fr-FR')} XAF`;
};

const getOrderItems = (order: any) => {
    const allOrderItems: any[] = [];
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
                    type: 'variation',
                    shop: variation.shop || null,
                    seller: variation.shop?.user || null
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
                    type: 'variation',
                    shop: variation.shop || null,
                    seller: variation.shop?.user || null
                });
            }
        });
    }

    // Ajouter les produits sans variation (order_details)
    if (order.order_details && order.order_details.length > 0) {
        order.order_details.forEach((item: any) => {
            if (item && item.product) {
                allOrderItems.push({
                    id: item.id,
                    name: item.product?.product_name || 'Produit inconnu',
                    color: '',
                    size: '',
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    image: item.product?.product_profile || '',
                    total: parseInt(item.quantity) * parseFloat(item.price),
                    type: 'simple',
                    shop: item.product?.shop || null,
                    seller: item.product?.shop?.user || null
                });
            }
        });
    }

    return allOrderItems;
};

const OrdersPage = () => {
    const { data: ordersData, isLoading } = useGetOrdersQuery('seller');
    const navigate = useNavigate();

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
        <div className=" overflow-hidden max-sm:mx-0 mx-24 px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
                <p className="text-gray-500 mt-2">Gérez vos commandes et suivez leur statut</p>
            </div>

            <IsLoadingComponents isLoading={isLoading} />

            <div className="grid grid-cols-3 max-sm:grid-cols-1 max-sm:mb-12 max-sm:gap-x-0 max-sm:gap-y-6 items-center  gap-x-44">
                {ordersData?.map((order: any) => {
                    const status = getOrderStatus(order.status);
                    const allOrderItems = getOrderItems(order);
                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-[26rem]"
                        >
                            <Card className="p-6 max-sm:max-w-[94vw] flex flex-col h-full">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 pb-4 border-b">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${status?.bgColor}`}>
                                            {status && <status.icon className={`w-6 h-6 ${status.color}`} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-sm">Commande #{order.id}</h3>
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
                                        <span className="font-semibold text-sm">{formatPrice(order.total_amount)}</span>
                                        <span className="text-sm text-gray-500">{order.itemsCount} article(s)</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Détails de livraison</h4>
                                    <div className="text-sm text-gray-500 space-y-1 bg-gray-50 p-3 rounded-md mb-6">
                                        <p><strong>Quartier:</strong> {order.quarter_delivery || 'Non spécifié'}</p>
                                        <p><strong>Frais:</strong> {formatPrice(order.fee_of_shipping)}</p>
                                        <p><strong>Estimé:</strong> {order.duration_of_delivery || 'Non spécifiée'}</p>
                                    </div>

                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Articles commandés ({allOrderItems.length})</h4>
                                    <div className="space-y-2">
                                        {allOrderItems.slice(0, 3).map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Img'; }} />
                                                <span className="flex-1 font-medium">{item.name}</span>
                                                <span className="text-gray-600">x{item.quantity}</span>
                                                {item.color && <span className="text-gray-500">({item.color})</span>}
                                                {item.size && <span className="text-gray-500">T:{item.size}</span>}
                                            </div>
                                        ))}
                                        {allOrderItems.length > 3 && (
                                            <p className="text-sm text-gray-600 pl-12">+{allOrderItems.length - 3} autre(s) article(s)</p>
                                        )}
                                        {!allOrderItems.length && (
                                            <div className="text-center py-4 text-gray-500">
                                                <Package className="w-8 h-8 mx-auto mb-1" />
                                                <p className="text-sm">Aucun article trouvé</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate(`/seller/orders/${order.id}`)}
                                            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 rounded-md transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                            Voir les détails de la commande
                                        </button>
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
        </div>
    );
};

export default OrdersPage; 