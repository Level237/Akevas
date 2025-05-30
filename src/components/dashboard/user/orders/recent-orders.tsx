import React from 'react';
import { useGetRecentOrdersQuery } from '@/services/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';
const RecentOrders = () => {
    const { data, isLoading,error } = useGetRecentOrdersQuery("Auth");
    console.log(error)
    return (
        <div>
            <Card className="p-6">
                <h2 className="text-xl font-semibold max-sm:text-md mb-6">Dernières commandes</h2>
                <div className="space-y-4">
                    {!isLoading && data?.map((order: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg">
                                <img src={order?.order_details[0]?.product?.product_profile || ''} alt={"dd"} width={64} height={64} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Commande {order.id}</h3>
                                <p className="text-sm text-gray-500">{order.itemsCount} articles • {order.status === "0" ? "en attente" : order.status === "1" ? "en cours de livraison" : "livré"}</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <AsyncLink to={`/user/orders/${order.id}`}>Voir détails</AsyncLink>
                            </Button>
                        </div>
                    ))}
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