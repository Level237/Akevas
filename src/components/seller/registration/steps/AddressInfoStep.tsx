import React from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetTownsQuery, useGetQuartersQuery } from '@/services/guardService';
interface AddressInfoStepProps {
  data: SellerFormData['addressInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}



const AddressInfoStep: React.FC<AddressInfoStepProps> = ({ data, onUpdate }) => {

  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');

  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');


  const filteredQuarters = quarters?.quarters.filter((quarter: { town_id: string }) => quarter.town_id === data.city);
  


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
                name="city"
                onValueChange={(value) => {
                  onUpdate({
                    addressInfo: {
                      ...data,
                      city: value,
                    },
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une ville" />
                </SelectTrigger>
                <SelectContent>
                  {townsLoading ? (
                    <SelectItem value="loading">Chargement des villes...</SelectItem>
                  ) : (
                    towns?.towns.map((town:{id:string,town_name:string}) => (
                      <SelectItem key={town.id} value={town.id}>
                        {town.town_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
            <Label htmlFor="street">Quartier</Label>
            <Select 
            name="quarter"
            onValueChange={(value) => {
              onUpdate({
                addressInfo: {
                  ...data,
                  street: value,
                },
              });
            }}
            disabled={quartersLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un quartier" />
              </SelectTrigger>
              <SelectContent>
                {quartersLoading ? (
                  <SelectItem value="loading">Chargement des quartiers...</SelectItem>
                ) : (
                  filteredQuarters?.map((quarter:{id:string,quarter_name:string}) => (
                    <SelectItem key={quarter.id} value={quarter.id}>
                      {quarter.quarter_name}
                    </SelectItem>
                  ))
                )}
                {filteredQuarters?.length === 0 && (
                  <SelectItem value="no-quarters">Aucun quartier trouvé,veuillez verifier votre ville</SelectItem>
                )}
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
