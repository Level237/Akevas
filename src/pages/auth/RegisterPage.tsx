

import { Link } from "react-router-dom"
import RegisterForm from "@/components/frontend/forms/RegisterForm"
import logo from "@/assets/favicon.png"
export default function SignupForm() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Left Section */}
      <div className="flex-1 px-4 flex mx-12 py-12 ">
        <div className="w-full space-y-8">
          <div className="space-y-2 flex justify-center items-center ">
            <img
              src={logo}
              alt="Logo"
              className="h-24"
            />
            <h1 className="text-3xl text-center font-semibold tracking-tight">Créer un compte</h1>

          </div>
          <RegisterForm />

          <div className="flex justify-between text-sm">
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

      {/* Right Section */}
      <div className="hidden lg:block relative w-[40%] bg-[#ed7e0f]/5">
        <div className="absolute inset-0">
          <img
            src="/register.jpeg"
            alt="Team collaboration"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}

