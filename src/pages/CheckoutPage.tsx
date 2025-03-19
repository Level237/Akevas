import React, { useState } from 'react';
import {
  Truck,
  Shield,
} from 'lucide-react';
import card from '@/assets/visa.png';
import Header from '@/components/ui/header';
import { ScrollRestoration } from 'react-router-dom';
import { getProductIdsFromUrl } from '@/lib/getProductIdFromUrl';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetUserQuery, useInitProductPaymentMutation } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useGetQuartersQuery } from '@/services/guardService';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import notchpay from '@/assets/notchpay.png';
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
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');
  const [quarter, setQuarter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const s = params.get('s');
  const residence = params.get('residence');
  const totalPrice = params.get('price');
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)

  const { data: userDataAuth } = useGetUserQuery('Auth');
  const productIds = getProductIdsFromUrl();
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const price = params.get('price');
  const name = params.get('name');

  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');

  const [initPayment] = useInitProductPaymentMutation();
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

  // Mock cart items


  // Mock data pour la démonstration
  const productLocation = s == "1" ? cartItems[0].product.residence : residence;
  const deliveryFees = {
    pickup: 0,
    localDelivery: 1500,
    remotePickup: 2500,
    remoteDelivery: 3500
  };
  console.log(userDataAuth)
  const isLocalOrder = userDataAuth?.residence?.toLowerCase() === productLocation?.toLowerCase();

  const getDeliveryFee = () => {
    return deliveryFees[address.deliveryOption];
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parseInt(item.product.product_price) * item.quantity, 0);
  const shipping = getDeliveryFee();
  const total = s == "1" ? subtotal + shipping : parseInt(totalPrice || '0') + shipping;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handlePayment = () => {
    if (address.deliveryOption === 'localDelivery' && quarter === '') {
      alert('Veuillez choisir un quartier de livraison');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmPayment = async() => {
    let productsPayments;
    setIsLoading(true);
    if (s === '1' && selectedPayment === "card") {
      productsPayments = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.product_price,
        name: item.product.product_name
      }));
      sessionStorage.setItem('productsPayments', JSON.stringify(productsPayments));
      sessionStorage.setItem('total', total.toString());
      sessionStorage.setItem('shipping', shipping.toString());
      sessionStorage.setItem('paymentMethod', selectedPayment);
    }else if (s === '0') {
      const formData=new FormData();
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
        if(total){
          formData.append("total",total.toString());
        }
        if(quarter){
          formData.append("quarter",quarter);
        }
        formData.append("shipping",shipping.toString());
        formData.append("paymentMethod",selectedPayment);
      const response = await initPayment(formData);
      
      if(response.data.status === "Accepted"){
        
        window.location.href = response.data.authorization_url;
        setIsLoading(false);
      }else{
        setIsLoading(false);
        alert("Une erreur est survenue lors de l'initialisation du paiement");
      }
    }
    //setIsLoading(true);
    //setTimeout(() => {
      //setIsLoading(false);
      //if (s === '1') {
        //navigate(`/payment?s=1&method=${selectedPayment}&total=${total}&shipping=${shipping}&productIds=${productIds}&quarter=${quarter}`);
      //} else {
        //navigate(`/payment?s=0&method=${selectedPayment}&total=${total}&shipping=${shipping}&productId=${productId}&quantity=${quantity}&name=${name}&price=${price}&quarter=${quarter}`);
      //}
    //}, 1000);
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
                    onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'localDelivery' }))}
                    className="mr-2"
                    
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
                    onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'remotePickup' }))}
                    className="mr-2"
                    
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
                    onChange={() => setAddress(prev => ({ ...prev, deliveryOption: 'remoteDelivery' }))}
                    className="mr-2"
                    
                  />
                  <label htmlFor="remoteDelivery" className={`${isLocalOrder ? 'text-gray-400' : ''}`}>
                    Expédition et livraison à domicile (3 500 XAF)
                  </label>
                </div>
              </div>

              {address.deliveryOption === 'localDelivery' && (
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
                    value={userDataAuth?.phone_number}
                    disabled={!!userDataAuth?.phone_number}
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
                    src={notchpay}
                    alt="Orange Money"
                    className="h-12 object-contain mb-4"
                  />
                  <h3 className="font-medium text-center">NotchPay Payment </h3>
                  <p className="text-sm text-gray-500 text-center">Orange Money/MTN Mobile Money</p>
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
                  <span className="font-medium">{s == "1" ? subtotal.toFixed(2) : parseInt(totalPrice || '0').toFixed(2)} Fcfa</span>
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
                {isLoading ? 'Traitement...' : 'Payer maintenant'}
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

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              </div>

              <div className="border-b pb-2">
                <p className="font-medium">Mode de paiement</p>
                <p>{selectedPayment === 'card' ? 'Carte bancaire' :
                    selectedPayment === 'orange' ? 'NotchPay Payment' :
                    'Mobile Money'
                }</p>
              </div>

              <div>
                <p className="font-medium">Montant total: {total} FCFA</p>
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
                {isLoading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

