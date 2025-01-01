import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopInfoStep from '@/components/seller/registration/steps/ShopInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';

const ShopInfoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SellerFormData['shopInfo']>({
    shopName: '',
    description: '',
    category: '',
    subCategory: '',
  });

  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.shopInfo) {
      setFormData(data.shopInfo);
    }
  };

  const handlePrevious = () => {
    navigate('/seller-registration/personal-info');
  };

  const handleNext = async () => {
    // Validation
    const requiredFields = ['shopName', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Animation de succès
      const element = document.createElement('div');
      element.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/20';
      element.innerHTML = '<div class="bg-green-500 text-white p-4 rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>';
      document.body.appendChild(element);

      // Attendre l'animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Nettoyer et naviguer
      document.body.removeChild(element);
      navigate('/seller-registration/bank-info');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
        <TopLoader progress={50} />
        <div className="max-w-5xl mx-auto">
          <ShopInfoStep 
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
              className="relative px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ShopInfoPage;
