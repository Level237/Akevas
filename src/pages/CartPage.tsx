import React, { useState, useEffect } from 'react';
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
import { useCheckAuthQuery } from '@/services/auth';
import OptimizedImage from '@/components/OptimizedImage';
const CartPage: React.FC = () => {
  // Mock data - À remplacer par l'état réel du panier
  const { data } = useCheckAuthQuery()
  const hasToken = data?.isAuthenticated

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
      if (hasToken) {
          setIsAuthenticated(true)
      }
  }, [hasToken])




  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice)
  const dispatch = useDispatch<AppDispatch>()

  const handleRemoveItem = (product: Product, selectedVariation?: any) => {
    dispatch(removeItem({ 
      product,
      selectedVariation: selectedVariation || undefined
    }));
  }
  const handleUpdateQuantity = (product: Product, quantity: number, selectedVariation?: any) => {
    dispatch(updateQuantity({ 
      product, 
      quantity,
      selectedVariation: selectedVariation || undefined
    }));
  }
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  //console.log(cartItems[0].selectedVariation.images[0])
  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      <div className="max-sm:ml-0">
      <Header />
      </div>
     
      <MobileNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 max-sm:mb-3">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 max-sm:w-4 max-sm:h-4 h-5 mr-2" />
            <span className='max-sm:text-sm'>Retour aux achats</span>
            
          </Link>
        </div>

        <h1 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <ShoppingCart className="w-16 max-sm:w-12 text-[#ed7e0f] h-16 mx-auto mb-4" />
            <h2 className="text-2xl max-sm:text-xl font-medium text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-500 mb-8 max-sm:text-sm">
              Découvrez nos produits et commencez vos achats
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#ed7e0f] max-sm:text-sm text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
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
                  {cartItems.map((item:any) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-6 pb-6 border-b last:border-0 last:pb-0"
                    >
                      <div className="w-24 h-24">
                        {item.selectedVariation ? (
                          <OptimizedImage
                            src={item.selectedVariation.images[0]}
                            alt={item.product.product_name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ):(
                          <OptimizedImage
                          src={item.product.product_profile}
                          alt={item.product.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        )}
                      
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="font-medium max-sm:text-sm text-gray-900">
                              {item.product.product_name}
                            </h3>
                            {item.selectedVariation && (
                              <div className="mt-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">Couleur:</span>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-200"
                                      style={{ backgroundColor: item.selectedVariation.color.hex }}
                                    />
                                    <span className="text-sm text-gray-700">
                                      {item.selectedVariation.color.name}
                                    </span>
                                  </div>
                                </div>
                                {item.selectedVariation.attributes && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Taille:</span>
                                    <span className="text-sm text-gray-700">
                                      {item.selectedVariation.attributes.value}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-sm text-gray-500">
                              Ville: {item.product.residence}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.product, item.selectedVariation)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>



                        <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-1 items-center justify-between">
                          <div className="flex items-center border rounded-lg max-sm:w-20">
                            <button
                              onClick={() => handleUpdateQuantity(item.product, item.quantity - 1, item.selectedVariation)}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product, item.quantity + 1, item.selectedVariation)}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-medium max-sm:text-sm text-gray-900">
                            
                            {item.selectedVariation && item.selectedVariation.isColorOnly===true &&
                             parseFloat(item.selectedVariation?.price) * item.quantity
                          }
                          {item.selectedVariation && item.selectedVariation.isColorOnly===false &&
                             parseFloat(item.selectedVariation?.attributes.price) * item.quantity
                          }
                          {!item.selectedVariation && parseFloat(item.product.product_price) * item.quantity}
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
                      <h3 className="font-medium max-sm:text-md text-gray-900">
                        Livraison rapide
                      </h3>
                      <p className="text-sm  text-gray-500">
                        Pour toute commande
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-[#ed7e0f]" />
                    <div>
                      <h3 className="font-medium max-sm:text-md text-gray-900">
                        Garantie premium
                      </h3>
                      <p className="text-sm  text-gray-500">
                        30 jours satisfait ou remboursé
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-[#ed7e0f]" />
                    <div>
                      <h3 className="font-medium max-sm:text-md text-gray-900">
                        Paiement sécurisé
                      </h3>
                      <p className="text-sm  text-gray-500">
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
                <h2 className="text-lg font-medium max-sm:text-md text-gray-900 mb-6">
                  Résumé de la commande
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 max-sm:text-sm">Sous-total</span>
                    <span className="font-medium max-sm:text-sm">{totalPrice.toFixed(2)} FCFA</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-lg font-bold">{totalPrice.toFixed(2)} FCFA</span>
                    </div>
                  </div>
                </div>
                {isAuthenticated ? <AsyncLink to="/checkout?s=1" >
                  <button className="w-full max-sm:text-sm mt-6 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
                    Procéder au paiement
                  </button>
                </AsyncLink> :
                  <button  onClick={() => redirectToLogin({ redirectUrl: '/checkout', productIds: cartItems.map(item => item.product.id), s: "1" })} className="w-full max-sm:text-sm mt-6 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
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
