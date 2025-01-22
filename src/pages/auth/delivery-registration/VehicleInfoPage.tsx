import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Bike,
  Car,
  Monitor,

} from 'lucide-react';
import { Link, ScrollRestoration } from 'react-router-dom';
import Header from '@/components/ui/header';
import AsyncLink from '@/components/ui/AsyncLink';

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

const vehicleTypes = [
  {
    id: 'bike',
    name: 'Vélo',
    icon: Bike,
    description: 'Idéal pour les livraisons en centre-ville'
  },
  {
    id: 'motorcycle',
    name: 'Moto/Scooter',
    icon: Monitor,
    description: 'Parfait pour les livraisons rapides'
  },
  {
    id: 'car',
    name: 'Voiture',
    icon: Car,
    description: 'Pour les livraisons volumineuses'
  }
];

const VehicleInfoPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    insurance: '',
    color: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission
    console.log({ vehicleType: selectedType, ...formData });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <ScrollRestoration />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Informations sur votre véhicule
          </h1>
          <p className="mt-2 text-gray-600">
            Dites-nous en plus sur le véhicule que vous utiliserez pour les livraisons
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
                      step.id <= 2
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
                      step.id <= 2 ? 'text-[#ed7e0f]' : 'text-gray-500'
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Type de véhicule
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {vehicleTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        selectedType === type.id
                          ? 'border-[#ed7e0f] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-2 ${
                        selectedType === type.id ? 'text-[#ed7e0f]' : 'text-gray-400'
                      }`} />
                      <h3 className="font-medium mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </button>
                  );
                })}
              </div>

              {selectedType && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marque
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modèle
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Année
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="1990"
                        max="2024"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Couleur
                      </label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {selectedType !== 'bike' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro d'immatriculation
                        </label>
                        <input
                          type="text"
                          name="licensePlate"
                          value={formData.licensePlate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro d'assurance
                        </label>
                        <input
                          type="text"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <AsyncLink
                      to="/delivery/register"
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Retour
                    </AsyncLink>
                    <AsyncLink
                      to="/delivery/zone"
                      className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors flex items-center gap-2"
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </AsyncLink>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ed7e0f]" />
              Informations importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Votre véhicule doit être en bon état de fonctionnement</li>
              <li>• Une assurance valide est requise pour les véhicules motorisés</li>
              <li>• Les documents seront vérifiés lors de l'étape suivante</li>
              <li>• Vous pourrez modifier ces informations plus tard si nécessaire</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleInfoPage;
