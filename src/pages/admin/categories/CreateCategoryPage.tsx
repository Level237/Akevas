import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

import { toast } from 'sonner';
import { useAllGendersQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { useAddCategoryMutation } from '@/services/adminService';

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const { data: genders } = useAllGendersQuery('guardService');
  const { data: categories, isLoading } = useGetCategoriesWithParentIdNullQuery("4");
  const [createCategory] = useAddCategoryMutation()
  const [formData, setFormData] = useState({
    category_name: '',
    category_profile: null as File | null,
    gender_id: [] as string[],
    parent_id: null as number | null // Renommé de parent_category_id à parent_id
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

  console.log(formData.category_name)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    try {

      await createCategory({
        'category_name':formData.category_name,
        'gender_id':formData.gender_id,
        "category_profile":formData.category_profile,
        "parent_id":formData.parent_id
      });
      
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
                  multiple
                  value={formData.gender_id}
                  onChange={e => {
                    // Crée un tableau à partir des options sélectionnées (e.target.selectedOptions)
                    const selectedValues = Array.from(e.target.selectedOptions)
                                                .map(option => option.value);
                    
                    // Met à jour l'état avec le nouveau tableau d'IDs
                    setFormData(prev => ({ 
                        ...prev, 
                        gender_id: selectedValues 
                    }));
                }}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] sm:text-sm"
                  required
                >
                  <option value={0} disabled>
                  Sélectionnez un ou plusieurs genres
                  </option>
                  {Array.isArray(genders) &&
                      genders.map((gender: any) => (
                          <option key={gender.id} value={gender.id}>
                              {gender.gender_name}
                          </option>
                      ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_id">Catégorie parente (Optionnel)</Label> {/* Mis à jour htmlFor */}
                <select
                  id="parent_id" // Mis à jour id
                  value={formData.parent_id || ''} // Utilisé parent_id ici
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    parent_id: e.target.value ? Number(e.target.value) : null // Utilisé parent_id ici
                  }))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] sm:text-sm"
                >
                  <option value="">Aucune catégorie parente</option>
                  {Array.isArray(categories?.data) && !isLoading &&
                    categories?.data?.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="category_profile" className="block">
                Image de la catégorie <span className="text-gray-400 font-normal">(facultatif)</span>
              </Label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <label
                    htmlFor="category_profile"
                    className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Aperçu"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 text-center">Cliquez pour ajouter une image</span>
                      </>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="category_profile"
                    />
                  </label>
                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="mt-1 text-xs text-red-500 hover:underline"
                    >
                      Supprimer l'image
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Formats acceptés : JPG, PNG, GIF.<br />
                  Taille maximale : 2 Mo.
                </div>
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