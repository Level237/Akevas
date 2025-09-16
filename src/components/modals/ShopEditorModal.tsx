import React, { useState, ChangeEvent, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, FileText, IdCard, MapPin, Camera, X, Plus, Trash2, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Select from 'react-select';
import { Select as UISelect, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useGetTownsQuery, useGetQuartersQuery, useGetCategoryByGenderQuery } from '@/services/guardService';
import { useUpdateShopMutation } from '@/services/sellerService';
import { toast } from 'sonner';

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
  shop_profile: string | File;
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
  images: ProductImage[] | File[];
  product_type?: string | number;
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
  identity_card_in_front: string | File;
  identity_card_in_back: string | File;
  identity_card_with_the_person: string | File;
  isSeller: number;
  feedbacks: any[];
  shop: Shop;
  created_at: string;
}

interface ImageUploadProps {
  label: string;
  value?: File | string | null;
  onChange: (val: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) { setPreview(null); return; }
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ed7e0f]/10 file:text-[#ed7e0f] hover:file:bg-[#ed7e0f]/20"
        onChange={e => onChange(e.target.files?.[0] || null)}
      />
      {preview && (
        <div className="mt-2 flex items-center gap-4">
          <img src={preview} alt="preview" className="rounded-lg w-24 h-24 object-cover border" />
          <Button type="button" variant="destructive" size="icon" onClick={() => onChange(null)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

interface GalleryUploadProps {
  images: (File | { id?: number; path: string })[];
  onChange: (images: File[]) => void;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({ images, onChange }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls: string[] = [];
    const revokers: string[] = [];
    images.forEach((item) => {
      if (item instanceof File) {
        const u = URL.createObjectURL(item);
        urls.push(u);
        revokers.push(u);
      } else if (item && typeof item === 'object' && 'path' in item) {
        urls.push(item.path);
      }
    });
    setPreviews(urls);
    return () => revokers.forEach(u => URL.revokeObjectURL(u));
  }, [images]);

  const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // keep only Files in state for upload
    const currentFiles = images.filter((it): it is File => it instanceof File);
    onChange([...currentFiles, ...files].slice(0, 6));
  };

  const handleRemove = (idx: number) => {
    const currentFiles = images.filter((it): it is File => it instanceof File);
    const next = currentFiles.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Galerie d'images</label>
      <div className="flex gap-3 flex-wrap">
        {previews.map((src, idx) => (
          <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border">
            <img src={src} alt="gallery" className="w-full h-full object-cover" />
            <button 
              type="button" 
              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-white" 
              onClick={() => handleRemove(idx)}
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

  const handleGalleryChange = (images: File[]) => {
    handleShopChange({ images: images as unknown as any });
  };

  const initialRef = React.useRef<SellerData | null>(null);
  useEffect(() => {
    initialRef.current = initialData; // snapshot pour comparaison
  }, [initialData]);

  const isChanged = (curr: any, prev: any) => {
    // comparaison simple (scalaires/strings); adapter si besoin
    return curr !== prev;
  };
  const fileChanged = (curr: unknown) => curr instanceof File;
  const arrayIds = (arr: any[]) => (arr || []).map((c: any) => c.id).sort();

  // Remplacez buildUpdateFormData par ceci:
  const buildUpdateFormData = (): FormData => {
    const fd = new FormData();
    const prev = initialRef.current as SellerData;

    // Vendeur
    if (isChanged(formData.firstName, prev?.firstName)) fd.append('firstName', formData.firstName || '');
    if (isChanged(formData.lastName, prev?.lastName)) fd.append('lastName', formData.lastName || '');
    if (isChanged(formData.email, prev?.email)) fd.append('email', formData.email || '');
    if (isChanged(formData.phone_number, prev?.phone_number)) fd.append('phone_number', formData.phone_number || '');
    if (isChanged(formData.birthDate, prev?.birthDate)) fd.append('birthDate', formData.birthDate || '');
    if (isChanged(formData.nationality, prev?.nationality)) fd.append('nationality', formData.nationality || '');
    if (isChanged(formData.isWholesaler, prev?.isWholesaler)) fd.append('isWholesaler', String(formData.isWholesaler));

    if (fileChanged(formData.identity_card_in_front)) fd.append('identity_card_in_front', formData.identity_card_in_front as unknown as File);
    if (fileChanged(formData.identity_card_in_back)) fd.append('identity_card_in_back', formData.identity_card_in_back as unknown as File);
    if (fileChanged(formData.identity_card_with_the_person)) fd.append('identity_card_with_the_person', formData.identity_card_with_the_person as unknown as File);

    // Boutique (aplatie)
    if (isChanged(formData.shop?.shop_name, prev?.shop?.shop_name)) fd.append('shop_name', formData.shop?.shop_name || '');
    if (isChanged(formData.shop?.shop_description, prev?.shop?.shop_description)) fd.append('shop_description', formData.shop?.shop_description || '');
    if (isChanged(formData.shop?.product_type, prev?.shop?.product_type)) fd.append('product_type', String(formData.shop?.product_type));
    if (isChanged(formData.shop?.gender, prev?.shop?.gender)) fd.append('shop_gender', String(formData.shop?.gender || ''));

    // Localisation (noms)
    if (isChanged(formData.shop?.town, prev?.shop?.town)) fd.append('town', formData.shop?.town || '');
    if (isChanged(formData.shop?.quarter, prev?.shop?.quarter)) fd.append('quarter', formData.shop?.quarter || '');

    // Photo profil: seulement si nouveau File
    if (fileChanged(formData.shop?.shop_profile)) {
      fd.append('shop_profile', formData.shop?.shop_profile as unknown as File);
    }

    // Catégories: synchroniser seulement si différent
    const currCat = arrayIds(formData.shop?.categories || []);
    const prevCat = arrayIds(prev?.shop?.categories || []);
    if (JSON.stringify(currCat) !== JSON.stringify(prevCat)) {
      currCat.forEach(id => fd.append('categories[]', String(id)));
    }

    // Galerie: n’envoyer que les nouveaux Files
    const images = (formData.shop?.images as unknown as (File | { path: string })[]) || [];
    const newFiles = images.filter((i): i is File => i instanceof File);
    if (newFiles.length > 0) {
      newFiles.forEach(f => fd.append('images[]', f));
    }
    return fd;
  };

  const handleSave = async () => {
    try {
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
      const fd = buildUpdateFormData();

      const response=await updateShop(fd as any);
      toast.success('Boutique mise à jour avec succès');
      console.log(response)
     

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Une erreur est survenue lors de la mise à jour');
    }
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSave();
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
            className="lg:hidden max-sm:hidden absolute top-4 left-4 z-50"
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
                      w-full text-white flex items-start justify-start gap-3 p-4 rounded-lg
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

            <form className="flex-1 sm:p-6 w-full lg:p-8" encType="multipart/form-data" onSubmit={submitForm}>
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
                {/* Infos vendeur */}
              
                {/* Général */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="general">
                  <div className="flex flex-col gap-6 sm:gap-4 p-2 sm:p-4 lg:p-3">
                    
                    <div>
                      <label className="block text-base max-sm:text-xs font-medium text-gray-700 mb-2">Nom de la boutique</label>
                      <Input
                        value={formData.shop?.shop_name || ''}
                        onChange={e => handleShopChange({ shop_name: e.target.value })}
                        placeholder="Nom de votre boutique"
                        className="w-full max-sm:text-sm bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20 text-base py-2 sm:py-3 px-3 sm:px-4 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-base max-sm:text-xs max-sm:text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Textarea
                        value={formData.shop?.shop_description || ''}
                            onChange={e => handleShopChange({ shop_description: e.target.value })}
                        placeholder="Décrivez votre boutique en quelques mots..."
                        className="w-full max-sm:text-sm bg-white border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20 text-base py-3"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-base max-sm:text-xs font-medium text-gray-700 mb-2">Catégories</label>
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
                     <div className="space-y-6">
                    <div>
                      <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Quel type de vendeur êtes-vous ?</label>
                      <UISelect
                        value={(formData.isWholesaler ?? '1').toString()}
                        onValueChange={(val) => handleSellerChange({ isWholesaler: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type de vendeur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Grossiste</SelectItem>
                          <SelectItem value="1">Détaillant</SelectItem>
                          <SelectItem value="2">Les deux</SelectItem>
                        </SelectContent>
                      </UISelect>
                    </div>

                    <div>
                      <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Types de produits</label>
                      <UISelect
                        value={(formData.shop?.product_type ?? '0').toString()}
                        onValueChange={(val) => handleShopChange({ product_type: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type de produits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Boutique</SelectItem>
                          <SelectItem value="1">Friperie</SelectItem>
                          <SelectItem value="2">Les deux</SelectItem>
                        </SelectContent>
                      </UISelect>
                    </div>
                  </div>
                  </div>
                </TabsContent>

                {/* Personnel */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="personal">
                  <div className="space-y-6 p-2 sm:p-4 lg:p-8">
                    <div className='flex max-sm:flex-col gap-4'>
                      <div className='w-1/2 max-sm:w-full'>
                          <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Prénom</label>
                          <Input
                            value={formData.firstName || ''}
                            onChange={e => handleSellerChange({ firstName: e.target.value })}
                            placeholder="Votre prénom"
                            className="bg-white border-gray-200 max-sm:text-xs  focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                          />
                      </div>
                      <div className='w-1/2 max-sm:w-full'>
                      <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Nom</label>
                      <Input
                        value={formData.lastName || ''}
                        onChange={e => handleSellerChange({ lastName: e.target.value })}
                        placeholder="Votre nom"
                        className="bg-white max-sm:text-xs border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    </div>
                    <div className='flex max-sm:flex-col gap-4'>
                      <div className='w-1/2 max-sm:w-full'>
                      <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        value={formData.email || ''}
                        onChange={e => handleSellerChange({ email: e.target.value })}
                        placeholder="Votre email"
                        type="email"
                        className="bg-white max-sm:text-xs border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    <div className='w-1/2 max-sm:w-full'>
                      <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Téléphone</label>
                      <Input
                        value={formData.phone_number || ''}
                        onChange={e => handleSellerChange({ phone_number: e.target.value })}
                        placeholder="Votre téléphone"
                        className="bg-white max-sm:text-xs border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    </div>
                   <div className='flex max-sm:flex-col gap-4'>
                    <div className='w-1/2 max-sm:w-full'>
                      <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2">Date de naissance</label>
                      <Input
                        value={formData.birthDate || ''}
                        onChange={e => handleSellerChange({ birthDate: e.target.value })}
                        type="date"
                        className="bg-white max-sm:text-xs border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    <div className='w-1/2 max-sm:w-full'>
                      <label className="block max-sm:text-xs text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                      <Input
                        value={formData.nationality || ''}
                        onChange={e => handleSellerChange({ nationality: e.target.value })}
                        placeholder="Votre nationalité"
                        className="bg-white max-sm:text-xs border-gray-200 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/20"
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
                      value={formData.identity_card_in_front as unknown as File | null}
                      onChange={val => handleSellerChange({ identity_card_in_front: val as unknown as any })}
                    />
                    <ImageUpload
                      label="CNI Verso"
                      value={formData.identity_card_in_back as unknown as File | null}
                      onChange={val => handleSellerChange({ identity_card_in_back: val as unknown as any })}
                    />
                    <ImageUpload
                      label="Photo avec CNI"
                      value={formData.identity_card_with_the_person as unknown as File | null}
                      onChange={val => handleSellerChange({ identity_card_with_the_person: val as unknown as any })}
                    />
                  </div>
                </TabsContent>

                {/* Localisation */}
                <TabsContent className='overflow-y-auto max-h-[calc(100vh-300px)] flex-1' value="location">
                  <div className="space-y-6 p-2 sm:p-4 lg:p-8">
                    <div>
                      <label className="block max-sm:text-xs text-sm font-medium text-gray-700 mb-2">Ville</label>
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
                      <label className="block max-sm:text-xs text-sm font-medium text-gray-700 mb-2">Quartier</label>
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
                      value={formData.shop?.shop_profile as unknown as File | null}
                      onChange={val => handleShopChange({ shop_profile: val as unknown as any })}
                    />
                    <GalleryUpload
                      images={(formData.shop?.images as unknown as (File | { id?: number; path: string })[]) || []}
                      onChange={handleGalleryChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <div className="p-4 sticky bottom-0  sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Annuler</Button>
                <Button 
                  className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
            </form>

            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopEditorModal;