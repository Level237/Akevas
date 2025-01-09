import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, X, ArrowLeft, Truck, Shield, CreditCard, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/ui/header';
import type { CartItem } from '@/components/cart/CartModal';
import shoes from "../assets/shoes1.webp"
import { useRef } from 'react';
import AsyncLink from '@/components/ui/AsyncLink';

const CartPage: React.FC = () => {
  // Mock data - À remplacer par l'état réel du panier
  const loadingBarRef = useRef(null);
  const [items, setItems] = React.useState<CartItem[]>([
    {
      id: '1',
      name: 'Figurine Collector Demon Slayer',
      price: 129.99,
      quantity: 2,
      image: shoes,
      storeCode: 'JP_STORE_8472',
      variants: {
        size: '24cm'
      }
    },
    // Ajoutez plus d'items
  ]);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setItems(items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Gratuit pour cet exemple
  const total = subtotal + shipping;

  const goTo=()=>{

  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux achats
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        {items.length === 0 ? (
          <div className="text-center">
            <ShoppingCart className="w-16 text-[#ed7e0f] h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-500 mb-8">
              Découvrez nos produits et commencez vos achats
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
            >
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Liste des produits */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-6 pb-6 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-24 h-24">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Code: {item.storeCode}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {item.variants && (
                          <div className="text-sm text-gray-500 mb-4">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-medium text-gray-900">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Truck className="w-8 h-8 text-[#ed7e0f]" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Livraison gratuite
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pour toute commande
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-[#ed7e0f]" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Garantie premium
                      </h3>
                      <p className="text-sm text-gray-500">
                        30 jours satisfait ou remboursé
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-[#ed7e0f]" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Paiement sécurisé
                      </h3>
                      <p className="text-sm text-gray-500">
                        Par carte ou PayPal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Résumé de la commande
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sous-total</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Livraison</span>
                    <span className="font-medium text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-lg font-bold">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
                  <AsyncLink to='/checkout'>
                <button   className="w-full mt-6 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
                  Procéder au paiement
                </button>
                </AsyncLink>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Paiement 100% sécurisé
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
