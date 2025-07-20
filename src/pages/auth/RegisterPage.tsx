import { Link, useNavigate } from "react-router-dom"
import RegisterForm from "@/components/frontend/forms/RegisterForm"
import logo from "@/assets/favicon.png"
import { ArrowLeft, Shield, Sparkles, Users, Zap,Star, Truck, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupForm() {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, text: "Sécurité maximale", color: "text-green-500", desc: "Vos données sont protégées" },
    { icon: Truck, text: "Livraison rapide", color: "text-blue-500", desc: "Livraison en 24h" },
    { icon: Users, text: "Communauté active", color: "text-purple-500", desc: "10K+ clients satisfaits" },
    { icon: CreditCard, text: "Paiement sécurisé", color: "text-orange-500", desc: "Transactions sécurisées" }
  ];

  const stats = [
    { number: "10K+", label: "Clients satisfaits", icon: Star },
    { number: "500+", label: "Produits disponibles", icon: Zap },
    { number: "24h", label: "Livraison rapide", icon: Truck }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Statique avec background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background avec image et overlay */}
        <div className="absolute inset-0 bg-[#6E0A13]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        </div>
        
        {/* Cercles décoratifs animés */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500" />

        {/* Contenu de la section gauche */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
          {/* Logo et titre */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-16 w-auto relative z-10"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 border-4 border-white/30 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Akevas</h1>
                <p className="text-white/80">Votre marketplace de confiance</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Rejoignez notre communauté
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Découvrez des produits exceptionnels et profitez d'une expérience d'achat unique au Cameroun
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold mb-6">Pourquoi nous choisir ?</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <feature.icon className={`w-6 h-6 ${feature.color} mt-1 flex-shrink-0`} />
                  <div>
                    <div className="font-semibold text-white">{feature.text}</div>
                    <div className="text-sm text-white/70">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-yellow-300 mr-2" />
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Section droite - Formulaire scrollable */}
      <div className="flex-1 lg:w-1/2 flex flex-col">
        {/* Header mobile */}
        <div className="lg:hidden p-6 bg-white border-b border-gray-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        {/* Contenu du formulaire */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full mx-6 max-sm:mx-0">
            {/* En-tête desktop */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden lg:block text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Créer votre compte
              </h2>
              <p className="text-gray-600">
                Commencez votre aventure en quelques étapes simples
              </p>
            </motion.div>

            {/* En-tête mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:hidden text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Akevas</h1>
                  <p className="text-sm text-gray-600">Marketplace</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Créer votre compte
              </h2>
              <p className="text-gray-600">
                Rejoignez notre communauté
              </p>
            </motion.div>

            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RegisterForm />
            </motion.div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link 
                  to="/login" 
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors hover:underline"
                >
                  Déjà inscrit ? Connexion
                </Link>
                <div className="h-4 w-px bg-gray-300" />
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-gray-800 transition-colors hover:underline"
                >
                  Conditions générales
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

