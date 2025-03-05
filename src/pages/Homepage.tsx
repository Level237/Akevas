



import Header from '@/components/ui/header'
import TopBar from '@/components/ui/topBar'
import MobileNav from '@/components/ui/mobile-nav'
import deliveryHero from '@/assets/delivery.png'

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
                className="w-[26rem] h-[26rem] rounded-2xl shadow-2xl"
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

      {/* Rest of the content */}


      <MobileNav />

    </div>
  );
};

export default Homepage;
