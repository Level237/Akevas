import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Eye, Users, X, Star, MessageCircle, Calendar,Phone, Package } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { useAdminListReviewsQuery, useDeclineOrValidateMutation } from "@/services/adminService";
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ListReviews = ({ reviews, isLoading }: { reviews: any, isLoading: boolean }) => {
    const [declineOrValidate] = useDeclineOrValidateMutation()

    const handleDeclineOrAccept = async (reviewId: number, status: number) => {
        await declineOrValidate({ reviewId: reviewId, status: status })
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Appréciation</TableHead>
                            <TableHead>Commentaire</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Nom du Produit</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && reviews?.length > 0 && reviews.map((review: any) => (
                            <TableRow key={review.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="text-sm font-medium">
                                                {review.user.userName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{review.user.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">{review.user.phone_number}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                        <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 max-w-xs truncate block">
                                        {review.comment}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={review.is_approved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                                        {review.is_approved ? "En ligne" : "Non approuvé"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">{review.product.product_name}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {review.is_approved ? (
                                            <Button 
                                                onClick={() => handleDeclineOrAccept(review.id, 0)} 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={() => handleDeclineOrAccept(review.id, 1)} 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Link to={`/produit/${review.product.product_url}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {!isLoading && reviews?.length > 0 && reviews.map((review: any) => (
                    <Card key={review.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            {/* Header with Client and Status */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="text-sm font-medium">
                                            {review.user.userName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {review.user.userName}
                                        </h3>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {review.user.phone_number}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={review.is_approved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                    {review.is_approved ? "En ligne" : "Non approuvé"}
                                </Badge>
                            </div>

                            {/* Rating and Product */}
                            <div className="px-4 pb-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span>Note</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                        <span className="text-sm font-medium ml-1">({review.rating}/5)</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{review.product.product_name}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span>Commenté le {formatDate(review.created_at)}</span>
                                </div>
                            </div>

                            {/* Comment */}
                            {review.comment && (
                                <div className="px-4 pb-4">
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="px-4 pb-4 flex items-center gap-2">
                                <Link to={`/produit/${review.product.product_url}`} className="flex-1">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Voir le produit
                                    </Button>
                                </Link>
                                {review.is_approved ? (
                                    <Button 
                                        onClick={() => handleDeclineOrAccept(review.id, 0)} 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-10 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Rejeter
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => handleDeclineOrAccept(review.id, 1)} 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-10 px-3 text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approuver
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!isLoading && reviews?.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun commentaire trouvé</p>
                </div>
            )}
        </div>
    )
}

const ListReviewContainer = () => {
    const { data, isLoading } = useAdminListReviewsQuery("admin")

    return <ListReviews reviews={data} isLoading={isLoading} />
}

export default ListReviewContainer;
