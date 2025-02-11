import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerTypeStep from '@/components/seller/registration/steps/SellerTypeStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setSellerType } from '@/store/seller/registerSlice';
const SellerTypePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SellerFormData['bankInfo']>({
    sellerType: '',
    productType: '',
  });

  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.bankInfo) {
      setFormData(data.bankInfo);
    }
  };

  const handlePrevious = () => {
    navigate(-1);
  };
console.log(formData);
  const handleNext = async () => {
    // Validation
    const requiredFields = ['sellerType', 'productType'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const sellerTypeState={
        'sellerType':formData.sellerType,
        'productType':formData.productType,
      }
      dispatch(setSellerType(sellerTypeState));
      // Animation de succès
      const element = document.createElement('div');
      element.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/20';
      element.innerHTML = '<div class="bg-[#ed7e0f] text-white p-4 rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>';
      document.body.appendChild(element);

      // Attendre l'animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Nettoyer et naviguer
      document.body.removeChild(element);
      navigate('/seller-registration/address-info');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
        <TopLoader progress={66.8} />
        <div className="max-w-5xl mx-auto">
          <SellerTypeStep 
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
              onClick={handlePrevious}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retour
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

export default SellerTypePage;
