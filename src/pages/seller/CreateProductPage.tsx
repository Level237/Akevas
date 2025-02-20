import React, { useState } from 'react';
import {
  Upload,
  Plus,

  X,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAddProductMutation } from '@/services/sellerService';
import { useGetCategoryByGenderQuery, useGetSubCategoriesQuery } from '@/services/guardService';
import { MultiSelect } from '@/components/ui/multiselect';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';

interface ProductAttribute {
  name: string;
  values: string[];
}

interface ProductVariant {
  id: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  sku: string;
  image: File | null;
}

const PREDEFINED_COLORS = [
  { name: 'Rouge', hex: '#FF0000' },
  { name: 'Bleu', hex: '#0000FF' },
  { name: 'Vert', hex: '#008000' },
  { name: 'Jaune', hex: '#FFFF00' },
  { name: 'Noir', hex: '#000000' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Violet', hex: '#800080' },
  { name: 'Rose', hex: '#FFC0CB' },
];

const PREDEFINED_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const CreateProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([
    { name: 'Couleur', values: [] },
    { name: 'Taille', values: [] },
    { name: 'Poids', values: [] }
  ]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [colorSearchTerm, setColorSearchTerm] = useState('');
  const [sizeSearchTerm, setSizeSearchTerm] = useState('');
  const [showColorSuggestions, setShowColorSuggestions] = useState(false);
  const [showSizeSuggestions, setShowSizeSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'product' | 'attributes'>('product');
  const [gender,setGender]=useState<number>(0)
  const [addProduct,{isLoading:isLoadingAddProduct}]=useAddProductMutation()
  const {data:categoriesByGender,isLoading:isLoadingCategoriesByGender}=useGetCategoryByGenderQuery(gender)
  const {data:subCategoriesByGender,isLoading:isLoadingSubCategoriesByParentId}=useGetSubCategoriesQuery(selectedCategories)
  const navigate=useNavigate()

  console.log(selectedSubCategories)
  // Liste des catégories disponibles


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

  const addAttributeValue = (attributeIndex: number, value: string) => {
    const newAttributes = [...attributes];
    if (!newAttributes[attributeIndex].values.includes(value)) {
      newAttributes[attributeIndex].values.push(value);
      setAttributes(newAttributes);
      generateVariants(newAttributes);
    }
  };

  const removeAttributeValue = (attributeIndex: number, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[attributeIndex].values = newAttributes[attributeIndex].values.filter(
      v => v !== value
    );
    setAttributes(newAttributes);
    generateVariants(newAttributes);
  };

  const generateVariants = (attrs: ProductAttribute[]) => {
    // Fonction pour générer toutes les combinaisons possibles d'attributs
    const generateCombinations = (arrays: string[][]): Record<string, string>[] => {
      if (arrays.length === 0) return [{}];
      
      const [first, ...rest] = arrays;
      const combinations = generateCombinations(rest);
      const attributeNames = attrs.map(attr => attr.name);
      
      return first.flatMap(item => 
        combinations.map(combo => ({
          ...combo,
          [attributeNames[arrays.length - 1]]: item
        }))
      );
    };

    // Ne prendre que les attributs qui ont des valeurs
    const activeAttrs = attrs.filter(attr => attr.values.length > 0);
    const combinations = generateCombinations(activeAttrs.map(attr => attr.values));

    // Créer les variants avec les combinaisons
    const newVariants = combinations.map((combo, index) => ({
      id: `variant-${index}`,
      attributes: combo,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      sku: `SKU-${index + 1}`,
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
    return PREDEFINED_COLORS.filter(color =>
      color.name.toLowerCase().includes(colorSearchTerm.toLowerCase()) &&
      !attributes[0].values.includes(color.name)
    );
  };

  const getFilteredSizes = () => {
    return PREDEFINED_SIZES.filter(size =>
      size.toLowerCase().includes(sizeSearchTerm.toLowerCase()) &&
      !attributes[1].values.includes(size)
    );
  };
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
   try {
    const formData = new FormData()
    formData.append('product_name', name);
    formData.append('product_price', price);
    formData.append('product_quantity', stock);
    formData.append('product_description', description);
    formData.append('product_gender', gender.toString());
    if (featuredImage) {
      formData.append('product_profile', featuredImage);
    }
    
    images.forEach(image => formData.append('images[]', image));
    selectedCategories.forEach(category => formData.append('categories[]', category.toString()));
    selectedSubCategories.forEach(subCategory => formData.append('sub_categories[]', subCategory.toString()));
    await addProduct(formData);

    navigate('/seller/products')
   }catch(error){
    console.log(error)
   }
  };

  const handleChangeGender = (value: string) => {
    setGender(Number(value))
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
                className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'product'
                  ? 'bg-white shadow-sm text-[#ed7e0f]'
                  : 'text-gray-600'
                }`}
              >
                Produit
              </button>
              <button
                onClick={() => setActiveTab('attributes')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'attributes'
                  ? 'bg-white shadow-sm text-[#ed7e0f]'
                  : 'text-gray-600'
                }`}
              >
                Attributs
              </button>
            </div>
          </div>

          <div  className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    placeholder="Prix (€)"
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
                { gender !==0 && (
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
                  {attributes.map((attribute, attrIndex) => (
                    <div key={attribute.name}>
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
                          <span key={value} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                            {attribute.name === 'Couleur' && (
                              <span 
                                className="w-3 h-3 rounded-full mr-1.5"
                                style={{ 
                                  backgroundColor: PREDEFINED_COLORS.find(c => c.name === value)?.hex || value 
                                }}
                              />
                            )}
                            {value}
                            <button
                              type="button"
                              onClick={() => removeAttributeValue(attrIndex, value)}
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
                          value={attribute.name === 'Couleur' ? colorSearchTerm : attribute.name === 'Taille' ? sizeSearchTerm : ''}
                          onChange={(e) => {
                            if (attribute.name === 'Couleur') {
                              setColorSearchTerm(e.target.value);
                              setShowColorSuggestions(true);
                            } else if (attribute.name === 'Taille') {
                              setSizeSearchTerm(e.target.value);
                              setShowSizeSuggestions(true);
                            }
                          }}
                          onFocus={() => {
                            if (attribute.name === 'Couleur') setShowColorSuggestions(true);
                            if (attribute.name === 'Taille') setShowSizeSuggestions(true);
                          }}
                        />
                        
                        {/* Suggestions pour les couleurs */}
                        {attribute.name === 'Couleur' && showColorSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {getFilteredColors().map((color) => (
                              <button
                                key={color.name}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
                                onClick={() => {
                                  addAttributeValue(attrIndex, color.name);
                                  setColorSearchTerm('');
                                  setShowColorSuggestions(false);
                                }}
                              >
                                <span 
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: color.hex }}
                                />
                                {color.name}
                              </button>
                            ))}
                            {colorSearchTerm && !getFilteredColors().some(c => c.name.toLowerCase() === colorSearchTerm.toLowerCase()) && (
                              <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-[#ed7e0f]"
                                onClick={() => {
                                  addAttributeValue(attrIndex, colorSearchTerm);
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
                                key={size}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                                onClick={() => {
                                  addAttributeValue(attrIndex, size);
                                  setSizeSearchTerm('');
                                  setShowSizeSuggestions(false);
                                }}
                              >
                                {size}
                              </button>
                            ))}
                            {sizeSearchTerm && !getFilteredSizes().some(s => s.toLowerCase() === sizeSearchTerm.toLowerCase()) && (
                              <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-[#ed7e0f]"
                                onClick={() => {
                                  addAttributeValue(attrIndex, sizeSearchTerm.toUpperCase());
                                  setSizeSearchTerm('');
                                  setShowSizeSuggestions(false);
                                }}
                              >
                                + Créer "{sizeSearchTerm.toUpperCase()}"
                              </button>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                          onClick={() => {
                            if (attribute.name === 'Couleur' && colorSearchTerm) {
                              addAttributeValue(attrIndex, colorSearchTerm);
                              setColorSearchTerm('');
                            } else if (attribute.name === 'Taille' && sizeSearchTerm) {
                              addAttributeValue(attrIndex, sizeSearchTerm.toUpperCase());
                              setSizeSearchTerm('');
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
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(variant.attributes).map(([key, value]) => (
                            <span key={key} className="text-sm text-gray-600">
                              {key}: <strong>{value}</strong>
                            </span>
                          ))}
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
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Référence SKU</label>
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = variants.map((v) =>
                                  v.id === variant.id ? { ...v, sku: e.target.value } : v
                                );
                                setVariants(newVariants);
                              }}
                              className="w-full px-3 py-1.5 text-sm border rounded-lg"
                              placeholder="REF-001"
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
                                  alt={`Variante ${variant.sku}`}
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