import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Star,
  TrendingUp,
  Zap,
  Award,
  CreditCard,
  Phone
} from 'lucide-react';


interface BoostPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

const StoreBoostPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'orange' | 'momo'>('card');

  const plans: BoostPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      duration: '7 jours',
      features: [
        'Mise en avant dans les résultats de recherche',
        'Badge "Boutique en vedette"',
        'Analytics basiques',
        'Support par email'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
      duration: '30 jours',
      recommended: true,
      features: [
        'Tous les avantages Starter',
        'Placement premium dans les résultats',
        'Badge "Boutique Pro"',
        'Analytics avancés',
        'Support prioritaire',
        'Posts promotionnels hebdomadaires'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 99.99,
      duration: '90 jours',
      features: [
        'Tous les avantages Pro',
        'Placement #1 garanti',
        'Badge "Boutique Premium"',
        'Analytics en temps réel',
        'Support dédié 24/7',
        'Posts promotionnels quotidiens',
        'Accès aux événements exclusifs'
      ]
    }
  ];

  const handleBoost = () => {
    if (!selectedPlan) return;
    // Implémenter la logique de boost ici
    console.log('Boosting store with plan:', selectedPlan);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Boostez votre visibilité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Augmentez vos ventes en rendant votre boutique plus visible auprès de millions d'acheteurs potentiels
          </p>
        </div>

        {/* Plans de boost */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-2xl shadow-sm overflow-hidden ${
                plan.recommended ? 'ring-2 ring-[#ed7e0f]' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-[#ed7e0f] text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Recommandé
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">{plan.price} €</span>
                  <span className="text-gray-500 ml-2">/ {plan.duration}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#ed7e0f] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-[#ed7e0f] text-white'
                      : 'bg-orange-100 text-[#ed7e0f] hover:bg-[#ed7e0f] hover:text-white'
                  }`}
                >
                  Sélectionner
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section de paiement */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Méthode de paiement</h2>

            <div className="space-y-4 mb-6">
              {/* Carte bancaire */}
              <div
                onClick={() => setSelectedPayment('card')}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${
                  selectedPayment === 'card' ? 'border-[#ed7e0f] bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-[#ed7e0f]" />
                  <span>Carte bancaire</span>
                </div>
                <Check
                  className={`w-5 h-5 ${
                    selectedPayment === 'card' ? 'text-[#ed7e0f]' : 'invisible'
                  }`}
                />
              </div>

              {/* Orange Money */}
              <div
                onClick={() => setSelectedPayment('orange')}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${
                  selectedPayment === 'orange' ? 'border-[#ed7e0f] bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-[#ed7e0f]" />
                  <span>Orange Money</span>
                </div>
                <Check
                  className={`w-5 h-5 ${
                    selectedPayment === 'orange' ? 'text-[#ed7e0f]' : 'invisible'
                  }`}
                />
              </div>

              {/* Mobile Money */}
              <div
                onClick={() => setSelectedPayment('momo')}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${
                  selectedPayment === 'momo' ? 'border-[#ed7e0f] bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-[#ed7e0f]" />
                  <span>Mobile Money</span>
                </div>
                <Check
                  className={`w-5 h-5 ${
                    selectedPayment === 'momo' ? 'text-[#ed7e0f]' : 'invisible'
                  }`}
                />
              </div>
            </div>

            <button
              onClick={handleBoost}
              className="w-full bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
            >
              Booster ma boutique
            </button>
          </motion.div>
        )}

        {/* Avantages du boost */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Pourquoi booster votre boutique ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Visibilité accrue</h3>
              <p className="text-gray-600">
                Apparaissez en priorité dans les résultats de recherche
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Plus de ventes</h3>
              <p className="text-gray-600">
                Augmentez significativement vos conversions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Badge spécial</h3>
              <p className="text-gray-600">
                Démarquez-vous avec un badge distinctif
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Support prioritaire</h3>
              <p className="text-gray-600">
                Bénéficiez d'une assistance personnalisée
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreBoostPage;
