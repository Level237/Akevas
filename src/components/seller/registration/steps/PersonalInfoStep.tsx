import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CalendarIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


import { cn } from '@/lib/utils';

interface PersonalInfoStepProps {
  data: SellerFormData['personalInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files) {
      onUpdate({
        personalInfo: {
          ...data,
          [name]: files[0],
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({
        personalInfo: {
          ...data,
          birthDate: date.toISOString(),
        },
      });
    }
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
            placeholder="John"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            placeholder="Doe"
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
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
         
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationalité</Label>
          <Input
            id="nationality"
            name="nationality"
            value={data.nationality}
            onChange={handleChange}
            placeholder="Française"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthPlace">Lieu de naissance</Label>
          <Input
            id="birthPlace"
            name="birthPlace"
            value={data.birthPlace}
            onChange={handleChange}
            placeholder="Paris"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor="idCardFront">Photo recto de la CNI</Label>
            <div className="flex items-center gap-4">
              <div className="h-32 w-48 rounded-lg bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                {data.idCardFront ? (
                  <img
                    src={URL.createObjectURL(data.idCardFront)}
                    alt="ID Card Front"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Recto de la CNI</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                id="idCardFront"
                name="idCardFront"
                onChange={handleChange}
                accept="image/*"
                className="max-w-[250px]"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor="idCardBack">Photo verso de la CNI</Label>
            <div className="flex items-center gap-4">
              <div className="h-32 w-48 rounded-lg bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                {data.idCardBack ? (
                  <img
                    src={URL.createObjectURL(data.idCardBack)}
                    alt="ID Card Back"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Verso de la CNI</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                id="idCardBack"
                name="idCardBack"
                onChange={handleChange}
                accept="image/*"
                className="max-w-[250px]"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
