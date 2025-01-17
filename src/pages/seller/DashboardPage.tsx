import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Store,
  AlertCircle,
  CheckCircle2,
  Bell,
  Settings,
  HelpCircle,
  FileText,
  UserCircle,
  Lock,
  Menu
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Sidebar from '@/components/seller/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const storeStatus = 'pending';

  const getStatusContent = () => {
    switch (storeStatus) {
      case 'pending':
        return {
          icon: Clock,
          title: 'En attente de validation',
          description: 'Votre demande est en cours d\'examen par notre équipe',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          estimate: '24-48 heures'
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          title: 'Boutique approuvée',
          description: 'Votre boutique a été validée. Vous pouvez commencer à vendre',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          title: 'Validation refusée',
          description: 'Votre demande n\'a pas été approuvée. Consultez les détails ci-dessous',
          color: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200'
        };
      default:
        return null;
    }
  };

  const status = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* En-tête avec navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <div className="flex max-sm:hidden items-center">
                <Store className="w-8 h-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900">
                  Espace Vendeur
                </h1>
              </div>
              <nav className="hidden lg:flex space-x-6">
                <span className="text-[#ed7e0f] font-medium">Tableau de bord</span>
                <span className="text-gray-400 cursor-not-allowed">Produits</span>
                <span className="text-gray-400 cursor-not-allowed">Commandes</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Vendeur</p>
                </div>
                <div className="h-8 w-8  rounded-full flex items-center justify-center">
                  <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className=" transition-all duration-300">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Carte de statut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className={`${status?.bgColor} border ${status?.borderColor}`}>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${status?.color} bg-white`}>
                    {status && <status.icon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${status?.color}`}>
                      {status?.title}
                    </h2>
                    <p className="mt-1 text-gray-600">
                      {status?.description}
                    </p>
                    {status?.estimate && (
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1.5" />
                        Temps estimé: {status.estimate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prochaines étapes */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prochaines étapes
                    </h3>
                    <span className="px-2.5 py-0.5 bg-[#ed7e0f]/10 text-[#ed7e0f] text-sm rounded-full">
                      1/3 complété
                    </span>
                  </div>
                  <div className="space-y-6">
                    {/* Étape 1 - En cours */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ed7e0f] text-white flex items-center justify-center">
                        1
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Validation de votre boutique
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          En cours d'examen par notre équipe
                        </p>
                      </div>
                      <Clock className="w-5 h-5 text-[#ed7e0f]" />
                    </div>

                    {/* Étape 2 - Verrouillée */}
                    <div className="flex items-center opacity-50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                        2
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Configuration de la boutique
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Personnalisez votre espace de vente
                        </p>
                      </div>
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Étape 3 - Verrouillée */}
                    <div className="flex items-center opacity-50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                        3
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Ajout de produits
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Commencez à créer votre catalogue
                        </p>
                      </div>
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Ressources et aide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Ressources utiles
                </h3>
                <div className="space-y-4">
                  <a
                    href="#"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Guide du vendeur
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Tout ce qu'il faut savoir pour bien démarrer
                        </p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Centre d'aide
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Trouvez des réponses à vos questions
                        </p>
                      </div>
                    </div>
                  </a>
                </div>

                <button className="mt-6 w-full bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors">
                  Contacter le support
                </button>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
