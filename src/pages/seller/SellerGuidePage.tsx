import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Store,
  Package,
  Truck,
  CreditCard,
  Settings,
  ShieldCheck,
  HelpCircle,
  Users,
  Star,
  Banknote
} from 'lucide-react';
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import AsyncLink from '@/components/ui/AsyncLink';
import MobileNav from '@/components/ui/mobile-nav';

const faqs = [
  {
    category: 'Démarrage',
    icon: Store,
    color: '#FF6B6B',
    questions: [
      {
        question: 'Comment créer une boutique sur Akevas ?',
        answer: 'Pour créer une boutique, cliquez sur "Devenir vendeur" en haut de la page. Remplissez le formulaire avec vos informations personnelles, les détails de votre boutique et téléchargez les documents requis. Notre équipe examinera votre demande sous 48h.'
      },
      {
        question: 'Quels documents sont nécessaires ?',
        answer: 'Vous aurez besoin d\'une pièce d\'identité valide, d\'un justificatif d\'adresse de moins de 3 mois, et de votre registre de commerce si vous êtes une entreprise.'
      }
    ]
  },
  {
    category: 'Produits',
    icon: Package,
    color: '#4ECDC4',
    questions: [
      {
        question: 'Comment ajouter des produits ?',
        answer: 'Dans votre tableau de bord vendeur, cliquez sur "Ajouter un produit". Remplissez les détails du produit, ajoutez des photos de qualité, définissez le prix et le stock disponible.'
      },
      {
        question: 'Quelles sont les règles pour les photos ?',
        answer: 'Les photos doivent être claires, sur fond blanc, montrant le produit sous différents angles. Taille minimale : 800x800px. Format : JPG ou PNG.'
      }
    ]
  },
  {
    category: 'Livraison',
    icon: Truck,
    color: '#45B7D1',
    questions: [
      {
        question: 'Comment gérer les expéditions ?',
        answer: 'Vous pouvez choisir entre utiliser notre réseau de livreurs ou gérer vos propres livraisons. Les commandes doivent être traitées sous 24h.'
      }
    ]
  },
  {
    category: 'Paiements',
    icon: CreditCard,
    color: '#96CEB4',
    questions: [
      {
        question: 'Quand suis-je payé ?',
        answer: 'Les paiements sont effectués tous les 7 jours pour les commandes livrées et non contestées. Le virement est automatique sur votre compte bancaire renseigné.'
      }
    ]
  },
  {
    category: 'Performance',
    icon: Star,
    color: '#FFD93D',
    questions: [
      {
        question: 'Comment améliorer mes ventes ?',
        answer: 'Maintenez un taux de réponse rapide, des photos de qualité, des descriptions détaillées et un excellent service client. Utilisez nos outils de promotion pour plus de visibilité.'
      }
    ]
  }
];

const SellerGuidePage = () => {
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
              Guide du vendeur Akevas
            </h1>
            <p className="text-xl opacity-90">
              Tout ce que vous devez savoir pour réussir sur notre marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">2M+</h3>
                <p className="text-gray-600">Clients actifs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">50k+</h3>
                <p className="text-gray-600">Vendeurs satisfaits</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">500M+</h3>
                <p className="text-gray-600">Ventes mensuelles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
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
              Prêt à commencer votre aventure ?
            </h2>
            <p className="text-gray-400 mb-8">
              Rejoignez des milliers de vendeurs qui font confiance à Akevas
            </p>
            <AsyncLink to="/seller-registration/personal-info"> <button className="bg-[#ed7e0f] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors">
              Devenir vendeur
            </button></AsyncLink>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerGuidePage;
