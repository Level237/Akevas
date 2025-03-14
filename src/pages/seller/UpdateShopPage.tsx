import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Store, UserSquare2, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const UpdateShopPage = () => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    shop_description: "",
    shop_gender: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    // Implement your update logic here
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mise à jour de votre boutique</h1>
            <p className="mt-2 text-gray-600">
              Complétez les informations ci-dessous pour mettre à jour votre boutique
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
                      className="w-full h-full border-2 border-dashed rounded-xl p-4 hover:border-gray-400 transition-colors flex flex-col items-center justify-center cursor-pointer"
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload('shop_logo')}
                        accept="image/*"
                      />
                      {formData.shop_logo ? (
                        <div className="text-center">
                          <img
                            src={URL.createObjectURL(formData.shop_logo)}
                            alt="Logo preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Logo de la boutique</p>
                          <p className="text-xs text-gray-400 mt-1">Format recommandé: 400x400px</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de base */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Store className="w-5 h-5" />
                  <h2>Informations de la boutique</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la boutique
                    </label>
                    <Input
                      placeholder="Nom de votre boutique"
                      value={formData.shop_name}
                      onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      placeholder="Décrivez votre boutique..."
                      value={formData.shop_description}
                      onChange={(e) => setFormData({ ...formData, shop_description: e.target.value })}
                      className="h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre principal
                    </label>
                    <Select
                      onValueChange={(value) => setFormData({ ...formData, shop_gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                        <SelectItem value="mixte">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
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
                      field: "identity_card_in_front" as const,
                    },
                    {
                      label: "Carte d'identité (Verso)",
                      field: "identity_card_in_back" as const,
                    },
                    {
                      label: "Photo avec la carte",
                      field: "identity_card_with_the_person" as const,
                    },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className="relative border-2 border-dashed rounded-lg p-4 hover:border-gray-400 transition-colors"
                    >
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload(item.field)}
                        accept="image/*"
                      />
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{item.label}</p>
                        </div>
                        {formData[item.field] && (
                          <p className="text-xs text-green-600 mt-2">Fichier sélectionné</p>
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
                  {uploading ? "Mise à jour en cours..." : "Mettre à jour la boutique"}
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