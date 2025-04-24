import React, { useState, useEffect, useMemo } from 'react';
import {
  Upload,
  Plus,
  X,
  Save,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
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
  size?: string;
  price: number;
  colors: Array<{
    id: number;
    name: string;
    hex: string;
    images: File[];
  }>;
}

const CLOTHING_SHOE_CATEGORIES = [1, 2, 3, 4, 5];

const CreateProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const { data: { data: getAttributes } = {} } = useGetAttributeValuesQuery("1");

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

  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<Array<{id: number, name: string, hex: string}>>([]);
  const [newSize, setNewSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [expandedSizeId, setExpandedSizeId] = useState<string | null>(null);

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
      size: combo.name,
      price: Number(price) || 0,
      colors: []
    }));

    setVariants(newVariants);
  };

  const handleVariantImageUpload = (variantId: string, files: FileList) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, colors: [...variant.colors, ...Array.from(files).map(file => ({
          id: Date.now(),
          name: '',
          hex: '',
          images: [file]
        }))] }
        : variant
    ));
  };

  const removeVariantImage = (variantId: string, imageIndex: number) => {
    setVariants(variants.map(variant =>
      variant.id === variantId
        ? { ...variant, colors: variant.colors.filter((_, idx) => idx !== imageIndex) }
        : variant
    ));
  };

  const getFilteredColors = () => {
    if (!getAttributes || !getAttributes[0]) return [];
    return getAttributes[0].values.filter((color: any) =>
      color.value.toLowerCase().includes(colorSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[0].id)?.values
        .some(v => v.value === color.value)
    );
  };

  const getFilteredSizes = () => {
    if (!getAttributes || !getAttributes[1]) return [];
    return getAttributes[1].values.filter((size: any) =>
      size.value.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes.find(attr => attr.id === getAttributes[1].id)?.values.some(v => v.value === size.value)
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

    const hasSelectedAttributes = attributes.some(attr => attr.values.length > 0);
    if (hasSelectedAttributes) {
      const invalidVariants = variants.some(variant =>
        variant.colors.length === 0 ||
        variant.colors.some(color => color.images.length === 0)
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

      if (variants.length > 0) {
        const transformedVariants = [];
        
        for (const variant of variants) {
          for (const color of variant.colors) {
            transformedVariants.push({
              variant_name: `${variant.size}-${color.name}`,
              size: variant.size,
              color: color.name,
              price: variant.price,
              images: []
            });
          }
        }

        formData.append('variants', JSON.stringify(transformedVariants));

        let variantImageIndex = 0;
        variants.forEach(variant => {
          variant.colors.forEach(color => {
            color.images.forEach(image => {
              formData.append(`variant_images_${variantImageIndex}`, image);
              variantImageIndex++;
            });
          });
        });
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

  const needsSizeColorAttributes = useMemo(() => {
    return selectedCategories.some(catId => CLOTHING_SHOE_CATEGORIES.includes(catId));
  }, [selectedCategories]);

  useEffect(() => {
    if (getAttributes && getAttributes[0]) {
      setAvailableColors(getAttributes[0].values.map((color: any) => ({
        id: color.id,
        name: color.value,
        hex: color.hex || '#CCCCCC'
      })));
    }
  }, [getAttributes]);

  useEffect(() => {
    if (getAttributes && getAttributes[1]) {
      setAvailableSizes(getAttributes[1].values.map((size: any) => size.value));
    }
  }, [getAttributes]);

  const addSizeVariant = () => {
    if (!newSize || !newPrice || Number(newPrice) <= 0) return;
    
    const variantId = `size-${Date.now()}`;
    const newVariant: ProductVariant = {
      id: variantId,
      size: newSize,
      price: Number(newPrice),
      colors: []
    };
    
    setVariants([...variants, newVariant]);
    setNewSize('');
    setNewPrice('');
    setExpandedSizeId(variantId);
  };

  const removeSizeVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId));
    if (expandedSizeId === variantId) {
      setExpandedSizeId(null);
    }
  };

  const addColorToVariant = (variantId: string, colorId: number, colorName: string, colorHex: string) => {
    setVariants(variants.map(variant => {
      if (variant.id === variantId) {
        if (!variant.colors.some(c => c.id === colorId)) {
          return {
            ...variant,
            colors: [...variant.colors, { id: colorId, name: colorName, hex: colorHex, images: [] }]
          };
        }
      }
      return variant;
    }));
  };

  const removeColorFromVariant = (variantId: string, colorId: number) => {
    setVariants(variants.map(variant => {
      if (variant.id === variantId) {
        return {
          ...variant,
          colors: variant.colors.filter(c => c.id !== colorId)
        };
      }
      return variant;
    }));
  };

  const handleColorImageUpload = (variantId: string, colorId: number, files: FileList) => {
    setVariants(variants.map(variant => {
      if (variant.id === variantId) {
        return {
          ...variant,
          colors: variant.colors.map(color => {
            if (color.id === colorId) {
              return {
                ...color,
                images: [...color.images, ...Array.from(files)]
              };
            }
            return color;
          })
        };
      }
      return variant;
    }));
  };

  const removeColorImage = (variantId: string, colorId: number, imageIndex: number) => {
    setVariants(variants.map(variant => {
      if (variant.id === variantId) {
        return {
          ...variant,
          colors: variant.colors.map(color => {
            if (color.id === colorId) {
              return {
                ...color,
                images: color.images.filter((_, idx) => idx !== imageIndex)
              };
            }
            return color;
          })
        };
      }
      return variant;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
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
            <div className={`md:col-span-2 space-y-6 ${activeTab === 'attributes' ? 'hidden md:block' : ''}`}>
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

            <div className={`space-y-6 ${activeTab === 'product' ? 'hidden md:block' : ''}`}>
              {/* Affichage des attributs - message par défaut quand aucune catégorie n'est sélectionnée */}
            
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Veuillez d'abord sélectionner une catégorie
                    </h3>
                    <p className="text-gray-500">
                      Les attributs disponibles s'afficheront ici en fonction de la catégorie de produit choisie.
                    </p>
                  </div>
                </div>
              

              {/* Attributs spécifiques pour vêtements/chaussures */}
              {needsSizeColorAttributes && selectedCategories.length > 0 && activeTab === 'attributes' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Gestion des tailles et couleurs</h2>
                    <p className="text-gray-600 text-sm">
                      Ajoutez les différentes tailles disponibles et leur prix, puis pour chaque taille, 
                      sélectionnez les couleurs disponibles avec des images.
                    </p>
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-md font-medium mb-3">Ajouter une taille</h3>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs text-gray-500 mb-1">Taille</label>
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          placeholder="Ex: M, XL, 42..."
                        />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs text-gray-500 mb-1">Prix (FCFA)</label>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          placeholder="Ex: 15000"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addSizeVariant}
                          className="h-[42px] px-4 py-2 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white rounded-lg hover:from-[#ed7e0f]/90 hover:to-orange-500"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>

                  {variants.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Tailles disponibles</h3>
                      
                      {variants.map((variant) => (
                        <div key={variant.id} className="border rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between bg-gray-50 p-3 border-b">
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-medium">{variant.size}</span>
                              <span className="px-3 py-1 bg-[#ed7e0f]/10 text-[#ed7e0f] rounded-full">
                                {variant.price.toLocaleString()} FCFA
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setExpandedSizeId(expandedSizeId === variant.id ? null : variant.id)}
                                className="p-1.5 hover:bg-gray-100 rounded-full"
                              >
                                {expandedSizeId === variant.id ? 
                                  <ChevronUp className="w-5 h-5" /> : 
                                  <ChevronDown className="w-5 h-5" />
                                }
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSizeVariant(variant.id)}
                                className="p-1.5 hover:bg-gray-100 text-red-500 rounded-full"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          {expandedSizeId === variant.id && (
                            <div className="p-4">
                              <h4 className="text-sm font-medium mb-3">Couleurs disponibles pour cette taille</h4>
                              
                              {variant.colors.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                  {variant.colors.map((color) => (
                                    <div key={color.id} className="border rounded-lg p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span 
                                            className="w-4 h-4 rounded-full border" 
                                            style={{ backgroundColor: color.hex }}
                                          />
                                          <span className="text-sm">{color.name}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeColorFromVariant(variant.id, color.id)}
                                          className="text-gray-400 hover:text-red-500"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                      
                                      <div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {color.images.map((image, imageIndex) => (
                                            <div key={imageIndex} className="relative group w-16 h-16">
                                              <img
                                                src={URL.createObjectURL(image)}
                                                alt={`${variant.size} ${color.name}`}
                                                className="w-full h-full object-cover rounded-md"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removeColorImage(variant.id, color.id, imageIndex)}
                                                className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ))}
                                          <label className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                            <input
                                              type="file"
                                              className="hidden"
                                              accept="image/*"
                                              multiple
                                              onChange={(e) => e.target.files && handleColorImageUpload(variant.id, color.id, e.target.files)}
                                            />
                                            <Plus className="w-5 h-5 text-gray-400" />
                                          </label>
                                        </div>
                                        {color.images.length === 0 && (
                                          <p className="text-xs text-red-500 mt-1">
                                            Ajoutez au moins une image pour cette couleur
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Ajouter des couleurs</h4>
                                <div className="flex flex-wrap gap-2">
                                  {availableColors
                                    .filter(color => !variant.colors.some(c => c.id === color.id))
                                    .map(color => (
                                      <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => addColorToVariant(variant.id, color.id, color.name, color.hex)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                                      >
                                        <span 
                                          className="w-3 h-3 rounded-full border" 
                                          style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="text-sm">{color.name}</span>
                                      </button>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                      <div className="mx-auto w-12 h-12 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Aucune taille ajoutée</h3>
                      <p className="text-gray-500">
                        Commencez par ajouter les tailles disponibles pour ce produit
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Message pour les produits sans attributs spécifiques */}
              {!needsSizeColorAttributes && selectedCategories.length > 0 && activeTab === 'attributes' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Ce type de produit ne nécessite pas d'attributs spécifiques
                    </h3>
                    <p className="text-gray-500">
                      Les attributs comme la taille et la couleur ne sont pas requis pour cette catégorie.
                      Vous pouvez continuer avec les informations de base du produit.
                    </p>
                  </div>
                </div>
              )}

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