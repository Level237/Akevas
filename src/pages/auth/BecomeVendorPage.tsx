import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import { ContactStep } from "@/components/vendor/steps/ContactStep"
import { PersonalInfoStep } from "@/components/vendor/steps/PersonalInfoStep"
import { PreferencesStep } from "@/components/vendor/steps/PreferencesStep"
import { StepSkeleton } from "@/components/vendor/steps/StepSkeleton"
import { useState } from "react"


export default function BecomeVendorPage() {
    const STEP_TITLES = [
        "Parlez nous de vous",
        "Vos coordonnées",
        "Vos préférences"
      ]
      
      const STEP_COMPONENTS = [
        PersonalInfoStep,
        ContactStep,
        PreferencesStep
      ]
      
      
        const [currentStep, setCurrentStep] = useState(0)
        const [isLoading, setIsLoading] = useState(false)
        const totalSteps = STEP_COMPONENTS.length
      
        const handleStepChange = async (nextStep: number) => {
          setIsLoading(true)
          // Simuler un temps de chargement
          await new Promise(resolve => setTimeout(resolve, 800))
          setCurrentStep(nextStep)
          setIsLoading(false)
        }
      
        const nextStep = () => {
          if (currentStep < totalSteps - 1) {
            handleStepChange(currentStep + 1)
          }
        }
      
        const prevStep = () => {
          if (currentStep > 0) {
            handleStepChange(currentStep - 1)
          }
        }
      
        const CurrentStepComponent = STEP_COMPONENTS[currentStep]
      
        return (
          <div className="min-h-screen bg-[#1a1a1a] text-white">
            <div className="container mx-auto px-4 py-12">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Colonne de gauche - Formulaire */}
                <div className="w-full lg:w-1/2 space-y-8">
                  <h1 className="text-5xl font-bold mb-12">{STEP_TITLES[currentStep]}</h1>
                  
                  <div className="transition-opacity duration-300 ease-in-out">
                    {isLoading ? (
                      <StepSkeleton />
                    ) : (
                      <CurrentStepComponent />
                    )}
                  </div>
                </div>
      
                {/* Colonne de droite - Illustration */}
                <div className="w-full lg:w-1/2 relative">
                  <img
                    src="/placeholder.svg?height=600&width=600"
                    alt="Illustration"
                    className="w-full h-auto"
                  />
                </div>
              </div>
      
              {/* Stepper en bas */}
              <div className="mt-12">
                <div className="flex justify-center items-center gap-4">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className={`h-3 w-3 rounded-full transition-colors duration-200 ${
                          index === currentStep 
                            ? 'bg-[#7c3aed]' 
                            : index < currentStep 
                              ? 'bg-[#6d28d9]' 
                              : 'bg-gray-600'
                        }`}
                      />
                      {index < totalSteps - 1 && (
                        <div 
                          className={`w-12 h-0.5 transition-colors duration-200 ${
                            index < currentStep ? 'bg-[#6d28d9]' : 'bg-gray-600'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isLoading}
                    className="text-white border-white hover:bg-[#2a2a2a]"
                  >
                    Précédent
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === totalSteps - 1 || isLoading}
                    className="bg-[#7c3aed] hover:bg-[#6d28d9]"
                  >
                    {currentStep === totalSteps - 1 ? 'Terminer' : 'Suivant'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
}
