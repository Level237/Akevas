
import { motion } from 'framer-motion';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Lock,
  X,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';

import VisibilityShop from '@/components/seller/level/Two/VisibilityShop';
import TitleOverview from '../../components/seller/level/Two/TitleOverview';
import StatisticsOverview from '@/components/seller/level/Two/StatisticsOverview';

const DashboardPage = () => {

  const {data: { data: sellerData } = {},isLoading}=useCurrentSellerQuery<SellerResponse>('seller')
  
  const storeStatus = sellerData?.shop.state;

  const getStatusContent = () => {
    switch (storeStatus) {
      case "0":
        return {
          icon: Clock,
          title: 'En attente de validation',
          description: 'Votre demande est en cours d\'examen par notre équipe',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          estimate: '24-48 heures'
        };
      case '1':
        return {
          icon: CheckCircle2,
          title: 'Boutique approuvée',
          description: 'Votre boutique a été validée. Vous pouvez commencer à vendre',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        };
      case '2':
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
    
      <div className=" transition-all duration-300">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Carte de statut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {sellerData?.shop.level !=="2" && sellerData?.shop.level==="1"
            &&
              <Card className={`${status?.bgColor} border ${status?.borderColor}`}>
              <div className="p-6">
                <IsLoadingComponents isLoading={isLoading}/>
                <div className="flex justify-between space-x-4">
                  
                  
                         <div className='flex  gap-3'>
                         <div className={`p-3 rounded-lg ${status?.color}  bg-white`}>
                    
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
                   <div className=''>
                    {sellerData?.shop.state==="1" && <X className='cursor-pointer'/>}
                          
                        </div>
                  
                 
                 
                  
                </div>
              </div>
            </Card>
            }
          
          </motion.div>
          {sellerData?.shop.level === "2" && (
            <TitleOverview 
            number={2} 
            title="Niveau 2 - Ajout d'un produit" 
            link="/seller/create-product" 
            content="Vous pouvez desormais ajouter vos produits directements dans votre boutique"
            cta="Ajouter un produit"
            />
          )}
           {sellerData?.shop.level === "3" && (
            <TitleOverview 
            number={3} 
            title="Niveau 3 - Mise en avant de votre boutique" 
            link="/seller/pro" 
            content="Devenez vendeur pro et positionnez votre boutique en tete de liste de la marketplace"
            cta="Devenez vendeur pro"
            />
          )}
          {sellerData?.shop.level==="2" && <VisibilityShop sellerData={sellerData}/>}
          {parseInt(sellerData?.shop.level || "0")>=2 && <StatisticsOverview sellerData={sellerData}/>}
          {sellerData?.shop.level==="3" && <VisibilityShop sellerData={sellerData}/>}
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
                     {sellerData?.shop.level==="1" &&  "0/3 complété"}
                      {sellerData?.shop.level==="2" &&  "1/3 complété"}
                      {sellerData?.shop.level==="3" &&  "2/3 complété"}
                    </span>
                  </div>
                  <div className="space-y-6">
                    {/* Étape 1 - En cours */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ed7e0f] text-white flex items-center justify-center">
                        1
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className={`text-sm font-medium text-gray-900`}>
                          Validation de votre boutique
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          En cours d'examen par notre équipe
                        </p>
                      </div>
                      {sellerData?.shop.level!=="1" && <Check className="w-5 h-5 text-[#ed7e0f]" />}
                      {sellerData?.shop.level==="1" && <Clock className="w-5 h-5 text-[#ed7e0f]" />}
                      
                    </div>

                    {/* Étape 2 - Verrouillée */}
                    <div className={`flex items-center ${parseInt(sellerData?.shop.level || "0")>=2 ? "" : "opacity-50"}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${parseInt(sellerData?.shop.level || "0")>=2 ? "bg-[#ed7e0f] text-white" : "bg-gray-200 text-gray-500"}   flex items-center justify-center`}>
                        2
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Ajouter un produit
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Créer votre première produit et démarrez vos ventes !
                        </p>
                      </div>
                      {parseInt(sellerData?.shop.level || "0")==2 && <Clock className="w-5 h-5 text-[#ed7e0f]" /> }
                      {parseInt(sellerData?.shop.level || "0")<2 && <Lock className="w-5 h-5 text-gray-400" />}
                      
                      {parseInt(sellerData?.shop.level || "0")>2 && <Check className="w-5 h-5 text-[#ed7e0f]" />}
                    </div>

                    {/* Étape 3 - Verrouillée */}
                    <div className={`flex items-center ${parseInt(sellerData?.shop.level || "0")>=3 ? "" : "opacity-50"}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${parseInt(sellerData?.shop.level || "0")>=3 ? "bg-[#ed7e0f] text-white" : "bg-gray-200 text-gray-500"}   flex items-center justify-center`}>
                        3
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Devenez vendeur pro
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Positionnez votre boutique en tete de liste de la marketplace
                        </p>
                      </div>
                      {parseInt(sellerData?.shop.level || "0")==3 && <Clock className="w-5 h-5 text-[#ed7e0f]" /> }
                      {parseInt(sellerData?.shop.level || "0")<3 && <Lock className="w-5 h-5 text-gray-400" />}
                      
                      {parseInt(sellerData?.shop.level || "0")>3 && <Check className="w-5 h-5 text-[#ed7e0f]" />}
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
    
  );
};

export default DashboardPage;
