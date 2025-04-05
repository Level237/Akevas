import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  useEffect(() => {
    // Récupérer les informations du vendeur connecté
    // fetchSellerInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-8">Finaliser votre boost</h1>
          
          {/* Résumé de la commande */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Résumé de votre sélection</h2>
            <div className="space-y-4">
              {/* Afficher les détails du plan sélectionné */}
            </div>
          </div>

          {/* Informations du vendeur */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
            {sellerInfo && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input 
                    type="text" 
                    value={sellerInfo.name}
                    readOnly
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 p-3"
                  />
                </div>
                {/* Autres champs d'information */}
              </div>
            )}
          </div>

          {/* Boutique à booster */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Boutique à booster</h2>
            {/* Afficher les informations de la boutique */}
          </div>

          {/* Bouton de paiement */}
          <button className="w-full bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
            Procéder au paiement
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage; 