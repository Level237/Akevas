import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Plus,
  Minus,
  X,
  Save,
  AlertCircle,
  ChevronRight,
  Layout,
  Box,
  Image as ImageIcon,
  Tag,
  Settings,
  Star
} from 'lucide-react';

interface ColorOption {
  name: string;
  hex: string;
}

const availableColors: ColorOption[] = [
  { name: 'Rouge', hex: '#EF4444' },
  { name: 'Bleu', hex: '#3B82F6' },
  { name: 'Vert', hex: '#10B981' },
  { name: 'Jaune', hex: '#F59E0B' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Rose', hex: '#EC4899' },
  { name: 'Gris', hex: '#6B7280' },
  { name: 'Noir', hex: '#1F2937' },
  { name: 'Blanc', hex: '#F9FAFB' }
];

interface ProductAttribute {
  name: string;
  type: 'color' | 'text' | 'number';
  values: string[];
}

const CreateProductPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    compareAtPrice: '',
    cost: '',
    sku: '',
    barcode: '',
    weight: '',
    attributes: [
      { name: 'Couleur', type: 'color', values: [] },
      { name: 'Taille', type: 'text', values: [] },
      { name: 'Matériau', type: 'text', values: [] }
    ] as ProductAttribute[],
    stock: '',
    taxable: true,
    status: 'draft'
  });

  const steps = [
    {
      id: 1,
      name: 'Informations',
      icon: Layout,
      description: 'Informations de base du produit'
    },
    {
      id: 2,
      name: 'Images',
      icon: ImageIcon,
      description: 'Photos et médias'
    },
    {
      id: 3,
      name: 'Prix',
      icon: Tag,
      description: 'Prix et inventaire'
    },
    {
      id: 4,
      name: 'Variantes',
      icon: Settings,
      description: 'Options et variantes'
    }
  ];

  const handleColorSelect = (color: ColorOption) => {
    if (selectedColors.find(c => c.hex === color.hex)) {
      setSelectedColors(selectedColors.filter(c => c.hex !== color.hex));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (mainImage === index) {
      setMainImage(0);
    }
  };

  const setAsMainImage = (index: number) => {
    setMainImage(index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Créer un produit</h1>
          <p className="text-gray-600 mt-1">
            Ajoutez un nouveau produit à votre catalogue
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={`${
                    stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                  } relative`}
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                        step.id === currentStep
                          ? 'bg-[#ed7e0f] text-white'
                          : step.id < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <step.icon className="h-6 w-6" />
                    </button>
                    {stepIdx !== steps.length - 1 && (
                      <div
                        className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform ${
                          step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">{step.name}</span>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm">
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">
                Informations du produit
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du produit
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="vetements">Vêtements</option>
                    <option value="chaussures">Chaussures</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Images du produit</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      index === mainImage ? 'border-[#ed7e0f]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAsMainImage(index)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#ed7e0f] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    Ajouter une image
                  </span>
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
          )}

          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Prix et inventaire</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de vente
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix barré
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        name="compareAtPrice"
                        value={formData.compareAtPrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coût par unité
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code-barres
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Options et variantes</h2>

              <div className="space-y-8">
                {/* Sélecteur de couleurs */}
                <div>
                  <h3 className="font-medium mb-4">Couleurs disponibles</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {availableColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleColorSelect(color)}
                        className={`group relative h-20 w-full rounded-lg border-2 ${
                          selectedColors.find(c => c.hex === color.hex)
                            ? 'border-[#ed7e0f]'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <span
                          className="absolute inset-2 rounded"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Autres attributs */}
                {formData.attributes
                  .filter(attr => attr.type !== 'color')
                  .map((attribute, index) => (
                    <div key={attribute.name}>
                      <h3 className="font-medium mb-4">{attribute.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {attribute.values.map((value) => (
                          <span
                            key={value}
                            className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                          >
                            {value}
                            <button
                              onClick={() => {
                                const newAttributes = [...formData.attributes];
                                newAttributes[index].values = newAttributes[
                                  index
                                ].values.filter((v) => v !== value);
                                setFormData({
                                  ...formData,
                                  attributes: newAttributes
                                });
                              }}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder={`Ajouter ${attribute.name.toLowerCase()}`}
                          className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              if (input.value) {
                                const newAttributes = [...formData.attributes];
                                if (!newAttributes[index].values.includes(input.value)) {
                                  newAttributes[index].values.push(input.value);
                                  setFormData({
                                    ...formData,
                                    attributes: newAttributes
                                  });
                                }
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className={`px-6 py-2 rounded-lg border ${
                currentStep === 1
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              disabled={currentStep === 1}
            >
              Précédent
            </button>
            <button
              onClick={() =>
                currentStep === steps.length
                  ? console.log('Submit form', formData)
                  : setCurrentStep(currentStep + 1)
              }
              className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors"
            >
              {currentStep === steps.length ? 'Créer le produit' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
