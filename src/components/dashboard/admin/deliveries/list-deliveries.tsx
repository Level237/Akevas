import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package,ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAdminListDeliveryQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Delivery } from '@/types/delivery'
import { Link } from 'react-router-dom'
export default function ListDeliveries({deliveries,isLoading}:{deliveries:Delivery[],isLoading:boolean}) {

  if(isLoading){
    return <IsLoadingComponents isLoading={isLoading}/>
  }
  return (
    <div>
            <Table>
                
        <TableHeader>
          <TableRow>
            <TableHead>Profil Vehicule</TableHead>
            <TableHead>Nom et Prenom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
                  
          {!isLoading && deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium flex items-center gap-2"> <Avatar>
                <AvatarImage src={delivery.vehicle?.vehicle_image} />
                <AvatarFallback>{delivery.firstName.charAt(0)}</AvatarFallback>
              </Avatar> </TableCell>
              <TableCell>{delivery.firstName} {delivery.lastName}</TableCell>
              <TableCell>{delivery.email}</TableCell>
              <TableCell>{delivery.phone_number}</TableCell>
              <TableCell>
                <Badge  className={delivery.isDelivery ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{delivery.isDelivery ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link to={`/admin/delivery/${delivery.id}`}> <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                 
                  Visualiser
                </Button></Link>
               
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isLoading && deliveries?.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucun livreur trouvé</p>
        </div>
      )}
    </div>
  )
}

export function ListDeliveriesContainer(){
  const {data:{data:deliveries}={},isLoading}=useAdminListDeliveryQuery('admin')
  return <ListDeliveries deliveries={deliveries} isLoading={isLoading}/>
}
