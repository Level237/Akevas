import { Link, useNavigate } from "react-router-dom"
import RegisterForm from "@/components/frontend/forms/RegisterForm"
import logo from "@/assets/favicon.png"
import { ArrowLeft, X } from "lucide-react"

export default function SignupForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 max-sm:p-0">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 relative">
        {/* Close button */}
        <div className="absolute top-4 left-4 max-sm:block sm:hidden">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={logo}
              alt="Logo"
              className="h-20"
            />
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Créer un compte
            </h1>
            <p className="text-sm text-gray-500 text-center">
              Rejoignez notre communauté et commencez à explorer
            </p>
          </div>

          <RegisterForm />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-500">
              Vous avez déjà un compte?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Connexion
              </Link>
            </div>
            <Link to="/terms" className="text-gray-500 hover:underline">
              Conditions générales
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

