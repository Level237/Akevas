import { useState } from 'react';
import {
  Upload,
  Plus,
  X,
  Save,
  AlertCircle
} from 'lucide-react';


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
      

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ed7e0f] to-orange-600 bg-clip-text text-transparent">
              Créer un produit
            </h1>
            <p className="text-gray-600 mt-2">
              Enrichissez votre catalogue avec un nouveau produit
            </p>
          </div>
          <div className="flex gap-3">
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

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="col-span-2 space-y-6">
            {/* Informations de base */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-2xl font-medium border-0 focus:ring-0"
                placeholder="Nom du produit"
              />
              
              <div className="flex gap-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                >
                  <option value="">Catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                  placeholder="Prix (€)"
                />

                <input
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="px-4 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
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

            {/* Photo mise en avant */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Photo mise en avant</h2>
              <div className="aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                {images[0] ? (
                  <div className="relative group h-full">
                    <img
                      src={URL.createObjectURL(images[0])}
                      alt="Featured product"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(0)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Ajouter une photo principale</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Galerie d'images */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Galerie d'images</h2>
              <div className="grid grid-cols-4 gap-4">
                {images.slice(1).map((image, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index + 1)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <label className="aspect-square rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-200">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Ajouter des photos</span>
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
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
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

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Ajouter ${attribute.name.toLowerCase()}`}
                        className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
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
                        className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Ajouter ${attribute.name.toLowerCase()}"]`) as HTMLInputElement;
                          if (input.value) {
                            addAttributeValue(attrIndex, input.value);
                            input.value = '';
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
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => {
                            const newVariants = variants.map((v) =>
                              v.id === variant.id ? { ...v, price: Number(e.target.value) } : v
                            );
                            setVariants(newVariants);
                          }}
                          className="px-3 py-1.5 text-sm border rounded-lg"
                          placeholder="Prix"
                        />
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => {
                            const newVariants = variants.map((v) =>
                              v.id === variant.id ? { ...v, stock: Number(e.target.value) } : v
                            );
                            setVariants(newVariants);
                          }}
                          className="px-3 py-1.5 text-sm border rounded-lg"
                          placeholder="Stock"
                        />
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => {
                            const newVariants = variants.map((v) =>
                              v.id === variant.id ? { ...v, sku: e.target.value } : v
                            );
                            setVariants(newVariants);
                          }}
                          className="px-3 py-1.5 text-sm border rounded-lg"
                          placeholder="SKU"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
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
                Publier
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProductPage;