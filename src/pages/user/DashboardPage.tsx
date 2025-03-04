import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Heart, Clock, MapPin, Settings, CreditCard, DollarSign, ShoppingBag } from 'lucide-react';
import { useGetUserStatsQuery } from '@/services/auth';
import Stats from '@/components/dashboard/user/stats';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';


const UserDashboardPage = () => {

  const { data, isLoading } = useGetUserStatsQuery("Auth");

  const cartItems = useSelector((state: RootState) => state.cart.cartItems)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Stats key={1} title="Commandes" icon={<Package className="w-6 h-6" />} value={data?.total_orders} color="bg-blue-500" index={1} />
        <Stats key={2} title="Montant dépensé" icon={<DollarSign className="w-6 h-6" />} value={`${data?.total_amount} XAF`} color="bg-pink-500" index={2} />
        <Stats key={3} title="En cours de livraison" icon={<Clock className="w-6 h-6" />} value={data?.orders_in_progress} color="bg-green-500" index={3} />
        <Stats key={4} title="Panier" icon={<ShoppingBag className="w-6 h-6" />} value={String(cartItems.length)} color="bg-green-500" index={4} />
      </div>

      {/* Section principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dernières commandes */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Dernières commandes</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">Commande #{2024001 + index}</h3>
                    <p className="text-sm text-gray-500">2 articles • En cours de livraison</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
            <div className="space-y-4">
              {[
                { title: 'Gérer mes paiements', icon: CreditCard, color: 'text-purple-500' },
                { title: 'Mes favoris', icon: Heart, color: 'text-pink-500' },
                { title: 'Paramètres du compte', icon: Settings, color: 'text-gray-500' },
              ].map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default UserDashboardPage; 