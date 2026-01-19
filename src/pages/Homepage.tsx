import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'

import MobileNav from '@/components/ui/mobile-nav'

import vendor from '@/assets/vendor.jpg'
import { Package, Truck, CreditCard } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);
  
  useEffect(() => {
    let start = 0;
    const end = target;
    const increment = end / (duration / 16);

    function animate() {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        ref.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        cancelAnimationFrame(ref.current);
      }
    }
    animate();
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return count;
}

const stats = [
  { value: 2000000, label: "Clients actifs", suffix: "+" },
  { value: 50000, label: "Vendeurs satisfaits", suffix: "+" },
  { value: 500000000, label: "Ventes mensuelles", suffix: "+" },
  { value: 24, label: "Support dédié", suffix: "/7" },
];

const Homepage = () => {






  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopBar />
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#ed7e0f] to-[#6e0a13] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl max-sm:text-3xl font-bold mb-6">
              Développez votre business avec Akevas
            </h1>
            <p className="text-xl max-sm:text-sm mb-8">
              Rejoignez la marketplace qui connecte plus de 2 millions d'acheteurs à des vendeurs de confiance
            </p>
            <AsyncLink to="/seller-registration/personal-info">
              <button className="bg-white text-[#ed7e0f] px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Commencer maintenant
              </button>
            </AsyncLink>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-7 h-7 text-[#ed7e0f]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Vendez sans limites</h3>
            <p className="text-gray-600">Accédez à des millions de clients potentiels et développez votre activité sans contraintes géographiques.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Truck className="w-7 h-7 text-[#ed7e0f]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Logistique simplifiée</h3>
            <p className="text-gray-600">Profitez de notre réseau de livraison optimisé et de nos outils de gestion des commandes intégrés.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <CreditCard className="w-7 h-7 text-[#ed7e0f]" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Paiements sécurisés</h3>
            <p className="text-gray-600">Recevez vos paiements de manière rapide et sécurisée tous les 7 jours.</p>
          </div>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Illustration */}
            <div className="relative max-sm:hidden">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full opacity-50"></div>
              <img
                src={vendor}
                alt="Vendeur sur Akevas"
                className="relative z-10 w-full max-w-lg mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-50 rounded-full opacity-50"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl max-sm:text-2xl max-sm:text-center max-sm:mb-4 md:text-4xl font-bold text-gray-900">
                Transformez votre passion en succès commercial
              </h2>
              <div className="relative hidden max-sm:block ">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full opacity-50"></div>
                <img
                  src={vendor}
                  alt="Vendeur sur Akevas"
                  className="relative  z-10 w-full max-w-lg mx-auto"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-50 rounded-full opacity-50"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Que vous soyez artisan, créateur ou commerçant, Akevas vous offre tous les outils nécessaires pour développer votre activité en ligne. Profitez de notre marketplace en pleine croissance et atteignez des millions de clients potentiels.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Inscription gratuite et rapide</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Commission compétitive</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Support dédié 7j/7</span>
                </li>
              </ul>
              <div className="pt-6">
                <AsyncLink to="/seller-registration/personal-info">
                  <button className="bg-[#ed7e0f] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors inline-flex items-center gap-2">
                    Commencer maintenant
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </AsyncLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#ed7e0f] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => {
              const count = useCountUp(stat.value, 1200 + idx * 200);
              // Format large numbers
              const display =
                stat.value >= 1000000
                  ? `${Math.floor(count / 1000000)}M${stat.suffix}`
                  : stat.value >= 1000
                  ? `${Math.floor(count / 1000)}k${stat.suffix}`
                  : `${count}${stat.suffix}`;
              return (
                <div
                  key={stat.label}
                  className="transition-all duration-300 hover:scale-105 hover:bg-white/10 rounded-xl py-8"
                >
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 transition-all duration-300 drop-shadow-lg">
                    {display}
                  </h3>
                  <p className="text-white/90 text-lg font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à développer votre business ?</h2>
          <p className="text-gray-600 mb-8">
            Commencez à vendre sur Akevas dès aujourd'hui et rejoignez notre communauté de vendeurs prospères
          </p>
          <div className="flex gap-4 justify-center">
            <AsyncLink to="/seller-registration/personal-info">
              <button className="bg-[#ed7e0f] text-white max-sm:px-4 max-sm:py-4 px-8 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors">
                Devenir vendeur
              </button>
            </AsyncLink>
            <AsyncLink to="/seller/guide">
              <button className="bg-gray-100 text-gray-800 max-sm:px-4 max-sm:py-4 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                En savoir plus
              </button>
            </AsyncLink>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 max-sm:mb-10 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Akevas. La marketplace africaine de confiance.
          </p>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Homepage;