import React, { useRef, useState } from 'react';
import { Dialog, DialogContent,DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { compressMultipleImages } from '@/lib/imageCompression';
import { useUpdateImagesMutation } from '@/services/sellerService';

interface ShopGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (images: File[]) => void;
  initialImages?: string[];
}

const MAX_IMAGES = 3;


const ShopGalleryModal: React.FC<ShopGalleryModalProps> = ({ open, onClose, onSave, initialImages = [] }) => {
  const [images, setImages] = useState<(File | string)[]>(initialImages);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateImages] = useUpdateImagesMutation();
  const handleAddImages = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, files } = e.target;
    
    if(type === 'file' && files) {
      if (images.length + files?.length > 3) {
        toast.error(`Vous ne pouvez sélectionner que 3 images au total.`);
        return;
       
      }
      await compressMultipleImages(files, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        maxSizeMB: 2,
      });
      
      setImages(prev => [...prev, ...files].slice(0, MAX_IMAGES));
      if (inputRef.current) inputRef.current.value = '';
    }
    
  };
  
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async() => {
    setIsSaving(true);
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i]);
    }
    const response=await updateImages(formData);
    console.log(response);
    setTimeout(() => {
      setIsSaving(false);
      onSave(images.filter(img => typeof img !== 'string') as File[]);
      toast.success('Galerie mise à jour !');
      
      window.location.href = '/seller/dashboard';
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none overflow-visible animate-fade-in">
        <div className="relative w-full rounded-3xl bg-gradient-to-br from-orange-50 via-pink-50 to-violet-50 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="sticky top-0 z-10 flex items-center justify-between px-8 pt-8 pb-2 bg-gradient-to-br from-orange-50 via-pink-50 to-violet-50 bg-opacity-80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-pink-400 p-3 shadow-lg">
                <ImageIcon className="w-7 h-7 text-white" />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold text-orange-600 leading-tight">Galerie d'images de la boutique</h2>
                <p className="text-sm text-gray-500 mt-1">Ajoutez jusqu'à 3 images pour présenter votre boutique. Les images doivent faire moins de 2 Mo chacune.</p>
              </div>
            </div>
            <DialogClose asChild>
              <button className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-2 shadow transition" aria-label="Fermer" type="button">
                <X className="w-6 h-6" />
              </button>
            </DialogClose>
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-8 px-8 pb-8 pt-2">
            <div className="w-full flex flex-col justify-center">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-orange-100 mb-6 max-h-[80vh]">
                <label className="block text-lg font-semibold text-gray-700 mb-3">Galerie d'images</label>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`Galerie ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <label className="aspect-square rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Ajouter</span>
                      <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleAddImages}
                      />
                    </label>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-3 mt-4">
                  <Button
                    className="w-full md:w-auto p-3 text-sm bg-[#ed7e0f] text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
                    onClick={handleSave}
                    disabled={images.length === 0 || isSaving}
                    type="button"
                  >
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                  <Button
                    className="w-full p-3 text-sm md:w-auto bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:from-gray-200 hover:to-gray-400 text-gray-700 font-bold py-3 rounded-xl transition shadow"
                    onClick={onClose}
                    type="button"
                  >
                    Annuler
                  </Button>
                </div>
                <div className="mt-6 text-xs text-gray-400 text-center border-t pt-4">
                  Vous pouvez modifier ces images à tout moment depuis votre espace vendeur.
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopGalleryModal; 