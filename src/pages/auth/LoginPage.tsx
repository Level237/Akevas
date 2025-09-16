import LoginForm from "@/components/frontend/forms/LoginForm";
import { Card } from "@/components/ui/card";
import login from '@/assets/login.jpg'
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="h-[100vh] overflow-hidden w-full bg-white">
      <div className="mx-auto grid min-h-screen lg:grid-cols-2">
        {/* Left Column - Login Form */}
        <div className="relative">

        <div className="absolute top-4 left-4 max-sm:block  sm:hidden">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-start mt-12 max-sm:mt-0">

          </div>

          <LoginForm />
        </div>

        {/* Right Column */}
        <Card className="relative lg:block border-none rounded-none hidden w-full block overflow-hidden md:hidden">
          <div className="absolute rounded-none    inset-0">
            <div className="absolute rotate-45 p-12 top-0   rounded-3xl z-50">

            </div>
            <img
              src={login}
              alt="Modern furniture in a living room"
              width={600}
              height={800}
              className="h-full border-none w-full object-cover"

            />
            <div className="absolute border-none  inset-0 bg-black/20" />
          </div>


        </Card>
        
      </div>
    </div>
  );
}
