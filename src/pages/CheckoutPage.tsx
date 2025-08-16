import React, { useEffect, useState } from 'react';
import orange from "@/assets/orange.jpeg"
import momo from "@/assets/momo.jpeg"
import {

  Shield,
  Loader2,
} from 'lucide-react';
import Header from '@/components/ui/header';
import { ScrollRestoration } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useGetUserQuery } from '@/services/auth';
import { useGetQuartersQuery } from '@/services/guardService';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { removeItem } from '@/store/cartSlice';


type PaymentMethod = 'card' | 'cm.orange' | 'cm.mtn';
type DeliveryOption = 'pickup' | 'localDelivery' | 'remotePickup' | 'remoteDelivery';

interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  deliveryOption: DeliveryOption;
}

const TAX_RATE = 0.05; // 5% de TVA

const CheckoutPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cm.orange');
  const [quarter, setQuarter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState<string>('');
  const [showModal, setShowModal] = useState(false)
  const params = new URLSearchParams(window.location.search);
  const s = params.get('s');
  const variations = params.get('variation');
  const residence = params.get('residence');
  const totalPrice = params.get('price');
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  const totalCartPrice = useSelector((state: RootState) => state.cart.totalPrice)
  const { data: userDataAuth } = useGetUserQuery('Auth');
  const [phone, setPhone] = useState<string>(userDataAuth?.phone_number);
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const price = params.get('price');
  const name = params.get('name');
  console.log(cartItems)
  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');

  const filteredQuarters = quarters?.quarters.filter((quarter: { town_name: string }) => quarter.town_name === residence);
  console.log(filteredQuarters)
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    deliveryOption: 'pickup'
  });

  const dispatch = useDispatch();

  // Mock cart items
  useEffect(() => {

    setPhone(userDataAuth?.phone_number);
  },)
  console.log(JSON.parse(variations || '{}'))
  // Mock data pour la démonstration
  const uniqueCities = Array.from(
    new Set(cartItems.map(item => item.product.residence || 'Ville inconnue'))
  );
  const [selectedCity, setSelectedCity] = useState<string>('');
  const productLocation =
    s === "1"
      ? (uniqueCities.length === 1
        ? uniqueCities[0]
        : selectedCity // si plusieurs villes, on prend celle choisie
      )
      : residence;
  const deliveryFees = {
    pickup: 0,
    localDelivery: 1500,
    remotePickup: 2500,
    remoteDelivery: 3500
  };


  const otherLocation = productLocation === "Yaoundé" ? "Douala" : "Yaoundé";
  const isMultiCity = s === "1" && uniqueCities.length > 1;
  const getDeliveryFee = () => {
    if (isMultiCity && address.deliveryOption === 'pickup') {
      return 1500;
    }
    return deliveryFees[address.deliveryOption];
  };

  const subtotal = totalCartPrice;
  const shipping = getDeliveryFee();
  console.log(shipping)
  const total = s == "1" ? subtotal + shipping : parseInt(totalPrice || '0') + shipping;
  console.log(totalPrice)
  const totalWithTax = s == "1" ? total + (total * TAX_RATE) : total + (parseInt(totalPrice || '0') * TAX_RATE); // Calculate total with tax
  const totalQuantity = cartItems.reduce((sum, item) => sum + parseInt(item.quantity.toString()), 0);
  console.log(totalQuantity)
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  console.log(selectedPayment)
  const handlePayment = () => {
    if (address.deliveryOption === 'localDelivery' && quarter === '') {
      alert('Veuillez choisir un quartier de livraison');
      return;
    }

    if (!paymentPhone) {
      alert('Veuillez entrer un numéro de téléphone pour le paiement');
      return;
    }

    setShowConfirmModal(true);
  };

  const getPrice = (item: any) => {
    if (item.selectedVariation?.attributes?.price) {
      return item.selectedVariation?.attributes?.price;
    }
    if (item.selectedVariation && item.selectedVariation.isColorOnly) {
      return item.selectedVariation?.price;
    }
    else {
      return item.product.product_price
    }
  }
  const confirmPayment = async () => {
    let productsPayments;
    const formData = new FormData();
    setIsLoading(true);
    if (s === '1') {
      productsPayments = cartItems.map(item => ({
        product_id: item.product.id,
        attributeVariationId: item.selectedVariation?.attributes?.id ?? null,
        productVariationId: item.selectedVariation?.id ?? null,
        quantity: item.quantity,
        hasVariation: item.selectedVariation ? true : false,
        price: getPrice(item),
        name: item.product.product_name,

      }));

      formData.append("s", "1");
      if (quarter) {
        formData.append("quarter", quarter);
      }
      if (totalQuantity) {
        formData.append("quantity", totalQuantity.toString());
      }
      let deliveryInfos;
      formData.append("isMultiCity", isMultiCity ? "true" : "false");
      if (isMultiCity) {
        deliveryInfos = shipping === 1500 ? `Récupérer en magasin de ${selectedCity}` : `Expédition et livraison à domicile dans la ville de ${selectedCity}`
        formData.append("delivery_info", deliveryInfos)
      }


      sessionStorage.setItem("paymentMethod", selectedPayment);
      sessionStorage.setItem("paymentPhone", paymentPhone);
      sessionStorage.setItem("phone", phone)
      formData.append("amount", Math.round(totalWithTax).toString()); // Use total with tax
      formData.append('productsPayments', JSON.stringify(productsPayments))

      //formData.append("address",totalWithTax.toString()); // Use total with tax
      formData.append("phone", phone);
      formData.append("address", address.address);
      formData.append("shipping", shipping.toString());
      formData.append("paymentMethod", selectedPayment);
      formData.append("paymentPhone", paymentPhone);

      let formDataObject: any = {};
      for (const [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }

      sessionStorage.setItem("formDataPayment", JSON.stringify(formDataObject));
      window.location.href = "/pay/mobile-money";
    } else if (s === '0') {

      if (productId) {
        formData.append("productId", productId);
      }
      if (quantity) {
        formData.append("quantity", quantity);
      }
      if (name) {
        formData.append("name", name);
      }
      if (price) {
        formData.append("price", price);
      }
      if (totalWithTax) { // Use total with tax
        formData.append("amount", totalWithTax.toString());
      }
      if (variations) {
        formData.append('hasVariation', 'true');
        formData.append("variations", variations);
      } else {
        formData.append('hasVariation', 'false');
      }
      formData.append("s", "0");
      if (quarter) {
        formData.append("quarter", quarter);
      }
      formData.append("phone", phone);
      formData.append("address", address.address);
      formData.append("shipping", shipping.toString());
      formData.append("paymentMethod", selectedPayment);
      formData.append("paymentPhone", paymentPhone);
      let formDataObject: any = {};
      for (const [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }

      sessionStorage.setItem("formDataPayment", JSON.stringify(formDataObject));
      window.location.href = "/pay/mobile-money";
    }
    setIsLoading(true);

  };

  // 1. Regrouper les produits par ville
  const productsByCity = cartItems.reduce((acc: any, item) => {
    const city = item.product.residence || 'Ville inconnue';
    if (!acc[city]) acc[city] = [];
    acc[city].push({
      id: item.product.id,
      name: item.product.product_name,
      image: item.product.product_profile,
      quantity: item.quantity,
    });
    return acc;
  }, {});

  // 2. Vérifier s'il y a plusieurs villes

  console.log('dd')
  console.log(isMultiCity)
  function handleRemoveFromCart(product: any, selectedVariation?: any) {
    dispatch(removeItem({
      product,
      selectedVariation: selectedVariation || undefined
    }));
  }



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
              {isMultiCity && (
                <div className="relative flex items-center gap-4 mb-6 px-5 py-4 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-100 shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 border border-red-200 mr-2">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="block text-base font-semibold text-red-700 mb-1">Attention</span>
                    <span className="block text-sm text-red-600">Les produits sélectionnés dans votre panier ne sont pas dans la même ville.</span>
                  </div>
                  <button
                    className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:from-red-600 hover:to-red-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={() => setShowModal(true)}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" />
                      </svg>
                      Voir
                    </span>
                  </button>
                </div>
              )}

              {/* Modal Produits par ville */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-0 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v6m0 0c-4.418 0-8-1.79-8-4V7a2 2 0 012-2h12a2 2 0 012 2v6c0 2.21-3.582 4-8 4z" />
                      </svg>
                      <h2 className="text-lg font-bold text-blue-700">Produits par ville</h2>
                      <button
                        className="ml-auto text-gray-400 hover:text-gray-700 text-2xl"
                        onClick={() => setShowModal(false)}
                        aria-label="Fermer"
                      >
                        &times;
                      </button>
                    </div>
                    {/* Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                      {Object.entries(productsByCity as any[]).map(([city, products]) => (
                        <div key={city} className="mb-8">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shadow">{city}</span>
                            <span className="text-xs text-gray-400">({products.length} produit{products.length > 1 ? 's' : ''})</span>
                          </div>
                          <div className="space-y-3">
                            {(products as any[]).map((product: any) => (
                              <div
                                key={product.id}
                                className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition group"
                              >
                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg border object-cover" />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 group-hover:text-blue-700 transition">{product.name}</div>
                                  <div className="text-xs text-gray-500">Qté: {product.quantity}</div>
                                </div>
                                <button
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition"
                                  onClick={() => handleRemoveFromCart(product, product.selectedVariation)}
                                >
                                  Supprimer
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end mt-2">
                        <button
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                          onClick={() => setShowModal(false)}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isMultiCity && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choisissez la ville de livraison :
                  </label>
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  >
                    <option value="">-- Sélectionnez une ville --</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {selectedCity === '' && (
                    <p className="text-xs text-red-500 mt-1">Veuillez choisir une ville pour la livraison.</p>
                  )}
                </div>
              )}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Localisation du produit : <span className="font-semibold">
                    {s === "1"
                      ? (uniqueCities.length === 1
                        ? uniqueCities[0]
                        : selectedCity
                      )
                      : residence}
                  </span>
                </p>
              </div>

              <div className={`space-y-4 mb-6 ${isMultiCity && !selectedCity ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                {/* Si tous les produits sont de la même ville, affiche les 4 options */}
                {!isMultiCity && (
                  <>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pickup"
                        name="deliveryOption"
                        value="pickup"
                        checked={address.deliveryOption === 'pickup'}
                        onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'pickup' }))}
                        className="mr-2"
                      />
                      <label htmlFor="pickup">
                        Récupérer en magasin de {productLocation} (0 XAF)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="localDelivery"
                        name="deliveryOption"
                        value="localDelivery"
                        checked={address.deliveryOption === 'localDelivery'}
                        onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'localDelivery' }))}
                        className="mr-2"
                      />
                      <label htmlFor="localDelivery">
                        Livraison à domicile {quarter} (1 500 XAF)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="remotePickup"
                        name="deliveryOption"
                        value="remotePickup"
                        checked={address.deliveryOption === 'remotePickup'}
                        onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'remotePickup' }))}
                        className="mr-2"
                      />
                      <label htmlFor="remotePickup">
                        Expédition au magasin Akevas de {otherLocation} (2 500 XAF)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="remoteDelivery"
                        name="deliveryOption"
                        value="remoteDelivery"
                        checked={address.deliveryOption === 'remoteDelivery'}
                        onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'remoteDelivery' }))}
                        className="mr-2"
                      />
                      <label htmlFor="remoteDelivery">
                        Expédition et livraison à domicile dans la ville de {otherLocation} (3 500 XAF)
                      </label>
                    </div>
                  </>
                )}

                {/* Si produits de villes différentes, affiche seulement les 2 options */}
                {isMultiCity && (
                  <>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pickup"
                        name="deliveryOption"
                        value="pickup"
                        checked={address.deliveryOption === 'pickup'}
                        onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'pickup' }))}
                        className="mr-2"
                        disabled={!selectedCity}
                      />
                      <label htmlFor="pickup">
                        Récupérer en magasin de {selectedCity} (1 500 XAF)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="remoteDelivery"
                        name="deliveryOption"
                        value="remoteDelivery"
                        checked={address.deliveryOption === 'remoteDelivery'}
                        onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'remoteDelivery' }))}
                        className="mr-2"
                        disabled={!selectedCity}
                      />
                      <label htmlFor="remoteDelivery">
                        Expédition et livraison à domicile dans la ville de {selectedCity} (3 500 XAF)
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Champ quartier et adresse pour Livraison à domicile */}
              {(address.deliveryOption === 'localDelivery' || address.deliveryOption === 'remoteDelivery') && (
                <>
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="street">Choisir un quartier de livraison</Label>
                    <Select
                      name="quarter"
                      value={quarter}
                      disabled={quartersLoading}
                      onValueChange={(value) => setQuarter(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un quartier" />
                      </SelectTrigger>
                      <SelectContent>
                        {quartersLoading ? (
                          <SelectItem value="loading">Chargement des quartiers...</SelectItem>
                        ) : (
                          quarters?.quarters
                            .filter((q: any) => {
                              if (address.deliveryOption === 'remoteDelivery') {
                                // Multi-ville : quartiers de la ville choisie
                                if (isMultiCity) return q.town_name === selectedCity;
                                // Mono-ville : quartiers de l'autre ville
                                return q.town_name === otherLocation;
                              }
                              // localDelivery : quartiers de la ville de résidence ou choisie
                              return q.town_name === (isMultiCity ? selectedCity : productLocation);
                            })
                            .map((quarter: any) => (
                              <SelectItem key={quarter.id} value={quarter.quarter_name}>
                                {quarter.quarter_name}
                              </SelectItem>
                            ))
                        )}
                        {quarters?.quarters.filter((q: any) => {
                          if (address.deliveryOption === 'remoteDelivery') {
                            if (isMultiCity) return q.town_name === selectedCity;
                            return q.town_name === otherLocation;
                          }
                          return q.town_name === (isMultiCity ? selectedCity : productLocation);
                        }).length === 0 && (
                            <SelectItem value="no-quarters">Aucun quartier trouvé, veuillez vérifier votre ville</SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse de livraison (mentionnez les détails de votre adresse de livraison)
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={address.address}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div className="space-y-4 mb-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom et prénom
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={userDataAuth?.userName || userDataAuth?.firstName}
                    disabled={!!userDataAuth?.userName || !!userDataAuth?.firstName}
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
                    value={userDataAuth?.residence}
                    disabled={!!userDataAuth?.residence}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={(e: any) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>
              </div>

            </div>

            {/* Méthodes de paiement */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Méthode de paiement</h2>
              <div className="mt-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone pour le paiement
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="Entrez le numéro associé à votre compte de paiement"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-[#ed7e0f] pl-10 transition-all duration-200 bg-white shadow-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPayment === 'cm.orange' ? 'Numéro Orange Money au format 6XXXXXXXX' : 'Numéro MTN Mobile Money au format 6XXXXXXXX'}
                </p>
              </div>
              <div className="flex items-center gap-6">
                {/* Carte bancaire */}
                <div
                  onClick={() => setSelectedPayment('cm.orange')}
                  className={`relative flex flex-col w-52 items-center p-6 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'cm.orange'
                    ? 'border-[#ed7e0f] bg-orange-50 '
                    : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <img
                    src={orange}
                    alt="Carte bancaire"
                    className="h-12 max-sm:h-8 object-contain mb-4"
                  />
                  <h3 className="font-medium max-sm:text-xs text-center">Orange money</h3>

                  {selectedPayment === 'cm.orange' && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-[#ed7e0f] rounded-full" />
                  )}
                </div>

                {/* Orange Money */}
                <div
                  onClick={() => setSelectedPayment('cm.mtn')}
                  className={`relative w-52 flex flex-col items-center p-6 border rounded-xl cursor-pointer transition-all ${selectedPayment === 'cm.mtn'
                    ? 'border-[#ed7e0f] bg-orange-50 scale-105'
                    : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <img
                    src={momo}
                    alt="Orange Money"
                    className="h-12 max-sm:h-8 object-contain mb-4"
                  />
                  <h3 className="font-medium max-sm:text-xs text-center">Momo Payment </h3>

                  {selectedPayment === 'cm.mtn' && (
                    <div className="absolute  top-2 right-2 w-4 h-4 bg-[#ed7e0f] rounded-full" />
                  )}
                </div>
              </div>

              {/* Champ de téléphone pour le paiement */}

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
                {s == "1" && cartItems.map((item: any) => (
                  <div key={item.product.id} className="flex gap-4">
                    {item.selectedVariation ? <img
                      src={item.selectedVariation?.images[0]}
                      alt={item.product.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    /> : <img
                      src={item.product.product_profile}
                      alt={item.product.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />}

                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.product.product_name}</h3>
                      {item.selectedVariation && (
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Couleur:</span>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: item.selectedVariation.color.hex }}
                              />
                              <span className="text-xs text-gray-700">
                                {item.selectedVariation.color.name}
                              </span>
                            </div>
                          </div>
                          {item.selectedVariation.attributes && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Taille:</span>
                              <span className="text-xs text-gray-700">
                                {item.selectedVariation.attributes.value}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        {(
                          (item.selectedVariation?.attributes?.price
                            ? parseFloat(item.selectedVariation.attributes.price)
                            : parseFloat(item.product.product_price)
                          ) * item.quantity
                        ).toFixed(2)} Fcfa
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-medium">
                    {s == "1" ?
                      cartItems.reduce((sum, item) => {
                        const price = item.selectedVariation?.attributes?.price
                          ? parseFloat(item.selectedVariation.attributes.price)
                          : parseFloat(item.product.product_price);
                        return sum + (price * item.quantity);
                      }, 0).toFixed(2)
                      : totalPrice || '0'
                    } Fcfa
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-medium text-green-600">{shipping} Fcfa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TVA</span>
                  <span className="font-medium">
                    {s == "1" ?
                      (total * TAX_RATE)
                      : (parseInt(totalPrice || '0') * TAX_RATE)
                    } Fcfa
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total (TTC)</span>
                    <span className="text-lg font-bold">
                      {totalWithTax} Fcfa
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handlePayment}
                disabled={paymentPhone.trim().length != 9 || (isMultiCity && !selectedCity)}
                className={`w-full mt-6 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${paymentPhone.trim().length != 9 || (isMultiCity && !selectedCity)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                  : 'bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/80'
                  }`}
              >
                {isLoading ? 'Traitement...' : 'Payer maintenant'}
              </button>

              {/* Informations supplémentaires */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {isLoading ? (
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ed7e0f] rounded-full animate-spin mb-6"></div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">Veuillez patienter</h3>
                <p className="text-gray-500 text-center">Votre paiement est en cours de vérification...</p>
                <div className="mt-4 flex gap-2 items-center text-[#ed7e0f]">
                  <span className="w-2 h-2 bg-[#ed7e0f] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-[#ed7e0f] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-[#ed7e0f] rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>

              <div className="space-y-4 mb-6">
                <div className="border-b pb-2">
                  <p className="font-medium">Informations client</p>
                  <p>Nom: {userDataAuth?.userName || userDataAuth?.firstName}</p>
                  <p>Téléphone: {userDataAuth?.phone_number}</p>
                  <p>Ville: {userDataAuth?.residence}</p>
                </div>

                <div className="border-b pb-2">
                  <p className="font-medium">Mode de livraison</p>
                  <p>{address.deliveryOption === 'pickup' ? 'Récupération en magasin' :
                    address.deliveryOption === 'localDelivery' ? `Livraison à ${quarter}` :
                      address.deliveryOption === 'remotePickup' ? 'Expédition au magasin' :
                        'Expédition et livraison à domicile'
                  }</p>
                  <p>Frais de livraison: {shipping} FCFA</p>
                  <p>TVA:  {s == "1" ?
                    (total * TAX_RATE).toFixed(2)
                    : (parseInt(totalPrice || '0') * TAX_RATE)
                  } Fcfa FCFA</p>
                </div>
                <div>
                  <p className="font-medium">Montant total:{totalWithTax} Fcfa FCFA</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmPayment}
                  className="flex-1 px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80"
                >
                  {isLoading ? <div className='flex items-center gap-2'><Loader2 className="w-4 h-4 animate-spin" /> Traitement...</div> : 'Confirmer'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

