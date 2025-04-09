import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard,  CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CheckoutRechargePage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('creditCard');
  const [credits, setCredits] = useState<number>(250); // Exemple de crédits sélectionnés
  const [price, setPrice] = useState<number>(59.99); // Exemple de prix total

  const paymentMethods = [
    { id: 'creditCard', name: 'Carte de Crédit', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
    { id: 'bank', name: 'Virement Bancaire', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-8 mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Résumé de la commande</h1>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-700">Crédits :</span>
            <span className="text-lg font-medium text-gray-900">{credits} crédits</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-700">Total :</span>
            <span className="text-lg font-bold text-[#ed7e0f]">{price.toFixed(2)}€</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Méthode de paiement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? 'border-[#ed7e0f] bg-[#ed7e0f]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <method.icon className="w-6 h-6 text-[#ed7e0f]" />
                  <span className="text-lg font-medium text-gray-900">{method.name}</span>
                </div>
                {selectedPaymentMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-[#ed7e0f]" />
                )}
              </div>
            ))}
          </div>

          {selectedPaymentMethod === 'creditCard' && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Numéro de carte"
                className="w-full"
              />
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="MM/AA"
                  className="w-1/2"
                />
                <Input
                  type="text"
                  placeholder="CVC"
                  className="w-1/2"
                />
              </div>
              <Input
                type="text"
                placeholder="Nom sur la carte"
                className="w-full"
              />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-[#ed7e0f] hover:bg-[#d97100] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Confirmer et Payer
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 