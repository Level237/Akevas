import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNav from '@/components/ui/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


const StoreCustomizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //const { data: { data: shop } = {} } = useGetShopQuery();
  //const [updateShop] = useUpdateShopMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      formData.append('name', name);
      formData.append('description', description);

      //await updateShop(formData).unwrap();
      //toast.success('Boutique mise à jour avec succès');
      navigate('/store');
    } catch (error) {
      //toast.error('Erreur lors de la mise à jour de la boutique');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Personnaliser votre boutique</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Photo de couverture */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Photo de couverture
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed7e0f] cursor-pointer"
              >
                Changer l'image
              </label>
            </div>
          </div>

          {/* Section Nom de la boutique */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom de la boutique
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez le nom de votre boutique"
              required
            />
          </div>

          {/* Section Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre boutique"
              rows={4}
              required
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/store')}
              className="border-gray-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/80"
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
      <MobileNav />
    </div>
  );
};

export default StoreCustomizationPage; 