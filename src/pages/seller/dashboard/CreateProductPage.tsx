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
  Star,
  Trash2
} from 'lucide-react';

interface ProductImage {
  id: string;
  file: File;
  preview: string;
  attributes: ProductAttribute[];
}

interface ProductAttribute {
  name: string;
  type: 'color' | 'text' | 'number';
  value: string;
}

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

const CreateProductPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);
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
    stock: '',
    taxable: true,
    status: 'draft'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        attributes: [
          { name: 'Couleur', type: 'color' as const, value: '' },
          { name: 'Taille', type: 'text' as const, value: '' },
          { name: 'Stock', type: 'number' as const, value: '' }
        ]
      }));
      setProductImages([...productImages, ...newImages]);
      if (!mainImageId && newImages.length > 0) {
        setMainImageId(newImages[0].id);
      }
    }
  };

  const removeImage = (imageId: string) => {
    setProductImages(productImages.filter(img => img.id !== imageId));
    if (mainImageId === imageId) {
      setMainImageId(productImages[0]?.id || null);
    }
  };

  const setAsMainImage = (imageId: string) => {
    setMainImageId(imageId);
  };

  const updateImageAttribute = (imageId: string, attributeName: string, value: string) => {
    setProductImages(productImages.map(img => 
      img.id === imageId
        ? {
            ...img,
            attributes: img.attributes.map(attr =>
              attr.name === attributeName ? { ...attr, value } : attr
            )
          }
        : img
    ));
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

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            {/* Basic Information */}
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

              {/* Images Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Images et Variantes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productImages.map((image) => (
                    <div
                      key={image.id}
                      className={`border rounded-xl p-4 ${
                        mainImageId === image.id ? 'border-[#ed7e0f]' : 'border-gray-200'
                      }`}
                    >
                      <div className="relative aspect-square mb-4">
                        <img
                          src={image.preview}
                          alt="Product"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => setAsMainImage(image.id)}
                            className={`p-2 rounded-full ${
                              mainImageId === image.id
                                ? 'bg-[#ed7e0f] text-white'
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeImage(image.id)}
                            className="p-2 rounded-full bg-white text-gray-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Attributes for this image */}
                      <div className="space-y-3">
                        {image.attributes.map((attr, index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {attr.name}
                            </label>
                            {attr.type === 'color' ? (
                              <div className="grid grid-cols-3 gap-2">
                                {availableColors.map((color) => (
                                  <button
                                    key={color.hex}
                                    onClick={() => updateImageAttribute(image.id, attr.name, color.hex)}
                                    className={`w-full aspect-square rounded-lg border-2 ${
                                      attr.value === color.hex
                                        ? 'border-[#ed7e0f]'
                                        : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <input
                                type={attr.type}
                                value={attr.value}
                                onChange={(e) => updateImageAttribute(image.id, attr.name, e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                                placeholder={`Entrer ${attr.name.toLowerCase()}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Upload Button */}
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#ed7e0f] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
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

              {/* Pricing Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Prix et Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de vente
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        FCFA
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix barré
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        FCFA
                      </span>
                      <input
                        type="number"
                        name="compareAtPrice"
                        value={formData.compareAtPrice}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock total
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
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t flex justify-between">
            <button
              type="button"
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors"
            >
              Créer le produit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
