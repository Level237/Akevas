import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IdentityStepProps } from "@/interfaces/steps/IdentityStepProps";
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
        console.log("lrv")
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
              <div className="relative group h-full w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.identity_card_in_front ? (
                  <img
                    src={data.identity_card_in_front}
                    alt="ID Card Front" 
                    className="h-44 w-96 object-cover"
                  />
                ) : (
                  <label className="cursor-pointer group relative block h-full">
                    <input
                      type="file"
                      className="hidden"
                      name="identity_card_in_front"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="text-center p-4 h-full flex flex-col items-center justify-center  rounded-lg group-hover:border-[#ed7e0f] transition-colors duration-200">
                      <svg
                        className="mx-auto h-10 w-16 text-[#ed7e0f] group-hover:scale-110 transition-transform duration-200"
                        viewBox="0 0 64 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="4" width="60" height="32" rx="4" fill="#fff" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="14" cy="20" r="6" fill="currentColor" fillOpacity="0.7"/>
                        <rect x="10" y="28" width="8" height="4" rx="2" fill="currentColor" fillOpacity="0.5"/>
                        <rect x="26" y="12" width="28" height="4" rx="2" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="26" y="20" width="22" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="26" y="26" width="18" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500 group-hover:text-[#ed7e0f]">Cliquez pour ajouter le recto de la CNI</p>
                      <p className="mt-1 text-xs text-gray-400">Format accepté : JPG, PNG</p>
                    </div>
                  </label>
                )}
                {data.identity_card_in_front && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onUpdate({
                          identityInfo: {
                            ...data,
                            identity_card_in_front: null
                          },
                        });
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardBack" className="text-sm font-medium text-gray-700">
              Photo verso de la CNI <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative group h-full w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.identity_card_in_back ? (
                  <img
                    src={data.identity_card_in_back}
                    alt="ID Card Back" 
                    className="h-44 w-96 object-cover"
                  />
                ) : (
                  <label className="cursor-pointer group relative block h-full">
                    <input
                      type="file"
                       id="identity_card_in_back"
                      name="identity_card_in_back"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="text-center p-4 h-full flex flex-col items-center justify-center  rounded-lg group-hover:border-[#ed7e0f] transition-colors duration-200">
                      <svg
                        className="mx-auto h-10 w-16 text-[#ed7e0f] group-hover:scale-110 transition-transform duration-200"
                        viewBox="0 0 64 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="4" width="60" height="32" rx="4" fill="#fff" stroke="currentColor" strokeWidth="2"/>
                        <rect x="8" y="10" width="48" height="6" rx="2" fill="currentColor" fillOpacity="0.7"/>
                        <rect x="8" y="20" width="40" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="8" y="26" width="32" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="8" y="32" width="24" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500 group-hover:text-[#ed7e0f]">Cliquez pour ajouter le verso de la CNI</p>
                      <p className="mt-1 text-xs text-gray-400">Format accepté : JPG, PNG</p>
                    </div>
                  </label>
                )}
                {data.identity_card_in_back && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onUpdate({
                          identityInfo: {
                            ...data,
                            identity_card_in_back: null
                          },
                        });
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-3">
            <Label htmlFor="idCardPassport" className="text-sm font-medium text-gray-700">
              Photo de vous avec votre CNI <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col items-center gap-4">
              <div className=" w-full rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 
                flex flex-col items-center justify-center overflow-hidden hover:border-[#ed7e0f]
                transition-colors duration-200">
                {data.identity_card_with_the_person ? (
                  <div className="relative group h-full">
                    <img
                      src={data.identity_card_with_the_person}
                      alt="Profile with ID"
                      className="h-44 w-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onUpdate({
                            identityInfo: {
                              ...data,
                              identity_card_with_the_person: null
                            },
                          });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer group relative block h-full">
                    <input
                      type="file"
                      className="hidden"
                      id="identity_card_with_the_person"
                      name="identity_card_with_the_person"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="text-center p-4 h-full flex flex-col items-center justify-center rounded-lg group-hover:border-[#ed7e0f] transition-colors duration-200">
                      <svg
                        className="mx-auto h-12 w-16 text-[#ed7e0f] group-hover:scale-110 transition-transform duration-200"
                        viewBox="0 0 80 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="40" y="28" width="32" height="18" rx="3" fill="#fff" stroke="currentColor" strokeWidth="2"/>
                        <rect x="44" y="32" width="24" height="3" rx="1.5" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="44" y="37" width="16" height="2.5" rx="1.2" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="44" y="42" width="12" height="2.5" rx="1.2" fill="currentColor" fillOpacity="0.2"/>
                        <ellipse cx="40" cy="44" rx="4" ry="2" fill="currentColor" fillOpacity="0.7"/>
                        <circle cx="24" cy="32" r="8" fill="currentColor" fillOpacity="0.7"/>
                        <rect x="16" y="40" width="16" height="10" rx="5" fill="currentColor" fillOpacity="0.5"/>
                        <rect x="28" y="44" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.7" transform="rotate(-10 28 44)"/>
                      </svg>
                      
                      <p className="mt-1 text-xs text-gray-400">Format accepté : JPG, PNG</p>
                      <p className="mt-1 text-xs text-gray-400 italic">Tenez votre CNI à côté de votre visage</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IdentityInfoStep;
