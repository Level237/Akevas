import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopInfoStep from '@/components/seller/registration/steps/ShopInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';

const ShopInfoPage = () => {
  const navigate = useNavigate();
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

  const handleNext = () => {
    // Validation
    const requiredFields = ['shopName', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Si tout est valide, naviguer vers l'étape suivante
    navigate('/seller-registration/bank-info');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
      <TopLoader progress={50} />
      <div className="max-w-5xl mx-auto">
        <ShopInfoStep 
          data={formData}
          onUpdate={handleUpdate}
        />
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Retour
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoPage;
