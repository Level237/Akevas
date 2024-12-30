import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BankInfoStepProps {
  data: SellerFormData['bankInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const BankInfoStep: React.FC<BankInfoStepProps> = ({ data, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      bankInfo: {
        ...data,
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Informations Bancaires</h2>
        <p className="text-sm text-muted-foreground">
          Ajoutez vos informations bancaires pour recevoir vos paiements
        </p>
      </div>

      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Vos informations bancaires sont sécurisées et ne seront utilisées que pour les virements de vos ventes
        </AlertDescription>
      </Alert>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="bankName">Nom de la banque</Label>
            <Input
              id="bankName"
              name="bankName"
              value={data.bankName}
              onChange={handleChange}
              placeholder="BNP Paribas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolder">Titulaire du compte</Label>
            <Input
              id="accountHolder"
              name="accountHolder"
              value={data.accountHolder}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">IBAN</Label>
          <Input
            id="iban"
            name="iban"
            value={data.iban}
            onChange={handleChange}
            placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            className="uppercase"
          />
          <p className="text-sm text-muted-foreground">
            Format: FR76 XXXX XXXX XXXX XXXX XXXX XXX
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="swift">Code SWIFT/BIC</Label>
          <Input
            id="swift"
            name="swift"
            value={data.swift}
            onChange={handleChange}
            placeholder="BNPAFRPPXXX"
            className="uppercase"
          />
          <p className="text-sm text-muted-foreground">
            Le code SWIFT/BIC est disponible sur votre RIB
          </p>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>* Ces informations sont nécessaires pour le versement de vos revenus</p>
        <p>* Assurez-vous que les informations sont correctes pour éviter tout retard de paiement</p>
      </div>
    </div>
  );
};

export default BankInfoStep;
