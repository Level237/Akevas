import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import AsyncLink from '@/components/ui/AsyncLink';
import { Card } from '../ui/card';
import { Camera, Check } from 'lucide-react';
import {motion} from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
export default function VisibilityShop() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
      
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
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <AsyncLink to='/shop/preview' className="flex-1">
                      <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white font-semibold py-3">
                        Voir ma boutique
                      </Button>
                    </AsyncLink>
                    <Button onClick={() => setShowDialog(true)} className="flex-1 bg-white hover:bg-gray-50 text-[#ed7e0f] border-2 border-[#ed7e0f] font-semibold py-3">
                      Modifier photo de couverture
                    </Button>
                  </div>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Photo de couverture de votre boutique</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600">
                        Personnalisez l'apparence de votre boutique en ajoutant une photo de couverture attractive. Cette image sera visible par tous vos clients potentiels.
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button 
                          className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const img = document.querySelector('.w-full.h-40') as HTMLDivElement;
                                  if (img) {
                                    const imageUrl = e.target?.result as string;
                                    setSelectedImage(imageUrl);
                                    img.style.backgroundImage = `url(${imageUrl})`;
                                    img.style.backgroundSize = 'cover';
                                    img.style.backgroundPosition = 'center';
                                    const camera = img.querySelector('.text-gray-400');
                                    if (camera) camera.remove();
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          {selectedImage ? 'Enregistrer' : 'Choisir une nouvelle photo'}
                        </Button>
                        <Button variant="outline" onClick={() => {setShowDialog(false)}}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
