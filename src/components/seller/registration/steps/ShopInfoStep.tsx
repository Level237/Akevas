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
                  <div className="relative group mt-5">
                    <img
                      src={data.logo}
                      alt="Logo de votre boutique"
                      className="h-28 w-28 object-cover rounded-lg"
                    />
                    {/* Overlay avec bouton de suppression */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onUpdate({
                            shopInfo: {
                              ...data,
                              logo: null,
                            },
                          });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer group relative block mt-5">
                    <input
                      type="file"
                      className="hidden"
                      name="logo"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    <div className="text-center p-6  border-gray-300 rounded-lg group-hover:border-[#ed7e0f] transition-colors duration-200">
                      <div className="w-full flex flex-col items-center">
                        <svg
                          className="mx-auto h-12 w-12 text-[#ed7e0f] group-hover:scale-110 transition-transform duration-200"
                          fill="none" 
                          viewBox="0 0 48 48"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path 
                            d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 7a6 6 0 100 12 6 6 0 000-12zm8 21v-2c0-4.411-3.589-8-8-8s-8 3.589-8 8v2" 
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                          <circle 
                            cx="24" 
                            cy="17" 
                            r="4" 
                            stroke="currentColor"
                            fill="currentColor"
                          />
                        </svg>
                        <p className="mt-4 text-sm text-gray-500 group-hover:text-[#ed7e0f]">
                          Cliquez pour ajouter le profil de votre boutique
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Format recommandé : 200x200 px
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Formats acceptés : JPG, PNG
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
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
                <div className="grid grid-cols-3 md:grid-cols-3 mt-5 gap-4">
            {data.images.map((image, index) => (
              <div key={index} className="relative group h-40">
                <img
                  src={image}
                  alt={`Image ${index + 1} de la boutique`}
                  className="h-full w-full object-cover rounded-lg"
                />
                {/* Overlay avec bouton de suppression */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
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
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            {/* Bouton d'ajout pour plus d'images */}
            {data.images && data.images.length < 3 && (
              <label className="cursor-pointer group relative h-40">
                <input
                  type="file"
                  multiple
                  id="images"
                  name="images"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={handleChange}
                />
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg group-hover:border-[#ed7e0f] transition-colors duration-200">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-[#ed7e0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500 group-hover:text-[#ed7e0f]">Ajouter</p>
                  </div>
                </div>
              </label>
            )}
          </div>
) : (
  <label className="cursor-pointer -mt-12 group relative block mt-5">
    <Input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleChange}
                accept="image/*"
               className="w-full text-sm"
              />
    <div className="text-center p-8  border-gray-300 rounded-lg group-hover:border-[#ed7e0f] transition-colors duration-200">
      <svg
        className="mx-auto h-12 w-12 text-[#ed7e0f] group-hover:scale-110 transition-transform duration-200"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="8" y="32" width="32" height="8" rx="2" fill="#fff" stroke="currentColor"/>
        <rect x="16" y="18" width="16" height="14" rx="3" fill="currentColor" stroke="currentColor"/>
        <path d="M20 18c0-2 8-2 8 0" stroke="#fff" strokeWidth={2} fill="none"/>
        <ellipse cx="24" cy="40" rx="10" ry="2" fill="currentColor" fillOpacity="0.2"/>
      </svg>
      <p className="mt-4 text-sm text-gray-500 group-hover:text-[#ed7e0f]">
        Cliquez pour ajouter des photos de votre boutique
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Sélectionnez plusieurs images (max 6 images)
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Formats acceptés : JPG, PNG
      </p>
    </div>
  </label>
)}
              </div>
             
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoStep;
