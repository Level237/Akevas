import React from 'react';
import { useGetRecentOrdersQuery } from '@/services/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';
const RecentOrders = () => {
    const { data, isLoading } = useGetRecentOrdersQuery("Auth");
    return (
        <div>
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Dernières commandes</h2>
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
                    {data?.length === 0 && <div className="flex items-center justify-center h-full">
                        <Package className="w-6 h-6" />
                        <p className="text-sm text-gray-500">Aucune commande récente</p>
                        <Button variant="outline" size="sm">
                            <AsyncLink to="/products">Voir les produits</AsyncLink>
                        </Button>
                    </div>}
                </div>
            </Card>
        </div>
    )
}

export default React.memo(RecentOrders);