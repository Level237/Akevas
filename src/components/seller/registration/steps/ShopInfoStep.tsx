import React, { useState } from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multiselect';

interface ShopInfoStepProps {
  data: SellerFormData['shopInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const categories = [
  'Mode',
  'Électronique',
  'Maison & Jardin',
  'Sports & Loisirs',
  'Beauté & Santé',
  'Alimentation',
  'Art & Collection',
  'Autres',
];



const ShopInfoStep: React.FC<ShopInfoStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    const { name, value,type, files } = e.target;
   
    if(type === 'file' && files) {
       if (name === 'images') {
        onUpdate({
          shopInfo: {
            ...data,
            [name]: Array.from(files), // Convertit FileList en array
          },
        });
        return;
      }
      onUpdate({
        shopInfo: {
          ...data,
          [name]: files[0],
        },
      });
      return;
    }
    onUpdate({
      shopInfo: {
        ...data,
        [name]: value,
      },
    });
  };
 const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  console.log(selectedCategories);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Informations de la Boutique</h2>
        <p className="text-sm text-muted-foreground">
          Configurez les détails de votre boutique
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="shopName">Nom de la boutique</Label>
          <Input
            id="shopName"
            name="shopName"
            value={data.shopName}
            onChange={handleChange}
            placeholder="Ma Super Boutique"
            className="py-6"
          />
          
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Décrivez votre boutique en quelques mots..."
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie produit</Label>
            <MultiSelect
        options={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        placeholder="Select categories..."
      />
          </div>

          
        </div>
       
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardFront" className="text-sm font-medium text-gray-700">
              Indiquez le logo ou le profil de votre boutique <span className="text-red-500">*</span><span className='text-xs text-gray-400'> ( Envoyez des photos de bonnes qualité pour permettre une validation rapide de votre boutique )</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.logo ? (
                  <div className='relative mt-5'>
                     <img
                    src={URL.createObjectURL(data.logo)}
                    alt="Logo de votre boutique"
                    className="h-full w-28 object-cover"
                  />
                   <button
          onClick={() => {
            onUpdate({
              shopInfo: {
                ...data,
                logo: undefined,
              },
            });
          }}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
                  </div>
                 
                  
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Logo de votre boutique</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                id="logo"
                name="logo"
                onChange={handleChange}
                accept="image/*"
               className="w-full text-sm"
              />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardFront" className="text-sm font-medium text-gray-700">
              Indiquez au moins 3 photos de votre boutique ou de vos produits <span className="text-red-500">*</span><span className='text-xs text-gray-400'> ( Envoyez des photos de bonnes qualité pour permettre une validation rapide de votre boutique )</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                 {data.images && data.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 mt-5 gap-4">
            {data.images.map((image, index) => (
              <div key={index} className="relative h-40 w-full">
        <img
          src={URL.createObjectURL(image)}
          alt={`Image ${index + 1} de la boutique`}
          className="h-full w-full object-cover rounded-lg"
        />
        <button
          onClick={() => {
            const newImages = data.images?.filter((_, i) => i !== index);
            onUpdate({
              shopInfo: {
                ...data,
                images: newImages,
              },
            });
          }}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ))}
  </div>
) : (
  <div className="text-center p-4">
    <Upload className="mx-auto h-8 w-8 text-gray-400" />
    <p className="mt-2 text-sm text-gray-500">Images de votre boutique</p>
    <p className="text-xs text-gray-400">Sélectionnez plusieurs images</p>
  </div>
)}
              </div>
              <Input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleChange}
                accept="image/*"
               className="w-full text-sm"
              />
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoStep;
