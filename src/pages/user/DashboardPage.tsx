import { motion } from 'framer-motion';
import { useGetUserQuery, useLogoutMutation } from '@/services/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Package, Heart, Clock, MapPin, Settings, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/authSlice';

const UserDashboardPage = () => {
  const { data: userData } = useGetUserQuery('Auth');

   const dispatch=useDispatch();
const [logout]=useLogoutMutation() 
  const handleLogout = async() => {
    // Logique de déconnexion
    await logout('Auth')
    dispatch(logoutUser())
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header personnalisé */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userData?.profile} />
                <AvatarFallback className="bg-[#ed7e0f] text-white text-xl">
                  {userData?.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">Bonjour, {userData?.userName}</h1>
                <p className="text-gray-500 text-sm">Bienvenue sur votre espace personnel</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Section des statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Commandes', icon: Package, value: '12', color: 'bg-blue-500' },
            { title: 'Liste de souhaits', icon: Heart, value: '8', color: 'bg-pink-500' },
            { title: 'En cours de livraison', icon: Clock, value: '3', color: 'bg-amber-500' },
            { title: 'Adresses', icon: MapPin, value: '2', color: 'bg-green-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
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
      </main>
    </div>
  );
};

export default UserDashboardPage; 