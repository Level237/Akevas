import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCheck, Eye, Package, User, Calendar, MapPin, Phone, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAdminListOrdersQuery } from "@/services/adminService";
import { formatDate } from "@/lib/formatDate";
import AsyncLink from "@/components/ui/AsyncLink";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ListOrders = ({ orders, isLoading }: { orders: any[], isLoading: boolean }) => {
    
    const getStatusInfo = (status: string) => {
        switch (status) {
            case "0":
                return { text: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock };
            case "1":
                return { text: "En cours", color: "bg-blue-100 text-blue-700", icon: Truck };
            case "2":
                return { text: "Livré", color: "bg-green-100 text-green-700", icon: CheckCircle };
            default:
                return { text: "Inconnu", color: "bg-gray-100 text-gray-700", icon: AlertCircle };
        }
    };

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
                            <TableHead>Nombre de produits</TableHead>
                            <TableHead>Prix total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Lieu de livraison</TableHead>
                            <TableHead>Numéro du livreur</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && renderTableLoader()}
                        {!isLoading && orders?.length > 0 && orders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;
                            
                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="text-sm font-medium">
                                                    {order?.userName?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{order?.userName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{order.itemsCount} produits</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-gray-900">{order.total_amount} XAF</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${statusInfo.color} hover:opacity-80`}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {statusInfo.text}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm  text-gray-600">
                                            {order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}
                                            {order.emplacement == null && order.addresse}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">{order.phone}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <AsyncLink to={`/admin/order/${order.id}`}>
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
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                        <Card key={order.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                {/* Header with Client and Status */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="text-sm font-medium">
                                                {order?.userName?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {order?.userName}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={`${statusInfo.color}`}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusInfo.text}
                                    </Badge>
                                </div>

                                {/* Order Information */}
                                <div className="px-4 pb-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span>Produits</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {order.itemsCount} produits
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span>Total</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {order.total_amount} XAF
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>
                                            {order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}
                                            {order.emplacement == null && order.addresse}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>{order.phone}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 pb-4 flex items-center gap-2">
                                    <AsyncLink to={`/admin/order/${order.id}`} className="flex-1">
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
    console.log(error)
    return <ListOrders orders={orders} isLoading={isLoading} />
}