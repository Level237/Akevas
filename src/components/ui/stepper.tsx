import React from 'react'
import { Check, ShoppingCart, CreditCard, Truck, Package } from 'lucide-react'
import { cn } from "@/lib/utils"

const steps = [
  { name: 'Panier', icon: ShoppingCart },
  { name: 'Paiement', icon: CreditCard },
  { name: 'Expédition', icon: Truck },
  { name: 'Confirmation', icon: Package },
]

interface StepperProps {
  currentStep: number
  children: React.ReactNode[]
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <nav aria-label="Progress" className="mb-8">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={cn("relative", stepIdx !== steps.length - 1 ? "flex-1" : "")}>
              {stepIdx < currentStep ? (
                <div className="group">
                  <span className="flex items-center">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 transition-colors group-hover:bg-indigo-800">
                      <Check className="h-8 w-8 text-white" aria-hidden="true" />
                    </span>
                    {stepIdx !== steps.length - 1 && (
                      <span className="absolute top-6 w-full bg-indigo-600 h-1 transition-colors group-hover:bg-indigo-800" />
                    )}
                  </span>
                </div>
              ) : stepIdx === currentStep ? (
                <div className="group">
                  <span className="flex items-center">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-600 bg-white transition-colors group-hover:border-indigo-800">
                      <step.icon className="h-6 w-6 text-indigo-600 transition-colors group-hover:text-indigo-800" aria-hidden="true" />
                    </span>
                    {stepIdx !== steps.length - 1 && (
                      <span className="absolute top-6 w-full bg-gray-200 h-1" />
                    )}
                  </span>
                </div>
              ) : (
                <div className="group">
                  <span className="flex items-center">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-colors group-hover:border-gray-400">
                      <step.icon className="h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-500" aria-hidden="true" />
                    </span>
                    {stepIdx !== steps.length - 1 && (
                      <span className="absolute top-6 w-full bg-gray-200 h-1" />
                    )}
                  </span>
                </div>
              )}
              <span className="mt-4 block text-center text-sm font-medium">
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out">
        {children[currentStep]}
      </div>
    </div>
  )
}

