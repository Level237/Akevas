
import { RecentProducts } from "@/components/dashboard/admin/recent-products"

import { UserStats } from "@/components/dashboard/admin/user-stats"
import RecentGridUser from "@/components/dashboard/admin/users/recent-grid-user"
import { useAdminActiveSellerStatsQuery, useAdminActiveStatsQuery, useAdminDeliveryStatsQuery, useRecentProductsQuery } from "@/services/adminService"
import { Users, TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react"








export default function DashboardAdminPage() {

  const { data: activeStats } = useAdminActiveStatsQuery("admin")
  const { data: sellerStatsAdmin } = useAdminActiveSellerStatsQuery("admin")
  const { data: deliveryStats } = useAdminDeliveryStatsQuery("admin")

  const sellerStats = [
    { title: "Total Sellers", value: sellerStatsAdmin?.totalSellers, change: 12, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "New Sellers", value: sellerStatsAdmin?.activeSellers, change: 8, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
    { title: "Active Products", value: sellerStatsAdmin?.activeProducts, change: -3, icon: <Package className="h-4 w-4 text-muted-foreground" /> },
  ]


  const delivererStats = [
    { title: "Total Deliverers", value: deliveryStats?.totalDeliveries, change: 5, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "New Deliverers", value: deliveryStats?.activeDeliveries, change: 15, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
    {
      title: "Completed Deliveries",
      value: deliveryStats?.activeOrders,
      change: 7,
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
    },
  ]
  const { data: { data: recentProducts } = {}, isLoading } = useRecentProductsQuery('admin')

  return (
    <main className="p-4 md:p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6">Akevas Dashboard</h1>

      <div className="grid gap-6 mb-6">
        <UserStats
          stats={[
            {
              title: "Total Revenue",
              value: activeStats?.revenues,
              change: 12,
              icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
            },
            {
              title: "Active Orders",
              value: activeStats?.activeOrders,
              change: 8,
              icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
            },
            {
              title: "Total Products",
              value: activeStats?.totalProducts,
              change: 3,
              icon: <Package className="h-4 w-4 text-muted-foreground" />,
            },
          ]}
        />
      </div>

      <div className="grid gap-6 mb-6">
        <RecentGridUser />
        <RecentProducts products={recentProducts} isLoading={isLoading} />
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Seller Statistics</h2>
          <UserStats stats={sellerStats} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Deliverer Statistics</h2>
          <UserStats stats={delivererStats} />
        </div>
      </div>
    </main>
  )
}

