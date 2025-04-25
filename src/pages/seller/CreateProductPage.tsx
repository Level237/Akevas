import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,

  X,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAddProductMutation } from '@/services/sellerService';
import { useGetAttributeValuesQuery, useGetCategoryByGenderQuery, useGetSubCategoriesQuery, useGetTownsQuery } from '@/services/guardService';
import { MultiSelect } from '@/components/ui/multiselect';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';

// Nouvelle interface pour mieux typer les attributs
interface ProductAttribute {
  id: number;
  name: string;
  affectsPrice: boolean; // Nouveau champ pour différencier les types d'attributs
  values: Array<{
    id: number;
    value: string;
    hex?: string;
    price?: number; // Prix spécifique pour les attributs qui affectent le prix
  }>;
}

interface ProductVariant {
  id: string;
  variant_name: string;
  attribute_value_id: number[];
  price: number;
  images: File[];
  stock?: number; // Optionnel: pour gérer le stock par variant
}


const CreateProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const { data: { data: getAttributes } = {} } = useGetAttributeValuesQuery("1");

  //console.log(getAttributes)
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [colorSearchTerm, setColorSearchTerm] = useState('');
  const [sizeSearchTerm, setSizeSearchTerm] = useState('');
  const [weightSearchTerm, setWeightSearchTerm] = useState('');
  const [showColorSuggestions, setShowColorSuggestions] = useState(false);
  const [showSizeSuggestions, setShowSizeSuggestions] = useState(false);
  const [showWeightSuggestions, setShowWeightSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'product' | 'attributes'>('product');
  const [gender, setGender] = useState<number>(0)
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [addProduct, { isLoading: isLoadingAddProduct }] = useAddProductMutation()
  const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(gender)
  const { data: subCategoriesByGender, isLoading: isLoadingSubCategoriesByParentId } = useGetSubCategoriesQuery({ arrayId: selectedCategories, id: gender })
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
  const navigate = useNavigate()

  // Ajout des pointures par catégorie
  const shoeSizes = {
    'Bébé': ['16', '17', '18'],
    'Enfant': ['28', '30', '32', '34', '35', '36', '37'],
    'Adulte': ['38', '39', '40', '41', '42', '43', '44', '45']
  };

  //console.log(selectedSubCategories)
  // Liste des catégories disponibles
  console.log(variants)
  // Initialisation des attributs avec la propriété affectsPrice
  useEffect(() => {
    if (getAttributes) {
      setAttributes(
        getAttributes.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
          affectsPrice: attr.name === 'Taille', // La taille affecte le prix, la couleur non
          values: []
        }))
      );
    }
  }, [getAttributes]);

  // Nouvelle fonction pour gérer la sélection/déselection des catégories
  const handleChangeCategories = (selected: number[]) => {
    setSelectedCategories(selected);
  };

  const handleChangeSubCategories = (selected: number[]) => {
    setSelectedSubCategories(selected);
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
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

  const addAttributeValue = (attributeId: number, value: string, valueId?: number, hex?: string) => {
    const newAttributes = [...attributes];
    const attrIndex = newAttributes.findIndex(attr => attr.id === attributeId);

    if (attrIndex !== -1) {
      // Pour les valeurs qui ne viennent pas de l'API (taille et poids),
      // on génère un ID unique négatif pour éviter les conflits avec les IDs de l'API
      const newValueId = valueId || -(Date.now());

      const newValue = {
        id: newValueId,
        value: value,
        hex: hex
      };

      if (!newAttributes[attrIndex].values.some(v => v.value === value)) {
        newAttributes[attrIndex].values.push(newValue);
        setAttributes(newAttributes);
        generateVariants(newAttributes);
      }
    }
  };
  //console.log(variants)
  const removeAttributeValue = (attributeId: number, valueToRemove: string) => {
    const newAttributes = [...attributes];
    const attrIndex = newAttributes.findIndex(attr => attr.id === attributeId);

    if (attrIndex !== -1) {
      newAttributes[attrIndex].values = newAttributes[attrIndex].values.filter(
        v => v.value !== valueToRemove
      );
      setAttributes(newAttributes);
      generateVariants(newAttributes);
    }
  };

  const generateVariants = (attrs: ProductAttribute[]) => {
    const generateCombinations = (attributes: ProductAttribute[]): { name: string; ids: number[]; price: number }[] => {
      if (attributes.length === 0) return [{ name: '', ids: [], price: Number(price) || 0 }];

      const [first, ...rest] = attributes;
      const restCombinations = generateCombinations(rest);

      return first.values.flatMap(value =>
        restCombinations.map(combo => ({
          name: combo.name ? `${value.value}-${combo.name}` : value.value,
          ids: [value.id, ...combo.ids],
          price: Number(price) || 0 // Utiliser le prix général comme valeur initiale
        }))
      );
    };

    const activeAttrs = attrs.filter(attr => attr.values.length > 0);
    const combinations = generateCombinations(activeAttrs);

    const newVariants = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      variant_name: combo.name,
      attribute_value_id: combo.ids,
      price: combo.price,
      images: []
    }));

    setVariants(newVariants);
  };

  const handleVariantImageUpload = (variantId: string, files: FileList) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, images: [...variant.images, ...Array.from(files)] }
        : variant
    ));
  };

  const removeVariantImage = (variantId: string, imageIndex: number) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, images: variant.images.filter((_, idx) => idx !== imageIndex) }
        : variant
    ));
  };

  const getFilteredColors = () => {
    if (!getAttributes || !getAttributes[0]?.values) return [];
    return getAttributes[0].values.filter((color: any) =>
      color.value.toLowerCase().includes(colorSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[0].id)?.values
        .some(v => v.value === color.value)
    );
  };

  const getFilteredSizes = () => {
    if (!getAttributes || !getAttributes[1]?.values) return [];
    return getAttributes[1].values.filter((size: any) =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[1].id)?.values
        .some(v => v.value === size.value)
    );
  };


  const getFilteredWeights = () => {
    if (!getAttributes || !getAttributes[2]) return [];
    return getAttributes[2].values.filter((size: any) =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[2].id)?.values.some(v => v.value === size.value)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation des champs requis
    if (!name.trim()) {
      alert("Le nom du produit est requis");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Le prix doit être supérieur à 0");
      return;
    }

    if (!stock || Number(stock) <= 0) {
      alert("Le stock doit être supérieur à 0");
      return;
    }

    if (gender === 0) {
      alert("Le genre du produit est requis");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Veuillez sélectionner au moins une catégorie");
      return;
    }

    if (selectedSubCategories.length === 0) {
      alert("Veuillez sélectionner au moins une sous-catégorie");
      return;
    }

    if (!city) {
      alert("La ville cible est requise");
      return;
    }

    if (!whatsappNumber.trim()) {
      alert("Le numéro WhatsApp est requis");
      return;
    }

    if (!featuredImage) {
      alert("Une photo mise en avant est requise");
      return;
    }

    // Validation des variants si des attributs sont sélectionnés
    const hasSelectedAttributes = attributes.some(attr => attr.values.length > 0);
    if (hasSelectedAttributes) {
      const invalidVariants = variants.some(variant =>
        variant.images.length === 0 ||
        !variant.price ||
        variant.price <= 0
      );

      if (invalidVariants) {
        alert("Veuillez remplir tous les champs (images, prix) pour chaque variante");
        return;
      }
    }

    try {
      const formData = new FormData()
      formData.append('product_name', name);
      formData.append('product_price', price);
      formData.append('product_quantity', stock);
      formData.append('product_description', description);
      formData.append('product_gender', gender.toString());
      formData.append('whatsapp_number', whatsappNumber);
      formData.append('product_residence', city);

      if (featuredImage) {
        formData.append('product_profile', featuredImage);
      }

      images.forEach(image => formData.append('images[]', image));
      selectedCategories.forEach(category => formData.append('categories[]', category.toString()));
      selectedSubCategories.forEach(subCategory => formData.append('sub_categories[]', subCategory.toString()));

      // Ajouter les variants au formData s'il y en a
      if (variants.length > 0) {
        const variantsData = variants.map(variant => ({
          variant_name: variant.variant_name,
          attribute_value_id: variant.attribute_value_id,
          price: variant.price,
          images: []
        }));

        formData.append('variants', JSON.stringify(variantsData));

        // Ajouter les images des variants séparément
        variants.forEach((variant, variantIndex) => {
          variant.images.forEach((image, imageIndex) => {
            formData.append(`variant_images_${variantIndex}_${imageIndex}`, image);
          });
        });
        //console.log(variantsData)
      }
      
      const response = await addProduct(formData);
      console.log(response)
      navigate('/seller/products')
    } catch (error) {
      console.log(error)
    }
  };

  const handleChangeGender = (value: string) => {
    setGender(Number(value))
  };

  const handleCityChange = (value: string) => {
    setCity(value);
  };

  // Fonction pour mettre à jour le prix d'un attribut
  const updateAttributePrice = (attributeId: number, valueId: number, price: number) => {
    setAttributes(prevAttributes => 
      prevAttributes.map(attr => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            values: attr.values.map(val => 
              val.id === valueId ? { ...val, price } : val
            )
          };
        }
        return attr;
      })
    );
  };

  // Fonction pour gérer l'ajout de taille
  const handleAddSize = (attributeId: number) => {
    setAttributes(prevAttributes => 
      prevAttributes.map(attr => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            values: [...attr.values, { id: Date.now(), value: sizeSearchTerm, price: 0 }]
          };
        }
        return attr;
      })
    );
    setSizeSearchTerm('');
  };

  // Effet pour générer les variations quand les attributs changent
  useEffect(() => {
    generateVariants(attributes);
  }, [attributes, price]);

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        {/* Boutons fixes pour mobile en haut */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-b z-50">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 px-6 py-3 border rounded-xl hover:bg-gray-50 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500 font-medium"
            >
              Publier
            </button>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-8">
          <div className="mb-8 flex max-sm:flex-col max-sm:gap-5 justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
                Créer un produit
              </h1>
              <p className="text-gray-600 mt-2">
                Enrichissez votre catalogue avec un nouveau produit
              </p>
            </div>
            <div className="flex max-sm:hidden gap-3">
              <button type="button" className="px-4 py-2 text-gray-700 bg-white border rounded-xl hover:bg-gray-50 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Guide
              </button>
              <button type="button" className="px-4 py-2 text-gray-700 bg-white border rounded-xl hover:bg-gray-50 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Brouillon
              </button>
            </div>
          </div>

          {/* Onglets pour mobile */}
          <div className="md:hidden mb-6">
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab('product')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg ${activeTab === 'product'
                  ? 'bg-white shadow-sm text-[#ed7e0f]'
                  : 'text-gray-600'
                  }`}
              >
                Produit
              </button>
              <button
                onClick={() => setActiveTab('attributes')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg ${activeTab === 'attributes'
                  ? 'bg-white shadow-sm text-[#ed7e0f]'
                  : 'text-gray-600'
                  }`}
              >
                Attributs
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className={`md:col-span-2 space-y-6 ${activeTab === 'attributes' ? 'hidden md:block' : ''}`}>
              {/* Informations de base */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-2xl font-medium border-[1px] rounded-lg border-[#0000007a] focus:ring-0"
                  placeholder="Nom du produit"
                  required
                />

                <div className="flex max-sm:flex-col gap-4">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-4 py-2 max-sm:py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                    placeholder="Prix (Fcfa)"
                    required
                  />

                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="px-4 py-2  max-sm:py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                    placeholder="Stock"
                    required
                  />
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                  placeholder="Description détaillée du produit..."
                />
              </div>



              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <div className="relative">
                  <label className="block text-lg font-semibold mb-4">Genre produit</label>

                  <Select name='gender' onValueChange={handleChangeGender} required>
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
              </div>
              {gender !== 0 && (
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
              {selectedCategories.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="relative">
                    <label className="block text-lg font-semibold mb-4">Sous catégories</label>
                    <div className="flex flex-row flex-wrap gap-2 mb-4">

                    </div>
                    {selectedCategories.length > 0 && (
                      !isLoadingSubCategoriesByParentId && (
                        <MultiSelect

                          options={subCategoriesByGender?.categories}
                          selected={selectedSubCategories}
                          onChange={handleChangeSubCategories}
                          placeholder="Select sub categories..."
                        />
                      )
                    )}
                  </div>
                </div>
              )}
              {/* Nouvelle section pour les informations de contact */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold">Informations de contact</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro WhatsApp
                    </label>
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
                        className="w-full pl-12 pr-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                        placeholder="Ex: +225 0123456789"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Ce numéro sera utilisé pour vous contactez
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville cible
                    </label>
                    <Select name='city' onValueChange={handleCityChange} required>
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
                    <p className="mt-1 text-sm text-gray-500">
                      Ville  que vous voulez touchez par votre produit
                    </p>
                  </div>
                </div>
              </div>
              {/* Photo mise en avant */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Photo mise en avant</h2>
                </div>
                <div className="aspect-[4/3] w-full max-w-sm mx-auto rounded-lg overflow-hidden border border-dashed border-gray-200 bg-gray-50">
                  {featuredImage ? (
                    <div className="relative group h-full">
                      <img
                        src={URL.createObjectURL(featuredImage)}
                        alt="Featured product"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removeFeaturedImage}
                          className="p-1.5 bg-white/90 rounded-full hover:bg-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-1 text-sm text-gray-500">Ajouter une photo</span>
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

              {/* Galerie d'images */}
              <div className="bg-white    rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Galerie d'images</h2>
                <div className="grid max-sm:grid-cols-1 grid-cols-4 gap-4">
                  {images.slice(1).map((image, index) => (
                    <div key={index} className="relative group  aspect-square rounded-xl overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index + 1)}
                          className="p-2  bg-white rounded-full hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="aspect-square rounded-xl  bg-gray-50 max-sm:w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200">
                    <Upload className="w-8 h-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Ajouter des photos</span>
                    <input
                      type="file"
                      className="hidden "
                      accept="image/*"
                      multiple

                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className={`space-y-6 ${activeTab === 'product' ? 'hidden md:block' : ''}`}>
              {/* Nouvelle section des attributs */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Attributs du produit</h2>
                    <p className="text-sm text-gray-500 mt-1">Configurez les variations de votre produit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => {
                        setAttributes([]);
                        setVariants([]);
                      }}
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                {/* Type de variation */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Type de variation</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAttributes(attributes.filter(attr => !attr.affectsPrice));
                        setVariants([]);
                      }}
                      className={`p-4 h-24 rounded-xl border-2 transition-all ${
                        !attributes.some(attr => attr.affectsPrice)
                          ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Couleur uniquement</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!attributes.some(attr => attr.affectsPrice)) {
                          setAttributes([
                            ...attributes,
                            {
                              id: 2,
                              name: 'Taille',
                              affectsPrice: true,
                              values: []
                            }
                          ]);
                        }
                        setVariants([]);
                      }}
                      className={`p-4 h-24 rounded-xl border-2 transition-all ${
                        attributes.some(attr => attr.affectsPrice && attr.name === 'Taille')
                          ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Couleur et Taille</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!attributes.some(attr => attr.affectsPrice)) {
                          setAttributes([
                            ...attributes,
                            {
                              id: 3,
                              name: 'Pointure',
                              affectsPrice: true,
                              values: []
                            }
                          ]);
                        }
                        setVariants([]);
                      }}
                      className={`p-4 h-24 rounded-xl border-2 transition-all ${
                        attributes.some(attr => attr.affectsPrice && attr.name === 'Pointure')
                          ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Couleur et Pointure</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sélection des couleurs */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Couleurs disponibles</h3>
                    <span className="text-sm text-gray-500">
                      {variants.filter(v => v.attribute_value_id.length === 1).length} sélectionné(s)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3">
                    {getAttributes?.[0]?.values.map((color: any) => (
                      <label
                        key={color.id}
                        className={`relative group cursor-pointer ${
                          variants.some(v => v.attribute_value_id.includes(color.id))
                            ? 'ring-2 ring-[#ed7e0f] ring-offset-2'
                            : ''
                        }`}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden">
                          <div
                            className="w-12 h-12"
                            style={{ backgroundColor: color.hex_color || '#f3f4f6' }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            {variants.some(v => v.attribute_value_id.includes(color.id)) ? (
                              <X className="w-4 h-4 text-gray-900" />
                            ) : (
                              <Plus className="w-2 h-2 text-gray-900" />
                            )}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={variants.some(v => v.attribute_value_id.includes(color.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (attributes.some(attr => attr.affectsPrice)) {
                                const newVariant = {
                                  id: `variant-${color.id}`,
                                  variant_name: color.value,
                                  attribute_value_id: [color.id],
                                  price: Number(price) || 0,
                                  images: []
                                };
                                setVariants([...variants, newVariant]);
                              } else {
                                const newVariant = {
                                  id: `variant-${color.id}`,
                                  variant_name: color.value,
                                  attribute_value_id: [color.id],
                                  price: Number(price) || 0,
                                  images: []
                                };
                                setVariants([...variants, newVariant]);
                              }
                            } else {
                              setVariants(variants.filter(v => !v.attribute_value_id.includes(color.id)));
                            }
                          }}
                        />
                       
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sélection des tailles */}
                {attributes.some(attr => attr.affectsPrice) && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Tailles disponibles</h3>
                      <span className="text-sm text-gray-500">
                        {variants.filter(v => v.attribute_value_id.length === 2).length} combinaison(s)
                      </span>
                    </div>
                    <div className="space-y-4">
                      {getAttributes?.[0]?.values
                        .filter((color: any) => variants.some(v => v.attribute_value_id.includes(color.id)))
                        .map((color: any) => (
                          <div key={color.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-5 h-5 rounded-full"
                                  style={{ backgroundColor: color.hex_color || '#f3f4f6' }}
                                />
                                <span className="font-medium text-gray-900">{color.value}</span>
                              </div>
                              <div className="flex-1">
                                <Select
                                  onValueChange={(value) => {
                                    const sizeId = Number(value);
                                    if (value) {
                                      const newVariant = {
                                        id: `variant-${sizeId}-${color.id}`,
                                        variant_name: `${getAttributes?.[1]?.values.find((s: any) => s.id === sizeId)?.value}-${color.value}`,
                                        attribute_value_id: [sizeId, color.id],
                                        price: getAttributes?.[1]?.values.find((s: any) => s.id === sizeId)?.price || Number(price) || 0,
                                        images: []
                                      };
                                      setVariants([...variants, newVariant]);
                                    } else {
                                      setVariants(variants.filter(v => 
                                        !(v.attribute_value_id.includes(color.id))
                                      ));
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner une taille" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAttributes?.[1]?.values.map((size: any) => (
                                      <SelectItem 
                                        key={size.id} 
                                        value={String(size.id)}
                                        disabled={variants.some(v => 
                                          v.attribute_value_id.includes(size.id) && 
                                          v.attribute_value_id.includes(color.id)
                                        )}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span>{size.value}</span>
                                          {size.price && (
                                            <span className="text-[#ed7e0f] text-sm">
                                              +{size.price - Number(price)} FCFA
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {variants
                                .filter(v => 
                                  v.attribute_value_id.includes(color.id) && 
                                  v.attribute_value_id.length === 2
                                )
                                .map(variant => {
                                  const size = getAttributes?.[1]?.values.find((s: any) => 
                                    variant.attribute_value_id.includes(s.id)
                                  );
                                  return (
                                    <div
                                      key={variant.id}
                                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-[#ed7e0f]/10 border border-[#ed7e0f]"
                                    >
                                      <span className="font-medium">{size?.value}</span>
                                      <button
                                        onClick={() => {
                                          setVariants(variants.filter(v => v.id !== variant.id));
                                        }}
                                        className="ml-2 p-0.5 hover:bg-[#ed7e0f]/20 rounded-full"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Sélection des pointures */}
                {attributes.some(attr => attr.affectsPrice && attr.name === 'Pointure') && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Pointures disponibles</h3>
                      <span className="text-sm text-gray-500">
                        {variants.filter(v => v.attribute_value_id.length === 2).length} combinaison(s)
                      </span>
                    </div>
                    <div className="space-y-4">
                      {getAttributes?.[0]?.values
                        .filter((color: any) => variants.some(v => v.attribute_value_id.includes(color.id)))
                        .map((color: any) => (
                          <div key={color.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-5 h-5 rounded-full"
                                  style={{ backgroundColor: color.hex || '#f3f4f6' }}
                                />
                                <span className="font-medium text-gray-900">{color.value}</span>
                              </div>
                            </div>
                            
                            {/* Catégories de pointures */}
                            <div className="space-y-4">
                              {Object.entries(shoeSizes).map(([category, sizes]) => (
                                <div key={category} className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-700">{category}</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                      <button
                                        key={size}
                                        onClick={() => {
                                          const sizeId = Number(size);
                                          if (!variants.some(v => 
                                            v.attribute_value_id.includes(color.id) && 
                                            v.attribute_value_id.includes(sizeId)
                                          )) {
                                            const newVariant = {
                                              id: `variant-${sizeId}-${color.id}`,
                                              variant_name: `${size}-${color.value}`,
                                              attribute_value_id: [sizeId, color.id],
                                              price: Number(price) || 0,
                                              images: []
                                            };
                                            setVariants([...variants, newVariant]);
                                          } else {
                                            setVariants(variants.filter(v => 
                                              !(v.attribute_value_id.includes(color.id) && 
                                                v.attribute_value_id.includes(sizeId))
                                            ));
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                          variants.some(v => 
                                            v.attribute_value_id.includes(color.id) && 
                                            v.attribute_value_id.includes(Number(size))
                                          )
                                            ? 'bg-[#ed7e0f] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {size}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Aperçu des variations */}
                {variants.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {attributes.some(attr => attr.affectsPrice) 
                            ? "Combinaisons sélectionnées" 
                            : "Variations de couleur"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Gérez les prix et le stock pour chaque variante</p>
                      </div>
                      <span className="px-3 py-1 bg-[#ed7e0f]/10 text-[#ed7e0f] rounded-full text-sm font-medium">
                        {attributes.some(attr => attr.affectsPrice)
                          ? variants.filter(v => v.attribute_value_id.length === 2).length
                          : variants.filter(v => v.attribute_value_id.length === 1).length
                        } var{variants.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-4 max-w-2xl">
                      {variants
                        .filter(variant => {
                          if (attributes.some(attr => attr.affectsPrice)) {
                            return variant.attribute_value_id.length === 2;
                          }
                          return variant.attribute_value_id.length === 1;
                        })
                        .map((variant) => {
                          const color = getAttributes?.[0]?.values.find((c: any) => 
                            variant.attribute_value_id.includes(c.id)
                          );
                          const size = getAttributes?.[1]?.values.find((s: any) => 
                            variant.attribute_value_id.includes(s.id)
                          );
                          
                          return (
                            <div
                              key={variant.id}
                              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <div className="flex flex-col gap-6">
                                {/* En-tête avec couleur et taille */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    {color?.hex_color && (
                                      <div className="relative">
                                        <div
                                          className="w-8 h-8 rounded-xl border-2 border-white shadow-md transform hover:scale-105 transition-transform"
                                          style={{ backgroundColor: color.hex_color }}
                                        />
                                        {variant.images.length > 0 && (
                                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#ed7e0f] text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm">
                                            {variant.images.length}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    <div>
                                      <h5 className="text-lg flex items-center font-semibold text-gray-900">
                                        {color?.value}
                                        {size && (
                                          <span className="inline-flex items-center">
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-2"></span>
                                            <span className="text-gray-700 font-medium">{size.value}</span>
                                          </span>
                                        )}
                                      </h5>
                                    </div>
                                  </div>
                                  {!attributes.some(attr => attr.affectsPrice) && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500 text-sm">Prix :</span>
                                      <span className="text-gray-900 font-medium">{variant.price} FCFA</span>
                                    </div>
                                  )}
                                </div>

                                {/* Section prix et stock */}
                                <div className={`${attributes.some(attr => attr.affectsPrice) ? 'grid grid-cols-2 gap-4' : ''}`}>
                                {attributes.some(attr => attr.affectsPrice) && (
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                                    <div className="relative">
                                      
                                        <div className="relative flex items-center">
                                          <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => {
                                              const newPrice = Number(e.target.value);
                                              setVariants(variants.map(v =>
                                                v.id === variant.id ? { ...v, price: newPrice } : v
                                              ));
                                            }}
                                            className="w-full pl-3 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] transition-all"
                                            placeholder="Entrez le prix"
                                          />
                                          <span className="absolute right-3 text-[#ed7e0f] font-medium">FCFA</span>
                                        </div>
                                      
                                    </div>
                                  </div>
                                )}
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                      type="number"
                                      value={variant.stock || ''}
                                      onChange={(e) => {
                                        const newStock = Number(e.target.value);
                                        setVariants(variants.map(v =>
                                          v.id === variant.id ? { ...v, stock: newStock } : v
                                        ));
                                      }}
                                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] transition-all"
                                      placeholder="Quantité disponible"
                                    />
                                  </div>
                                </div>

                                {/* Section images */}
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-gray-700">Images du produit</label>
                                  <div className="flex flex-wrap gap-3">
                                    {variant.images.map((image, idx) => (
                                      <div key={idx} className="relative group">
                                        <img
                                          src={URL.createObjectURL(image)}
                                          alt={`Variant ${idx + 1}`}
                                          className="w-16 h-16 object-cover rounded-xl shadow-sm group-hover:ring-2 group-hover:ring-[#ed7e0f] transition-all"
                                        />
                                        <button
                                          onClick={() => removeVariantImage(variant.id, idx)}
                                          className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-50"
                                        >
                                          <X className="w-4 h-4 text-red-500" />
                                        </button>
                                      </div>
                                    ))}
                                    <label className="w-16 h-16 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50/80 hover:border-[#ed7e0f] transition-all group">
                                      <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#ed7e0f]" />
                                      <span className="text-xs text-gray-400 group-hover:text-[#ed7e0f]">Ajouter</span>
                                      <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => e.target.files && handleVariantImageUpload(variant.id, e.target.files)}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex max-sm:hidden gap-3">
                <button
                  type="button"
                  className="flex-1 px-6 py-2.5 border rounded-xl hover:bg-gray-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white rounded-xl hover:from-[#ed7e0f]/90 hover:to-orange-500 font-medium"
                >
                  {isLoadingAddProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publier'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
};

export default CreateProductPage;