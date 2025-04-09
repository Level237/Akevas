import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { 
  Store, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Shield, 
  Clock
} from 'lucide-react';
import notchPayLogo from '@/assets/notchpay.png'; // Assurez-vous d'ajouter le logo

interface CheckoutInfo {
  plan: {
    name: string;
    price: number;
    duration: string;
  };
  seller: {
    name: string;
    email: string;
    phone: string;
    store: {
      name: string;
      address: string;
    }
  };
}

const CheckoutBoostPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simuler la récupération des données
    // À remplacer par votre appel API
    setCheckoutInfo({
      plan: {
        name: 'Plan Pro',
        price: 29.99,
        duration: '30 jours'
      },
      seller: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+237 600000000',
        store: {
          name: 'Ma Super Boutique',
          address: 'Douala, Cameroun'
        }
      }
    });
  }, [planId]);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Intégrer ici la logique de paiement NotchPay
    try {
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Rediriger vers NotchPay
    } catch (error) {
      console.error('Erreur de paiement:', error);
    }
    setIsProcessing(false);
  };

  if (!checkoutInfo) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div 
        
        className="max-w-4xl mx-auto"
      >
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Finalisation de votre boost</h1>
          <p className="text-gray-600 mt-2">Sécurisez votre paiement avec NotchPay</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Détails de la commande */}
          <div className="md:col-span-7 space-y-6">
            {/* Résumé du plan */}
            <div 
            
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-[#ed7e0f]" />
                Résumé de votre boost
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Plan sélectionné</span>
                  <span className="font-medium">{checkoutInfo.plan.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Durée</span>
                  <span className="font-medium">{checkoutInfo.plan.duration}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Montant total</span>
                  <span className="text-2xl font-bold text-[#ed7e0f]">
                    {checkoutInfo.plan.price} €
                  </span>
                </div>
              </div>
            </div>

            {/* Informations du vendeur */}
            <div 
          
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#ed7e0f]" />
                Vos informations
              </h2>
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Boutique</p>
                    <p className="font-medium">{checkoutInfo.seller.store.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{checkoutInfo.seller.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{checkoutInfo.seller.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section paiement */}
          <div 
            
            className="md:col-span-5"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Paiement sécurisé</h2>
              
              {/* NotchPay Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 border-2 border-[#ed7e0f] rounded-xl bg-orange-50">
                  <div className="flex items-center gap-3">
                    <img 
                      src={notchPayLogo} 
                      alt="NotchPay" 
                      className="h-8 w-auto"
                    />
                    <span className="font-medium">NotchPay</span>
                  </div>
                  <Shield className="w-5 h-5 text-[#ed7e0f]" />
                </div>
              </div>

              {/* Informations de sécurité */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Transaction instantanée</span>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </div>
                ) : (
                  `Payer ${checkoutInfo.plan.price} €`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBoostPage; 