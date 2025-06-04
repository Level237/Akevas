import { useState } from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import IdentityInfoStep from '@/components/seller/registration/steps/IdentityInfoStep';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setIdentity } from '@/store/seller/registerSlice';
const IdentityInfoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SellerFormData['identityInfo']>({
    identity_card_in_front: null,
    identity_card_in_back: null,
    identity_card_with_the_person: null,
  });

  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.identityInfo) {
      setFormData(data.identityInfo);
    }
  };

  const handleNext = async () => {
    // Validation
    const requiredFields = ['identity_card_in_front', 'identity_card_in_back', 'identity_card_with_the_person'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error('Veuillez remplir tous les champs obligatoires', {
        description: "Tous les champs marqués d'un * sont requis.",
        duration: 4000, // ms
      });
      return;

    }


    setIsLoading(true);

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const identityInfoState={
        'identity_card_in_front':formData.identity_card_in_front,
        'identity_card_in_back':formData.identity_card_in_back,
        'identity_card_with_the_person':formData.identity_card_with_the_person,
      }
      dispatch(setIdentity(identityInfoState));
      // Animation de succès
      const element = document.createElement('div');
      element.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/20';
      element.innerHTML = '<div class="bg-[#ed7e0f] text-white p-4 rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>';
      document.body.appendChild(element);

      // Attendre l'animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Nettoyer et naviguer
      document.body.removeChild(element);
      navigate('/seller-registration/shop-info');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
console.log(formData);
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
        <TopLoader progress={33.4} />
        <ScrollRestoration />
        <div className="max-w-5xl mx-auto">
          <IdentityInfoStep
            data={formData}
            onUpdate={handleUpdate}
          />
          <motion.div 
            className="mt-8 flex justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
             <button
              onClick={()=>navigate(-1)}
              disabled={isLoading}
              className="relative px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
             
              
                Précedent
              
            </button>
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

export default IdentityInfoPage;
