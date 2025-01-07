import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdentityStepProps } from "@/interfaces/steps/IdentityStepProps";
import { Upload } from "lucide-react";


const IdentityInfoStep: React.FC<IdentityStepProps> = ({ data, onUpdate }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files) {
      onUpdate({
        identityInfo: {
          ...data,
          [name]: files[0],
        },
      });
      return;
    }

    onUpdate({
      identityInfo: {
        ...data,
        [name]: value,
      },
    });
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
            <Label htmlFor="idCardFront" className="text-sm font-medium text-gray-700">
              Photo recto de la CNI ou passport <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
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
                {data.idCardPassport ? (
                  <img
                    src={URL.createObjectURL(data.idCardPassport)}
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
                id="idCardPassport"
                name="idCardPassport"
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
