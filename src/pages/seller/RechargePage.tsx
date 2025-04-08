import { motion } from 'framer-motion';
import { Coins, CreditCard, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

const creditPackages = [
  { id: 1, credits: 100, price: 29.99, popular: false },
  { id: 2, credits: 250, price: 59.99, popular: true },
  { id: 3, credits: 500, price: 99.99, popular: false },
  { id: 4, credits: 1000, price: 179.99, popular: false },
];

export default function RechargePage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(2);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rechargez votre compte
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez le forfait qui correspond à vos besoins
          </p>
        </motion.div>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Zap,
              title: "Paiement instantané",
              description: "Crédits disponibles immédiatement après paiement"
            },
            {
              icon: Shield,
              title: "100% Sécurisé",
              description: "Vos transactions sont protégées et cryptées"
            },
            {
              icon: CreditCard,
              title: "Paiement flexible",
              description: "Plusieurs moyens de paiement acceptés"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#ed7e0f]/10 rounded-xl">
                  <feature.icon className="w-6 h-6 text-[#ed7e0f]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Forfaits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pkg.id * 0.1 }}
              className={`relative bg-white rounded-2xl p-6 ${
                selectedPackage === pkg.id
                  ? 'ring-2 ring-[#ed7e0f]'
                  : 'hover:shadow-lg'
              } transition-all duration-300 cursor-pointer`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#ed7e0f] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Plus populaire
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-[#ed7e0f]" />
              </div>

              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.credits} crédits
                </div>
                <div className="text-3xl font-bold text-[#ed7e0f]">
                  {pkg.price}€
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  selectedPackage === pkg.id
                    ? 'bg-[#ed7e0f] text-white'
                    : 'bg-[#ed7e0f]/10 text-[#ed7e0f] hover:bg-[#ed7e0f]/20'
                }`}
              >
                Sélectionner
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bouton de paiement */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <button className="bg-[#ed7e0f] text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#d97100] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
              Procéder au paiement
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 