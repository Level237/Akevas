import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Plus,
  Minus,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/ui/header';

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
}

const CreateProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([
    { name: 'Couleur', values: [] },
    { name: 'Taille', values: [] },
    { name: 'Poids', values: [] }
  ]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Catégories disponibles
  const categories = [
    'Vêtements',
    'Chaussures',
    'Accessoires',
    'Électronique',
    'Maison',
    'Sport',
    'Beauté'
  ];

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
      sku: `SKU-${index + 1}`
    }));

    setVariants(newVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implémenter la logique de soumission
    console.log({
      name,
      description,
      category,
      images,
      attributes,
      variants
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un produit</h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations ci-dessous pour créer un nouveau produit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Informations générales
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  placeholder="ex: T-shirt Premium Coton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  placeholder="Décrivez votre produit en détail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Images du produit</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#ed7e0f] transition-colors">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Ajouter</span>
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

          {/* Attributs et variants */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Attributs et variantes
            </h2>

            <div className="space-y-6">
              {attributes.map((attribute, attrIndex) => (
                <div key={attribute.name} className="border-b pb-6 last:border-0">
                  <h3 className="font-medium mb-4">{attribute.name}</h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {attribute.values.map((value) => (
                      <div
                        key={value}
                        className="flex items-center bg-gray-100 rounded-lg px-3 py-1"
                      >
                        <span className="text-sm">{value}</span>
                        <button
                          type="button"
                          onClick={() => removeAttributeValue(attrIndex, value)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Ajouter ${attribute.name.toLowerCase()}`}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          addAttributeValue(attrIndex, input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      onClick={() => {
                        const input = document.querySelector(`input[placeholder="Ajouter ${attribute.name.toLowerCase()}"]`) as HTMLInputElement;
                        if (input.value) {
                          addAttributeValue(attrIndex, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Liste des variants */}
            {variants.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Variantes du produit</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(variants[0].attributes).map((attr) => (
                          <th key={attr} className="py-2 px-4 text-left font-medium">
                            {attr}
                          </th>
                        ))}
                        <th className="py-2 px-4 text-left font-medium">Prix</th>
                        <th className="py-2 px-4 text-left font-medium">Stock</th>
                        <th className="py-2 px-4 text-left font-medium">SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => (
                        <tr key={variant.id} className="border-b last:border-0">
                          {Object.values(variant.attributes).map((value, i) => (
                            <td key={i} className="py-2 px-4">
                              {value}
                            </td>
                          ))}
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = variants.map((v) =>
                                  v.id === variant.id
                                    ? { ...v, price: Number(e.target.value) }
                                    : v
                                );
                                setVariants(newVariants);
                              }}
                              className="w-24 px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => {
                                const newVariants = variants.map((v) =>
                                  v.id === variant.id
                                    ? { ...v, stock: Number(e.target.value) }
                                    : v
                                );
                                setVariants(newVariants);
                              }}
                              className="w-24 px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = variants.map((v) =>
                                  v.id === variant.id
                                    ? { ...v, sku: e.target.value }
                                    : v
                                );
                                setVariants(newVariants);
                              }}
                              className="w-32 px-2 py-1 border rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Prix et stock par défaut */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Prix et stock par défaut
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
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
        </form>
      </main>
    </div>
  );
};

export default CreateProductPage;