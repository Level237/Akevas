import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, X, ArrowLeft, Truck, Shield, CreditCard, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/ui/header';
import AsyncLink from '@/components/ui/AsyncLink';
import MobileNav from '@/components/ui/mobile-nav';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { removeItem, updateQuantity } from '@/store/cartSlice';
import { Product } from '@/types/products';
import { redirectToLogin } from '@/lib/redirectToLogin';
const CartPage: React.FC = () => {
  // Mock data - À remplacer par l'état réel du panier
  const token = useSelector((state: RootState) => state.auth.usedToken)






  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice)
  const dispatch = useDispatch<AppDispatch>()

  const handleRemoveItem = (product: Product) => {
    dispatch(removeItem({ product }))
  }
  const handleUpdateQuantity = (product: Product, quantity: number) => {
    dispatch(updateQuantity({ product, quantity }))
  }
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      <Header />
      <MobileNav />
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

        {cartItems.length === 0 ? (
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
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-6 pb-6 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-24 h-24">
                        <img
                          src={item.product.product_profile}
                          alt={item.product.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.product.product_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Ville: {item.product.residence}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.product)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>



                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg max-sm:w-20">
                            <button
                              onClick={() => handleUpdateQuantity(item.product, Math.max(0, item.quantity - 1))}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-medium max-sm:text-sm text-gray-900">
                            {(parseInt(item.product.product_price) * item.quantity).toFixed(2)} Fcfa
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
                    <span className="font-medium">{totalPrice.toFixed(2)} FCFA</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-lg font-bold">{totalPrice.toFixed(2)} FCFA</span>
                    </div>
                  </div>
                </div>
                {token ? <AsyncLink to="/checkout" >
                  <button className="w-full mt-6 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
                    Procéder au paiement
                  </button>
                </AsyncLink> :
                  <button onClick={() => redirectToLogin({ redirectUrl: '/checkout', productIds: cartItems.map(item => item.product.id), provideIsCard: "1" })} className="w-full mt-6 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
                    Procéder au paiement
                  </button>
                }
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
