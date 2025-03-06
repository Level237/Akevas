import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import logo from '../../../assets/logo.png';
import { useCreateDeliveryMutation } from '@/services/guardService';
import { RootState } from '@/store';
import { convertBase64ToFile } from '@/lib/convertBase64ToFile';
import { useSelector } from 'react-redux';
import { useLoginMutation } from '@/services/auth';
import Cookies from 'universal-cookie';
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
  const [createDelivery] = useCreateDeliveryMutation()
  const { firstName, lastName, email, phone, selectedQuarters, birthDate, nationality, quarter, vehicleType, vehicleState, vehiclePlate, vehicleModel, password } = useSelector((state: RootState) => state.registerDelivery)

  const identity_front = sessionStorage.getItem('identity_card_in_front') || null;
  const driver_license = sessionStorage.getItem('drivers_license') || null || "";
  const vehicle_image = sessionStorage.getItem("vehicleImage") || null;
  const identity_with_person = sessionStorage.getItem('identity_card_with_the_person') || null;

  // Conversion des images en fichiers
  const [login] = useLoginMutation()
  const vehicleImage = vehicle_image ? convertBase64ToFile(vehicle_image, 'vehicle.png') : null;
  const identity_front_file = identity_front ? convertBase64ToFile(identity_front, 'identity_front.png') : null;
  const identity_with_person_file = identity_with_person ? convertBase64ToFile(identity_with_person, 'identity_with_person.png') : null;
  let driver_license_file: any | null;

  if (driver_license === "null") {
    driver_license_file = null
    console.log("dd")
  } else {
    console.log("ddxq,")
    console.log(driver_license)
    console.log(driver_license_file)
    driver_license_file = convertBase64ToFile(driver_license, 'driver_license.png');
  }
  useEffect(() => {


    //console.log(driver_license)


    const createDeliveryHandler = async () => {

      const formData = new FormData();
      try {

        const deliveryObject = {
          firstName,
          lastName,
          email,
          phone_number: phone,
          birthDate,
          nationality,
          residence: quarter,
          vehicle_type: vehicleType,
          vehicle_state: vehicleState,
          vehicle_number: vehiclePlate,
          vehicle_model: vehicleModel,
          password,
          identity_card_in_front: identity_front_file,
          identity_card_with_the_person: identity_with_person_file,
          drivers_license: driver_license_file,
          vehicle_image: vehicleImage
        }

        Object.entries(deliveryObject).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        const quarters = JSON.parse(selectedQuarters || '[]');
        for (let i = 0; i < quarters.length; i++) {
          formData.append('quarters[]', quarters[i]);
        }

        const response = await createDelivery(formData);
        console.log(response)
        const userObject = { phone_number: phone, password: password, role_id: 4 }
        const userData = await login(userObject)

        const cookies = new Cookies();
        cookies.set('tokenDelivery', userData.data.access_token, { path: '/', secure: true });
        cookies.set('refreshTokenDelivery', userData.data.refresh_token, { path: '/', secure: true });







      } catch (error) {
        console.error('Erreur lors de la création du compte livreur:', error);
        return;
      }
    }

    createDeliveryHandler()
    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        clearInterval(timer);
        // Redirect to dashboard after a short delay
        setTimeout(() => {

          window.location.href = '/dashboard';
        }, 1500);
      }
    }, 3000);
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
              className={`flex items-start gap-4 ${index !== steps.length - 1 ? 'mb-8' : ''
                }`}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${index < currentStep
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
                    className={`absolute left-1/2 top-8 w-0.5 h-16 -translate-x-1/2 ${index < currentStep ? 'bg-[#6e0a13]' : 'bg-gray-100'
                      }`}
                  />
                )}
              </div>
              <div>
                <h3
                  className={`font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm mt-1 ${index <= currentStep ? 'text-gray-600' : 'text-gray-400'
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
