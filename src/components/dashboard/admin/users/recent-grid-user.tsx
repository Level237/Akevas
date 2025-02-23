
import { RecentUsers } from '../recent-users'
import { useRecentDeliveryQuery, useRecentSellerQuery } from '@/services/adminService'

export default function RecentGridUser() {

  const {data:{data:recentSellers}={data:[]},isLoading}=useRecentSellerQuery('admin')
  const {data:{data:recentDelivery}={data:[]},isLoading:isLoadingDelivery}=useRecentDeliveryQuery('admin')
  console.log(recentDelivery)
  return (
   <div className="grid gap-4 md:grid-cols-2">
        <RecentUsers users={recentDelivery} isLoading={isLoadingDelivery} title="Livreurs Récents" />
        <RecentUsers users={recentSellers} isLoading={isLoading} title="Boutiques Récentes" />
      </div>
  )
}
