
import { Card } from '@/components/ui/card';
import { Package, Clock, DollarSign, ShoppingBag, Settings } from 'lucide-react';
import { useGetUserStatsQuery } from '@/services/auth';
import Stats from '@/components/dashboard/user/stats';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import RecentOrders from '@/components/dashboard/user/orders/recent-orders';
import AsyncLink from '@/components/ui/AsyncLink';
const UserDashboardPage = () => {

  const { data } = useGetUserStatsQuery("Auth");
  console.log(data)
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
        <div
          className="lg:col-span-2"


        >
          <RecentOrders />
        </div>

        {/* Actions rapides */}
        <div

          className='max-sm:mb-12'
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
            <div className="space-y-4">
              {[
                { title: 'Mon Panier', icon: ShoppingBag, color: 'text-pink-500', link: '/cart' },
                { title: 'Paramètres du compte', icon: Settings, color: 'text-gray-500', link: '/account' },
              ].map((action, index) => (
                <AsyncLink
                  key={index}
                  to={action.link}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="font-medium">{action.title}</span>
                </AsyncLink>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UserDashboardPage; 