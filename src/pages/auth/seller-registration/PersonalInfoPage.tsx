import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfoStep from '@/components/seller/registration/steps/PersonalInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';

const PersonalInfoPage = () => {
  const navigate = useNavigate();
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

  const handleNext = () => {
    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'nationality'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Email invalide');
      return;
    }

    // Si tout est valide, naviguer vers l'étape suivante
    navigate('/seller-registration/shop-info');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
      <TopLoader progress={25} />
      <div className="max-w-5xl mx-auto">
        <PersonalInfoStep 
          data={formData}
          onUpdate={handleUpdate}
        />
        <div className="mt-8 flex justify-end">
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

export default PersonalInfoPage;
