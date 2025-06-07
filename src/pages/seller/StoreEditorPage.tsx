import { useState } from 'react';
import {
  MapPin, Store, User,
  Flag,
  Camera, Eye,Plus, Save,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';

export default function StoreEditorPage() {
  const [activeSection, setActiveSection] = useState('general');
  const { data: { data: sellerData } = {} } = useCurrentSellerQuery('seller');
  const [isUploading, setIsUploading] = useState(false);

  // Ajout des states pour gérer les modifications
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    console.log(type)
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2 Mo
      if (file.size > maxSize) {
        toast.error("Le fichier ne doit pas dépasser 2 Mo.", {
          description: "Choisir un fichier en dessous de 2Mo",
          duration: 4000,
        });
        return;
      }
      // Gérer l'upload
      setIsUploading(true);
      // Simulation d'upload
      setTimeout(() => {
        setIsUploading(false);
        toast.success("Image téléchargée avec succès");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête fixe avec effet de glassmorphism */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="gap-2 hover:bg-gray-100/50" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button variant="ghost" className="gap-2 hover:bg-gray-100/50">
              <Eye className="w-4 h-4" />
              Prévisualiser
            </Button>
          </div>
          <Button 
            className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 gap-2"
            disabled={isUploading}
          >
            <Save className="w-4 h-4" />
            {isUploading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Contenu principal avec animation */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar améliorée */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Paramètres</h2>
                  <p className="text-sm text-gray-500">Gérez les informations de votre boutique</p>
                </div>
                <nav className="space-y-1">
                  {[
                    { id: 'general', icon: Store, label: 'Informations générales' },
                    { id: 'personal', icon: User, label: 'Informations personnelles' },
                    { id: 'identity', icon: Flag, label: 'Documents d\'identité' },
                    { id: 'location', icon: MapPin, label: 'Localisation' },
                    { id: 'media', icon: Camera, label: 'Médias' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === item.id 
                          ? 'bg-[#ed7e0f]/10 text-[#ed7e0f]' 
                          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${
                        activeSection === item.id 
                          ? 'text-[#ed7e0f]' 
                          : 'text-gray-400'
                      }`} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenu principal avec animations */}
            <div className="lg:col-span-3 space-y-8">
              {activeSection === 'general' && (
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Informations de la boutique</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Niveau {sellerData?.shop?.level} • {sellerData?.shop?.products_count} produits
                      </p>
                </div>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom de la boutique</label>
                      <Input 
                        defaultValue={sellerData?.shop?.shop_name}
                        placeholder="Nom de votre boutique"
                        className="transition-all duration-200 focus:ring-2 focus:ring-[#ed7e0f]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type de produits</label>
                      <Select defaultValue={sellerData?.shop?.product_type}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Boutique</SelectItem>
                          <SelectItem value="1">Friperie</SelectItem>
                          <SelectItem value="2">Les deux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea 
                      defaultValue={sellerData?.shop?.shop_description}
                      placeholder="Décrivez votre boutique..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Catégories</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                      {sellerData?.shop?.categories?.map((category: any) => (
                        <Badge 
                          key={category.id}
                          className="bg-[#ed7e0f]/10 text-[#ed7e0f] hover:bg-[#ed7e0f]/20"
                        >
                          {category.category_name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Type de vendeur</label>
                    <div className="flex gap-4">
                      {[
                        { id: 'retail', label: 'Détaillant' },
                        { id: 'wholesale', label: 'Grossiste' }
                      ].map(type => (
                        <label key={type.id} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                          <input 
                            type="radio" 
                            name="sellerType" 
                            value={type.id}
                            className="text-[#ed7e0f] focus:ring-[#ed7e0f]" 
                          />
                          {type.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'personal' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Prénom</label>
                        <Input 
                          defaultValue={sellerData?.firstName}
                          placeholder="Votre prénom" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nom</label>
                        <Input 
                          defaultValue={sellerData?.lastName}
                          placeholder="Votre nom" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input 
                          type="email" 
                          defaultValue={sellerData?.email}
                          placeholder="votre@email.com" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Téléphone</label>
                        <Input 
                          defaultValue={sellerData?.phone_number}
                          placeholder="Votre numéro" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date de naissance</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nationalité</label>
                        <Select>
                          <option>Sélectionnez votre nationalité</option>
                        </Select>
              </div>
            </div>
          </div>
        </div>
              )}

              {activeSection === 'identity' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Documents d'identité</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">CNI Recto</label>
                        <div className="relative group">
                          {sellerData?.identity_card_in_front ? (
                            <div className="relative">
                              <img 
                                src={sellerData.identity_card_in_front}
                                alt="CNI Recto"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <Button variant="destructive" size="sm">Modifier</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                              <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CNI Verso</label>
                        <div className="relative group">
                          {sellerData?.identity_card_in_front ? (
                            <div className="relative">
                              <img 
                                src={sellerData.identity_card_in_back}
                                alt="CNI Verso"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <Button variant="destructive" size="sm">Modifier</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                              <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Photo avec CNI</label>
                      <div className="relative group">
                          {sellerData?.identity_card_in_front ? (
                            <div className="relative">
                              <img 
                                src={sellerData.identity_card_with_the_person}
                                alt="CNI Verso"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <Button variant="destructive" size="sm">Modifier</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                              <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                            </div>
                          )}
                        </div>
            </div>
          </div>
        </div>
              )}

              {activeSection === 'location' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Localisation</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ville</label>
                        <Select defaultValue={sellerData?.shop?.town}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une ville" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Douala">Douala</SelectItem>
                            <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                          </SelectContent>
                        </Select>
      </div>
            <div>
                        <label className="block text-sm font-medium mb-2">Quartier</label>
              <Input
                          defaultValue={sellerData?.shop?.quarter}
                          placeholder="Votre quartier"
              />
            </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'media' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Médias</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Photo de profil</label>
                      <div className="relative group">
                        {sellerData?.shop?.shop_profile ? (
                          <div className="relative">
                            <img 
                              src={sellerData.shop.shop_profile}
                              alt="Profile"
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                              transition-opacity duration-200 rounded-lg flex items-center justify-center">
                              <Button variant="destructive" size="sm">Modifier</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'profile')}
                              id="profile-upload"
                            />
                            <label 
                              htmlFor="profile-upload"
                              className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                                transition-all duration-200 group-hover:border-[#ed7e0f] group-hover:bg-[#ed7e0f]/5"
                            >
                              <Camera className="w-8 h-8 mx-auto text-gray-400 group-hover:text-[#ed7e0f] mb-2" />
                              <p className="text-sm text-gray-500 group-hover:text-[#ed7e0f]">
                                Cliquez pour télécharger
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Format recommandé : 200x200 px (Max 2Mo)
                              </p>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

            <div>
                      <label className="block text-sm font-medium mb-2">Images de la boutique</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sellerData?.shop?.images?.map((image: any, index: number) => (
                          <div key={index} className="relative group aspect-square">
                            <img 
                              src={image.path}
                              alt={`Boutique ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                              transition-opacity duration-200 rounded-lg flex items-center justify-center">
                              <Button variant="destructive" size="sm">Supprimer</Button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Bouton d'ajout si moins de 3 images */}
                        {(sellerData?.shop?.images?.length || 0) < 3 && (
                          <div className="relative group aspect-square">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'gallery')}
                              id="gallery-upload"
                              multiple
                            />
                            <label 
                              htmlFor="gallery-upload"
                              className="flex flex-col items-center justify-center w-full h-full border-2 
                                border-dashed rounded-lg cursor-pointer transition-all duration-200 
                                group-hover:border-[#ed7e0f] group-hover:bg-[#ed7e0f]/5"
                            >
                              <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#ed7e0f] mb-2" />
                              <p className="text-sm text-gray-500 group-hover:text-[#ed7e0f]">Ajouter</p>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 