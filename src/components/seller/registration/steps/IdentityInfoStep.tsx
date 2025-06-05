import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdentityStepProps } from "@/interfaces/steps/IdentityStepProps";
import { Upload } from "lucide-react";
import { toast } from 'sonner';

const IdentityInfoStep: React.FC<IdentityStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, files } = e.target;
    const reader = new FileReader();
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const maxSize = 2 * 1024 * 1024; // 2 Mo en octets

      if (file.size > maxSize) {
       
        toast.error("Le fichier ne doit pas dépasser 2 Mo.", {
          description: "Choisir un fichier en dessous de 2Mo",
          duration: 4000, // ms
        });
        return;
      }

      if(name === 'identity_card_in_front'){
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          onUpdate({
            identityInfo: {
              ...data,
              [name]: base64,
            },
          });
        };
        reader.readAsDataURL(file);
      }
      else if(name === 'identity_card_in_back'){
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          onUpdate({
            identityInfo: {
              ...data,
              [name]: base64,
            },
          });
        }
         reader.readAsDataURL(file);
      }
      else if(name === 'identity_card_with_the_person'){
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          onUpdate({
            identityInfo: {
              ...data,
              [name]: base64,
            },
          });
        }
        reader.readAsDataURL(file);
      }
     
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Identification nationales</h2>
        <p className="text-sm text-muted-foreground">
          Identifiez vous en renseignant vos documents nationaux
        </p>
      </div>

     

      <div  className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="identity_card_in_front" className="text-sm font-medium text-gray-700">
              Photo recto de la CNI ou passport <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.identity_card_in_front ? (
                  <img
                    src={data.identity_card_in_front}
                    alt="ID Card Front" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg
                      className="mx-auto h-10 w-16 text-[#ed7e0f]"
                      viewBox="0 0 64 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      
                      <rect x="2" y="4" width="60" height="32" rx="4" fill="#fff" stroke="#ed7e0f" strokeWidth="2"/>
                      
                      <circle cx="14" cy="20" r="6" fill="#ed7e0f" fillOpacity="0.7"/>
                      <rect x="10" y="28" width="8" height="4" rx="2" fill="#ed7e0f" fillOpacity="0.5"/>
                     
                      <rect x="26" y="12" width="28" height="4" rx="2" fill="#ed7e0f" fillOpacity="0.2"/>
                      <rect x="26" y="20" width="22" height="3" rx="1.5" fill="#ed7e0f" fillOpacity="0.2"/>
                      <rect x="26" y="26" width="18" height="3" rx="1.5" fill="#ed7e0f" fillOpacity="0.2"/>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Recto de la CNI</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                id="identity_card_in_front"
                name="identity_card_in_front"
                onChange={handleChange}
                accept="image/*"
                className="w-full text-sm"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardBack" className="text-sm font-medium text-gray-700">
              Photo verso de la CNI <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.identity_card_in_back ? (
                  <img
                    src={data.identity_card_in_back}
                    alt="ID Card Back"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg
                      className="mx-auto h-10 w-16 text-[#ed7e0f]"
                      viewBox="0 0 64 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="4" width="60" height="32" rx="4" fill="#fff" stroke="#ed7e0f" strokeWidth="2"/>
                      <rect x="8" y="10" width="48" height="6" rx="2" fill="#ed7e0f" fillOpacity="0.7"/>
                      <rect x="8" y="20" width="40" height="3" rx="1.5" fill="#ed7e0f" fillOpacity="0.2"/>
                      <rect x="8" y="26" width="32" height="3" rx="1.5" fill="#ed7e0f" fillOpacity="0.2"/>
                      <rect x="8" y="32" width="24" height="3" rx="1.5" fill="#ed7e0f" fillOpacity="0.2"/>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Verso de la CNI</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                id="identity_card_in_back"
                name="identity_card_in_back"
                onChange={handleChange}
                accept="image/*"
                className="w-full text-sm"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardPassport" className="text-sm font-medium text-gray-700">
              Photo de vous avec votre CNI <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.identity_card_with_the_person ? (
                  <img
                    src={data.identity_card_with_the_person}
                    alt="Passport"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <svg
                      className="mx-auto h-12 w-16 text-[#ed7e0f]"
                      viewBox="0 0 80 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="40" y="28" width="32" height="18" rx="3" fill="#fff" stroke="#ed7e0f" strokeWidth="2"/>
                      <rect x="44" y="32" width="24" height="3" rx="1.5" fill="#ed7e0f" fillOpacity="0.2"/>
                      <rect x="44" y="37" width="16" height="2.5" rx="1.2" fill="#ed7e0f" fillOpacity="0.2"/>
                      <rect x="44" y="42" width="12" height="2.5" rx="1.2" fill="#ed7e0f" fillOpacity="0.2"/>
                      <ellipse cx="40" cy="44" rx="4" ry="2" fill="#ed7e0f" fillOpacity="0.7"/>
                      <circle cx="24" cy="32" r="8" fill="#ed7e0f" fillOpacity="0.7"/>
                      <rect x="16" y="40" width="16" height="10" rx="5" fill="#ed7e0f" fillOpacity="0.5"/>
                      <rect x="28" y="44" width="16" height="4" rx="2" fill="#ed7e0f" fillOpacity="0.7" transform="rotate(-10 28 44)"/>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">profil + CNI</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                id="identity_card_with_the_person"
                name="identity_card_with_the_person"
                onChange={handleChange}
                accept="image/*"
                className="w-full text-sm"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IdentityInfoStep;
