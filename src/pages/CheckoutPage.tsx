import React, { useEffect, useState } from 'react';
import orange from "@/assets/orange.jpeg"
import momo from "@/assets/momo.jpeg"
import {

  Shield,
  Loader2,
} from 'lucide-react';
import Header from '@/components/ui/header';
import { ScrollRestoration } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetUserQuery } from '@/services/auth';
import { useGetQuartersQuery } from '@/services/guardService';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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

const TAX_RATE = 0.05; // 19% de TVA (à ajuster selon vos besoins)

const CheckoutPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cm.orange');
  const [quarter, setQuarter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState<string>('');
  
  const params = new URLSearchParams(window.location.search);
  const s = params.get('s');
  const variations=params.get('variation');
  const residence = params.get('residence');
  const totalPrice = params.get('price');
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  const { data: userDataAuth } = useGetUserQuery('Auth');
  const [phone, setPhone] = useState<string>(userDataAuth?.phone_number);
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const price = params.get('price');
  const name = params.get('name');
  
  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');

  const filteredQuarters = quarters?.quarters.filter((quarter: { town_name: string }) => quarter.town_name === residence);

  console.log(variations)
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    deliveryOption: 'pickup'
  });

  // Mock cart items
  useEffect(()=>{
    
    setPhone(userDataAuth?.phone_number);
  },)
  console.log(JSON.parse(variations || '{}'))
  // Mock data pour la démonstration
  const productLocation = s == "1" ? cartItems[0].product.residence : residence;
  const deliveryFees = {
    pickup: 0,
    localDelivery: 1500,
    remotePickup: 2500,
    remoteDelivery: 3500
  };
  
  
  const otherLocation = productLocation === "Yaoundé" ? "Douala" : "Yaoundé";
  const filterOtherLocation=quarters?.quarters.filter((quarter: { town_name: string }) => quarter.town_name === otherLocation);
  const getDeliveryFee = () => {
    return deliveryFees[address.deliveryOption];
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parseInt(item.product.product_price) * item.quantity, 0);
  const shipping = getDeliveryFee();
  const total = s == "1" ? subtotal + shipping : parseInt(totalPrice || '0') + shipping;
  const totalWithTax = total * (1 + TAX_RATE); // Calculate total with tax
  const totalQuantity=cartItems.reduce((sum, item) => sum + parseInt(item.quantity.toString()), 0);
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

  const confirmPayment = async() => {
    let productsPayments;
    const formData=new FormData();
    setIsLoading(true);
    if (s === '1') {
      productsPayments = cartItems.map(item => ({
        product_id: item.product.id,
        attributeVariationId: item.selectedVariation?.attributes?.[0]?.id ?? null,
        productVariationId: item.selectedVariation?.id ?? null,
        quantity: item.quantity,
        hasVariation:item.selectedVariation ? true : false,
        price: item.product.product_price,
        name: item.product.product_name
      }));

      formData.append("s","1");
      if(quarter){
        formData.append("quarter",quarter);
      }
      if(totalQuantity){
          formData.append("quantity",totalQuantity.toString());
      }
     
     
      
      sessionStorage.setItem("paymentMethod",selectedPayment);
      sessionStorage.setItem("paymentPhone", paymentPhone);
      sessionStorage.setItem("phone",phone)
      formData.append("amount",totalWithTax.toString()); // Use total with tax
      formData.append('productsPayments', JSON.stringify(productsPayments))
      
      formData.append("address",totalWithTax.toString()); // Use total with tax
      formData.append("phone",phone);
      formData.append("address",address.address);
      formData.append("shipping",shipping.toString());
      formData.append("paymentMethod",selectedPayment);
      formData.append("paymentPhone", paymentPhone);

      let formDataObject:any = {};
        for (const [key, value] of formData.entries()) {
          formDataObject[key] = value;
        }
        
        sessionStorage.setItem("formDataPayment",JSON.stringify(formDataObject));
        window.location.href = "/pay/mobile-money";
    }else if (s === '0') {
      
        if(productId){
          formData.append("productId",productId);
        }
        if(quantity){
          formData.append("quantity",quantity);
        }
        if(name){
          formData.append("name",name);
        }
        if(price){
          formData.append("price",price);
        }
        if(totalWithTax){ // Use total with tax
          formData.append("amount",totalWithTax.toString());
        }
        if(variations){
          formData.append('hasVariation','true');
          formData.append("variations",variations);
        }else{
          formData.append('hasVariation','false');
        }
        formData.append("s","0");
        if(quarter){
          formData.append("quarter",quarter);
        }
        formData.append("phone",phone);
        formData.append("address",address.address);
        formData.append("shipping",shipping.toString());
        formData.append("paymentMethod",selectedPayment);
        formData.append("paymentPhone", paymentPhone);
        let formDataObject:any = {};
        for (const [key, value] of formData.entries()) {
          formDataObject[key] = value;
        }
        
        sessionStorage.setItem("formDataPayment",JSON.stringify(formDataObject));
        window.location.href = "/pay/mobile-money";
    }
    setIsLoading(true);
    
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
                  <label htmlFor="remotePickup" className=''>
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
                  <label htmlFor="remoteDelivery" className="">
                    Expédition et livraison à domicile dans la ville de {otherLocation} (3 500 XAF)
                  </label>
                </div>
              </div>

              {address.deliveryOption === 'localDelivery' && (
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
                        filteredQuarters?.map((quarter: { id: string, quarter_name: string }) => (
                          <SelectItem key={quarter.id} value={quarter.quarter_name}>
                            {quarter.quarter_name}
                          </SelectItem>
                        ))
                      )}
                      {filteredQuarters?.length === 0 && (
                        <SelectItem value="no-quarters">Aucun quartier trouvé,veuillez verifier votre ville</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                </>

              )}
{
                address.deliveryOption === "remoteDelivery" && (
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
                        filterOtherLocation?.map((quarter: { id: string, quarter_name: string }) => (
                          <SelectItem key={quarter.id} value={quarter.quarter_name}>
                            {quarter.quarter_name}
                          </SelectItem>
                        ))
                      )}
                      {filterOtherLocation?.length === 0 && (
                        <SelectItem value="no-quarters">Aucun quartier trouvé,veuillez verifier votre ville</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                )
              }
              {
                (address.deliveryOption === "remoteDelivery" || address.deliveryOption === "localDelivery") && (
                  <div className="col-span-2 mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison (mentionnez les details de votre adresse de livraison)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={address.address}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                  />
                </div>
                )
              }
              
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
                    onChange={(e:any)=>setPhone(e.target.value)}
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
                {s == "1" && cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img
                      src={item.product.product_profile}
                      alt={item.product.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
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
                          {item.selectedVariation.attributes?.[0] && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Taille:</span>
                              <span className="text-xs text-gray-700">
                                {item.selectedVariation.attributes[0].value}
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
                          (item.selectedVariation?.attributes?.[0]?.price
                            ? parseFloat(item.selectedVariation.attributes[0].price)
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
                        const price = item.selectedVariation?.attributes?.[0]?.price 
                          ? parseFloat(item.selectedVariation.attributes[0].price)
                          : parseFloat(item.product.product_price);
                        return sum + (price * item.quantity);
                      }, 0).toFixed(2)
                      : parseInt(totalPrice || '0').toFixed(2)
                    } Fcfa
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-medium text-green-600">{shipping.toFixed(2)} Fcfa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TVA</span>
                  <span className="font-medium">
                    {s == "1" ? 
                      (cartItems.reduce((sum, item) => {
                        const price = item.selectedVariation?.attributes?.[0]?.price 
                          ? parseFloat(item.selectedVariation.attributes[0].price)
                          : parseFloat(item.product.product_price);
                        return sum + (price * item.quantity);
                      }, 0) * TAX_RATE).toFixed(2)
                      : (parseInt(totalPrice || '0') * TAX_RATE).toFixed(2)
                    } Fcfa
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total (TTC)</span>
                    <span className="text-lg font-bold">
                      {totalWithTax.toFixed(2)} Fcfa
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handlePayment}
                disabled={!paymentPhone.trim()}
              className={`w-full mt-6 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                !paymentPhone.trim() 
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
                  <p>TVA: {totalWithTax.toFixed(2)} FCFA</p>
                </div>
                <div>
                  <p className="font-medium">Montant total: {totalWithTax.toFixed(2)} FCFA</p>
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

