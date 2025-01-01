import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressInfoStep from '@/components/seller/registration/steps/AddressInfoStep';
import { SellerFormData } from '@/types/seller-registration.types';
import TopLoader from '@/components/ui/top-loader';

const AddressInfoPage = () => {
  const navigate = useNavigate();
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
    navigate('/seller-registration/bank-info');
  };

  const handleSubmit = () => {
    // Validation
    const requiredFields = ['street', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Ici, vous pouvez ajouter la logique pour soumettre toutes les données
    console.log('Données à envoyer:', formData);
    // Après succès, rediriger vers une page de confirmation
    navigate('/seller-registration/success');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
      <TopLoader progress={100} />
      <div className="max-w-5xl mx-auto">
        <AddressInfoStep 
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
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Terminer l'inscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoPage;
