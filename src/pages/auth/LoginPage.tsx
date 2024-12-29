import LoginForm from "@/components/frontend/forms/LoginForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Shield, Truck, Unlock } from "lucide-react";



export default function LoginPage() {
  return (
    <div className="h-[100vh] overflow-hidden w-full bg-white">
    <div className="mx-auto grid min-h-screen   md:grid-cols-2">
      {/* Left Column - Si<div className="min-h-screen w-full bg-white">
      <div className="mx-auto grid min-h-screen max-w-screen-xl md:grid-cols-2">
        {/* Left Column - Sign Up Form */}
       <LoginForm/>

        
        <Card className="relative  hidden w-full  overflow-hidden md:block">
          <div className="absolute rounded-none   inset-0">
            <img
              src="/traditional-dark.jpeg"
              alt="Modern furniture in a living room"
              width={600}
              height={800}
              className="h-full  w-full object-cover"
              
            />
            <div className="absolute  inset-0 bg-black/20" />
          </div>
          
          <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <h2 className="mb-4 text-3xl font-semibold">
              Discovering the Best Furniture for Your Home
            </h2>
            <p className="mb-6 max-w-md text-sm opacity-90">
              Our expertise is Designing Complete Environmental exceptional buildings communities and place in special situations
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>100% Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
                <Truck className="h-4 w-4" />
                <span>Free delivery London area</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}