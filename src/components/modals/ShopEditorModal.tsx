import React, { useState, ChangeEvent, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, IdCard, MapPin, Camera, X, Plus, Trash2, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Select from 'react-select';
import { Select as UISelect, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useGetTownsQuery, useGetQuartersQuery, useUpdateShopMutation, useGetCategoryByGenderQuery } from '@/services/guardService';

// Types pour la structure de données
interface ProductImage {
  id: number;
  path: string;
}

interface ProductCategory {
  id: number;
  category_name: string;
  products_count: number;
  category_profile: string;
  category_url: string;
  parent?: {
    id: number;
    category_name: string;
    category_profile: string | null;
    category_url: string;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
  };
}

interface Product {
  id: string;
  product_name: string;
  product_description: string;
  product_profile: string;
  product_price: string;
  product_quantity: string;
  product_url: string;
  product_images: ProductImage[];
  product_categories: ProductCategory[];
  status: number;
  created_at: string;
}

interface ShopCategory {
  id: number;
  category_name: string;
  products_count: number;
  category_profile: string;
  category_url: string;
  parent: any;
}

interface Shop {
  shop_id: string;
  shop_name: string;
  shop_description: string;
  shop_profile: string;
  shop_key: string;
  review_average: number;
  reviewCount: number;
  status: any;
  coins: string;
  isSubscribe: number;
  products_count: number;
  products: Product[];
  expire: any;
  subscribe_id: any;
  town: string;
  quarter: string;
  isPublished: number;
  visitTotal: number;
  categories: ShopCategory[];
  orders: any[];
  orders_count: number;
  total_earnings: number;
  state: string;
  gender: string;
  level: string;
  cover: string;
  images: ProductImage[];
}

interface SellerData {
  id: number;
  firstName: string;
  email: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  role_id: number;
  phone_number: string;
  isWholesaler: string;
  identity_card_in_front: string;
  identity_card_in_back: string;
  identity_card_with_the_person: string;
  isSeller: number;
  feedbacks: any[];
  shop: Shop;
  created_at: string;
}

interface ImageUploadProps {
  label: string;
  value: string | undefined;
  onChange: (val: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="file"
      accept="image/*"
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ed7e0f]/10 file:text-[#ed7e0f] hover:file:bg-[#ed7e0f]/20"
      onChange={e => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => onChange(ev.target?.result as string);
          reader.readAsDataURL(file);
        }
      }}
    />
    {value && (
      <div className="mt-2 flex items-center gap-4">
        <img src={value} alt="preview" className="rounded-lg w-24 h-24 object-cover border" />
        <Button type="button" variant="destructive" size="icon" onClick={() => onChange('')}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )}
  </div>
);

