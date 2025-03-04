import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { Package } from "lucide-react";
import { User } from "@/types/user";
import { useAdminListCustomersQuery } from "@/services/adminService";
import { formatDate } from "@/lib/formatDate";

const ListCustomers = ({ customers, isLoading }: { customers: User[], isLoading: boolean }) => {
    return (
        <div>
            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Quartier</TableHead>
                        <TableHead>Date de création</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {!isLoading && customers?.length > 0 && customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell className="font-medium flex items-center gap-2"> <Avatar>

                                <AvatarFallback>{customer?.userName?.charAt(0)}</AvatarFallback>
                            </Avatar> {customer?.userName}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone_number}</TableCell>
                            <TableCell>{customer?.residence}</TableCell>
                            <TableCell>{formatDate(customer.created_at)}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!isLoading && customers?.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun client trouvé</p>
                </div>
            )}
        </div>
    )
}

export default React.memo(ListCustomers);

export function ListCustomersContainer() {
    const { data: customers, isLoading } = useAdminListCustomersQuery('admin')
    console.log(customers)
    return <ListCustomers customers={customers} isLoading={isLoading} />
}