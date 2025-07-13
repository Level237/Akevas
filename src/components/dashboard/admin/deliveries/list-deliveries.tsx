import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, ExternalLink, User, Phone, Mail, Car } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAdminListDeliveryQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Delivery } from '@/types/delivery'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

// Helper function to get "time ago" string
function timeAgo(dateString: string) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? "il y a 1 an" : `il y a ${interval} ans`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? "il y a 1 mois" : `il y a ${interval} mois`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? "il y a 1 jour" : `il y a ${interval} jours`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? "il y a 1 heure" : `il y a ${interval} heures`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? "il y a 1 minute" : `il y a ${interval} minutes`;
  return "à l'instant";
}

export default function ListDeliveries({ deliveries, isLoading }: { deliveries: Delivery[], isLoading: boolean }) {

  if (isLoading) {
    return <IsLoadingComponents isLoading={isLoading} />
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profil Véhicule</TableHead>
              <TableHead>Nom et Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={delivery.vehicle?.vehicle_image} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-medium">
                      {delivery.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{delivery.firstName} {delivery.lastName}</span>
                    {delivery.vehicle && (
                      <span className="text-xs text-gray-500">
                        {delivery.vehicle.vehicle_type || 'Véhicule'}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{delivery.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{delivery.phone_number}</span>
                </TableCell>
                <TableCell>
                  <Badge className={delivery.isDelivery ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                    {delivery.isDelivery ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-500">
                    {delivery.created_at ? timeAgo(delivery.created_at) : 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/delivery/${delivery.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visualiser
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {!isLoading && deliveries.map((delivery) => (
          <Card key={delivery.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Header with Avatar and Status */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={delivery.vehicle?.vehicle_image} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-medium">
                      {delivery.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {delivery.firstName} {delivery.lastName}
                    </h3>
                    {delivery.vehicle && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {delivery.vehicle.vehicle_type || 'Véhicule'}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={delivery.isDelivery ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {delivery.isDelivery ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Contact Information */}
              <div className="px-4 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{delivery.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{delivery.phone_number}</span>
                </div>
                {delivery.created_at && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3 text-gray-400" />
                    <span>Inscrit {timeAgo(delivery.created_at)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4">
                <Link to={`/admin/delivery/${delivery.id}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le profil complet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && deliveries?.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucun livreur trouvé</p>
        </div>
      )}
    </div>
  )
}

export function ListDeliveriesContainer() {
  const { data: { data: deliveries } = {}, isLoading } = useAdminListDeliveryQuery('admin')
  return <ListDeliveries deliveries={deliveries} isLoading={isLoading} />
}
