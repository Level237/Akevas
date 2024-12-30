import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddressInfoStepProps {
  data: SellerFormData['addressInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const countries = [
  'France',
  'Belgique',
  'Suisse',
  'Luxembourg',
  'Canada',
  'Autre',
];

const AddressInfoStep: React.FC<AddressInfoStepProps> = ({ data, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      addressInfo: {
        ...data,
        [name]: value,
      },
    });
  };

  const handleCountryChange = (value: string) => {
    onUpdate({
      addressInfo: {
        ...data,
        country: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Adresse</h2>
        <p className="text-sm text-muted-foreground">
          Renseignez l'adresse de votre entreprise
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="street">Rue</Label>
            <Input
              id="street"
              name="street"
              value={data.street}
              onChange={handleChange}
              placeholder="123 rue de la Paix"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                value={data.city}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Région</Label>
              <Input
                id="state"
                name="state"
                value={data.state}
                onChange={handleChange}
                placeholder="Île-de-France"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={data.postalCode}
                onChange={handleChange}
                placeholder="75000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select
                value={data.country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>* Cette adresse sera utilisée pour la facturation et la correspondance</p>
        <p>* Assurez-vous que l'adresse est valide et complète</p>
      </div>
    </div>
  );
};

export default AddressInfoStep;
