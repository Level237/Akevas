import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import MobileNav from '@/components/ui/mobile-nav'
import deliveryHero from '@/assets/delivery.png'
import { Clock, TrendingUp, Lock } from 'lucide-react'
import deliveryMan from '@/assets/livraisond.webp'
const Homepage = () => {


  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopBar />
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Livrez avec <span className="text-[#ed7e0f]">Akevas</span><br />
                Gagnez en liberté
              </h1>
              <p className="text-gray-300 text-lg">
                Rejoignez notre communauté de livreurs et profitez d'horaires flexibles,
                de revenus attractifs et d'un support 24/7.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="bg-[#ed7e0f] px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-all">
                  Devenir livreur
                </button>
                <button className="border border-white/20 px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all">
                  En savoir plus
                </button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src={deliveryHero}
                alt="Livreur Akevas"
                className="w-[28rem] h-[28rem] rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#ed7e0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Flexibilité</h3>
                <p className="text-gray-600">Choisissez vos horaires</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">25k FCFA</h3>
                <p className="text-gray-600">Gain moyen/jour</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Protection</h3>
                <p className="text-gray-600">100% assuré</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Akevas Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Akevas ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rejoignez la plateforme de livraison qui met ses livreurs au premier plan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexibilité totale</h3>
              <p className="text-gray-600">
                Définissez vos propres horaires et zones de livraison. Travaillez quand vous le souhaitez.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Revenus attractifs</h3>
              <p className="text-gray-600">
                Gagnez plus avec nos bonus, primes et pourboires. Paiements hebdomadaires garantis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Protection complète</h3>
              <p className="text-gray-600">
                Assurance tous risques et support 24/7 pour votre tranquillité d'esprit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={deliveryMan}
                alt="Application Akevas"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">+2000</p>
                    <p className="text-sm text-gray-600">Livreurs actifs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Une application intuitive pour une expérience optimale</h2>
              <p className="text-gray-600">
                Notre application mobile vous permet de gérer facilement vos livraisons, suivre vos gains
                et optimiser vos trajets. Tout ce dont vous avez besoin dans une seule interface.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Navigation GPS optimisée</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Suivi des gains en temps réel</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Support chat intégré</span>
                </li>
              </ul>
              <button className="bg-[#ed7e0f] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-all">
                Télécharger l'application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer l'aventure ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez Akevas aujourd'hui et découvrez une nouvelle façon de travailler.
            Inscription rapide, formation complète et démarrage immédiat.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-[#ed7e0f] px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-all">
              Devenir livreur
            </button>
            <button className="border border-white/20 px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all">
              Consulter le guide
            </button>
          </div>
        </div>
      </div>

      <MobileNav />

    </div>
  );
};

export default Homepage;
