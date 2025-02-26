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

interface ProductAttribute {
  id: number;
  name: string;
  values: Array<{
    id: number;
    value: string;
    hex?: string;
  }>;
}

interface ProductVariant {
  id: string;
  variant_name: string;
  attribute_value_id: number[];
  price: number;
  stock: number;
  image: File | null;
}


const CreateProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const { data: { data: getAttributes } = {}, isLoading } = useGetAttributeValuesQuery("1");

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
  const [addProduct, { isLoading: isLoadingAddProduct }] = useAddProductMutation()
  const { data: categoriesByGender, isLoading: isLoadingCategoriesByGender } = useGetCategoryByGenderQuery(gender)
  const { data: subCategoriesByGender, isLoading: isLoadingSubCategoriesByParentId } = useGetSubCategoriesQuery({ arrayId: selectedCategories, id: gender })
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
  const navigate = useNavigate()

  //console.log(selectedSubCategories)
  // Liste des catégories disponibles

  // Effet pour initialiser les attributs depuis l'API
  useEffect(() => {
    if (getAttributes) {
      setAttributes(
        getAttributes.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
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
    const generateCombinations = (attributes: ProductAttribute[]): { name: string; ids: number[] }[] => {
      if (attributes.length === 0) return [{ name: '', ids: [] }];

      const [first, ...rest] = attributes;
      const restCombinations = generateCombinations(rest);

      return first.values.flatMap(value =>
        restCombinations.map(combo => ({
          name: combo.name ? `${value.value}-${combo.name}` : value.value,
          ids: [value.id, ...combo.ids]
        }))
      );
    };

    const activeAttrs = attrs.filter(attr => attr.values.length > 0);
    const combinations = generateCombinations(activeAttrs);

    const newVariants = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      variant_name: combo.name,
      attribute_value_id: combo.ids,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      image: null
    }));

    setVariants(newVariants);
  };

  const handleVariantImageUpload = (variantId: string, file: File) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, image: file }
        : variant
    ));
  };

  const removeVariantImage = (variantId: string) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, image: null }
        : variant
    ));
  };

  const getFilteredColors = () => {
    if (!getAttributes || !getAttributes[0]) return [];
    return getAttributes[0].values.filter(color =>
      color.value.toLowerCase().includes(colorSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[0].id)?.values
        .some(v => v.value === color.value)
    );
  };

  const getFilteredSizes = () => {
    if (!getAttributes || !getAttributes[1]) return [];
    return getAttributes[1].values.filter(size =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[1].id)?.values.some(v => v.value === size.value)
    );
  };


  const getFilteredWeights = () => {
    if (!getAttributes || !getAttributes[2]) return [];
    return getAttributes[2].values.filter(size =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[2].id)?.values.some(v => v.value === size.value)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation des variants si des attributs sont sélectionnés
    const hasSelectedAttributes = attributes.some(attr => attr.values.length > 0);
    if (hasSelectedAttributes) {
      // Vérifier que chaque variant a tous les champs requis
      const invalidVariants = variants.some(variant =>
        !variant.image ||
        !variant.price ||
        !variant.stock
      );

      if (invalidVariants) {
        alert("Veuillez remplir tous les champs (image, prix, stock) pour chaque variante");
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
          stock: variant.stock,
          image: null
        }));

        formData.append('variants', JSON.stringify(variantsData));

        // Ajouter les images des variants séparément
        variants.forEach((variant, index) => {
          if (variant.image) {
            formData.append(`variant_images[${index}]`, variant.image);
          }
        });
        console.log(variantsData)
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
                />

                <div className="flex max-sm:flex-col gap-4">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-4 py-2 max-sm:py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                    placeholder="Prix (Fcfa)"
                  />

                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="px-4 py-2  max-sm:py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                    placeholder="Stock"
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
                    <Select name='city' onValueChange={handleCityChange}>
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
              {/* Attributs */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Attributs</h2>
                <div className="space-y-4">
                  {attributes.map((attribute) => (
                    <div key={attribute.id}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm text-gray-700">{attribute.name}</h3>
                        <button
                          type="button"
                          onClick={() => generateVariants(attributes)}
                          className="text-xs text-[#ed7e0f] hover:underline"
                        >
                          Générer les variantes
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {attribute.values.map((value) => (
                          <span key={value.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                            {attribute.name === 'Couleur' && value.hex && (
                              <span
                                className="w-3 h-3 rounded-full mr-1.5"
                                style={{ backgroundColor: value.hex }}
                              />
                            )}
                            {value.value}
                            <button
                              type="button"
                              onClick={() => removeAttributeValue(attribute.id, value.value)}
                              className="ml-1.5 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="relative flex gap-2">
                        <input
                          type="text"
                          placeholder={`Ajouter ${attribute.name.toLowerCase()}`}
                          className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          value={
                            attribute.name === 'Couleur'
                              ? colorSearchTerm
                              : attribute.name === 'Taille'
                                ? sizeSearchTerm
                                : attribute.name === 'Poids'
                                  ? weightSearchTerm
                                  : ''
                          }
                          onChange={(e) => {
                            if (attribute.name === 'Couleur') {
                              setColorSearchTerm(e.target.value);
                              setShowColorSuggestions(true);
                            } else if (attribute.name === 'Taille') {
                              setSizeSearchTerm(e.target.value);
                              setShowSizeSuggestions(true);
                            } else if (attribute.name === 'Poids' && weightSearchTerm) {
                              setWeightSearchTerm(e.target.value);
                              setShowWeightSuggestions(true);
                            }
                          }}
                          onFocus={() => {
                            if (attribute.name === 'Couleur') setShowColorSuggestions(true);
                            if (attribute.name === 'Taille') setShowSizeSuggestions(true);
                            if (attribute.name === 'Poids') setShowWeightSuggestions(true);
                          }}
                        />

                        {/* Suggestions pour les couleurs */}
                        {attribute.name === 'Couleur' && showColorSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {getFilteredColors().map((color) => (
                              <button
                                key={color.id}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
                                onClick={() => {
                                  addAttributeValue(attribute.id, color.value, color.id, color.hex);
                                  setColorSearchTerm('');
                                  setShowColorSuggestions(false);
                                }}
                              >
                                <span
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: color.hex }}
                                />
                                {color.value}
                              </button>
                            ))}
                            {colorSearchTerm && !getFilteredColors().some(c => c.value.toLowerCase() === colorSearchTerm.toLowerCase()) && (
                              <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-[#ed7e0f]"
                                onClick={() => {
                                  addAttributeValue(attribute.id, colorSearchTerm, undefined, colorSearchTerm);
                                  setColorSearchTerm('');
                                  setShowColorSuggestions(false);
                                }}
                              >
                                + Créer "{colorSearchTerm}"
                              </button>
                            )}
                          </div>
                        )}

                        {/* Suggestions pour les tailles */}
                        {attribute.name === 'Taille' && showSizeSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {getFilteredSizes().map((size) => (
                              <button
                                key={size.id}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                                onClick={() => {
                                  addAttributeValue(attribute.id, size.value, size.id, undefined);
                                  setSizeSearchTerm('');
                                  setShowSizeSuggestions(false);
                                }}
                              >
                                {size.value}
                              </button>
                            ))}
                            {sizeSearchTerm && !getFilteredSizes().some(s => s.toLowerCase() === sizeSearchTerm.toLowerCase()) && (
                              <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-[#ed7e0f]"
                                onClick={() => {
                                  addAttributeValue(attribute.id, sizeSearchTerm.toUpperCase(), undefined, undefined);
                                  setSizeSearchTerm('');
                                  setShowSizeSuggestions(false);
                                }}
                              >
                                + Créer "{sizeSearchTerm.toUpperCase()}"
                              </button>
                            )}
                          </div>
                        )}

                        {/* Suggestions pour les poids */}
                        {attribute.name === 'Poids' && showWeightSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {getFilteredWeights().map((weight) => (
                              <button
                                key={weight}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                                onClick={() => {
                                  addAttributeValue(attribute.id, weight.value, weight.id, undefined);
                                  setWeightSearchTerm('');
                                  setShowWeightSuggestions(false);
                                }}
                              >
                                {weight.value}
                              </button>
                            ))}
                            {weightSearchTerm && !getFilteredWeights().some(w => w.toLowerCase() === weightSearchTerm.toLowerCase()) && (
                              <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-[#ed7e0f]"
                                onClick={() => {
                                  addAttributeValue(attribute.id, weightSearchTerm, undefined, undefined);
                                  setWeightSearchTerm('');
                                  setShowWeightSuggestions(false);
                                }}
                              >
                                + Créer "{weightSearchTerm}"
                              </button>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                          onClick={() => {
                            if (attribute.name === 'Couleur' && colorSearchTerm) {
                              addAttributeValue(attribute.id, colorSearchTerm, undefined, colorSearchTerm);
                              setColorSearchTerm('');
                            } else if (attribute.name === 'Taille' && sizeSearchTerm) {
                              addAttributeValue(attribute.id, sizeSearchTerm.toUpperCase(), undefined, undefined);
                              setSizeSearchTerm('');
                            } else if (attribute.name === 'Poids' && weightSearchTerm) {
                              addAttributeValue(attribute.id, weightSearchTerm, undefined, undefined);
                              setWeightSearchTerm('');
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variantes */}
              {variants.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Variantes ({variants.length})</h2>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {variants.map((variant) => (
                      <div key={variant.id} className="p-3 bg-gray-50 rounded-xl">
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">
                            {variant.variant_name}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Prix unitaire</label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = variants.map((v) =>
                                  v.id === variant.id ? { ...v, price: Number(e.target.value) } : v
                                );
                                setVariants(newVariants);
                              }}
                              className="w-full px-3 py-1.5 text-sm border rounded-lg"
                              placeholder="0.00 €"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Quantité en stock</label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => {
                                const newVariants = variants.map((v) =>
                                  v.id === variant.id ? { ...v, stock: Number(e.target.value) } : v
                                );
                                setVariants(newVariants);
                              }}
                              className="w-full px-3 py-1.5 text-sm border rounded-lg"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Section image simplifiée */}
                        <div className="mt-3">
                          <label className="block text-xs text-gray-500 mb-2">Image de la variante</label>
                          <div className="flex gap-2">
                            {variant.image ? (
                              <div className="relative group w-16 h-16">
                                <img
                                  src={URL.createObjectURL(variant.image)}
                                  alt={`Variante ${variant.id}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariantImage(variant.id)}
                                  className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => e.target.files?.[0] && handleVariantImageUpload(variant.id, e.target.files[0])}
                                />
                                <Plus className="w-5 h-5 text-gray-400" />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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