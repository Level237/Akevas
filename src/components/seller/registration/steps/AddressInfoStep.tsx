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



  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Adresse</h2>
        <p className="text-sm text-muted-foreground">
          Renseignez l'adresse de votre boutique ou votre residence personnelle
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Select
                id="city"
                name="city"
                value={data.city}
                onChange={handleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paris">Paris</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
            <Label htmlFor="street">Quartier</Label>
            <Input
              id="street"
              name="street"
              value={data.street}
              onChange={handleChange}
              className="py-6"
              placeholder="123 rue de la Paix"
            />
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
