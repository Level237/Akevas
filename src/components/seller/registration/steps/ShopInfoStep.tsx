import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';

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

  const handleCategoryChange = (value: string) => {
    onUpdate({
      shopInfo: {
        ...data,
        category: value,
      },
    });
  };

  const handleSubCategoryChange = (value: string) => {
    onUpdate({
      shopInfo: {
        ...data,

      },
    });
  };

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
            <Select
              value={data.category}
              onValueChange={handleCategoryChange}
              
            >
              <SelectTrigger className="py-6">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
        </div>
       
        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardFront" className="text-sm font-medium text-gray-700">
              Indiquez au moins 3 photos de votre boutique <span className="text-red-500">*</span><span className='text-xs text-gray-400'> ( Envoyez des photos de bonnes qualité pour permettre une validation rapide de votre boutique )</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.logo ? (
                  <img
                    src={URL.createObjectURL(data.logo)}
                    alt="Logo de votre boutique"
                    className="h-full w-full object-cover"
                  />
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
      </div>
    </div>
  );
};

export default ShopInfoStep;
