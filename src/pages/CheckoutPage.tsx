import React, { useState } from 'react';
import {
  CreditCard,
  Phone,
  ChevronRight,
  Truck,
  Shield,
} from 'lucide-react';
import card from '@/assets/visa.png';
import Header from '@/components/ui/header';
import { ScrollRestoration } from 'react-router-dom';
import { getProductIdsFromUrl } from '@/lib/getProductIdFromUrl';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetUserQuery } from '@/services/auth';

type PaymentMethod = 'card' | 'orange' | 'momo';
type DeliveryOption = 'pickup' | 'localDelivery' | 'remotePickup' | 'remoteDelivery';

interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  deliveryOption: DeliveryOption;
}

const CheckoutPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  const { data: userDataAuth } = useGetUserQuery('Auth');
  const productIds = getProductIdsFromUrl();
  console.log(productIds);
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    deliveryOption: 'pickup'
  });

  // Mock cart items


  // Mock data pour la démonstration
  const productLocation = cartItems[0].product.residence;
  const deliveryFees = {
    pickup: 0,
    localDelivery: 1500,
    remotePickup: 2500,
    remoteDelivery: 3500
  };
  console.log(userDataAuth)
  const isLocalOrder = userDataAuth?.residence?.toLowerCase() === productLocation.toLowerCase();

  const getDeliveryFee = () => {
    return deliveryFees[address.deliveryOption];
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parseInt(item.product.product_price) * item.quantity, 0);
  const shipping = getDeliveryFee();
  const total = subtotal + shipping;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    // Implémenter la logique de paiement ici
    console.log('Processing payment with', selectedPayment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-8">
            {/* Adresse de livraison */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Options de livraison</h2>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Localisation du produit: <span className="font-semibold">{productLocation}</span>
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="pickup"
                    name="deliveryOption"
                    value="pickup"
                    checked={address.deliveryOption === 'pickup'}
                    onChange={(e) => setAddress(prev => ({ ...prev, deliveryOption: 'pickup' }))}
                    className="mr-2"
                    disabled={!isLocalOrder}
                  />
                  <label htmlFor="pickup" className={`${!isLocalOrder ? 'text-gray-400' : ''}`}>
                    Récupérer en magasin (0 XAF)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="localDelivery"
                    name="deliveryOption"
                    value="localDelivery"
                    checked={address.deliveryOption === 'localDelivery'}
                    onChange={(e) => setAddress(prev => ({ ...prev, deliveryOption: 'localDelivery' }))}
                    className="mr-2"
                    disabled={!isLocalOrder}
                  />
                  <label htmlFor="localDelivery" className={`${!isLocalOrder ? 'text-gray-400' : ''}`}>
                    Livraison en ville (1 500 XAF)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="remotePickup"
                    name="deliveryOption"
                    value="remotePickup"
                    checked={address.deliveryOption === 'remotePickup'}
                    onChange={(e) => setAddress(prev => ({ ...prev, deliveryOption: 'remotePickup' }))}
                    className="mr-2"
                    disabled={isLocalOrder}
                  />
                  <label htmlFor="remotePickup" className={`${isLocalOrder ? 'text-gray-400' : ''}`}>
                    Expédition au magasin de votre ville (2 500 XAF)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="remoteDelivery"
                    name="deliveryOption"
                    value="remoteDelivery"
                    checked={address.deliveryOption === 'remoteDelivery'}
                    onChange={(e) => setAddress(prev => ({ ...prev, deliveryOption: 'remoteDelivery' }))}
                    className="mr-2"
                    disabled={isLocalOrder}
                  />
                  <label htmlFor="remoteDelivery" className={`${isLocalOrder ? 'text-gray-400' : ''}`}>
                    Expédition et livraison à domicile (3 500 XAF)
                  </label>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom et prénom
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={address.address}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Méthodes de paiement */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Méthode de paiement</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Carte bancaire */}
                <div
                  onClick={() => setSelectedPayment('card')}
                  className={`relative flex flex-col items-center p-6 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'card'
                    ? 'border-[#ed7e0f] bg-orange-50 scale-105'
                    : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <img
                    src={card}
                    alt="Carte bancaire"
                    className="h-12 object-contain mb-4"
                  />
                  <h3 className="font-medium text-center">Carte bancaire</h3>
                  <p className="text-sm text-gray-500 text-center">Visa, Mastercard</p>
                  {selectedPayment === 'card' && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-[#ed7e0f] rounded-full" />
                  )}
                </div>

                {/* Orange Money */}
                <div
                  onClick={() => setSelectedPayment('orange')}
                  className={`relative flex flex-col items-center p-6 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'orange'
                    ? 'border-[#ed7e0f] bg-orange-50 scale-105'
                    : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <img
                    src="/images/orange-money.png"
                    alt="Orange Money"
                    className="h-12 object-contain mb-4"
                  />
                  <h3 className="font-medium text-center">Orange Money</h3>
                  <p className="text-sm text-gray-500 text-center">Paiement mobile</p>
                  {selectedPayment === 'orange' && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-[#ed7e0f] rounded-full" />
                  )}
                </div>

                {/* Mobile Money */}
                <div
                  onClick={() => setSelectedPayment('momo')}
                  className={`relative flex flex-col items-center p-6 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'momo'
                    ? 'border-[#ed7e0f] bg-orange-50 scale-105'
                    : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <img
                    src="/images/mtn-momo.png"
                    alt="Mobile Money"
                    className="h-12 object-contain mb-4"
                  />
                  <h3 className="font-medium text-center">Mobile Money</h3>
                  <p className="text-sm text-gray-500 text-center">MTN, Moov</p>
                  {selectedPayment === 'momo' && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-[#ed7e0f] rounded-full" />
                  )}
                </div>
              </div>

              {/* Formulaire spécifique selon la méthode */}
              {selectedPayment === 'card' && (
                <div className="mt-6 p-4 border rounded-xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(selectedPayment === 'orange' || selectedPayment === 'momo') && (
                <div className="mt-6 p-4 border rounded-xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Résumé de la commande
              </h2>

              {/* Articles */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img
                      src={item.product.product_profile}
                      alt={item.product.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.product.product_name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        {(parseInt(item.product.product_price) * item.quantity).toFixed(2)} Fcfa
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-medium">{subtotal.toFixed(2)} Fcfa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-medium text-green-600">{shipping.toFixed(2)} Fcfa</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">{total.toFixed(2)} Fcfa</span>
                  </div>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handlePayment}
                className="w-full mt-6 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
              >
                Payer maintenant
              </button>

              {/* Informations supplémentaires */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck className="w-4 h-4" />
                  <span>Livraison gratuite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;

