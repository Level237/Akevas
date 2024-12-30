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

const subCategories: Record<string, string[]> = {
  'Mode': ['Vêtements', 'Chaussures', 'Accessoires', 'Bijoux', 'Montres'],
  'Électronique': ['Smartphones', 'Ordinateurs', 'Audio', 'Photo & Vidéo', 'Accessoires'],
  'Maison & Jardin': ['Meubles', 'Décoration', 'Jardin', 'Bricolage', 'Électroménager'],
  'Sports & Loisirs': ['Sport', 'Camping', 'Vélos', 'Jeux & Jouets', 'Instruments de musique'],
  'Beauté & Santé': ['Soins', 'Parfums', 'Maquillage', 'Bien-être', 'Hygiène'],
  'Alimentation': ['Épicerie', 'Boissons', 'Bio', 'Gourmandises', 'Produits frais'],
  'Art & Collection': ['Peintures', 'Sculptures', 'Photos', 'Antiquités', 'Collection'],
  'Autres': ['Divers'],
};

const ShopInfoStep: React.FC<ShopInfoStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
        subCategory: '', // Reset sub-category when category changes
      },
    });
  };

  const handleSubCategoryChange = (value: string) => {
    onUpdate({
      shopInfo: {
        ...data,
        subCategory: value,
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
          />
          <p className="text-sm text-muted-foreground">
            Ce nom sera visible par tous les clients sur la marketplace
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie principale</Label>
            <Select
              value={data.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="subCategory">Sous-catégorie</Label>
            <Select
              value={data.subCategory}
              onValueChange={handleSubCategoryChange}
              disabled={!data.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                {data.category &&
                  subCategories[data.category].map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoStep;
