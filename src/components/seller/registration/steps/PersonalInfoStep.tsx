import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


interface PersonalInfoStepProps {
  data: SellerFormData['personalInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if(name=="phone"){
      const valueEmpty=value.replace(/^\+?237\s?/, '')
      onUpdate({
        personalInfo: {
          ...data,
          [name]: valueEmpty,
        },
      });
      return;
    }

    onUpdate({
      personalInfo: {
        ...data,
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Informations Personnelles</h2>
        <p className="text-sm text-muted-foreground">
          Remplissez vos informations personnelles pour commencer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
            placeholder="Entrez votre prénom"
            className="py-6 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            className="py-6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            className="py-6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <div className="flex items-center bg-white/80 rounded-xl shadow-sm border border-gray-200 focus-within:border-blue-500 transition-all">
          <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-l-xl border-none focus:outline-none cursor-default"
                tabIndex={-1}
                disabled
              >
                <span role="img" aria-label="Cameroun" className="text-white text-sm">🇨🇲</span>
              </button>
              <span className="px-3 text-gray-700 font-semibold select-none text-sm bg-gray-50">+237</span>
              <Input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="Entrez votre numéro de téléphone"
           className="flex-1 h-12 border-none bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 rounded-r-xl"
          />
          </div>
         
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            type="date"
            id="birthDate"
            name="birthDate"
            min="1950-01-01" 
            max="2008-01-01"
            value={data.birthDate}
            onChange={handleChange}
            className="py-6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationalité</Label>
          <Input
            id="nationality"
            name="nationality"
            value={data.nationality}
            onChange={handleChange}
            placeholder="Entrez votre nationalité"
            className="py-6"
          />
        </div>
      </div>

      
    </div>
  );
};

export default PersonalInfoStep;