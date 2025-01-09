import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, X, Plus, Minus, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import shoes from "../../assets/shoes1.webp"
interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'weight';
  value: string;
  inStock: boolean;
  price?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  storeCode: string;
  category: string;
  tags: string[];
  variants: {
    colors?: ProductVariant[];
    sizes?: ProductVariant[];
    weights?: ProductVariant[];
  };
  isPremium: boolean;
}

// Mock data
const premiumProducts: Product[] = [
  {
    id: '1',
    name: 'Figurine Collector Demon Slayer',
    description: 'Figurine collector édition limitée de Tanjiro Kamado en pose de combat.',
    price: 129.99,
    originalPrice: 159.99,
    images: [shoes, shoes],
    rating: 4.8,
    reviewCount: 128,
    storeCode: 'JP_STORE_8472',
    category: 'Figurines',
    tags: ['Premium', 'Collector', 'Demon Slayer'],
    variants: {
      sizes: [
        { id: 's1', name: '18cm', type: 'size', value: '18cm', inStock: true },
        { id: 's2', name: '24cm', type: 'size', value: '24cm', inStock: true, price: 149.99 },
      ]
    },
    isPremium: true
  },
  {
    id: '1',
    name: 'Figurine Collector Demon Slayer',
    description: 'Figurine collector édition limitée de Tanjiro Kamado en pose de combat.',
    price: 129.99,
    originalPrice: 159.99,
    images: [shoes, shoes],
    rating: 4.8,
    reviewCount: 128,
    storeCode: 'JP_STORE_8472',
    category: 'Figurines',
    tags: ['Premium', 'Collector', 'Demon Slayer'],
    variants: {
      sizes: [
        { id: 's1', name: '18cm', type: 'size', value: '18cm', inStock: true },
        { id: 's2', name: '24cm', type: 'size', value: '24cm', inStock: true, price: 149.99 },
      ]
    },
    isPremium: true
  },
  {
    id: '1',
    name: 'Figurine Collector Demon Slayer',
    description: 'Figurine collector édition limitée de Tanjiro Kamado en pose de combat.',
    price: 129.99,
    originalPrice: 159.99,
    images: [shoes, shoes],
    rating: 4.8,
    reviewCount: 128,
    storeCode: 'JP_STORE_8472',
    category: 'Figurines',
    tags: ['Premium', 'Collector', 'Demon Slayer'],
    variants: {
      sizes: [
        { id: 's1', name: '18cm', type: 'size', value: '18cm', inStock: true },
        { id: 's2', name: '24cm', type: 'size', value: '24cm', inStock: true, price: 149.99 },
      ]
    },
    isPremium: true
  },
  {
    id: '1',
    name: 'Figurine Collector Demon Slayer',
    description: 'Figurine collector édition limitée de Tanjiro Kamado en pose de combat.',
    price: 129.99,
    originalPrice: 159.99,
    images: [shoes, shoes],
    rating: 4.8,
    reviewCount: 128,
    storeCode: 'JP_STORE_8472',
    category: 'Figurines',
    tags: ['Premium', 'Collector', 'Demon Slayer'],
    variants: {
      sizes: [
        { id: 's1', name: '18cm', type: 'size', value: '18cm', inStock: true },
        { id: 's2', name: '24cm', type: 'size', value: '24cm', inStock: true, price: 149.99 },
      ]
    },
    isPremium: true
  },
  // Ajoutez plus de produits ici
];

const ProductModal: React.FC<{
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Implémentez la logique d'ajout au panier
    console.log('Adding to cart:', {
      product,
      variants: selectedVariants,
      quantity
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
            
            <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-hidden"
                 onClick={e => e.stopPropagation()}>
              <div className="relative grid grid-cols-2 gap-8">
                {/* Images */}
                <div className="p-6">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, idx) => (
                      <button
                        key={idx}
                        className={`aspect-square rounded-lg overflow-hidden border-2 
                          ${selectedImage === idx ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Détails */}
                <div className="p-6 pr-8">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{product.category}</span>
                      <ChevronRight className="w-4 h-4" />
                      <span>Code: {product.storeCode}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                          {product.rating}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({product.reviewCount} avis)
                        </span>
                      </div>
                      {product.isPremium && (
                        <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price} €
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {product.originalPrice} €
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {product.description}
                    </p>
                  </div>

                  {/* Variants */}
                  {Object.entries(product.variants).map(([type, variants]) => (
                    <div key={type} className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {variants.map(variant => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariants(prev => ({
                              ...prev,
                              [type]: variant.id
                            }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium
                              ${selectedVariants[type] === variant.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }
                              ${!variant.inStock && 'opacity-50 cursor-not-allowed'}
                            `}
                            disabled={!variant.inStock}
                          >
                            {variant.name}
                            {variant.price && ` (+${variant.price - product.price}€)`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Quantité et ajout au panier */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PremiumProducts: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Produits Premium
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits premium, choisis pour leur qualité exceptionnelle 
            et leur authenticité.
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="p-2 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  {product.isPremium && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                        Premium
                      </span>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Code: {product.storeCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {product.price} €
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {product.originalPrice} €
                        </span>
                      )}
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct!}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default PremiumProducts;
