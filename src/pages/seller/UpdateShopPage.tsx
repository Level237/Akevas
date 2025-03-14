import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, UserSquare2, ImageIcon, X, PenSquare} from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentSellerQuery, useUpdateDocsMutation } from "@/services/sellerService";
import { SellerResponse } from "@/types/seller";
import IsLoadingComponents from "@/components/ui/isLoadingComponents";


const UpdateShopPage = () => {
  const {data: { data: sellerData } = {},isLoading} = useCurrentSellerQuery<SellerResponse>('seller');
  const [updateDocs]=useUpdateDocsMutation()
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    shop_logo: null,
    identity_card_in_front: null,
    identity_card_in_back: null,
    identity_card_with_the_person: null,
  });
  

  const handleFileUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      });
    }
  };

  const handleRemoveFile = (field: string) => {
    setFormData({
      ...formData,
      [field]: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const formDataObjet = new FormData();
    console.log(formData)
    // Only append if the file exists
    if (formData.shop_logo) formDataObjet.append("shop_profile", formData.shop_logo);
    if (formData.identity_card_in_front) formDataObjet.append("identity_card_in_front", formData.identity_card_in_front);
    if (formData.identity_card_in_back) formDataObjet.append("identity_card_in_back", formData.identity_card_in_back);
    if (formData.identity_card_with_the_person) formDataObjet.append("identity_card_with_the_person", formData.identity_card_with_the_person);
    console.log(formDataObjet.get('shop_profile'))
    const res=await updateDocs(formDataObjet)
    console.log(res)
    setTimeout(() => setUploading(false), 2000);
    sessionStorage.setItem("message","Vous aviez modifié vos documents avec success patientez nous traitons vos données pour confirmer votre boutique")
    window.location.href="/seller/dashboard"
  };



  if (isLoading) {
    return <IsLoadingComponents isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mise à jour de vos documents</h1>
            <p className="mt-2 text-gray-600">
              Mettez à jour vos documents pour validation
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6 space-y-8">
              {/* Logo de la boutique */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <ImageIcon className="w-5 h-5" />
                  <h2>Logo de la boutique</h2>
                </div>

                <div className="flex justify-center">
                  <div className="relative w-40 h-40">
                    <div
                      className="w-full h-full border-2 border-dashed rounded-xl p-4 hover:border-gray-400 transition-colors flex flex-col items-center justify-center cursor-pointer relative"
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload('shop_logo')}
                        accept="image/*"
                      />
                      {formData.shop_logo ? (
                        <div className="text-center relative w-full h-full">
                          <img
                            src={URL.createObjectURL(formData.shop_logo)}
                            alt="Logo preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('shop_logo')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : sellerData?.shop.shop_profile ? (
                        <div className="text-center relative w-full h-full">
                          <img
                            src={sellerData.shop.shop_profile}
                            alt="Logo actuel"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <label
                            htmlFor="shop_logo_input"
                            className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white rounded-full p-1 hover:bg-[#ed7e0f]/90 transition-colors cursor-pointer"
                          >
                            <PenSquare className="w-4 h-4" />
                          </label>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Logo de la boutique</p>
                          <p className="text-xs text-gray-400 mt-1">Format recommandé: 400x400px</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="shop_logo_input"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload('shop_logo')}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              {/* Documents d'identité */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <UserSquare2 className="w-5 h-5" />
                  <h2>Documents d'identité</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Carte d'identité (Recto)",
                      field: "identity_card_in_front",
                      currentImage: sellerData?.identity_card_in_front,
                    },
                    {
                      label: "Carte d'identité (Verso)",
                      field: "identity_card_in_back",
                      currentImage: sellerData?.identity_card_in_back,
                    },
                    {
                      label: "Photo avec la carte",
                      field: "identity_card_with_the_person",
                      currentImage: sellerData?.identity_card_with_the_person,
                    },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className="relative border-2 border-dashed rounded-lg p-4 hover:border-gray-400 transition-colors"
                    >
                      <input
                        id={`${item.field}_input`}
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload(item.field)}
                        accept="image/*"
                      />
                      <div className="text-center min-h-[120px] flex flex-col items-center justify-center">
                        {formData[item.field] ? (
                          <div className="relative w-full">
                            <img
                              src={URL.createObjectURL(formData[item.field])}
                              alt={item.label}
                              className="w-full h-[120px] object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(item.field)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : item.currentImage ? (
                          <div className="relative w-full">
                            <img
                              src={item.currentImage}
                              alt={item.label}
                              className="w-full h-[120px] object-cover rounded-lg"
                            />
                            <label
                              htmlFor={`${item.field}_input`}
                              className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white rounded-full p-1 hover:bg-[#ed7e0f]/90 transition-colors cursor-pointer"
                            >
                              <PenSquare className="w-4 h-4" />
                            </label>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500 mt-2">{item.label}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white"
                  disabled={uploading}
                >
                  {uploading ? "Mise à jour en cours..." : "Mettre à jour les documents"}
                </Button>
              </div>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateShopPage; 