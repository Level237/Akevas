import React, { useState } from 'react';
import {
  User,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import AsyncLink from '@/components/ui/AsyncLink';
import { Button } from '@/components/ui/button';
import { useGetTownsQuery } from '@/services/guardService';
import { useGetQuartersQuery } from '@/services/guardService';
import { setDeliveryZone } from '@/store/delivery/deliverySlice';
import { useDispatch } from 'react-redux';
import TopLoader from '@/components/ui/top-loader';
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
    route: '/delivery/register/vehicle'
  },
  {
    id: 3,
    name: 'Zone de livraison',
    icon: MapPin,
    route: '/delivery/register/zone'
  },
  {
    id: 4,
    name: 'Documents',
    icon: FileText,
    route: '/delivery/register/documents'
  },
  {
    id: 5,
    name: 'Validation',
    icon: CheckCircle,
    route: '/delivery/register/validation'
  }
];


const DeliveryZonePage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const dispatch=useDispatch();
  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const { data: quarters } = useGetQuartersQuery('guard');
  const handleDistrictToggle = (districtId: string) => {
    if (selectedDistricts.includes(districtId)) {
      setSelectedDistricts(selectedDistricts.filter(d => d !== districtId));
    } else {
      setSelectedDistricts([...selectedDistricts, districtId]);
    }
  };
  const navigate=useNavigate()
 const filteredQuarters = quarters?.quarters.filter((quarter: { town_id: number }) => quarter.town_id === parseInt(selectedCity));
 
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    setIsLoading(true); 
   await new Promise(resolve => setTimeout(resolve, 500));
 const dataZone={
  selectedQuarters:JSON.stringify(selectedDistricts)
 }
  dispatch(setDeliveryZone(dataZone));
  navigate('/delivery/documents');
  setIsLoading(false);
}
  return (
    <div className="min-h-screen bg-gray-50">
     <ScrollRestoration />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <TopLoader progress={60} />
            Zone de livraison
          </h1>
          <p className="mt-2 text-gray-600">
            Sélectionnez les zones où vous souhaitez effectuer des livraisons
          </p>
        </div>

        {/* Progress Steps */}
        <nav className="mb-8 max-sm:hidden">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.id <= 3
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
                    className={`text-sm font-medium ${
                      step.id <= 3 ? 'text-[#ed7e0f]' : 'text-gray-500'
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
        <form onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Sélectionnez votre ville
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!townsLoading && towns?.towns.map((city:{id:string,town_name:string}) => (
                    <button
                    type='button'
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        selectedCity === city.id
                          ? 'border-[#ed7e0f] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className={`w-6 h-6 mb-2 ${
                        selectedCity === city.id ? 'text-[#ed7e0f]' : 'text-gray-400'
                      }`} />
                      <h3 className="font-medium">{city.town_name}</h3>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCity && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Sélectionnez vos quartiers de livraison
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredQuarters?.map((district:{id:string,quarter_name:string}) => (
                      <button
                        type='button'
                        key={district.id}
                        onClick={() => handleDistrictToggle(district.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedDistricts.includes(district.id)
                            ? 'border-[#ed7e0f] bg-orange-50 text-[#ed7e0f]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {district.quarter_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t flex justify-between">
              <AsyncLink
                to="/delivery/vehicle"
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Retour
              </AsyncLink>

              <Button
                type="submit"
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  selectedCity && selectedDistricts.length > 0
                    ? 'bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/80'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!selectedCity || selectedDistricts.length === 0) {
                    e.preventDefault();
                  }
                }}
              >
               {isLoading ? <div className='flex items-center gap-2'><Loader2 className='w-4 h-4 animate-spin' />Chargement...</div> : 'Suivant'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ed7e0f]" />
              Informations importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Vous pouvez sélectionner plusieurs quartiers</li>
              <li>• Concentrez-vous sur les zones que vous connaissez bien</li>
              <li>• Vous pourrez modifier vos zones plus tard</li>
              <li>• Plus vous sélectionnez de zones, plus vous aurez d'opportunités</li>
            </ul>
          </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default DeliveryZonePage;
