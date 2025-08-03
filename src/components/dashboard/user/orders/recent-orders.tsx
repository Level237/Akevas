import React from 'react';
import { useGetRecentOrdersQuery } from '@/services/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Package } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';

const getOrderItems = (order: any) => {
  const allOrderItems: any[] = [];
  
  // Ajouter les produits avec variation (orderVariations)
  if (order.orderVariations && order.orderVariations.length > 0) {
    order.orderVariations.forEach((item: any) => {
      if (item.variation_attribute && item.variation_attribute.product_variation) {
        const variation = item.variation_attribute.product_variation;
        const attributeValue = item.variation_attribute.value;
        
        allOrderItems.push({
          id: item.id,
          name: variation.product_name || 'Produit inconnu',
          color: variation.color?.name || '',
          size: attributeValue || '',
          quantity: parseInt(item.variation_quantity),
          price: parseFloat(item.variation_price),
          image: variation.images?.[0]?.path || '',
          total: parseInt(item.variation_quantity) * parseFloat(item.variation_price),
          type: 'variation'
        });
      }
    });
  }
  
  // Ajouter les produits sans variation (order_details)
  if (order.order_details && order.order_details.length > 0) {
    order.order_details.forEach((item: any) => {
      allOrderItems.push({
        id: item.id,
        name: item.product?.product_name || 'Produit inconnu',
        color: '',
        size: '',
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        image: item.product?.product_profile || '',
        total: parseInt(item.quantity) * parseFloat(item.price),
        type: 'simple'
      });
    });
  }
  
  return allOrderItems;
};

const getProductImage = (orderItems: any[]) => {
  if (orderItems.length > 0) {
    // Essayer d'abord de trouver une image valide
    const itemWithImage = orderItems.find(item => item.image && item.image !== '');
    if (itemWithImage) {
      return itemWithImage.image;
    }
    // Si aucune image trouvée, retourner la première image disponible
    return orderItems[0].image || '';
  }
  return '';
};

const getTotalItems = (orderItems: any[]) => {
  return orderItems.reduce((total: number, item: any) => {
    return total + (item.quantity || 0);
  }, 0);
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
                        const orderItems = getOrderItems(order.order);
                        const totalItems = getTotalItems(orderItems);
                        const hasVariations = orderItems.some((item: any) => item.type === 'variation');
                        
                        return (
                            <div key={order.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={getProductImage(orderItems)} 
                                        alt={orderItems[0]?.name || 'Produit'} 
                                        width={64} 
                                        height={64} 
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Image';
                                        }}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">Commande #{order.order.id}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.order.status)}`}>
                                            {getStatusText(order.order.status)}
                                        </span>
                                        {hasVariations && (
                                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Produits variés</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {totalItems} article(s) • {order.price} XAF
                                    </p>
                                    <div className="text-xs text-gray-600">
                                        {orderItems.slice(0, 2).map((item: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span>• {item.name}</span>
                                                {item.color && (
                                                    <span className="text-purple-600">({item.color})</span>
                                                )}
                                                {item.size && (
                                                    <span className="text-blue-600">Taille: {item.size}</span>
                                                )}
                                                <span>x{item.quantity}</span>
                                                <span className="text-gray-500">({item.price} XAF)</span>
                                            </div>
                                        ))}
                                        {orderItems.length > 2 && (
                                            <span className="text-gray-500">
                                                +{orderItems.length - 2} autre(s) produit(s)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <AsyncLink to={`/user/orders/${order.order.id}`}>Voir détails</AsyncLink>
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