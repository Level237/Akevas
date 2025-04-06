import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Star,
  TrendingUp,
  Zap,
  Award,
  CreditCard,
  Phone,
  Store
} from 'lucide-react';
import { useCheckAuthQuery } from '@/services/auth';
import { useGetSubscriptionQuery } from '@/services/guardService';


interface BoostPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

const StoreBoostPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'orange' | 'momo'>('card'); // À connecter avec votre système d'auth
  const { data, isLoading } = useCheckAuthQuery()
  const {data:subscription,isLoading:isLoadingSubscription} = useGetSubscriptionQuery("guard")
  console.log(subscription)
  if (isLoading || isLoadingSubscription) {
    return <div>Loading...</div>
}
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

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    
    if (data?.isAuthenticated === true ) {
      // Redirection vers login avec les paramètres
      navigate(`/checkout?plan=${planId}`);
    }else{
      navigate(`/login?redirect=/checkout&plan=${planId}`);
      return;
    }

    // Redirection vers checkout si authentifié
   
  };

  const handleBoost = () => {
    if (!selectedPlan) return;
    // Implémenter la logique de boost ici
    console.log('Boosting store with plan:', selectedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section avec animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ed7e0f] to-orange-600">
            Boostez votre visibilité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Augmentez vos ventes en rendant votre boutique plus visible auprès de millions d'acheteurs potentiels
          </p>
        </motion.div>

        {/* Plans de boost avec nouveau design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {!isLoadingSubscription && subscription.map((plan:any, index:any) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.id===2 ? 'ring-2 ring-[#ed7e0f]' : ''
              }`}
            >
              {plan.id===2 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white px-6 py-2 text-sm font-medium rounded-full">
                  Recommandé
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {plan.subscription_name}
                </h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-[#ed7e0f]">{plan.subscription_price} XAF</span>
                  <span className="text-gray-500 ml-2">/ {plan.subscription_duration}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.descriptions.map((feature:any, index:any) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#ed7e0f] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature.description_name}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-300 
                    ${plan.recommended 
                      ? 'bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-orange-50 text-[#ed7e0f] hover:bg-[#ed7e0f] hover:text-white'
                    }`}
                >
                  Sélectionner ce plan
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
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
        </motion.div>
      </main>
    </div>
  );
};

export default StoreBoostPage;
