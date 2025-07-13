import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { User as UserType } from "@/types/user";
import { useAdminListCustomersQuery } from "@/services/adminService";
import { formatDate } from "@/lib/formatDate";
import { Card, CardContent } from '@/components/ui/card';

const ListCustomers = ({ customers, isLoading }: { customers: UserType[], isLoading: boolean }) => {
    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Quartier</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && customers?.length > 0 && customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="text-sm font-medium">
                                                {customer?.userName?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{customer?.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">{customer.email}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">{customer.phone_number}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">{customer?.residence || 'N/A'}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs text-gray-500">{formatDate(customer.created_at)}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {!isLoading && customers?.length > 0 && customers.map((customer) => (
                    <Card key={customer.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            {/* Header with Avatar and Name */}
                            <div className="p-4 flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="text-sm font-medium">
                                        {customer?.userName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {customer?.userName}
                                    </h3>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        Client
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="px-4 pb-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{customer.phone_number}</span>
                                </div>
                                {customer?.residence && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{customer.residence}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span>Inscrit le {formatDate(customer.created_at)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 pb-4 flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 h-10"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-10 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Supprimer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
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