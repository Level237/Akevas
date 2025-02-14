import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Package, Clock, Shield, 
  ChevronDown, Grid, List, SlidersHorizontal, 
  Edit2, Camera, Save, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function StoreEditorPage() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const {data: { data: sellerData } = {}} = useCurrentSellerQuery('seller');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'action fixe en haut */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="gap-2">
              <Eye className="w-4 h-4" />
              Prévisualiser
            </Button>
          </div>
          <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90">
            Publier
          </Button>
        </div>
      </div>

      {/* Contenu principal avec marge pour la barre fixe */}
      <div className="pt-16">
        {/* Bannière de la boutique */}
        <div className="relative h-[300px] bg-gray-900">
          <img
            src={sellerData?.shop.shop_profile || '/placeholder.jpg'}
            alt="Store cover"
            className="w-full h-full object-cover opacity-50"
          />
          <Button 
            className="absolute top-4 right-4 bg-white/90"
          >
            <Camera className="w-4 h-4 mr-2" />
            Modifier la bannière
          </Button>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white">
                  <img
                    src={sellerData?.shop.shop_profile || '/placeholder.jpg'}
                    alt={sellerData?.shop.shop_name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    className="absolute bottom-2 right-2 rounded-full p-2 bg-white/90"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 text-white">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">{sellerData?.shop.shop_name}</h1>
                  <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                    Premium
                  </Badge>
                  <Button variant="ghost" className="text-white">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-gray-200">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>4.8</span>
                    <span className="ml-1">(256 avis)</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-1" />
                    <span>189 produits</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{sellerData?.shop.town}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-4 font-medium border-b-2 ${
                  activeTab === 'products' ? 'border-[#ed7e0f] text-[#ed7e0f]' : 'border-transparent'
                }`}
              >
                Produits
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-4 font-medium border-b-2 ${
                  activeTab === 'about' ? 'border-[#ed7e0f] text-[#ed7e0f]' : 'border-transparent'
                }`}
              >
                À propos
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-4 font-medium border-b-2 ${
                  activeTab === 'reviews' ? 'border-[#ed7e0f] text-[#ed7e0f]' : 'border-transparent'
                }`}
              >
                Avis
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Contenu spécifique à chaque onglet */}
        </main>
      </div>

      {/* Dialogs pour l'édition */}
      <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom de la boutique</label>
              <Input
                value={sellerData?.shop.shop_name}
                onChange={(e) => {
                  // Handle name change
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={sellerData?.shop.shop_description}
                onChange={(e) => {
                  // Handle description change
                }}
              />
            </div>
            <Button onClick={() => setIsEditingInfo(false)}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 