import React from 'react';
import { useGetRecentOrdersQuery } from '@/services/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Package } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';

const isVariedOrder = (orderDetails: any[]) => {
    return orderDetails.some((detail: any) => detail.product_variation);
};

const getProductImage = (orderDetails: any[]) => {
    if (isVariedOrder(orderDetails)) {
        const firstVariedDetail = orderDetails.find((detail: any) => detail.product_variation);
        return firstVariedDetail?.product_variation?.images?.[0]?.path || '';
    } else {
        return orderDetails[0]?.product?.product_profile || '';
    }
};

const getTotalItems = (orderDetails: any[]) => {
    if (isVariedOrder(orderDetails)) {
        return orderDetails.reduce((total: number, detail: any) => {
            return total + parseInt(detail.variation_quantity || 0);
        }, 0);
    } else {
        return orderDetails.length;
    }
};

const getProductDetails = (orderDetails: any[]) => {
    if (isVariedOrder(orderDetails)) {
        const variedDetails = orderDetails.filter((detail: any) => detail.product_variation);
        return variedDetails.map((detail: any) => ({
            name: detail.product_variation?.product_name || 'Produit inconnu',
            color: detail.product_variation?.color?.name || '',
            quantity: detail.variation_quantity,
            price: detail.variation_price,
            image: detail.product_variation?.images?.[0]?.path || ''
        }));
    } else {
        return orderDetails.map((detail: any) => ({
            name: detail.product?.name || 'Produit inconnu',
            quantity: detail.quantity || 1,
            price: detail.price || 0,
            image: detail.product?.product_profile || ''
        }));
    }
};

const getStatusBadgeColor = (status: string) => {
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

const RecentOrders = () => {
    const { data, isLoading} = useGetRecentOrdersQuery("Auth");
    return (
        <div>
            <Card className="p-6">
                <div className='flex flex-row items-center justify-between'>
                        <h2 className="text-xl font-semibold max-sm:text-md mb-6">Dernières commandes</h2>

                        <Button className='bg-[#ed7e0f] hover:bg-[#ed7e0f]' size="sm" asChild>
                            <AsyncLink to="/user/orders">Voir plus <ArrowRight/></AsyncLink>
                        </Button>
                </div>
                
                <div className="space-y-4">
                    {!isLoading && data?.map((order: any) => {
                        const productDetails = getProductDetails(order.order_details);
                        const totalItems = getTotalItems(order.order_details);
                        const isVaried = isVariedOrder(order.order_details);
                        return (
                            <div key={order.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg">
                                    <img src={getProductImage(order.order_details)} alt={productDetails[0]?.name || 'Produit'} width={64} height={64} className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">Commande #{order.id}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>{getStatusText(order.status)}</span>
                                        {isVaried && (
                                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Produits variés</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {totalItems} article(s) • {order.total_amount} XAF
                                    </p>
                                    <div className="text-xs text-gray-600">
                                        {productDetails.slice(0, 2).map((product: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span>• {product.name}</span>
                                                {product.color && (
                                                    <span className="text-purple-600">({product.color})</span>
                                                )}
                                                <span>x{product.quantity}</span>
                                            </div>
                                        ))}
                                        {productDetails.length > 2 && (
                                            <span className="text-gray-500">
                                                +{productDetails.length - 2} autre(s) produit(s)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <AsyncLink to={`/user/orders/${order.id}`}>Voir détails</AsyncLink>
                                </Button>
                            </div>
                        );
                    })}
                    {isLoading && <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>}
                    {data?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                            <Package className="w-12 h-12 text-gray-400" />
                            <p className="text-lg max-sm:text-sm font-semibold text-gray-700">Aucune commande récente</p>
                            <p className="text-sm max-sm:text-xs text-gray-500">Il semble que vous n'ayez pas encore passé de commande.</p>
                            <Button variant="outline">
                                <AsyncLink className='max-sm:text-xs' to="/products">Découvrir nos produits</AsyncLink>
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default React.memo(RecentOrders);