import AsyncLink from "@/components/ui/AsyncLink"
import { Card } from "@/components/ui/card"
import { Seller } from "@/types/seller"
import { motion } from "framer-motion"
import { TrendingUp, Users, Package, ShoppingCart, Plus } from "lucide-react"

export default function StatisticsOverview(sellerData: { sellerData: Seller | null | undefined }) {
  const stats = [
    {
      title: "Visites",
      value: "0",
      icon: <Users className="w-6 h-6" />,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Produits",
      value: sellerData?.sellerData?.shop.products_count || "0",
      icon: <Package className="w-6 h-6" />,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Ventes",
      value: sellerData?.sellerData?.shop?.orders_count || "0",
      icon: <ShoppingCart className="w-6 h-6" />,
      gradient: "from-green-500 to-green-600"
    }
  ]

  return (
    <div className="w-full">
      <motion.div
        
        
        className="mb-8"
      >
        <Card className="p-8 bg-white shadow-lg">
          <div className="flex items-center mb-8 justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Statistiques de votre boutique
          </h3>
          <AsyncLink
            to="/seller/create-product"
            className="flex items-center gap-2 px-4 py-2 bg-[#d97100] text-[#d97100] border border-[#d97100] text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="max-sm:hidden">Nouveau produit</span>
          </AsyncLink>
          </div>
          
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                
                className={`p-6 rounded-2xl bg-gradient-to-r ${stat.gradient} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/20 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium">{stat.title}</span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
              </motion.div>
            ))}

          <motion.div
           
            className="p-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Revenus totaux</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                {sellerData?.sellerData?.shop?.total_earnings || 0} XAF
              </span>
            </div>
          </motion.div>
          </div>

        </Card>
      </motion.div>
    </div>
  )
}
