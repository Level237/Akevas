import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCheck, Eye, Package, Calendar, MapPin, Phone, Truck, Clock, CheckCircle, AlertCircle, DollarSign} from "lucide-react";
import { useAdminListOrdersQuery } from "@/services/adminService";
import AsyncLink from "@/components/ui/AsyncLink";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const formatDateSafely = (dateString: string) => {
  try {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date non disponible';
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Date non disponible';
  }
};

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0 XAF';
  return `${numPrice.toLocaleString('fr-FR')} XAF`;
};

const getOrderItems = (order: any) => {
  const allOrderItems: any[] = [];
  
  if (!order) {
    return allOrderItems;
  }
  
  // Traitement des variations (orderVariations)
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
          type: 'variation',
          shop_name: variation.shop_name || ''
        });
      }
    });
  }
  
  // Traitement des produits simples (order_details)
  if (order.order_details && Array.isArray(order.order_details) && order.order_details.length > 0) {
    order.order_details.forEach((item: any) => {
      // Traitement des variations dans order_details
      if (item.variation_attribute && item.variation_attribute.product_variation) {
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
          type: 'variation',
          shop_name: variation.shop_name || ''
        });
      }
      // Traitement des produits simples
      else if (item.product) {
        allOrderItems.push({
          id: item.id,
          name: item.product?.product_name || 'Produit inconnu',
          color: '',
          size: '',
          quantity: parseInt(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          image: item.product?.product_profile || '',
          total: (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0),
          type: 'simple',
          shop_name: item.product?.shop_name || ''
        });
      }
    });
  }
  
  return allOrderItems;
};

const getTotalItems = (orderItems: any[]) => {
  return orderItems.reduce((total: number, item: any) => {
    return total + (item.quantity || 0);
  }, 0);
};



const getDeliveryLocation = (order: any) => {
  if (order.quarter_delivery) {
    return order.quarter_delivery;
  }
  if (order.emplacement) {
    return order.emplacement;
  }
  if (order.addresse) {
    return order.addresse;
  }
  return 'Adresse non spécifiée';
};

const getPaymentStatus = (isPay: number) => {
  return isPay === 1 ? { text: "Payé", color: "bg-green-100 text-green-700", icon: CheckCircle } : { text: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock };
};

const getStatusInfo = (status: string) => {
    switch (status) {
        case "0":
            return { text: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock };
        case "1":
            return { text: "En cours", color: "bg-blue-100 text-blue-700", icon: Truck };
        case "2":
            return { text: "Livré", color: "bg-green-100 text-green-700", icon: CheckCircle };
        case "3":
            return { text: "Annulé", color: "bg-red-100 text-red-700", icon: AlertCircle };
        default:
            return { text: "Inconnu", color: "bg-gray-100 text-gray-700", icon: AlertCircle };
    }
};

