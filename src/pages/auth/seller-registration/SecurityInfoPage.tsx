import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityInfoStep from '@/components/seller/registration/steps/SecurityInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';

const SecurityInfoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SellerFormData['securityInfo']>({
    password: '',
    confirmPassword: '',
  });

  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.securityInfo) {
      setFormData(data.securityInfo);
    }
  };

  const handleNext = async () => {
    // Validation
    if (!formData.password || !formData.confirmPassword) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
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
      navigate('/seller-registration/shop-info');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
        <TopLoader progress={37.5} />
        <div className="max-w-5xl mx-auto">
          <SecurityInfoStep 
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
              className="relative px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SecurityInfoPage;
