
import { RecentUsers } from '../recent-users'
import { useRecentSellerQuery } from '@/services/adminService'

export default function RecentGridUser() {

  const {data:{data:recentSellers}={data:[]},isLoading}=useRecentSellerQuery('admin')
  return (
   <div className="grid gap-4 md:grid-cols-2">
        <RecentUsers users={null} isLoading={isLoading} title="Livreurs Récents" />
        <RecentUsers users={recentSellers} isLoading={isLoading} title="Boutiques Récents" />
      </div>
  )
}
