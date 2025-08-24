import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

import { toast } from 'sonner';
import { useAllGendersQuery } from '@/services/guardService';

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const { data: genders } = useAllGendersQuery('guardService');
  // console.log(genders)
  const [formData, setFormData] = useState({
    category_name: '',
    category_profile: null as File | null,
    gender_id: 0
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, category_profile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category_name', formData.category_name);
      formDataToSend.append('gender_id', String(formData.gender_id));
      if (formData.category_profile) {
        formDataToSend.append('category_profile', formData.category_profile);
      }


      //await createCategory(formDataToSend).unwrap();
      toast.success('Catégorie créée avec succès');
      navigate('/admin/categories');
    } catch (error) {
      toast.error('Erreur lors de la création de la catégorie');
    }
  };

  return (
    <div className="p-6 mt-16">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/categories')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle catégorie</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category_name">Nom de la catégorie</Label>
                <Input
                  id="category_name"
                  value={formData.category_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                  placeholder="Entrez le nom de la catégorie"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender_id">Genre</Label>
                <select
                  id="gender_id"
                  value={formData.gender_id}
                  onChange={e => setFormData(prev => ({ ...prev, gender_id: Number(e.target.value) }))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] sm:text-sm"
                  required
                >
                  <option value={0} disabled>
                    Sélectionnez un genre
                  </option>
                  {Array.isArray(genders) &&
                    genders.map((gender: any) => (
                      <option key={gender.id} value={gender.id}>
                        {gender.gender_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>



            <div className="space-y-2">
              <Label>Image de la catégorie</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="category_profile"
                  />
                  <Label
                    htmlFor="category_profile"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Choisir une image
                  </Label>
                </div>
                {previewImage && (
                  <div className="relative w-20 h-20">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/categories')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#ed7e0f] hover:bg-[#d66d00] text-white"
              //disabled={isLoading}
              >
                {/*{isLoading ? 'Création en cours...' : 'Créer la catégorie'}*/}
                Créer la catégorie
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 