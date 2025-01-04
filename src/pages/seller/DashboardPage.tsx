import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Store,
  AlertCircle,
  CheckCircle2,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  FileText,
  UserCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const DashboardPage = () => {
  // État simulé de la boutique
  const storeStatus = 'approved'; // 'pending' | 'approved' | 'rejected'

  const getStatusContent = () => {
    switch (storeStatus) {
      case 'pending':
        return {
          icon: Clock,
          title: 'En attente de validation',
          description: 'Votre demande est en cours d\'examen par notre équipe',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          estimate: '24-48 heures'
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          title: 'Boutique approuvée',
          description: 'Votre boutique a été validée. Vous pouvez commencer à vendre',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          title: 'Validation refusée',
          description: 'Votre demande n\'a pas été approuvée. Consultez les détails ci-dessous',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return null;
    }
  };

  const status = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Tableau de bord vendeur
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="w-6 h-6" />
              </button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`p-6 ${status?.bgColor} border-2 ${status?.borderColor}`}>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${status?.bgColor} ${status?.color}`}>
                {status && <status.icon className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h2 className={`text-lg font-semibold ${status?.color}`}>
                  {status?.title}
                </h2>
                <p className="mt-1 text-gray-600">
                  {status?.description}
                </p>
                {status?.estimate && (
                  <p className="mt-2 text-sm text-gray-500">
                    Temps d'attente estimé: {status.estimate}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-not-allowed opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Store className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Ma boutique</h3>
                  <p className="text-sm text-gray-500">En attente de validation</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-not-allowed opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Documents</h3>
                  <p className="text-sm text-gray-500">Gérer vos documents</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Aide</h3>
                  <p className="text-sm text-gray-500">Centre d'assistance</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </motion.div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Prochaines étapes
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium">1</span>
                </div>
                Validation de votre boutique par notre équipe
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium">2</span>
                </div>
                Configuration de votre boutique
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium">3</span>
                </div>
                Ajout de vos premiers produits
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Centre de ressources
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Guide du vendeur
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Bonnes pratiques de vente
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  FAQ Vendeurs
                </a>
              </li>
            </ul>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
