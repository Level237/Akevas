import { useState, useEffect } from 'react';
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
  Camera,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/dashboard/seller/layouts/header';
import { useGetUserQuery } from '@/services/auth';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AsyncLink from '@/components/ui/AsyncLink';

const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Section descriptive */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimisez votre visibilité</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-[#ed7e0f] mr-2" />
                    Attirer plus de clients
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-[#ed7e0f] mr-2" />
                    Renforcer la confiance
                  </li>
                </ul>
              </Card>

              {/* Section Call-to-Action */}
              <Card className="relative overflow-hidden group cursor-pointer h-[140px]" onClick={() => setIsOpen(true)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src={sellerData?.shop.shop_profile || "/placeholder-cover.jpg"}
                  alt="Couverture de la boutique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Button
                    variant="outline" 
                    className="bg-white/90 hover:bg-white text-gray-800 border-0"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Ajouter une photo de couverture
                  </Button>
                </div>
              </Card>

              {/* Section Upgrade */}
              <Card className="p-4 bg-gradient-to-br from-[#ed7e0f]/10 to-orange-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visibilité de votre boutique</h3>
                <p className="text-sm text-gray-600 mb-3">Soyez en tete de liste devant de nombreuses boutique</p>
                <AsyncLink to='/seller/boost'>
                <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white">
                  Mettre à niveau
                </Button>
                </AsyncLink>
              </Card>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Modifier la photo de couverture</DialogTitle>
                  <DialogDescription>
                    Format recommandé: 1200x400px
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cover-photo">Photo de couverture</Label>
                    <Input
                      id="cover-photo"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => {
                        // Gérer le changement de fichier ici
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white">
                    Sauvegarder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                     {sellerData?.shop.level==="0" &&  "1/3 complété"}
                      {sellerData?.shop.level==="1" &&  "2/3 complété"}
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
                    <div className={`flex items-center ${sellerData?.shop.level==="2" ? "" : "opacity-50"}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${sellerData?.shop.level==="2" ? "bg-[#ed7e0f] text-white" : "bg-gray-200 text-gray-500"}   flex items-center justify-center`}>
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
                      {sellerData?.shop.level === "2" ? <Clock className="w-5 h-5 text-[#ed7e0f]" /> : <Lock className="w-5 h-5 text-gray-400" />}
                      
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
    
  );
};

export default DashboardPage;
