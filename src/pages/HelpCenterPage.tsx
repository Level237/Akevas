import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  MessageCircle,
  Shield,
  Search
} from 'lucide-react';
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';

const helpTopics = [
  {
    category: 'Commandes',
    icon: ShoppingBag,
    color: '#FF6B6B',
    questions: [
      {
        question: 'Comment passer une commande ?',
        answer: 'Ajoutez les articles dans votre panier, vérifiez votre commande, choisissez votre mode de livraison et procédez au paiement. Vous recevrez une confirmation par email.'
      },
      {
        question: 'Comment suivre ma commande ?',
        answer: 'Connectez-vous à votre compte, allez dans "Mes commandes" et cliquez sur le numéro de commande pour voir son statut en temps réel.'
      }
    ]
  },
  {
    category: 'Paiements',
    icon: CreditCard,
    color: '#4ECDC4',
    questions: [
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer: 'Nous acceptons les cartes bancaires, Mobile Money (Orange Money, MTN Mobile Money), et le paiement à la livraison dans certaines zones.'
      },
      {
        question: 'Ma transaction a échoué, que faire ?',
        answer: 'Vérifiez que vos informations bancaires sont correctes. Si le problème persiste, contactez notre service client ou réessayez plus tard.'
      }
    ]
  },
  {
    category: 'Livraison',
    icon: Truck,
    color: '#45B7D1',
    questions: [
      {
        question: 'Quels sont les délais de livraison ?',
        answer: 'Les délais varient selon votre localisation : 24h en ville, 2-5 jours en province. Vous pouvez voir le délai estimé avant de valider votre commande.'
      }
    ]
  },
  {
    category: 'Retours',
    icon: RotateCcw,
    color: '#96CEB4',
    questions: [
      {
        question: 'Comment retourner un article ?',
        answer: "Vous avez 7 jours pour retourner un article. Initiez le retour depuis Mes commandes, imprimez l'étiquette de retour et déposez le colis au point relais."
      }
    ]
  },
  {
    category: 'Sécurité',
    icon: Shield,
    color: '#FFD93D',
    questions: [
      {
        question: 'Mes données sont-elles protégées ?',
        answer: 'Oui, nous utilisons un cryptage SSL pour protéger vos données. Nous ne partageons jamais vos informations avec des tiers.'
      }
    ]
  }
];

const HelpCenterPage = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = helpTopics.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />
      <MobileNav />

      {/* Hero Section avec Recherche */}
      <div className="bg-gradient-to-r from-[#ed7e0f] to-[#6e0a13] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Comment pouvons-nous vous aider ?
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Rechercher une réponse..."
                className="w-full px-6 py-4 rounded-xl pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact Rapide */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Chat en direct</h3>
                <p className="text-gray-600">Temps de réponse moyen : 2 min</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Support prioritaire</h3>
                <p className="text-gray-600">Par email ou téléphone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {filteredTopics.map((category) => (
            <div key={category.category} className="mb-6">
              <button
                onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
                className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
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
                            onClick={() => setOpenQuestion(openQuestion === item.question ? null : item.question)}
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

      {/* Section Pas trouvé votre réponse */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-gray-400 mb-8">
              Notre équipe de support est disponible 24/7 pour vous aider
            </p>
            <button className="bg-[#ed7e0f] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors">
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage; 