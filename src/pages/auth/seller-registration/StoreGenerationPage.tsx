import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Store } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/index';
import { useLoginMutation,useNewStoreMutation } from '@/services/auth';
import { authTokenChange } from '@/store/authSlice';
import { convertBase64ToFile } from '@/lib/convertBase64ToFile';
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
  const {firstName, lastName, email, phone, birthDate, nationality, storeName, storeDescription, storeCategories, storeTown, storeQuarter, password,productType} = useSelector((state: RootState) => state.registerSeller);

  const [newStore] = useNewStoreMutation();
    const [login]=useLoginMutation()
  const dispatch=useDispatch<AppDispatch>()

  const [error, setError] = useState<string | null>(null);

  const identity_front = localStorage.getItem('identity_card_in_front') || null;
  const identity_back = localStorage.getItem('identity_card_in_back') || null;
  const identity_with_person = localStorage.getItem('identity_card_with_the_person') || null;
  const storeLogo = localStorage.getItem('storeLogo') || null;
   const imagesString = localStorage.getItem('storeImages') || '[]';
  // Conversion des images en fichiers
  const logoFile = storeLogo ? convertBase64ToFile(storeLogo, 'logo.png') : null;
  const frontFile = identity_front ? convertBase64ToFile(identity_front, 'identity_front.jpg') : null;
  const backFile = identity_back ? convertBase64ToFile(identity_back, 'identity_back.jpg') : null;
  const withPersonFile = identity_with_person ? convertBase64ToFile(identity_with_person, 'identity_with_person.jpg') : null;
    
  const imagesArray = JSON.parse(imagesString);
    
  const imageFiles = imagesArray.map((image: string, index: number) => 
    convertBase64ToFile(image, `store_image_${index + 1}.jpg`)
      );
      
   useEffect(() => {
    let isSubscribed = true;
    const createStore = async () => {
      if (localStorage.getItem('storeCreationStarted')) {
        return;
      }
      
      localStorage.setItem('storeCreationStarted', 'true');
      const formData = new FormData();
      
      try {
        // Configuration des durées pour chaque étape
        const stepDuration = 3000; // 3 secondes par étape
        const totalDuration = stepDuration * steps.length;
        
        // Fonction pour gérer la progression d'une étape
        const handleStepProgress = (stepIndex: number) => {
          return new Promise<void>((resolve) => {
            setCurrentStep(stepIndex);
            const startProgress = (stepIndex * 100) / steps.length;
            const endProgress = ((stepIndex + 1) * 100) / steps.length;
            
            const interval = setInterval(() => {
              setProgress(prev => {
                const newProgress = prev + 1;
                if (newProgress >= endProgress) {
                  clearInterval(interval);
                  resolve();
                  return endProgress;
                }
                return newProgress;
              });
            }, stepDuration / (endProgress - startProgress));
          });
        };

        // Exécution des étapes une par une
        for (let i = 0; i < steps.length - 1; i++) {
          await handleStepProgress(i);
        }

        // Préparation et envoi des données
        const storeObject = {
          firstName, lastName, email, phone_number: phone, birthDate, nationality,
          identity_card_in_front: frontFile, identity_card_in_back: backFile, 
          identity_card_with_the_person: withPersonFile,
          shop_name: storeName, shop_description: storeDescription, 
          categories: storeCategories, shop_profile: logoFile,
          town_id: storeTown, quarter_id: storeQuarter, password, 
          product_type: productType,
        };
        Object.entries(storeObject).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images[]', imageFiles[i]); // Ajoute chaque image au tableau
    }
        console.log(formData.get('images'));

        // Envoi à l'API
        const storeData = await newStore(formData).unwrap();
        console.log(storeData);
        // Dernière étape après succès de l'API
        await handleStepProgress(steps.length - 1);
        setProgress(100);
        console.log(storeData);
        setTimeout(() => {
          localStorage.removeItem('storeCreationStarted');
          //navigate('/seller/dashboard');
        }, 1000);

      } catch (error) {
        setError("Une erreur est survenue lors de la création de votre boutique. Veuillez actualiser la page et réessayer.");
        localStorage.removeItem('storeCreationStarted');
      }
    };

    createStore();

    return () => {
      isSubscribed = false;
    };
  }, [navigate, newStore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
      {error ? (
        <div className="bg-red-50 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold text-red-700 mb-4">Erreur</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Actualiser la page
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default StoreGenerationPage;
