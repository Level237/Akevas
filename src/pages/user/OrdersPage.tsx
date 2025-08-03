import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Search,
    Filter,
    Loader2,
} from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';
import { useGetOrdersQuery } from '@/services/auth';
import { useState } from 'react';

const getOrderItems = (order: any) => {
  const allOrderItems: any[] = [];
  
  // Vérifier si order existe
  if (!order) {
    return allOrderItems;
  }
  
  // Ajouter les produits avec variation (orderVariations)
  if (order.orderVariations && Array.isArray(order.orderVariations) && order.orderVariations.length > 0) {
    order.orderVariations.forEach((item: any) => {
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
  if (order.order_details && Array.isArray(order.order_details) && order.order_details.length > 0) {
    order.order_details.forEach((item: any) => {
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

const OrdersPage = () => {
    const { data: orders, isLoading } = useGetOrdersQuery("Auth");
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    console.log(orders)
    
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

    const filteredOrders = orders?.filter((order: any) => {
        const orderId = order?.order?.id || order?.id;
        const matchesSearch = orderId ? orderId.toString().includes(searchTerm) : false;
        const matchesStatus = statusFilter === 'all' || (order?.order && order.order.status === statusFilter);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Mes Commandes</h1>
                    <Button variant="outline" asChild>
                        <AsyncLink to="/products">Continuer mes achats</AsyncLink>
                    </Button>
                </div>

                <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Rechercher une commande..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="0">En attente</SelectItem>
                                    <SelectItem value="1">Confirmé</SelectItem>
                                    <SelectItem value="2">En cours</SelectItem>
                                    <SelectItem value="3">Livré</SelectItem>
                                    <SelectItem value="4">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : filteredOrders?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mb-2" />
                                <p>Aucune commande trouvée</p>
                            </div>
                        ) : (
                            filteredOrders?.map((order: any) => {
                                console.log('Order structure:', order);
                                // Essayer d'abord avec order.order, puis avec order directement
                                const orderData = order.order || order;
                                const orderItems = getOrderItems(orderData);
                                console.log('Order items:', orderItems);
                                const totalItems = getTotalItems(orderItems);
                                const hasVariations = orderItems.some((item: any) => item.type === 'variation');
                                const orderId = order?.order?.id || order?.id;
                                
                                return (
                                    <motion.div
                                        key={order.id || orderId}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                            <img
                                                src={getProductImage(orderItems)}
                                                alt="Product"
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Image';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">Commande #{orderId}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(orderData?.status)}`}>
                                                    {getStatusText(orderData?.status)}
                                                </span>
                                                {hasVariations && (
                                                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                                        Produits variés
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {totalItems} article(s) • {order.price || orderData?.total_amount} XAF
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Commandé le {new Date(orderData?.created_at).toLocaleDateString()}
                                            </p>
                                            {/* Affichage des détails des produits */}
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
                                        <div className="flex gap-2">
                                            <Button variant="outline" asChild>
                                                <AsyncLink to={`/user/orders/${orderId}`}>
                                                    Voir détails
                                                </AsyncLink>
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default OrdersPage; 