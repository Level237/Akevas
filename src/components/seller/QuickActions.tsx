import { motion } from "framer-motion"
import { ShoppingBag, Wallet, Package, Settings, ArrowRight } from "lucide-react"
import AsyncLink from "../ui/AsyncLink"


interface QuickActionsProps {
  sellerData: any
}

export function QuickActions({ sellerData }: QuickActionsProps) {
  const actions = [
    {
      title: "Catalogue",
      description: "Gérer vos produits",
      icon: <ShoppingBag className="w-4 h-4 text-gray-700" />,
      link: "/catalogue",
      metric: "Voir tout"
    },
    {
      title: "Recharger",
      description: "Solde coins",
      icon: <Wallet className="w-4 h-4 text-gray-700" />,
      link: "/recharge",
      metric: `${sellerData?.shop?.coins || 0} coins`
    },
    {
      title: "Produits",
      description: "Gérer l'inventaire",
      icon: <Package className="w-4 h-4 text-gray-700" />,
      link: "/seller/products",
      metric: `${sellerData?.shop?.products_count || 0}`
    },
    {
      title: "Boutique",
      description: "Personnalisation",
      icon: <Settings className="w-4 h-4 text-gray-700" />,
      link: "/shop/editor",
      metric: "Éditer"
    }
  ]

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">
        Liens rapides
      </h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AsyncLink to={action.link} className="block">
              <div className="group relative bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-gray-100 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {action.metric}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-0.5">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Accéder</span>
                    <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </AsyncLink>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 