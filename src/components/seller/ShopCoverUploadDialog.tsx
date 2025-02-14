import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';

interface ShopCoverUploadDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  onSave?: (imageUrl: string) => void;
}

export default function ShopCoverUploadDialog({
  showDialog,
  setShowDialog,
  selectedImage,
  setSelectedImage,
  onSave
}: ShopCoverUploadDialogProps) {
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setSelectedImage(imageUrl);
          if (onSave) {
            onSave(imageUrl);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Photo de couverture de votre boutique</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div 
            className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center"
            style={selectedImage ? {
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : undefined}
          >
            {!selectedImage && <Camera className="w-12 h-12 text-gray-400" />}
          </div>
          <p className="text-gray-600">
            Personnalisez l'apparence de votre boutique en ajoutant une photo de couverture attractive. Cette image sera visible par tous vos clients potentiels.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90"
              onClick={handleImageUpload}
            >
              {selectedImage ? 'Enregistrer' : 'Choisir une nouvelle photo'}
            </Button>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 