
import { Button } from '@/components/ui/button';

import AsyncLink from '@/components/ui/AsyncLink';
import { Card } from '../../../ui/card';
import { Check, Package, MapPin, Store } from 'lucide-react';
import {motion} from "framer-motion"
import { Seller } from '@/types/seller';


export default function VisibilityShop(sellerData:{sellerData:Seller}) {

      


  return (
      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
             

              {/* Section Aperçu Boutique */}
              <Card className="p-6   to-white border border-[#ed7e0f]/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                      Aperçu de votre boutique
                    </h3>
                    <AsyncLink to='/shop/editor'>
                      <Button className="bg-white hover:bg-gray-50 text-[#ed7e0f] border-2 border-[#ed7e0f] font-medium px-4 py-1 rounded-full transition-all duration-200">
                        Éditer
                      </Button>
                    </AsyncLink>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-white/60 p-3 rounded-xl backdrop-blur-sm">
                    <div className="relative group">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ed7e0f] to-orange-400 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                        {sellerData.sellerData.shop.shop_profile ? (
                          <img 
                            src={sellerData.sellerData.shop.shop_profile} 
                            alt="Logo boutique" 
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <Store className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Votre boutique sur la marketplace</p>
                      <h4 className="text-lg font-bold text-gray-900">
                        {sellerData.sellerData.shop.shop_key || "Nom de votre boutique"}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-[#ed7e0f]/10 rounded-lg">
                          <MapPin className="w-4 h-4 text-[#ed7e0f]" />
                        </div>
                        <h5 className="font-medium text-gray-700">Localisation</h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-8 mt-1">
                        {sellerData.sellerData.phone_number || "Non renseignée"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-[#ed7e0f]/10 rounded-lg">
                          <Package className="w-4 h-4 text-[#ed7e0f]" />
                        </div>
                        <h5 className="font-medium text-gray-700">Catalogue</h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-8 mt-1">
                        {sellerData.sellerData.phone_number || 0} produits
                      </p>
                    </div>
                  </div>

                  <AsyncLink to={`/shop/${sellerData.sellerData.shop.shop_id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-[#ed7e0f] to-orange-600 hover:from-[#ed7e0f]/90 hover:to-orange-500 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Voir ma boutique
                    </Button>
                  </AsyncLink>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#ed7e0f]/10 to-orange-50 border-2 border-[#ed7e0f]/20">
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-gray-900">Booster la visibilité de vos produits 🌟</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Visibilité accrue sur la marketplace</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Support client prioritaire</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Outils marketing avancés</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Commission réduite sur les ventes</span>
                    </li>
                  </ul>
                  <AsyncLink to='/seller/pro' >
                    <Button className="w-full mt-16 block bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white font-semibold py-3">
                      Devenir Vendeur Pro
                    </Button>
                  </AsyncLink>
                </div>
              </Card>
            </div>
          </motion.div>
  )
}
