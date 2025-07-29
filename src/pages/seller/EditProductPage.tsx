import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  X,
  Loader2,
  Edit,
} from 'lucide-react';


import { useGetCategoryByGenderQuery, useGetProductByUrlQuery, useGetSubCategoriesQuery, useGetTownsQuery } from '@/services/guardService';
import { MultiSelect } from '@/components/ui/multiselect';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';


// Interfaces pour les données du produit
interface ProductImage {
  id: number;
  path: string;
}


interface ProductVariation {
  id: string;
  color: {
    id: number;
    name: string;
    hex: string;
  };
  quantity?: number;
  size?: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  };
  shoeSize?: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  };
  images: File[];
  price: number;
}




const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  console.log(url)
  // États pour les données du produit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [gender, setGender] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const [productType, setProductType] = useState<'simple' | 'variable'>('simple');
  
  // États pour les images
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  
  // États pour les variations (si produit variable)
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [variationFrames, setVariationFrames] = useState<Array<{
    id: string;
    colorId?: number;
    sizes: Array<{ id: number; quantity: number; }>;
    shoeSizes: Array<{ id: number; quantity: number; }>;
    images: File[];
    quantity?: number;
  }>>([]);
  
  // États pour les prix
 
  
  
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  
  // Queries
  
  //const { data: { data: getAttributes } = {} } = useGetAttributeValuesQuery("1");
  const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(gender);
  const { data: subCategoriesByGender, isLoading: isLoadingSubCategoriesByParentId } = useGetSubCategoriesQuery({ arrayId: selectedCategories, id: gender });
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');


  // Trouver le produit à éditer
  const { data: { data: product } = {}, isLoading } = useGetProductByUrlQuery(url);

  // Initialiser les données du produit
  useEffect(() => {
    if (product && !isLoading) {
      setIsLoadingProduct(true);
      
      // Remplir les champs de base
      setName(product.product_name);
      setDescription(product.product_description);
      setPrice(product.product_price);
      setStock(product.product_quantity);
      setCity(product.residence);
      
      // Déterminer le type de produit
      const hasVariations = product.variations && product.variations.length > 0;
      setProductType(hasVariations ? 'variable' : 'simple');
      
      // Remplir les catégories
      if (product.product_categories && product.product_categories.length > 0) {
        const categoryIds = product.product_categories.map((cat:any) => cat.id);
        setSelectedCategories(categoryIds);
        console.log(categoryIds)
        // Déterminer le genre basé sur les catégories
        if (product.product_categories.some((cat:any) => cat.category_name.toLowerCase().includes('femme'))) {
          setGender(2);
        } else if (product.product_categories.some((cat:any) => cat.category_name.toLowerCase().includes('homme'))) {
          setGender(1);
        } else if (product.product_categories.some((cat:any) => cat.category_name.toLowerCase().includes('enfant'))) {
          setGender(3);
        } else {
          setGender(4); // Mixte par défaut
        }
      }
      
      // Remplir les images existantes
      setExistingImages(product.product_images || []);
      setFeaturedImagePreview(product.product_profile);
      
      // Remplir les variations si c'est un produit variable
      if (hasVariations) {
        setVariations(product.variations);
        // Convertir les variations en frames pour l'interface
        const frames = product.variations.map((variation:any) => ({
          id: variation.id,
          colorId: variation.color.id,
          sizes: variation.size ? [{
            id: variation.size.id,
            quantity: variation.size.quantity
          }] : [],
          shoeSizes: variation.shoeSize ? [{
            id: variation.shoeSize.id,
            quantity: variation.shoeSize.quantity
          }] : [],
          images: [], // Les images seront gérées séparément
          quantity: variation.quantity
        }));
        setVariationFrames(frames);
        
        // Remplir les prix
        product.variations.forEach((variation:any) => {
          if (variation.size) {
            //setSizePrices(prev => ({ ...prev, [variation.size.id]: variation.size.price }));
          }
          if (variation.shoeSize) {
            //setShoeSizePrices(prev => ({ ...prev, [variation.shoeSize.id]: variation.shoeSize.price }));
          }
          if (!variation.size && !variation.shoeSize) {
            //setGlobalColorPrice(variation.price);
          }
        });
      }
      
      setIsLoadingProduct(false);
    }
  }, [product, isLoading]);

  // Handlers pour les changements
  const handleChangeCategories = (selected: number[]) => {
    setSelectedCategories(selected);
  };

  const handleChangeSubCategories = (selected: number[]) => {
    setSelectedSubCategories(selected);
  };

  const handleChangeGender = (value: string) => {
    setGender(Number(value));
  };

  const handleCityChange = (value: string) => {
    setCity(value);
  };

  // Handlers pour les images
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setRemovedImageIds([...removedImageIds, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  // Handlers pour les variations
  const addVariationFrame = () => {
    setVariationFrames([
      ...variationFrames,
      {
        id: `frame-${Date.now()}`,
        sizes: [],
        shoeSizes: [],
        images: [],
        quantity: undefined
      }
    ]);
  };

  //const updateVariationFrame = (frameId: string, updates: Partial<typeof variationFrames[0]>) => {
    //setVariationFrames(variationFrames.map(frame => 
      //frame.id === frameId ? { ...frame, ...updates } : frame
    //));
  //};

  //const removeVariationFrame = (frameId: string) => {
  //  setVariationFrames(variationFrames.filter(frame => frame.id !== frameId));
  //};

  //    const handleVariationImageUpload = (frameId: string, files: FileList) => {
  //  setVariationFrames(variationFrames.map(frame =>
  //    frame.id === frameId
  //      ? { ...frame, images: [...frame.images, ...Array.from(files)] }
  //      : frame
  //  ));
  //};

  //const removeVariationImage = (frameId: string, imageIndex: number) => {
  //  setVariationFrames(variationFrames.map(frame =>
  //    frame.id === frameId
  //      ? { ...frame, images: frame.images.filter((_, idx) => idx !== imageIndex) }
  //      : frame
  //  ));
  //};

  // Fonction de soumission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validations similaires à CreateProductPage
    if (!name.trim()) {
      toast.error('Le nom du produit est obligatoire');
      return;
    }

    if (productType === 'simple') {
      if (!price || Number(price) <= 0) {
        toast.error('Le prix du produit est obligatoire');
        return;
      }

      if (!stock || Number(stock) <= 0) {
        toast.error('La quantité du produit est obligatoire');
        return;
      }
    }

    if (!description.trim()) {
      toast.error('La description du produit est obligatoire');
      return;
    }

    if (gender === 0) {
      toast.error('Le genre du produit est obligatoire');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('La catégorie du produit est obligatoire');
      return;
    }

    if (selectedSubCategories.length === 0) {
      toast.error('La sous-catégorie du produit est obligatoire');
      return;
    }

    if (!whatsappNumber.trim()) {
      toast.error('Le numéro de téléphone est obligatoire');
      return;
    }

    if (!city) {
      toast.error('La ville du produit est obligatoire');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('product_name', name);
      formData.append('product_price', price);
      formData.append('product_quantity', stock);
      formData.append('product_description', description);
      formData.append('product_gender', gender.toString());
      formData.append('whatsapp_number', whatsappNumber);
      formData.append('product_residence', city);
      formData.append('type', productType);

      // Ajouter l'image de profil si modifiée
      if (featuredImage) {
        formData.append('product_profile', featuredImage);
      }

      // Ajouter les nouvelles images
      images.forEach(image => formData.append('images[]', image));

      // Ajouter les IDs des images supprimées
      if (removedImageIds.length > 0) {
        formData.append('removed_image_ids', JSON.stringify(removedImageIds));
      }

      // Ajouter les catégories
      selectedCategories.forEach(category => formData.append('categories[]', category.toString()));
      selectedSubCategories.forEach(subCategory => formData.append('sub_categories[]', subCategory.toString()));

      // Ajouter les variations si c'est un produit variable
      if (productType === 'variable' && variations.length > 0) {
        formData.append('variations', JSON.stringify(variations));
      }

      // Appeler la mutation de mise à jour
      //await updateProduct({ productId: productId!, formData });
      
      toast.success('Produit mis à jour avec succès');
      navigate('/seller/products');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la mise à jour du produit');
      console.error(error);
    }
  };

  if (isLoadingProduct || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#ed7e0f]" />
          <span className="text-gray-600">Chargement du produit...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Produit non trouvé</h2>
          <p className="text-gray-600 mb-4">Le produit que vous recherchez n'existe pas.</p>
          <button
            onClick={() => navigate('/seller/products')}
            className="px-4 py-2 bg-[#ed7e0f] text-white rounded-xl hover:bg-[#ed7e0f]/90"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-sm:pb-16">
      <form onSubmit={handleSubmit} className='' encType='multipart/form-data'>
        {/* Header avec boutons d'action */}
        <header className="sticky top-16 px-24 max-sm:px-0 z-30 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Version mobile */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-4">
                <button 
                  type="button" 
                  onClick={() => navigate("/seller/products")}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#6e0a13] to-orange-600 bg-clip-text text-transparent">
                  Modifier le produit
                </h1>
                <button
                  type="submit"
                  className="p-2 bg-[#6e0a13] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : <span className='max-sm:text-sm'>Mettre à jour</span>}
                </button>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Modifiez les informations de votre produit
              </p>
            </div>

            {/* Version desktop */}
            <div className="hidden md:flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                  Modifier le produit
                </h1>
                <p className="text-gray-600 mt-1">
                  Modifiez les informations de votre produit
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-gray-700 bg-white border rounded-xl hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6e0a13] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500 font-medium flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Mettre à jour
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl pl-24 max-sm:px-4 px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="md:col-span-2 space-y-6">
              {/* Informations de base */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full max-sm:placeholder:text-lg px-4 py-3 text-2xl font-medium border-0 border-b focus:ring-0 focus:border-[#ed7e0f]"
                  placeholder="Nom du produit"
                />

                {productType === 'simple' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full max-sm:placeholder:text-md px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Prix (Fcfa)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full max-sm:placeholder:text-sm px-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Quantité disponible"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full max-sm:placeholder:text-md px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                    placeholder="Description détaillée du produit..."
                  />
                </div>
              </div>

              {/* Catégories et sous-catégories */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <div>
                  <label className="block text-lg max-sm:text-sm font-semibold mb-4">Genre produit</label>
                  <Select name='gender' value={gender.toString()} onValueChange={handleChangeGender}>
                    <SelectTrigger className="bg-gray-50 border-0">
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

                {gender !== 0 && (
                  <>
                    <div>
                      <label className="block max-sm:text-sm text-lg font-semibold mb-4">Catégories</label>
                      {isLoadingCategoriesByGender ? (
                        <div className="flex items-center justify-center h-20">
                          <Loader2 className="w-6 h-6 animate-spin text-[#ed7e0f]" />
                        </div>
                      ) : (
                        <MultiSelect
                          options={categoriesByGender?.categories}
                          selected={selectedCategories}
                          onChange={handleChangeCategories}
                          placeholder="Sélectionner les catégories..."
                        />
                      )}
                    </div>

                    {selectedCategories.length > 0 && (
                      <div>
                        <label className="block text-lg font-semibold mb-4">Sous catégories</label>
                        {isLoadingSubCategoriesByParentId ? (
                          <div className="flex items-center justify-center h-20">
                            <Loader2 className="w-6 h-6 animate-spin text-[#ed7e0f]" />
                          </div>
                        ) : (
                          <MultiSelect
                            options={subCategoriesByGender?.categories}
                            selected={selectedSubCategories}
                            onChange={handleChangeSubCategories}
                            placeholder="Sélectionner les sous-catégories..."
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Informations de contact */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold">Informations de contact</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Ex: +237 656488374"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville cible</label>
                    <Select name='city' value={city} onValueChange={handleCityChange}>
                      <SelectTrigger className="bg-gray-50 border-0">
                        <SelectValue placeholder="Sélectionnez votre ville de livraison" />
                      </SelectTrigger>
                      <SelectContent>
                        {townsLoading ? (
                          <SelectItem value="loading">Chargement des villes...</SelectItem>
                        ) : (
                          towns?.towns.map((town: { id: string, town_name: string }) => (
                            <SelectItem key={town.id} value={String(town.id)}>
                              {town.town_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {productType === 'simple' ? (
                <>
                  {/* Photo mise en avant pour produit simple */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg max-sm:text-sm font-semibold mb-4">Photo mise en avant</h2>
                    <div className="aspect-square w-64 max-sm:w-44 h-64 max-sm:h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                      {featuredImage ? (
                        <div className="relative group h-64">
                          <img
                            src={URL.createObjectURL(featuredImage)}
                            alt="Featured product"
                            className="w-full max-sm:w-44 h-full max-sm:h-44 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeFeaturedImage}
                              className="p-2 bg-white/90 rounded-full hover:bg-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : featuredImagePreview ? (
                        <div className="relative group h-64">
                          <img
                            src={featuredImagePreview}
                            alt="Featured product"
                            className="w-full max-sm:w-44 h-full max-sm:h-44 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeFeaturedImage}
                              className="p-2 bg-white/90 rounded-full hover:bg-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-10 h-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Ajouter une photo</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFeaturedImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Galerie d'images pour produit simple */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold max-sm:text-sm mb-4">Galerie d'images</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Images existantes */}
                      {existingImages.map((image) => (
                        <div key={image.id} className="relative group aspect-square rounded-xl overflow-hidden">
                          <img
                            src={image.path}
                            alt={`Product ${image.id}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Nouvelles images */}
                      {images.map((image, index) => (
                        <div key={`new-${index}`} className="relative group aspect-square rounded-xl overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <label className="aspect-square rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200">
                        <Upload className="w-8 h-8 max-sm:w-5 max-sm:h-5 text-gray-400" />
                        <span className="mt-2 text-sm max-sm:text-xs text-gray-500">Ajouter</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Section des variations pour produit variable */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="mb-6">
                      <h2 className="text-lg max-sm:text-sm font-semibold text-gray-900">Variations du produit</h2>
                      <p className="text-sm text-gray-500 mt-1 max-sm:text-xs">Modifiez les variations de votre produit</p>
                    </div>

                    {/* Liste des variations existantes */}
                    <div className="space-y-4">
                      {variations.map((variation) => (
                        <div key={variation.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border border-gray-200"
                              style={{ backgroundColor: variation.color.hex }}
                            />
                            <span className="font-medium">{variation.color.name}</span>
                            {variation.size && (
                              <span className="text-sm text-gray-600">Taille: {variation.size.name}</span>
                            )}
                            {variation.shoeSize && (
                              <span className="text-sm text-gray-600">Pointure: {variation.shoeSize.name}</span>
                            )}
                            <span className="text-sm font-medium text-[#ed7e0f] ml-auto">
                              {variation.price} FCFA
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bouton pour ajouter de nouvelles variations */}
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={addVariationFrame}
                        className="w-full px-4 py-3 bg-transparent border border-[#ed7e0f] hover:bg-[#ed7e0f]/5 text-[#ed7e0f] rounded-xl transition-colors flex items-center gap-2 justify-center"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Ajouter une variation</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </form>
    </div>
  );
};

export default EditProductPage; 