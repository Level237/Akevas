import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdentityStepProps } from "@/interfaces/steps/IdentityStepProps";
import { Upload } from "lucide-react";


const IdentityInfoStep: React.FC<IdentityStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, files } = e.target;
    const reader = new FileReader();
    if (type === 'file' && files) {
      
      
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
        reader.readAsDataURL(files[0]);
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
         reader.readAsDataURL(files[0]);
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
        reader.readAsDataURL(files[0]);
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
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
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
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
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
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
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
