import React, { useState } from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multiselect';
import { useGetCategoriesQuery, useGetCategoryByGenderQuery } from '@/services/guardService';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';

interface ShopInfoStepProps {
  data: SellerFormData['shopInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const ShopInfoStep: React.FC<ShopInfoStepProps> = ({ data, onUpdate }) => {
  const {data:categories}=useGetCategoriesQuery('guard')
   const [gender,setGender]=useState<number>(0)
    const {data:categoriesByGender,isLoading:isLoadingCategoriesByGender}=useGetCategoryByGenderQuery(gender)
  console.log(categories);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    const { name,value,type, files } = e.target;
    if(type === 'file' && files) {
       if (name === 'images') {
        // Traitement de plusieurs fichiers
        const file = files[0];
        const maxSize = 2 * 1024 * 1024; // 2 Mo en octets
        

        if (file.size > maxSize) {
       
          toast.error("Le fichier ne doit pas dépasser 2 Mo.", {
            description: "Choisir un fichier en dessous de 2Mo",
            className:"bg-black",
            duration: 4000, // ms
          });
          return;
        }
        
        if (files && files.length > 3) {
                    alert('Vous ne pouvez sélectionner que 3 images maximum');
                    e.target.value = '';
                    return;
                  }
        const fileArray = Array.from(files);
        Promise.all(
          fileArray.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve(e.target?.result as string);
              };
              reader.readAsDataURL(file);
            });
          })
        ).then((base64Array) => {
          onUpdate({
            shopInfo: {
              ...data,
              [name]: base64Array,
            },
          });
        });
        return;
      } else if (name === 'logo') {

        const file = files[0];
        const maxSize = 2 * 1024 * 1024; // 2 Mo en octets
        

        if (file.size > maxSize) {
       
          toast.error("Le fichier ne doit pas dépasser 2 Mo.", {
            description: "Choisir un fichier en dessous de 2Mo",
            className:"bg-black",
            duration: 4000, // ms
          });
          return;
        }
        // Traitement d'un seul fichier (logo)
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          onUpdate({
            shopInfo: {
              ...data,
              [name]: base64,
            },
          });
        };
        reader.readAsDataURL(files[0]);
        return;
      }
    }
    onUpdate({
      shopInfo: {
        ...data,
        [name]: value,
      },
    });
  };
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const handleChangeCategories = (selected: number[]) => {
      setSelectedCategories(selected);
      onUpdate({
        shopInfo: {
          ...data,
          category: selected.map((id) => categories?.categories.find((c:{id:number,category_name:string}) => c.id === id)?.id|| ''),
        },
      });
    };
    
    const handleChangeGender = (value: string) => {
      setGender(parseInt(value));
      onUpdate({
        shopInfo: {
          ...data,  
          gender: parseInt(value),
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
        <div className="space-y-2">
          <Label htmlFor="gender">Sélectionnez le genre de votre boutique</Label>
        <Select name='gender' onValueChange={handleChangeGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Homme</SelectItem>
                    <SelectItem value="2">Femme</SelectItem>
                    <SelectItem value="3">Enfant</SelectItem>
                    <SelectItem value="4">Mixte</SelectItem>
                </SelectContent>
              </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="space-y-2">
                            { gender !==0 && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <div className="relative">
                  <label className="block text-lg font-semibold mb-4">Catégories</label>
                  <div className="flex flex-row flex-wrap gap-2 mb-4">
                 
                  </div>
              {isLoadingCategoriesByGender ? <div>Loading...</div> : (
              <MultiSelect
              
        options={categoriesByGender?.categories}
        selected={selectedCategories}
        onChange={handleChangeCategories}
        placeholder="Select categories..."
      />
            )}
                </div>
              </div>
                )}
          </div>

          
        </div>
       
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardFront" className="text-sm font-medium text-gray-700">
              Indiquez le profil de votre boutique <span className="text-red-500">*</span><span className='text-xs text-gray-400'> ( Envoyez des photos de bonnes qualité pour permettre une validation rapide de votre boutique )</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.logo ? (
                  <div className='relative mt-5'>
                     <img
                    src={data.logo}
                    alt="Logo de votre boutique"
                    className="h-full w-28 object-cover"
                  />
                   <button
          onClick={() => {
            onUpdate({
              shopInfo: {
                ...data,
                logo: null,
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
                    {/* SVG logo entreprise */}
                    <svg
                      className="mx-auto h-10 w-10 text-[#ed7e0f]"
                      fill="none"
                      viewBox="0 0 48 48"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="8" y="20" width="32" height="20" rx="3" fill="#fff" stroke="#ed7e0f" />
                      <rect x="16" y="28" width="8" height="12" rx="1" fill="#ed7e0f" stroke="#ed7e0f" />
                      <rect x="28" y="28" width="8" height="6" rx="1" fill="#ed7e0f" stroke="#ed7e0f" />
                      <path d="M8 20L24 8L40 20" stroke="#ed7e0f" strokeWidth={2.5} fill="none" />
                    </svg>
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
          src={image}
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
    {/* SVG représentant un produit/vitrine */}
    <svg
      className="mx-auto h-10 w-10 text-[#ed7e0f]"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      {/* Présentoir */}
      <rect x="8" y="32" width="32" height="8" rx="2" fill="#fff" stroke="#ed7e0f"/>
      {/* Produit (sac/boîte) */}
      <rect x="16" y="18" width="16" height="14" rx="3" fill="#ed7e0f" stroke="#ed7e0f"/>
      {/* Poignée du sac */}
      <path d="M20 18c0-2 8-2 8 0" stroke="#fff" strokeWidth={2} fill="none"/>
      {/* Ombre sous le produit */}
      <ellipse cx="24" cy="40" rx="10" ry="2" fill="#ed7e0f" fillOpacity="0.2"/>
    </svg>
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
