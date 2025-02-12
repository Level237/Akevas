import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityInfoStep from '@/components/seller/registration/steps/SecurityInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';
import { PageTransition } from '@/components/ui/page-transition';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setSecurityInfo } from '@/store/seller/registerSlice';
const SecurityInfoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SellerFormData['securityInfo']>({
    password: '',
    confirmPassword: '',
  });
console.log(formData);
  const handleUpdate = (data: Partial<SellerFormData>) => {
    if (data.securityInfo) {
      setFormData(data.securityInfo);
    }
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = ['password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      const securityInfo = {
        password: formData.password,
      }
      dispatch(setSecurityInfo(securityInfo));
      // Animation de succès finale
      const element = document.createElement('div');
      element.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/20';
      element.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div class="mb-4">
            <svg class="w-16 h-16 text-[#ed7e0f] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      navigate('/seller-registration/generating');
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="relative px-6 py-3 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SecurityInfoPage;
