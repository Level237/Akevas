import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AsyncLink from '@/components/ui/AsyncLink';
import { Card } from '../ui/card';
import dress from "../../assets/dress.jpg"
import { Camera, Check } from 'lucide-react';
import {motion} from "framer-motion"
import { useState} from 'react';
export default function VisibilityShop() {
      const [isOpen, setIsOpen] = useState(false);
  return (
      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Section Boutique */}
              <Card className="p-6 bg-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Votre boutique est active !
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#ed7e0f]/5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Aperçu de la boutique</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ajoutez une photo de couverture pour personnaliser votre boutique</p>
                        <button className="text-[#ed7e0f] text-sm font-medium mt-1">Modifier</button>
                      </div>
                    </div>
                  </div>

                  <AsyncLink to='/shop/preview' className="block">
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white font-semibold py-3">
                      Voir ma boutique
                    </Button>
                  </AsyncLink>
                </div>
              </Card>

              {/* Section Vendeur Pro */}
              <Card className="p-6 bg-gradient-to-br from-[#ed7e0f]/10 to-orange-50 border-2 border-[#ed7e0f]/20">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Devenez Vendeur Pro 🌟</h3>
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
                  <AsyncLink to='/seller/pro' className="block mt-6">
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white font-semibold py-3">
                      Devenir Vendeur Pro
                    </Button>
                  </AsyncLink>
                </div>
              </Card>
            </div>
          </motion.div>
  )
}
