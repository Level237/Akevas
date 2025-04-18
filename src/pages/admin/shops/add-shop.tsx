import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddShopMutation } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useGetTownsQuery, useGetQuartersQuery, useGetCategoriesQuery } from '@/services/guardService';

import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddShopPage() {
  const navigate = useNavigate();
  const [addShop, { isLoading }] = useAddShopMutation();
  const { data: towns } = useGetTownsQuery('guard');
  const { data: categories } = useGetCategoriesQuery('category');
  const [selectedTown, setSelectedTown] = useState<string>('');
  const { data: quarters } = useGetQuartersQuery(selectedTown);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    birthDate: '',
    nationality: '',
    password: '',
    isWholesaler: false,
    shop_name: '',
    shop_description: '',
    town_id: '',
    quarter_id: '',
    product_type: '',
    shop_gender: '',
    categories: [] as string[],
    shop_profile: null as File | null,
    identity_card_in_front: null as File | null,
    identity_card_in_back: null as File | null,
    identity_card_with_the_person: null as File | null,
    images: [] as File[],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'shop_images') {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, file]
      }));
      setPreviewImages(prev => [...prev, URL.createObjectURL(file)]);
    } else {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value?.toString() || '');
        }
      });

      await addShop(formDataToSend).unwrap();
      toast.success('Boutique créée avec succès');
      navigate('/admin/shops');
    } catch (error) {
      toast.error('Erreur lors de la création de la boutique');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mt-12 mb-12">Ajouter une nouvelle boutique</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 ">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 ">Informations du vendeur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                required
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                required
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                required
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nationalité</Label>
              <Input
                required
                value={formData.nationality}
                onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isWholesaler}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isWholesaler: checked }))}
              />
              <Label>Grossiste</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Informations de la boutique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nom de la boutique</Label>
              <Input
                required
                value={formData.shop_name}
                onChange={(e) => setFormData(prev => ({ ...prev, shop_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.shop_description}
                onChange={(e) => setFormData(prev => ({ ...prev, shop_description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Ville</Label>
              <Select
                value={formData.town_id}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, town_id: value }));
                  setSelectedTown(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  {towns?.towns.map((town:any) => (
                    <SelectItem key={town.id} value={town.id.toString()}>
                      {town.town_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quartier</Label>
              <Select
                value={formData.quarter_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quarter_id: value }))}
                disabled={!quarters}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un quartier" />
                </SelectTrigger>
                <SelectContent>
                  {quarters?.quarters.map((quarter:any) => (
                    <SelectItem key={quarter.id} value={quarter.id.toString()}>
                      {quarter.quarter_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type de produit</Label>
              <Input
                required
                value={formData.product_type}
                onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Genre de la boutique</Label>
              <Select
                value={formData.shop_gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, shop_gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homme">Homme</SelectItem>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="enfant">Enfant</SelectItem>
                  <SelectItem value="mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Documents d'identité</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>CNI Recto</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'identity_card_in_front')}
                  className="hidden"
                  id="cni-front"
                />
                <label htmlFor="cni-front" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>CNI Verso</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'identity_card_in_back')}
                  className="hidden"
                  id="cni-back"
                />
                <label htmlFor="cni-back" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Photo avec CNI</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'identity_card_with_the_person')}
                  className="hidden"
                  id="cni-person"
                />
                <label htmlFor="cni-person" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger</p>
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Images de la boutique</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'shop_images')}
                className="hidden"
                id="shop-images"
                multiple
              />
              <label htmlFor="shop-images" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger les images</p>
              </label>
            </div>
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImages(prev => prev.filter((_, i) => i !== index));
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.categories.map((category:any) => (
              <div key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={formData.categories.includes(category.id.toString())}
                  onChange={(e) => {
                    const value = category.id.toString();
                    setFormData(prev => ({
                      ...prev,
                      categories: e.target.checked
                        ? [...prev.categories, value]
                        : prev.categories.filter(id => id !== value)
                    }));
                  }}
                />
                <Label htmlFor={`category-${category.id}`}>{category.category_name}</Label>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer la boutique'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 