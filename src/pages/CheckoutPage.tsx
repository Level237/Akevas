import React, { useState } from 'react';
import {
  CreditCard,
  Phone,
  ChevronRight,
  Truck,
  Shield,
} from 'lucide-react';
import Header from '@/components/ui/header';
import shoes from "../assets/shoes1.webp";
import { ScrollRestoration } from 'react-router-dom';

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
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    deliveryOption: 'pickup'
  });

  // Mock cart items
  const cartItems = [
    {
      id: '1',
      name: 'Figurine Collector Demon Slayer',
      price: 129.99,
      quantity: 2,
      image: shoes,
      variants: { size: '24cm' }
    }
  ];

  // Mock data pour la démonstration
  const productLocation = "Abidjan";
  const deliveryFees = {
    pickup: 0,
    localDelivery: 1500,
    remotePickup: 2500,
    remoteDelivery: 3500
  };

  const isLocalOrder = address.city.toLowerCase() === productLocation.toLowerCase();

  const getDeliveryFee = () => {
    return deliveryFees[address.deliveryOption];
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

              <div className="space-y-4">
                {/* Carte bancaire */}
                <div
                  onClick={() => setSelectedPayment('card')}
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'card'
                    ? 'border-[#ed7e0f] bg-orange-50'
                    : 'hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-[#ed7e0f]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Carte bancaire</h3>
                      <p className="text-sm text-gray-500">
                        Visa, Mastercard, etc.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                {/* Orange Money */}
                <div
                  onClick={() => setSelectedPayment('orange')}
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'orange'
                    ? 'border-[#ed7e0f] bg-orange-50'
                    : 'hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#ed7e0f]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Orange Money</h3>
                      <p className="text-sm text-gray-500">
                        Paiement mobile Orange
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                {/* Mobile Money */}
                <div
                  onClick={() => setSelectedPayment('momo')}
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'momo'
                    ? 'border-[#ed7e0f] bg-orange-50'
                    : 'hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#ed7e0f]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mobile Money</h3>
                      <p className="text-sm text-gray-500">
                        MTN, Moov, etc.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
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
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
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
