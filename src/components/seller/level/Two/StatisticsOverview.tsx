import { Card } from "@/components/ui/card"
import { Seller } from "@/types/seller"

import { motion } from "framer-motion"

export default function StatisticsOverview(sellerData: { sellerData: Seller | null | undefined }) {
  console.log(sellerData)
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Statistiques de votre boutique
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-[#ed7e0f]/5 rounded-lg">
              <div className="text-3xl font-bold text-[#ed7e0f]">
                0
              </div>
              <div className="text-sm text-gray-600 mt-1">Visites</div>
            </div>

            <div className="p-4 bg-[#ed7e0f]/5 rounded-lg">
              <div className="text-3xl font-bold text-[#ed7e0f]">
                0
              </div>
              <div className="text-sm text-gray-600 mt-1">Followers</div>
            </div>

            <div className="p-4 bg-[#ed7e0f]/5 rounded-lg">
              <div className="text-3xl font-bold text-[#ed7e0f]">
                {sellerData?.sellerData?.shop.products_count || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Produits</div>
            </div>

            <div className="p-4 bg-[#ed7e0f]/5 rounded-lg">
              <div className="text-3xl font-bold text-[#ed7e0f]">
                {sellerData?.sellerData?.shop?.orders_count || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Ventes</div>
            </div>

            <div className="p-4 bg-[#ed7e0f]/5 rounded-lg col-span-2 md:col-span-4">
              <div className="text-3xl font-bold text-[#ed7e0f]">
                {sellerData?.sellerData?.shop?.total_earnings || 0} XAF
              </div>
              <div className="text-sm text-gray-600 mt-1">Revenus totaux</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
