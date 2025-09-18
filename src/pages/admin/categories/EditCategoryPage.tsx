import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAllGendersQuery, useGetCategoriesWithParentIdNullQuery } from '@/services/guardService';
import { useGetCategoryQuery, useUpdateCategoryMutation } from '@/services/adminService';

export default function EditCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryId = Number(id);

  const { data: genders } = useAllGendersQuery('guardService');
  const { data: parentCategories, isLoading: isLoadingParents } = useGetCategoriesWithParentIdNullQuery('guardService');
  const { data: categoryData, isLoading: isLoadingCategory } = useGetCategoryQuery(categoryId, { skip: !categoryId });
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [formData, setFormData] = useState({
    category_name: '',
    category_profile: null as File | null,
    gender_id: 0,
    parent_id: null as number | null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  console.log(categoryData?.category)
  useEffect(() => {
    if (categoryData?.category) {
      const current = categoryData.category;
      setFormData({
        category_name: current.category_name ?? '',
        category_profile: null,
        gender_id: (Array.isArray(current.genders) && current.genders.length > 0 ? current.genders[0]?.id : current.gender_id) ?? 0,
        parent_id: current.parent?.id ?? null,
      });
      setPreviewImage(current.category_profile ?? null);
    }
  }, [categoryData]);

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
      const body = new FormData();
      body.append('category_name', formData.category_name);
      body.append('gender_id', String(formData.gender_id));
      if (formData.category_profile) {
        body.append('category_profile', formData.category_profile);
      }
      if (formData.parent_id) {
        body.append('parent_id', String(formData.parent_id));
      }

      const response=await updateCategory({ id: categoryId, body });
      console.log(response)
      toast.success('Catégorie mise à jour avec succès');
      navigate('/admin/categories');
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la catégorie");
    }
  };

  if (isLoadingCategory) {
    return (
      <div className="p-6 mt-16">Chargement...</div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Modifier la catégorie</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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

              <div className="space-y-2">
                <Label htmlFor="parent_id">Catégorie parente (Optionnel)</Label>
                <select
                  id="parent_id"
                  value={formData.parent_id || ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    parent_id: e.target.value ? Number(e.target.value) : null
                  }))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] sm:text-sm"
                >
                  <option value="">Aucune catégorie parente</option>
                  {Array.isArray(parentCategories?.data) && !isLoadingParents &&
                    parentCategories?.data?.map((category: any) => (
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
                        setFormData(prev => ({ ...prev, category_profile: null }));
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
                disabled={isUpdating}
              >
                {isUpdating ? 'Mise à jour...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


