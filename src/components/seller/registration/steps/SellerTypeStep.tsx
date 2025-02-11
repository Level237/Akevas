import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SellerTypeStepProps {
  data: SellerFormData['bankInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const SellerTypeStep: React.FC<SellerTypeStepProps> = ({ data, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      bankInfo: {
        ...data,
        [name]: value,
      },
    });
  };

  const handleSellerTypeChange = (value: string) => {
    onUpdate({
      bankInfo: {
        ...data,
        sellerType: value, // Reset sub-category when category changes
      },
    });
  };
  const handleProductTypeChange = (value: string) => {
    onUpdate({
      bankInfo: {
        ...data,
        productType: value, // Reset sub-category when category changes
      },
    });
  };


  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Informations Vendeur</h2>
        <p className="text-sm text-muted-foreground">
          Ajoutez vos informations en tant que vendeur sur notre plateforme
        </p>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Quel type de vendeur etes vous?</Label>
            <Select
            name='sellerType'
            value={data.sellerType}
              onValueChange={handleSellerTypeChange}
            >
              <SelectTrigger className="py-6">
                <SelectValue placeholder="Sélectionnez une reponse" />
              </SelectTrigger>
              <SelectContent>
                
                  <SelectItem key="0" value="0">
                      Grossiste
                  </SelectItem>
                
                  <SelectItem key="1" value="1">
                      Detaillant
                  </SelectItem>
                  <SelectItem key="2" value="2">
                      Les deux
                  </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Vos produits sont?</Label>
            <Select
            name='productType'
            value={data.productType}
              onValueChange={handleProductTypeChange}
            >
              <SelectTrigger className="py-6">
                <SelectValue placeholder="Sélectionnez une reponse" />
              </SelectTrigger>
              <SelectContent>
                
                  <SelectItem key="0" value="0">
                      Boutique
                  </SelectItem>
                
                  <SelectItem key="1" value="1">
                      Friperie
                  </SelectItem>

                  <SelectItem key="2" value="2">
                      les deux
                  </SelectItem>
              </SelectContent>
            </Select>
          </div>
         
        </div>

      <div className="text-sm text-muted-foreground">
        <p>* Ces informations sont nécessaires pour le versement de vos revenus</p>
        <p>* Assurez-vous que les informations sont correctes pour éviter tout retard de paiement</p>
      </div>
    </div>
  );
};

export default SellerTypeStep;
