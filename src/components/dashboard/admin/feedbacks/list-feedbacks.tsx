import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {  ExternalLink,MessageCircle } from "lucide-react";

import { formatDate } from "@/lib/formatDate";
import { useAdminListFeedbackQuery } from "@/services/adminService";
import { Link } from "react-router-dom";


const ListFeedback=({feedbacks,isLoading}:{feedbacks:any,isLoading:boolean})=>{
    

    
    return (
        <div>
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

                {!isLoading && feedbacks?.length > 0 && feedbacks.map((feedback:any) => (
                    <TableRow key={feedback.id}>
                        <TableCell className="font-medium flex items-center gap-2"> <Avatar>

                            <AvatarFallback>{feedback.user.firstName.charAt(0)}</AvatarFallback>
                        </Avatar> {feedback.user.firstName}</TableCell>
                        <TableCell>{feedback.user.phone_number}</TableCell>
                        <TableCell>{feedback.message}</TableCell>
                        <TableCell>{feedback.role===2 && <div>Vendeur</div>}{feedback.role===4 && <div>Livreur</div>}</TableCell>
                        <TableCell>{feedback.status===1 ? <div className="bg-green-500 text-white p-1 text-xs rounded">traité</div> : <div className="bg-red-500 text-white p-1 text-xs rounded">non traité</div>}</TableCell>
                        <TableCell>{formatDate(feedback.created_at)}</TableCell>
                        <TableCell className="text-right flex items-center">
                        {feedback.role===2 &&  <Link to={`/admin/shops/${feedback.shop.id}`}> <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                        
                  Visualiser
                </Button></Link>}
                {feedback.role===4 &&  <Link to={`/admin/delivery/${feedback.user.id}`}> <Button variant="ghost" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />  Visualiser
                </Button></Link>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {!isLoading && feedbacks?.length === 0 && (
            <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucun Feedback trouvé</p>
            </div>
        )}
    </div>
    )
}

const ListFeedbackContainer=()=>{
    const {data,isLoading}=useAdminListFeedbackQuery("admin")
  
    return <ListFeedback feedbacks={data} isLoading={isLoading} />
}

export default ListFeedbackContainer;
