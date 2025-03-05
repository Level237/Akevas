import LoginForm from "@/components/frontend/forms/LoginForm";
import { Card } from "@/components/ui/card";
import MobileNav from "@/components/ui/mobile-nav";
import login from '@/assets/login.jpg'


export default function LoginPage() {
  return (
    <div className="h-[100vh] overflow-hidden w-full bg-white">
      <div className="mx-auto grid min-h-screen md:grid-cols-2">
        {/* Left Column - Login Form */}
        <div className="relative">


          <div className="flex justify-start mt-12">

          </div>

          <LoginForm />
        </div>

        {/* Right Column */}
        <Card className="relative border-none rounded-none hidden w-full overflow-hidden md:block">
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
        <MobileNav />
      </div>
    </div>
  );
}
