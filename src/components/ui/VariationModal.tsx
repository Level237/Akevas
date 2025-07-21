import React, { useState, useEffect } from 'react';
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
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  // Initialiser la première variation quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && product?.variations && product.variations.length > 0 && !selectedVariant) {
      const firstVariation = product.variations[0];
      setSelectedVariant(firstVariation);
      setSelectedColor(firstVariation.color.id.toString());
      // Si la variation a des attributs, sélectionner le premier
      if (firstVariation.attributes && firstVariation.attributes.length > 0) {
        setSelectedSize(firstVariation.attributes[0].value);
      }
    }
  }, [isOpen, product, selectedVariant]);

  // Fonction pour obtenir les attributs de la couleur sélectionnée
  const getAttributesForSelectedColor = () => {
    if (!selectedVariant) return [];
    return selectedVariant.attributes || [];
  };

  // Fonction pour obtenir le prix actuel
  const getCurrentPrice = () => {
    if (!selectedVariant) return product.product_price;
    
    if (selectedSize && selectedVariant.attributes) {
      const selectedAttribute = selectedVariant.attributes.find((attr: any) => attr.value === selectedSize);
      return selectedAttribute ? selectedAttribute.price : selectedVariant.price || product.product_price;
    }
    
    return selectedVariant.price || product.product_price;
  };

  // Fonction pour obtenir la quantité actuelle
  const getCurrentQuantity = () => {
    if (!selectedVariant) return product.product_quantity;

    if (selectedSize && selectedVariant.attributes) {
      const selectedAttribute = selectedVariant.attributes.find((attr: any) => attr.value === selectedSize);
      return selectedAttribute ? selectedAttribute.quantity : selectedVariant.quantity || product.product_quantity;
    }
    
    return selectedVariant.quantity || product.product_quantity;
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    setSelectedSize(null); // Réinitialiser la taille
    
    // Trouver la variation correspondante
    const variation = product.variations?.find((v: any) => v.color.id.toString() === colorId);
    if (variation) {
      setSelectedVariant(variation);
      // Si la variation a des attributs, sélectionner le premier
      if (variation.attributes && variation.attributes.length > 0) {
        setSelectedSize(variation.attributes[0].value);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    // Créer la variation avec l'attribut sélectionné si applicable
    let modifiedSelectedVariant = selectedVariant;
    if (selectedSize && selectedVariant.attributes) {
      const foundAttribute = selectedVariant.attributes.find((attr: any) => attr.value === selectedSize);
      if (foundAttribute) {
        modifiedSelectedVariant = {
          ...selectedVariant,
          attributes: foundAttribute // Remplacer l'array par l'objet unique
        };
      }
    }

    onAddToCart(modifiedSelectedVariant);
    onClose();
  };

  const currentAttributes = getAttributesForSelectedColor();
  const currentPrice = getCurrentPrice();
  const currentQuantity = getCurrentQuantity();

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
                  src={selectedVariant?.images?.[0] || product.product_profile}
                  alt={product.product_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {product.product_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {currentPrice} Fcfa
                </p>
                {currentQuantity > 0 ? (
                  <p className="text-xs text-green-600 mt-1">En stock ({currentQuantity})</p>
                ) : (
                  <p className="text-xs text-red-600 mt-1">Rupture de stock</p>
                )}
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
              <div className="space-y-6">
                {/* Sélection de la couleur */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Couleur</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.variations?.map((variation: any) => (
                      <button
                        key={variation.color.id}
                        onClick={() => handleColorSelect(variation.color.id.toString())}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === variation.color.id.toString()
                            ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: variation.color.hex }}
                        title={variation.color.name}
                      />
                    ))}
                  </div>
                  {selectedVariant && (
                    <p className="text-sm text-gray-600 mt-2">
                      Couleur sélectionnée: <span className="font-medium">{selectedVariant.color.name}</span>
                    </p>
                  )}
                </div>

                {/* Sélection de la taille (seulement si la couleur sélectionnée a des attributs) */}
                {currentAttributes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Taille</h4>
                    <div className="flex gap-2 flex-wrap">
                      {currentAttributes.map((attr: any) => (
                        <button
                          key={attr.id}
                          onClick={() => setSelectedSize(attr.value)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selectedSize === attr.value
                              ? 'border-[#ed7e0f] bg-[#ed7e0f] text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {attr.value}
                        </button>
                      ))}
                    </div>
                    {selectedSize && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Prix pour cette taille:</span>
                          <span className="font-bold text-[#ed7e0f]">
                            {currentAttributes.find((attr: any) => attr.value === selectedSize)?.price} FCFA
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-600">Stock:</span>
                          <span className={`font-medium ${currentAttributes.find((attr: any) => attr.value === selectedSize)?.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {currentAttributes.find((attr: any) => attr.value === selectedSize)?.quantity || 0} unités
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Informations de la variation sélectionnée */}
                {selectedVariant && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: selectedVariant.color.hex }}
                      />
                      <h5 className="font-medium text-gray-900">
                        {selectedVariant.color.name}
                        {selectedSize && ` - Taille ${selectedSize}`}
                      </h5>
                    </div>
                    <div className="text-sm text-gray-600">
                      Prix: <span className="font-bold text-[#ed7e0f]">{currentPrice} FCFA</span>
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
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedColor || (currentAttributes.length > 0 && !selectedSize) || currentQuantity <= 0}
                  className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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