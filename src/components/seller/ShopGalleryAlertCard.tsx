import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import ShopGalleryModal from './ShopGalleryModal';

const ShopGalleryAlertCard: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Simule la sauvegarde (à remplacer par appel API réel)
  const handleSave = (images: File[]) => {
    // TODO: Envoyer les images à l’API
    setOpen(false);
  };

  return (
    <>
      <Card className="flex max-sm:flex-col  items-center gap-4 p-6 bg-white from-orange-50 to-pink-50 border-orange-100 border shadow-lg rounded-2xl mb-6">
        <div className="flex-shrink-0 bg-[#6e0a13] from-orange-400 to-pink-400 rounded-full p-3 shadow-lg">
          <ImageIcon className="w-8 max-sm:w-5 h-8 max-sm:h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-orange-700 mb-1">Ajoutez une galerie d’images à votre boutique</h3>
          <p className="text-sm text-gray-600  mb-2">Une galerie d’images attrayante augmente la confiance des clients et met en valeur vos produits. Ajoutez jusqu’à 3 images pour rendre votre boutique plus attractive ! (Ne pas ajouter une image contenant votre logo)</p>
          <Button className="bg-[#6e0a13] hover:bg-[#6e0a13]/90" onClick={() => setOpen(true)}>
            Ajouter des images à ma boutique 
          </Button>
        </div>
      </Card>
      <ShopGalleryModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </>
  );
};

export default ShopGalleryAlertCard; 