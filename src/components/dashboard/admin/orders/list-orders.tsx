import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCheck, Eye} from "lucide-react";
import { Package } from "lucide-react";
import { useAdminListOrdersQuery } from "@/services/adminService";
import { formatDate } from "@/lib/formatDate";
import AsyncLink from "@/components/ui/AsyncLink";
const ListOrders = ({ orders, isLoading }: { orders: any[], isLoading: boolean }) => {
    return (
        <div >
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

                    {!isLoading && orders?.length > 0 && orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium flex items-center gap-2"> <Avatar>

                                <AvatarFallback>{order?.userName?.charAt(0)}</AvatarFallback>
                            </Avatar> {order?.userName}</TableCell>


                            <TableCell>{formatDate(order.created_at)}</TableCell>
                            <TableCell>{order.itemsCount} produits commandés</TableCell>
                            <TableCell>{order.total_amount}</TableCell>
                            <TableCell className={`${order.status === "0" && "text-red-500"} ${order.status === "1" && "text-orange-500"} ${order.status === "2" && "text-green-500"}`}>
                                <span className="capitalize font-bold">{order.status === "0" && "En attente"}</span>
                                <span className="capitalize font-bold">{order.status === "1" && "En Cours"}</span>
                                <span className="capitalize font-bold">{order.status === "2" && "Livré"}</span>
                            </TableCell>

                            
                            <TableCell>{order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}</TableCell>
                            <TableCell>{order.phone}</TableCell>
                            <TableCell className="text-right flex items-center">
                                <AsyncLink to={`/admin/order/${order.id}`} className="mr-2">
                                    <Eye className="h-4 w-4" />
                                </AsyncLink>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <CheckCheck className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
    const { data: orders, isLoading,error } = useAdminListOrdersQuery('admin')
    console.log(error)
    return <ListOrders orders={orders} isLoading={isLoading} />
}