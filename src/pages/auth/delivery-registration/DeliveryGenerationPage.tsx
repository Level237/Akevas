import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import logo from '../../../assets/logo.png';
const steps = [
  {
    id: 'verify',
    title: 'Vérification des informations',
    description: 'Nous vérifions vos informations personnelles'
  },
  {
    id: 'documents',
    title: 'Validation des documents',
    description: 'Nous vérifions vos documents fournis'
  },
  {
    id: 'account',
    title: 'Création du compte',
    description: 'Nous créons votre compte livreur'
  },
  {
    id: 'setup',
    title: 'Configuration finale',
    description: 'Nous configurons votre espace livreur'
  }
];

const DeliveryGenerationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        clearInterval(timer);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/delivery/dashboard';
        }, 1500);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[#6e0a13] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">
            Création de votre compte livreur
          </h1>
          <p className="mt-2 text-gray-200">
            Veuillez patienter pendant que nous configurons votre compte
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-4 ${
                index !== steps.length - 1 ? 'mb-8' : ''
              }`}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStep
                      ? 'bg-[#6e0a13]'
                      : index === currentStep
                      ? 'bg-[#ed7e0f]'
                      : 'bg-gray-100'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : index === currentStep ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-8 w-0.5 h-16 -translate-x-1/2 ${
                      index < currentStep ? 'bg-[#6e0a13]' : 'bg-gray-100'
                    }`}
                  />
                )}
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

       

        <div className="mt-8 text-center text-sm text-white">
          <p>Ne fermez pas cette fenêtre</p>
          <p>Vous serez automatiquement redirigé</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryGenerationPage;
