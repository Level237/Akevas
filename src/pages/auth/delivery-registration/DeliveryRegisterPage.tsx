import React, { useState } from 'react';

import {
  User,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import TopLoader from '@/components/ui/top-loader';
import { useCheckIfEmailExistsMutation, useGetQuartersQuery } from '@/services/guardService';
import { useGetTownsQuery } from '@/services/guardService';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import { SelectTrigger } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import { setPersonalInfoDelivery } from '@/store/delivery/deliverySlice';
const steps = [
  {
    id: 1,
    name: 'Informations personnelles',
    icon: User,
    route: '/delivery/register'
  },
  {
    id: 2,
    name: 'Véhicule',
    icon: Truck,
    route: '/delivery/vehicle'
  },
  {
    id: 3,
    name: 'Zone de livraison',
    icon: MapPin,
    route: '/delivery/zone'
  },
  {
    id: 4,
    name: 'Documents',
    icon: FileText,
    route: '/delivery/documents'
  },
  {
    id: 5,
    name: 'Validation',
    icon: CheckCircle,
    route: '/delivery/validation'
  }
];


const DeliveryRegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const [checkIfEmailExists] = useCheckIfEmailExistsMutation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    nationality: '',
    city: '',
    quarter: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');
  const [townId, setTownId] = useState<string>('');
  const navigate = useNavigate();
  const filteredQuarters = quarters?.quarters.filter((quarter: { town_id: number }) => quarter.town_id === parseInt(townId));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'nationality', 'city', 'quarter'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      
      toast.error('Veuillez remplir tous les champs obligatoires', {
        description: "Tous les champs marqués d'un * sont requis.",
        duration: 4000, // ms
      });
      return;
    }
    const form = new FormData()
    form.append("email", formData.email)
    form.append("phone", formData.phone)
    const response = await checkIfEmailExists(form)
    console.log(response)
    if (response.error) {
      
      toast.error('Ce mail ou ce numéro de téléphone existe déjà', {
       
        duration: 4000, // ms
      });
      return;
    }

    setIsLoading(true);
    // Implement form submission
    //console.log(formData);
    const deliveryData = {
      ...formData,
      town_id: parseInt(townId),
      quarter_id: parseInt(formData.quarter)
    };
    dispatch(setPersonalInfoDelivery(deliveryData));
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    navigate('/delivery/vehicle');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">

        <ScrollRestoration />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              <TopLoader progress={20} />
              Devenir livreur partenaire
            </h1>
            <p className="mt-2 text-gray-600">
              Rejoignez notre réseau de livreurs et gagnez un revenu supplémentaire
            </p>
          </div>

          {/* Progress Steps */}
          <nav className="mb-8 max-sm:hidden">
            <ol className="flex items-center justify-center space-x-8">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${step.id === 1
                        ? 'bg-[#ed7e0f] text-white'
                        : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className="hidden sm:block w-24 h-0.5 bg-gray-200 ml-4" />
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm font-medium ${step.id === 1 ? 'text-[#ed7e0f]' : 'text-gray-500'
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Informations personnelles
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"

                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"

                      />
                    </div>
                  </div>

                  <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"

                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"

                      />
                    </div>
                  </div>

                  <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        min="1950-01-01"
                        max="2008-01-01"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"

                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationalité
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"

                      />
                    </div>
                  </div>



                  <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Select
                        name="city"
                        onValueChange={(value) => {
                          setTownId(value);
                          setFormData(prev => ({
                            ...prev,
                            city: value,
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {townsLoading ? (
                            <SelectItem value="loading">Chargement des villes...</SelectItem>
                          ) : (
                            towns?.towns.map((town: { id: string, town_name: string }) => (
                              <SelectItem key={town.id} value={String(town.id)}>
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
                          setFormData(prev => ({
                            ...prev,
                            quarter: value,
                          }));
                        }}
                        disabled={quartersLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un quartier" />
                        </SelectTrigger>
                        <SelectContent>
                          {quartersLoading ? (
                            <SelectItem value="loading">Chargement des quartiers...</SelectItem>
                          ) : (
                            filteredQuarters?.map((quarter: { id: string, quarter_name: string }) => (
                              <SelectItem key={quarter.id} value={String(quarter.id)}>
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

                  <div className="flex justify-end">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors flex items-center gap-2"
                    >
                      {isLoading ? <div className='flex items-center gap-2'><Loader2 className='w-4 h-4 animate-spin' />Chargement...</div> : 'Suivant'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-[#ed7e0f]" />
                </div>
                <h3 className="font-medium mb-2">Flexibilité totale</h3>
                <p className="text-gray-600 text-sm">
                  Choisissez vos horaires et zones de livraison
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-[#ed7e0f]" />
                </div>
                <h3 className="font-medium mb-2">Revenus attractifs</h3>
                <p className="text-gray-600 text-sm">
                  Gagnez un revenu complémentaire intéressant
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#ed7e0f]" />
                </div>
                <h3 className="font-medium mb-2">Support dédié</h3>
                <p className="text-gray-600 text-sm">
                  Une équipe à votre écoute 7j/7
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default DeliveryRegisterPage;
