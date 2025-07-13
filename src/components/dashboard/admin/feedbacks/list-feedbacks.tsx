import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, User, Phone, Calendar, Store, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { useAdminListFeedbackQuery } from "@/services/adminService";
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ListFeedback = ({ feedbacks, isLoading }: { feedbacks: any, isLoading: boolean }) => {
    const getRoleInfo = (role: number) => {
        switch (role) {
            case 2:
                return { text: "Vendeur", icon: Store, color: "bg-blue-100 text-blue-700" };
            case 4:
                return { text: "Livreur", icon: Truck, color: "bg-purple-100 text-purple-700" };
            default:
                return { text: "Utilisateur", icon: User, color: "bg-gray-100 text-gray-700" };
        }
    };

    const getStatusInfo = (status: number) => {
        return status === 1 
            ? { text: "Traité", color: "bg-green-100 text-green-700", icon: CheckCircle }
            : { text: "Non traité", color: "bg-red-100 text-red-700", icon: AlertCircle };
    };

    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && feedbacks?.length > 0 && feedbacks.map((feedback: any) => {
                            const roleInfo = getRoleInfo(feedback.role);
                            const statusInfo = getStatusInfo(feedback.status);
                            const RoleIcon = roleInfo.icon;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <TableRow key={feedback.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="text-sm font-medium">
                                                    {feedback.user.firstName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{feedback.user.firstName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">{feedback.user.phone_number}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600 max-w-xs truncate block">
                                            {feedback.message}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${roleInfo.color} hover:opacity-80`}>
                                            <RoleIcon className="h-3 w-3 mr-1" />
                                            {roleInfo.text}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${statusInfo.color} hover:opacity-80`}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {statusInfo.text}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-gray-500">{formatDate(feedback.created_at)}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {feedback.role === 2 && (
                                            <Link to={`/admin/shops/${feedback.shop.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Visualiser
                                                </Button>
                                            </Link>
                                        )}
                                        {feedback.role === 4 && (
                                            <Link to={`/admin/delivery/${feedback.user.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Visualiser
                                                </Button>
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {!isLoading && feedbacks?.length > 0 && feedbacks.map((feedback: any) => {
                    const roleInfo = getRoleInfo(feedback.role);
                    const statusInfo = getStatusInfo(feedback.status);
                    const RoleIcon = roleInfo.icon;
                    const StatusIcon = statusInfo.icon;

                    return (
                        <Card key={feedback.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                {/* Header with User and Status */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="text-sm font-medium">
                                                {feedback.user.firstName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {feedback.user.firstName}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {feedback.user.phone_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Badge className={`${roleInfo.color}`}>
                                            <RoleIcon className="h-3 w-3 mr-1" />
                                            {roleInfo.text}
                                        </Badge>
                                        <Badge className={`${statusInfo.color}`}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {statusInfo.text}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="px-4 pb-4">
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            "{feedback.message}"
                                        </p>
                                    </div>
                                </div>

                                {/* Date and Actions */}
                                <div className="px-4 pb-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="h-3 w-3 text-gray-400" />
                                        <span>Envoyé le {formatDate(feedback.created_at)}</span>
                                    </div>

                                    {/* Actions */}
                                    {feedback.role === 2 && (
                                        <Link to={`/admin/shops/${feedback.shop.id}`}>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Voir la boutique
                                            </Button>
                                        </Link>
                                    )}
                                    {feedback.role === 4 && (
                                        <Link to={`/admin/delivery/${feedback.user.id}`}>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Voir le livreur
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {!isLoading && feedbacks?.length === 0 && (
                <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun feedback trouvé</p>
                </div>
            )}
        </div>
    )
}

const ListFeedbackContainer = () => {
    const { data, isLoading } = useAdminListFeedbackQuery("admin")

    return <ListFeedback feedbacks={data} isLoading={isLoading} />
}

export default ListFeedbackContainer;
