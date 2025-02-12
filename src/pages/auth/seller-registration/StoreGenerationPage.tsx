import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Store } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { useNewStoreMutation } from '@/services/guardService';

const steps = [
  "Création de votre boutique...",
  "Configuration de votre espace vendeur...",
  "Préparation de vos outils de vente...",
  "Finalisation de votre compte..."
];


const StoreGenerationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const {firstName, lastName, email, phone, birthDate, nationality, identity_card_in_front, identity_card_in_back, identity_card_with_the_person, storeName, storeDescription, storeCategories, storeLogo, storeBanner, storePhone, storeTown, storeQuarter, password} = useSelector((state: RootState) => state.registerSeller);
  console.log(firstName, lastName, email, phone, birthDate, nationality, identity_card_in_front, identity_card_in_back, identity_card_with_the_person, storeName, storeDescription, storeCategories, storeLogo, storeBanner, storePhone, storeTown, storeQuarter, password);
  const [newStore, {isLoading}] = useNewStoreMutation();
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    // Redirect after completion
    const redirectTimeout = setTimeout(() => {
      navigate('/seller/dashboard');
    }, 12000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Store Icon */}
        <div className="flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Store className="w-24 h-24 text-[#ed7e0f]" />
          </motion.div>
        </div>

        {/* Progress Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {progress === 100 ? "Configuration terminée !" : "Configuration en cours..."}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#ed7e0f] bg-[#ed7e0f]/10">
                Progression
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-[#ed7e0f]">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[#ed7e0f]/20">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#ed7e0f]"
            />
          </div>
        </div>

        {/* Completion Check */}
        {progress === 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center"
          >
            <CheckCircle2 className="w-16 h-16 text-[#ed7e0f]" />
          </motion.div>
        )}

        {/* Status Messages */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0
              }}
              className="flex items-center space-x-3"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-[#ed7e0f]' : 'bg-gray-300'
                }`}
              />
              <span
                className={`text-sm ${
                  index <= currentStep ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StoreGenerationPage;