const ListOrders = ({ orders, isLoading }: { orders: any[], isLoading: boolean }) => {
    
    // Loader for table rows (desktop)
    const renderTableLoader = () => (
        <TableRow>
            <TableCell colSpan={8}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </TableCell>
        </TableRow>
    );

    // Loader for mobile cards
    const renderMobileLoader = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border border-gray-200">
                    <CardContent className="p-0">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded" />
                        </div>
                        <div className="px-4 pb-4 space-y-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="px-4 pb-4 flex items-center gap-2">
                            <Skeleton className="h-10 w-32 rounded" />
                            <Skeleton className="h-10 w-20 rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Produits</TableHead>
                            <TableHead>Prix total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Paiement</TableHead>
                            <TableHead>Lieu de livraison</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && renderTableLoader()}
                        {!isLoading && orders?.length > 0 && orders.map((order) => {
                            // Utiliser la même logique que OrdersPage pour traiter les données
                            const orderData = order.order || order;
                            const statusInfo = getStatusInfo(orderData.status);
                            const StatusIcon = statusInfo.icon;
                            const paymentStatus = getPaymentStatus(orderData.isPay);
                            const PaymentIcon = paymentStatus.icon;
                            const orderItems = getOrderItems(orderData);
                            const totalItems = getTotalItems(orderItems);
                            const hasVariations = orderItems.some((item: any) => item.type === 'variation');
                            const deliveryLocation = getDeliveryLocation(orderData);
                            const orderId = order?.order?.id || order?.id;
                            
                            return (
                                <TableRow key={orderId} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-700">
                                                    {orderData?.userName?.charAt(0).toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className="font-medium text-gray-900">{orderData?.userName || 'Client inconnu'}</span>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {orderData?.userPhone || 'Téléphone non disponible'}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Calendar className="h-3 w-3" />
                                            {formatDateSafely(orderData.created_at)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{totalItems} article(s)</span>
                                            {hasVariations && (
                                                <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">
                                                    Variés
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <span className="font-semibold text-gray-900">{formatPrice(orderData.total_amount)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${statusInfo.color} hover:opacity-80`}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {statusInfo.text}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${paymentStatus.color} hover:opacity-80`}>
                                            <PaymentIcon className="h-3 w-3 mr-1" />
                                            {paymentStatus.text}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin className="h-3 w-3" />
                                            <span className="max-w-[200px] truncate" title={deliveryLocation}>
                                                {deliveryLocation}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <AsyncLink to={`/admin/order/${orderId}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </AsyncLink>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                <CheckCheck className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {isLoading && renderMobileLoader()}
                {!isLoading && orders?.length > 0 && orders.map((order) => {
                    // Utiliser la même logique que OrdersPage pour traiter les données
                    const orderData = order.order || order;
                    const statusInfo = getStatusInfo(orderData.status);
                    const StatusIcon = statusInfo.icon;
                    const paymentStatus = getPaymentStatus(orderData.isPay);
                    const PaymentIcon = paymentStatus.icon;
                    const orderItems = getOrderItems(orderData);
                    const totalItems = getTotalItems(orderItems);
                    const hasVariations = orderItems.some((item: any) => item.type === 'variation');
                    const deliveryLocation = getDeliveryLocation(orderData);
                    const orderId = order?.order?.id || order?.id;
                    
                    return (
                        <Card key={orderId} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                {/* Header with Client and Status */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-700">
                                                {orderData?.userName?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {orderData?.userName || 'Client inconnu'}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDateSafely(orderData.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge className={`${statusInfo.color}`}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {statusInfo.text}
                                        </Badge>
                                        <Badge className={`${paymentStatus.color} text-xs`}>
                                            <PaymentIcon className="h-3 w-3 mr-1" />
                                            {paymentStatus.text}
                                        </Badge>
                                        {hasVariations && (
                                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                                                Produits variés
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Order Information */}
                                <div className="px-4 pb-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span>Produits</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {totalItems} article(s)
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <span>Total</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {formatPrice(orderData.total_amount)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="flex-1 truncate" title={deliveryLocation}>
                                            {deliveryLocation}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>{orderData.userPhone || 'Téléphone non disponible'}</span>
                                    </div>

                                    {/* Product Details */}
                                    {orderItems.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs font-medium text-gray-700 mb-2">Produits commandés :</p>
                                            <div className="space-y-1">
                                                {orderItems.slice(0, 3).map((item: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <span className="flex-1 truncate">• {item.name}</span>
                                                        {item.color && (
                                                            <span className="text-purple-600 text-xs">({item.color})</span>
                                                        )}
                                                        {item.size && (
                                                            <span className="text-blue-600 text-xs">T.{item.size}</span>
                                                        )}
                                                        <span className="text-xs">x{item.quantity}</span>
                                                        <span className="text-gray-500 text-xs">({formatPrice(item.price)})</span>
                                                    </div>
                                                ))}
                                                {orderItems.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{orderItems.length - 3} autre(s) produit(s)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="px-4 pb-4 flex items-center gap-2">
                                    <AsyncLink to={`/admin/order/${orderId}`} className="flex-1">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Voir les détails
                                        </Button>
                                    </AsyncLink>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-10 px-3 text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                        <CheckCheck className="h-4 w-4 mr-1" />
                                        Valider
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {!isLoading && orders?.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune commande trouvée</p>
                </div>
            )}
        </div>
    )
}

export default React.memo(ListOrders);

export function ListOrdersContainer() {
    const { data: orders, isLoading, error } = useAdminListOrdersQuery('admin')
    
    if (error) {
        console.error('Erreur lors du chargement des commandes:', error);
    }
    
    return <ListOrders orders={orders || []} isLoading={isLoading} />
}