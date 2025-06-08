import { Link, useNavigate } from "react-router-dom"
import RegisterForm from "@/components/frontend/forms/RegisterForm"
import logo from "@/assets/favicon.png"
import { ArrowLeft, Shield, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Arrière-plan animé */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
        
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-200 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-40 left-40 w-[400px] h-[400px] bg-orange-100 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Card principale avec motif */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Motif de fond */}
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          
          {/* Effet de brillance */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200 z-[-1] rounded-3xl opacity-60" />

          {/* Contenu principal */}
          <div className="relative p-8">
            {/* Bouton retour */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-white/80 hover:bg-orange-50 transition-all duration-300 shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </motion.button>

            <div className="space-y-8">
              {/* En-tête amélioré */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="relative">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-24 w-auto relative z-10"
                    />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-4 border-4 border-orange-200/50 rounded-full"
                    />
                    {/* Effet d'étoiles */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-6 h-6 text-orange-400" />
                    </motion.div>
                  </div>
                </div>
                <div className="text-center relative">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Créer un compte
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Rejoignez notre communauté et commencez à explorer
                  </p>
                  {/* Ligne décorative */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-orange-200 to-orange-400 rounded-full" />
                </div>
              </motion.div>

              {/* Formulaire */}
              <RegisterForm />

              {/* Footer amélioré */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm pt-6 border-t border-orange-100/50"
              >
                <div className="flex items-center gap-2 bg-orange-50/50 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">Vos données sont sécurisées</span>
                </div>
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-orange-600 font-medium hover:text-orange-700 transition-colors hover:underline"
                  >
                    Déjà inscrit ? Connexion
                  </Link>
                  <div className="h-4 w-px bg-orange-200" />
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
      </motion.div>
    </div>
  )
}

