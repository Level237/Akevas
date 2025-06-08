import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '@/types/products';

interface VariationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (variation: any) => void;
}

const VariationModal: React.FC<VariationModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  console.log(product)
  const handleAddToCart = () => {
    if (!product.variations) return;

    const selectedVariation = product.variations.find(
      (v:any) => v.color.id.toString() === selectedColor
    );
    
    if (selectedVariation) {
      onAddToCart(selectedVariation);
      
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* En-tête avec image et nom du produit */}
            <div className="flex gap-4 p-4 border-b">
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={product.product_profile}
                  alt={product.product_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {product.product_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.product_price} Fcfa
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu du modal avec scroll si nécessaire */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Sélection de la couleur */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Couleur</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.variations?.map((variation:any) => (
                      <button
                        key={variation.color.id}
                        onClick={() => setSelectedColor(variation.color.id.toString())}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === variation.color.id.toString()
                            ? 'border-[#ed7e0f]'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: variation.color.hex }}
                        title={variation.color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sélection de la taille (si disponible) */}
                {product.variations?.[0]?.attributes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Taille</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.variations[0].attributes.map((attr:any) => (
                        <button
                          key={attr.id}
                          onClick={() => setSelectedSize(attr.value)}
                          className={`px-3 py-1 rounded-md border ${
                            selectedSize === attr.value
                              ? 'border-[#ed7e0f] bg-[#ed7e0f] text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {attr.value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pied du modal avec les boutons */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedColor}
                  className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 disabled:opacity-50"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VariationModal; 