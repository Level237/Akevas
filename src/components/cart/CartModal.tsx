import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeCode: string;
  variants?: {
    size?: string;
    color?: string;
    weight?: string;
  };
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Mon Panier</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-4">Votre panier est vide</p>
                <Link
                  to="/products"
                  className="text-[#ed7e0f] hover:text-[#ed7e0f]/80 font-medium"
                  onClick={onClose}
                >
                  Continuer mes achats
                </Link>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 bg-white rounded-lg p-4 border"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Code: {item.storeCode}
                          </p>
                          {item.variants && (
                            <div className="text-sm text-gray-500 mb-2">
                              {Object.entries(item.variants).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="p-1 text-gray-600 hover:text-gray-900"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-600 hover:text-gray-900"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="font-medium text-gray-900">
                              {(item.price * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-white p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {total.toFixed(2)} €
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/cart"
                      onClick={onClose}
                      className="block w-full bg-[#ed7e0f] text-white px-4 py-3 rounded-xl font-medium text-center hover:bg-[#ed7e0f]/80 transition-colors"
                    >
                      Voir mon panier
                    </Link>
                    <button
                      onClick={onClose}
                      className="block w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
