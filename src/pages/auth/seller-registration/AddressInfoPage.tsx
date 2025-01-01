import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressInfoStep from '@/components/seller/registration/steps/AddressInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';

const AddressInfoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SellerFormData['addressInfo']>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.addressInfo) {
      setFormData(data.addressInfo);
    }
  };

  const handlePrevious = () => {
    navigate('/seller-registration/shop-info');
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = ['street', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Animation de succès finale
      const element = document.createElement('div');
      element.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/20';
      element.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div class="mb-4">
            <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Inscription Réussie!</h3>
          <p class="text-gray-600 mb-6">Votre compte vendeur a été créé avec succès.</p>
          <div class="animate-pulse text-sm text-gray-500">Redirection en cours...</div>
        </div>
      `;
      document.body.appendChild(element);

      // Attendre l'animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Nettoyer et naviguer
      document.body.removeChild(element);
      navigate('/seller-registration/success');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
        <TopLoader progress={100} />
        <div className="max-w-5xl mx-auto">
          <AddressInfoStep 
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="relative px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Finalisation...</span>
                </div>
              ) : (
                "Terminer l'inscription"
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AddressInfoPage;