interface GalleryUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ images, onChange }) => {
  const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ProductImage[] = [];
    
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push({ 
          id: Date.now() + idx, 
          path: ev.target?.result as string 
        });
        if (newImages.length === files.length) {
          onChange([...images, ...newImages].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (id: number) => {
    onChange(images.filter(img => img.id !== id));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Galerie d'images</label>
      <div className="flex gap-3 flex-wrap">
        {images.map(img => (
          <div key={img.id} className="relative group w-24 h-24 rounded-lg overflow-hidden border">
            <img src={img.path} alt="gallery" className="w-full h-full object-cover" />
            <button 
              type="button" 
              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-white" 
              onClick={() => handleRemove(img.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
        {images.length < 6 && (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Ajouter</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleAdd} />
          </label>
        )}
      </div>
    </div>
  );
};

interface ShopEditorModalProps {
  open: boolean;
  onClose: () => void;
  initialData: any;
}

const ShopEditorModal: React.FC<ShopEditorModalProps> = ({ open, onClose, initialData }) => {
  const [formData, setFormData] = useState<SellerData>(initialData);
  const [tab, setTab] = useState<string>('general');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updateShop, { isLoading }] = useUpdateShopMutation();
  let initialGender = formData?.shop?.gender;
  if (!initialGender) initialGender = '1'; 
  // Mise à jour du formData quand initialData change
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  const { data: categoriesByGender } = useGetCategoryByGenderQuery(initialGender);
  // Catégories
  
  
  
  // Villes et quartiers
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');

  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');


  const filteredQuarters = quarters?.quarters.filter((quarter: { town_name: string }) => quarter.town_name === formData.shop?.town);

  // Helpers pour update avec gestion d'erreur
  const handleShopChange = (changes: Partial<Shop>) => {
    setFormData((prev: SellerData) => ({
      ...prev,
      shop: {
        ...prev.shop,
        ...changes
      }
    }));
  };

  const handleSellerChange = (changes: Partial<SellerData>) => {
    setFormData((prev: SellerData) => ({
      ...prev,
      ...changes
    }));
  };

  const handleCategoriesChange = (selected: number[]) => {
    // Convertir les IDs en objets de catégories
    const selectedCategories = selected.map(id => {
      const category = categoriesByGender?.categories?.find((cat:any) => cat.id === id);
      return category ? {
        id: category.id,
        category_name: category.category_name,
        products_count: category.products_count || 0,
        category_profile: category.category_profile || '',
        category_url: category.category_url || '',
        parent: category.parent || null
      } : null;
    }).filter(Boolean) as ShopCategory[];

    handleShopChange({ categories: selectedCategories });
  };

  const handleGalleryChange = (images: ProductImage[]) => {
    handleShopChange({ images });
  };

  // Enregistrement avec validation
  const handleSave = async () => {
    try {
      // Validation des données requises
      if (!formData.shop.shop_name?.trim()) {
        alert('Le nom de la boutique est requis');
        return;
      }

      if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
        alert('Le prénom et le nom sont requis');
        return;
      }

      if (!formData.email?.trim()) {
        alert('L\'email est requis');
        return;
      }

      // Préparation des données pour l'API
      const updateData = {
        ...formData,
        shop: {
          ...formData.shop,
          // S'assurer que les catégories sont au bon format
          categories: formData.shop.categories?.map(cat => ({
            id: cat.id,
            category_name: cat.category_name,
            products_count: cat.products_count,
            category_profile: cat.category_profile,
            category_url: cat.category_url,
            parent: cat.parent
          })) || []
        }
      };

      await updateShop(updateData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Une erreur est survenue lors de la mise à jour');
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fonction pour obtenir les IDs des catégories sélectionnées
  const getSelectedCategoryIds = () => {
    return formData.shop.categories?.map(cat => cat.id) || [];
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-sm:max-w-[100vw] sm:max-w-[90vw] h-[95vh] sm:h-[90vh] p-0 border-0 bg-white shadow-2xl overflow-hidden rounded-xl">
        <div className="flex h-full relative">
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 left-4 z-50"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Sidebar */}
          <div className={`
            absolute lg:relative w-64 lg:w-80 bg-[#6e0a13] border-r border-gray-200 p-6
            transition-transform duration-300 ease-in-out z-40
            lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center gap-3 mb-8">
              <div className='mb-40'>
                <h2 className="text-lg font-bold text-white">Éditer ma boutique</h2>
                <p className="text-sm text-white">Personnalisez votre espace</p>
              </div>
            </div>
            <Tabs value={tab} onValueChange={(val) => {
              setTab(val);
              setSidebarOpen(false);
            }} orientation="vertical" className="h-full">
              <TabsList className="flex flex-col gap-3 bg-transparent">
                {[
                  { value: 'general', label: 'Général', icon: FileText },
                  { value: 'personal', label: 'Personnel', icon: User },
                  { value: 'identity', label: 'Identité', icon: IdCard },
                  { value: 'location', label: 'Localisation', icon: MapPin },
                  { value: 'media', label: 'Médias', icon: Camera }
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={`
                      w-full text-white flex items-center gap-3 p-4 rounded-lg
                      transition-all duration-300 ease-in-out
                      hover:bg-[#ed7e0f]/30 hover:shadow-sm
                      data-[state=active]:bg-[#ed7e0f]/30
                      data-[state=active]:shadow-lg
                      data-[state=active]:scale-105
                      data-[state=active]:text-[#ed7e0f]
                      data-[state=active]:font-medium
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col w-full lg:w-auto">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl  font-semibold text-gray-900 ml-12 lg:ml-0">Configuration de la boutique</h3>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>

            <div className="flex-1 sm:p-6 w-full lg:p-8">
              {/* MOBILE: Tabs horizontaux scrollables */}
              <div className="block md:hidden sticky top-0 bg-white z-20 border-b">
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex flex-row px-2 py-2">
                    {[
                      { value: 'general', label: 'Général', icon: FileText },
                      { value: 'personal', label: 'Personnel', icon: User },
                      { value: 'identity', label: 'Identité', icon: IdCard },
                      { value: 'location', label: 'Localisation', icon: MapPin },
                      { value: 'media', label: 'Médias', icon: Camera }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setTab(value)}
                        className={`
                          flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[64px]
                          text-xs font-medium
                          transition-all duration-300
                          ${tab === value
                            ? 'bg-[#ed7e0f]/20 text-[#ed7e0f] font-semibold shadow'
                            : 'text-gray-700 hover:bg-[#ed7e0f]/10'}
                          focus:outline-none
                        `}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Tabs value={tab} className="h-full flex flex-col">
                {/* Général */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="general">
                  <div className="flex flex-col gap-6 sm:gap-4 p-2 sm:p-4 lg:p-3">
                    
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Nom de la boutique</label>
                      <Input
                        value={formData.shop?.shop_name || ''}
                        onChange={e => handleShopChange({ shop_name: e.target.value })}
                        placeholder="Nom de votre boutique"
                        className="w-full bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20 text-base py-2 sm:py-3 px-3 sm:px-4 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Description</label>
                      <Textarea
                        value={formData.shop?.shop_description || ''}
                        onChange={e => handleShopChange({ shop_description: e.target.value })}
                        placeholder="Décrivez votre boutique en quelques mots..."
                        className="w-full bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20 text-base py-3"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Catégories</label>
                      <Select
                        isMulti
                        options={(categoriesByGender?.categories || []).map((cat:any) => ({
                          value: cat.id,
                          label: cat.category_name
                        }))}
                        value={(categoriesByGender?.categories || [])
                          .filter((cat:any) => getSelectedCategoryIds().includes(cat.id))
                          .map((cat:any) => ({
                            value: cat.id,
                            label: cat.category_name
                          }))}
                        onChange={(selectedOptions) => {
                          const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                          handleCategoriesChange(selectedIds);
                        }}
                        placeholder="Sélectionnez les catégories"
                        className="w-full text-sm"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: 48,
                            borderRadius: 12,
                            borderColor: '#ed7e0f',
                            boxShadow: 'none',
                          }),
                          multiValue: (base) => ({
                            ...base,
                            background: 'linear-gradient(90deg, #ed7e0f 0%, #ed7e0f 100%)',
                            color: '#fff',
                            borderRadius: 8,
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            maxHeight: 240,
                            overflowY: 'auto',
                          }),
                          menuList: (base) => ({
                            ...base,
                            maxHeight: 220,
                            overflowY: 'auto',
                          }),
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Personnel */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="personal">
                  <div className="space-y-6 p-2 sm:p-4 lg:p-8">
                    <div className='flex max-sm:flex-col gap-4'>
                      <div className='w-1/2'>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                          <Input
                            value={formData.firstName || ''}
                            onChange={e => handleSellerChange({ firstName: e.target.value })}
                            placeholder="Votre prénom"
                            className="bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                          />
                      </div>
                      <div className='w-1/2'>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <Input
                        value={formData.lastName || ''}
                        onChange={e => handleSellerChange({ lastName: e.target.value })}
                        placeholder="Votre nom"
                        className="bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    </div>
                    <div className='flex max-sm:flex-col gap-4'>
                      <div className='w-1/2'>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        value={formData.email || ''}
                        onChange={e => handleSellerChange({ email: e.target.value })}
                        placeholder="Votre email"
                        type="email"
                        className="bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    <div className='w-1/2'>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <Input
                        value={formData.phone_number || ''}
                        onChange={e => handleSellerChange({ phone_number: e.target.value })}
                        placeholder="Votre téléphone"
                        className="bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    </div>
                   <div className='flex max-sm:flex-col gap-4'>
                    <div className='w-1/2'>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                      <Input
                        value={formData.birthDate || ''}
                        onChange={e => handleSellerChange({ birthDate: e.target.value })}
                        type="date"
                        className="bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    <div className='w-1/2'>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                      <Input
                        value={formData.nationality || ''}
                        onChange={e => handleSellerChange({ nationality: e.target.value })}
                        placeholder="Votre nationalité"
                        className="bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                   </div>
                    
                    
                  
                  </div>
                </TabsContent>

                {/* Identité */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="identity">
                  <div className="space-y-6 flex items-center max-sm:flex-col gap-4 p-2 sm:p-4 lg:p-8">
                    <ImageUpload
                      label="CNI Recto"
                      value={formData.identity_card_in_front}
                      onChange={val => handleSellerChange({ identity_card_in_front: val })}
                    />
                    <ImageUpload
                      label="CNI Verso"
                      value={formData.identity_card_in_back}
                      onChange={val => handleSellerChange({ identity_card_in_back: val })}
                    />
                    <ImageUpload
                      label="Photo avec CNI"
                      value={formData.identity_card_with_the_person}
                      onChange={val => handleSellerChange({ identity_card_with_the_person: val })}
                    />
                  </div>
                </TabsContent>

                {/* Localisation */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="location">
                  <div className="space-y-6 p-2 sm:p-4 lg:p-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                      <UISelect
                        value={formData.shop?.town || ''}
                        onValueChange={val => handleShopChange({ town: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {!townsLoading && towns?.towns.map((town: any) => (
                            <SelectItem key={town.id} value={town.town_name}>{town.town_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </UISelect>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                      <UISelect
                        value={formData.shop?.quarter || ''}
                        onValueChange={val => handleShopChange({ quarter: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un quartier" />
                        </SelectTrigger>
                        <SelectContent>
                          {!quartersLoading && filteredQuarters?.map((quarter: any) => (
                            <SelectItem key={quarter.id} value={quarter.quarter_name}>{quarter.quarter_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </UISelect>
                    </div>
                  </div>
                </TabsContent>

                {/* Médias */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="media">
                  <div className="flex max-sm:flex-col items-center gap-6 sm:gap-8 p-2 sm:p-4 lg:p-8">
                    <ImageUpload
                      label="Photo de profil"
                      value={formData.shop?.shop_profile}
                      onChange={val => handleShopChange({ shop_profile: val })}
                    />
                    <GalleryUpload
                      images={formData.shop?.images || []}
                      onChange={handleGalleryChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-4 sticky bottom-0  sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Annuler</Button>
                <Button 
                  className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white" 
                  onClick={handleSave} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopEditorModal;