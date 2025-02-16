import { Header } from "@/components/dashboard/admin/layouts/Header"
import { Sidebar } from "@/components/dashboard/admin/layouts/Sidebar"
import { RecentProducts } from "@/components/dashboard/admin/recent-products"
import { RecentUsers } from "@/components/dashboard/admin/recent-users"
import { UserStats } from "@/components/dashboard/admin/user-stats"
import RecentGridUser from "@/components/dashboard/admin/users/recent-grid-user"
import { useRecentProductsQuery } from "@/services/adminService"
import { Users, TrendingUp, Package,ShoppingCart, DollarSign } from "lucide-react"




const recentProducts = [
  { id: "1", name: "Wireless Earbuds", price: 79.99, image: "/placeholder.svg", addedAt: "2023-01-25" },
  { id: "2", name: "Smart Watch", price: 199.99, image: "/placeholder.svg", addedAt: "2023-01-26" },
  { id: "3", name: "Portable Charger", price: 49.99, image: "/placeholder.svg", addedAt: "2023-01-27" },
]

const sellerStats = [
  { title: "Total Sellers", value: 1234, change: 12, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  { title: "New Sellers", value: 56, change: 8, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
  { title: "Active Products", value: 789, change: -3, icon: <Package className="h-4 w-4 text-muted-foreground" /> },
]

const delivererStats = [
  { title: "Total Deliverers", value: 567, change: 5, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  { title: "New Deliverers", value: 23, change: 15, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
  {
    title: "Completed Deliveries",
    value: 1023,
    change: 7,
    icon: <Package className="h-4 w-4 text-muted-foreground" />,
  },
]

export default function DashboardAdminPage() {

  const {data:{data:recentProducts}={},isLoading}=useRecentProductsQuery('admin')
  console.log(recentProducts)
  return (
    <main className="p-4 md:p-6 mt-16">
    <h1 className="text-2xl font-bold mb-6">Akevas Dashboard</h1>

    <div className="grid gap-6 mb-6">
      <UserStats
        stats={[
          {
            title: "Total Revenue",
            value: 0,
            change: 12,
            icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Active Orders",
            value: 0,
            change: 8,
            icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: "Total Products",
            value: 0,
            change: 3,
            icon: <Package className="h-4 w-4 text-muted-foreground" />,
          },
        ]}
      />
    </div>

    <div className="grid gap-6 mb-6">
      <RecentGridUser/>
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

