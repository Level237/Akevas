import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Check,Eye, Users, X } from "lucide-react";

import { formatDate } from "@/lib/formatDate";
import {  useAdminListShopReviewsQuery, useDeclineOrValidateShopReviewMutation } from "@/services/adminService";
import { Link } from "react-router-dom";


const ListShopReviews=({reviews,isLoading}:{reviews:any,isLoading:boolean})=>{
    const [declineOrValidateShopReview]=useDeclineOrValidateShopReviewMutation()

    const handleDeclineOrAccept=async(reviewId:number,status:number)=>{

        await declineOrValidateShopReview({reviewId:reviewId,status:status})
    }
    return (
        <div>
        <Table>

            <TableHeader>
                <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Appreciation</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Nom de la boutique</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                {!isLoading && reviews?.length > 0 && reviews.map((review:any) => (
                    <TableRow key={review.id}>
                        <TableCell className="font-medium flex items-center gap-2"> <Avatar>

                            <AvatarFallback>{review.user.userName.charAt(0)}</AvatarFallback>
                        </Avatar> {review.user.userName}</TableCell>
                        <TableCell>{review.user.phone_number}</TableCell>
                        <TableCell>{review.rating}</TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>{review.is_approved ? <div className="bg-green-500 text-white p-1 text-xs rounded">En ligne</div> : <div className="bg-red-500 text-white p-1 text-xs rounded">non approuvé</div>}</TableCell>
                        <TableCell>{review.shop.shop_name}</TableCell>
                        <TableCell>{formatDate(review.created_at)}</TableCell>
                        <TableCell className="text-right flex items-center">
                        {review.is_approved ? <Button onClick={()=>handleDeclineOrAccept(review.id,0)} variant="ghost" size="icon" className="mr-2">
                                <X  className="h-4 text-red-500 w-4"/>
                            </Button> : <Button onClick={()=>handleDeclineOrAccept(review.id,1)} variant="ghost" size="icon" className="mr-2">
                                <Check  className="h-4 text-green-500 w-4" />
                            </Button>}
                            <Link to={`/shop/${review.shop.id}`} className="text-red-500 hover:text-red-600">
                                <Eye className="h-4 w-4" />
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {!isLoading && reviews?.length === 0 && (
            <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucun Commentaire trouvé</p>
            </div>
        )}
    </div>
    )
}

const ListShopReviewContainer=()=>{
    const {data,isLoading}=useAdminListShopReviewsQuery("admin")
    
    return <ListShopReviews reviews={data} isLoading={isLoading} />
}

export default ListShopReviewContainer;
