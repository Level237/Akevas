"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { Link } from "react-router-dom"

import RegisterForm from "@/components/frontend/forms/RegisterForm"
export default function SignupForm() {
  return (
<div className="min-h-screen bg-gradient-to-br from-[#fff9e6] to-[##ed7e0f] flex items-center justify-center p-4">
      <Card className="w-full max-w-[1200px] p-0 overflow-hidden rounded-3xl">
        <div className="grid md:grid-cols-2 h-full">
          {/* Left Column */}
          <div className="p-12 max-sm:px-3 bg-[#fdf6e9]">
            <div className="space-y-6">
             

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Créer un compte</h1>
                <p className="text-gray-500 text-sm">Inscrivez-vous et obtenez 30 jours d'essai gratuit</p>
              </div>

             <RegisterForm />

              <div className="flex justify-between text-sm">
                <div className="text-gray-500">
                  Vous avez déjà un compte?{" "}
                  <Link to="/login" className="text-black hover:underline">
                    Connexion
                  </Link>
                </div>
                <Link to="/terms" className="text-gray-500 hover:underline">
                  Conditions générales
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative hidden md:block">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10 hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
            <div className="relative h-full">
              <img
                src="/register.jpeg"
                alt="Team collaboration"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/10" />

            
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

