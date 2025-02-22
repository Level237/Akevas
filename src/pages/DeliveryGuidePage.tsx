import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Bike,
  Clock,
  MapPin,
  Wallet,
  Shield,
  Package,
  PhoneCall
} from 'lucide-react';
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import AsyncLink from '@/components/ui/AsyncLink';
import MobileNav from '@/components/ui/mobile-nav';

const faqs = [
  {
    category: 'Démarrage',
    icon: Bike,
    color: '#FF6B6B',
    questions: [
      {
        question: 'Comment devenir livreur sur Akevas ?',
        answer: 'Pour devenir livreur, inscrivez-vous via "Devenir livreur". Fournissez vos documents (pièce d\'identité, permis de conduire, assurance), passez un entretien rapide, et suivez notre formation en ligne.'
      },
      {
        question: 'De quel équipement ai-je besoin ?',
        answer: 'Vous aurez besoin d\'un smartphone Android/iOS, d\'un moyen de transport (moto recommandée), d\'un sac de livraison isotherme et d\'un casque. Akevas fournit l\'uniforme officiel.'
      }
    ]
  },
  {
    category: 'Commandes',
    icon: Package,
    color: '#4ECDC4',
    questions: [
      {
        question: 'Comment fonctionnent les attributions de commandes ?',
        answer: 'Les commandes sont attribuées selon votre localisation, votre note et votre disponibilité. Vous recevez une notification et avez 30 secondes pour accepter la livraison.'
      },
      {
        question: 'Que faire en cas de problème lors d\'une livraison ?',
        answer: 'Utilisez le bouton "Support" dans l\'app pour contacter notre équipe 24/7. En cas d\'urgence, appelez notre hotline dédiée aux livreurs.'
      }
    ]
  },
  {
    category: 'Zones et Horaires',
    icon: MapPin,
    color: '#45B7D1',
    questions: [
      {
        question: 'Comment choisir ma zone de livraison ?',
        answer: 'Sélectionnez jusqu\'à 3 zones préférées dans l\'app. Vous recevrez en priorité les commandes de ces zones. Vous pouvez les modifier chaque semaine.'
      },
      {
        question: 'Quels sont les horaires de travail ?',
        answer: 'Choisissez vos horaires librement. Les créneaux premium (11h-14h et 19h-22h) offrent des bonus. Minimum 4h par jour pour maintenir votre compte actif.'
      }
    ]
  },
  {
    category: 'Rémunération',
    icon: Wallet,
    color: '#96CEB4',
    questions: [
      {
        question: 'Comment suis-je payé ?',
        answer: 'Paiement hebdomadaire automatique. Tarif de base + bonus distance + pourboires + primes horaires. Les paiements sont effectués chaque lundi pour la semaine précédente.'
      },
      {
        question: 'Quels sont les bonus disponibles ?',
        answer: 'Bonus météo (pluie/chaleur), bonus heures de pointe, bonus fidélité mensuel, bonus notation client, et challenges hebdomadaires.'
      }
    ]
  },
  {
    category: 'Support',
    icon: PhoneCall,
    color: '#FFD93D',
    questions: [
      {
        question: 'Comment contacter le support ?',
        answer: 'Support 24/7 via l\'app, hotline dédiée pour urgences, et bureau physique dans chaque ville pour l\'équipement et les questions administratives.'
      }
    ]
  }
];

const DeliveryGuidePage = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />
      <MobileNav/>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ed7e0f] to-[#6e0a13] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Devenez Livreur Partenaire Akevas
            </h1>
            <p className="text-xl opacity-90">
              Flexibilité, revenus attractifs et support 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">25k FCFA</h3>
                <p className="text-gray-600">Gain moyen/jour</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Flexible</h3>
                <p className="text-gray-600">Horaires libres</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">100%</h3>
                <p className="text-gray-600">Assuré</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Même structure que SellerGuidePage */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category) => (
                       <div key={category.category} className="mb-6">
              <button
                onClick={() =>
                  setOpenCategory(
                    openCategory === category.category ? null : category.category
                  )
                }
                className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <category.icon
                        className="w-6 h-6"
                        style={{ color: category.color }}
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{category.category}</h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openCategory === category.category ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {openCategory === category.category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      {category.questions.map((item) => (
                        <div
                          key={item.question}
                          className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              setOpenQuestion(
                                openQuestion === item.question
                                  ? null
                                  : item.question
                              )
                            }
                            className="w-full px-6 py-4 text-left hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.question}</span>
                              <ChevronDown
                                className={`w-5 h-5 transition-transform ${
                                  openQuestion === item.question ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>

                          <AnimatePresence>
                            {openQuestion === item.question && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 py-4 border-t text-gray-600">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Rejoignez l'équipe de livraison Akevas
            </h2>
            <p className="text-gray-400 mb-8">
              Commencez à gagner dès aujourd'hui en devenant livreur partenaire
            </p>
            <AsyncLink to="/delivery/register">
              <button className="bg-[#ed7e0f] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors">
                Devenir livreur
              </button>
            </AsyncLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryGuidePage; 