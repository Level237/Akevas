import { useState } from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import PersonalInfoStep from '@/components/seller/registration/steps/PersonalInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setPersonalInfo } from '@/store/seller/registerSlice';
import { useCheckIfEmailExistsMutation } from '@/services/guardService';
const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [checkIfEmailExists]=useCheckIfEmailExistsMutation()
  const [formData, setFormData] = useState<SellerFormData['personalInfo']>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
  });

  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.personalInfo) {
      setFormData(data.personalInfo);
    }
  };

  const handleNext = async () => {
    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'nationality'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Email invalide');
      return;
    }
    const form=new FormData()
    form.append("email",formData.email)
    console.log(formData.email)
    form.append("phone",formData.phone)
    const response=await checkIfEmailExists(form)

    if(response.error){
      alert("ce mail ou ce numéro de téléphone existe déjà");
      return;
    }
    

    setIsLoading(true);

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const personalInfoState={
                'lastName':formData.lastName,
                'firstName':formData.firstName,
                'email':formData.email,
                'phone':formData.phone,
                'birthDate':formData.birthDate,
                'nationality':formData.nationality,
            }
            
            dispatch(setPersonalInfo(personalInfoState))
      // Animation de succès
      const element = document.createElement('div');
      element.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/20';
      element.innerHTML = '<div class="bg-[#ed7e0f] text-white p-4 rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>';
      document.body.appendChild(element);

      // Attendre l'animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Nettoyer et naviguer
      document.body.removeChild(element);
      navigate('/seller-registration/identity-info');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
        <TopLoader progress={16.7} />
        <ScrollRestoration/>
        <div className="max-w-5xl mx-auto">
          <PersonalInfoStep 
            data={formData}
            onUpdate={handleUpdate}
          />
          <motion.div 
            className="mt-8 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="relative px-6 py-3 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Validation...</span>
                </div>
              ) : (
                'Suivant'
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PersonalInfoPage;