import React, { useState } from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import PersonalInfoStep from '@/components/seller/registration/steps/PersonalInfoStep';
import ShopInfoStep from '@/components/seller/registration/steps/ShopInfoStep';
import BankInfoStep from '@/components/seller/registration/steps/BankInfoStep';
import AddressInfoStep from '@/components/seller/registration/steps/AddressInfoStep';


const steps = [
  { id: 1, title: 'Informations personnelles' },
  { id: 2, title: 'Informations boutique' },
  { id: 3, title: 'Informations Vendeur' },
  { id: 4, title: 'Adresse' },
];

const SellerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SellerFormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      birthPlace: '',
      nationality: '',
    },
    shopInfo: {
      shopName: '',
      description: '',
      category: '',
      subCategory: '',
    },
    bankInfo: {
      bankName: '',
      accountHolder: '',
      iban: '',
      swift: '',
    },
    addressInfo: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const updateFormData = (stepData: Partial<SellerFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={formData.personalInfo} onUpdate={updateFormData} />;
      case 2:
        return <ShopInfoStep data={formData.shopInfo} onUpdate={updateFormData} />;
      case 3:
        return <BankInfoStep data={formData.bankInfo} onUpdate={updateFormData} />;
      case 4:
        return <AddressInfoStep data={formData.addressInfo} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Devenir Vendeur</h1>
          <p className="mt-2 text-gray-600">Complétez les informations suivantes pour créer votre compte vendeur</p>
        </div>

        <Card className="bg-white p-6 rounded-lg shadow-sm">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                        ${currentStep > step.id
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : currentStep === step.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-gray-300 text-gray-300'
                        }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="mt-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>

            <Button
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {currentStep === steps.length ? (
                'Terminer'
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SellerRegistration;
