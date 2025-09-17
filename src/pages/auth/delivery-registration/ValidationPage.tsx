import React, { useState } from 'react';
import {
  User,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link, ScrollRestoration } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPassword } from '@/store/delivery/deliverySlice';
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

const ValidationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch=useDispatch()
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const [agreeCGU, setAgreeCGU] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeCGU) {
      setError('Vous devez accepter les CGU pour continuer');
      return;
    }
    if (validatePassword()) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(setPassword({password:formData.password}))
      window.location.href = '/delivery/generating';
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollRestoration />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <TopLoader progress={100} />
            Validation finale
          </h1>
          <p className="mt-2 text-gray-600">
            Créez votre mot de passe pour finaliser votre inscription
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
                      step.id <= 5
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
                      step.id <= 5 ? 'text-[#ed7e0f]' : 'text-gray-500'
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <input
                    id="agree-cgu"
                    type="checkbox"
                    checked={agreeCGU}
                    onChange={(e) => setAgreeCGU(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#ed7e0f] focus:ring-[#ed7e0f]"
                    required
                  />
                  <label htmlFor="agree-cgu" className="text-sm text-gray-700">
                    J'accepte les <a target="_blank" rel="noreferrer" href="https://akevas.com/terms-of-use" className="text-[#ed7e0f] hover:underline">Conditions Générales d'Utilisation</a>
                  </label>
                </div>

                <div className="flex justify-between gap-3">
                  <Link
                    to="/delivery/documents"
                    className="px-6 py-2 max-sm:text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !agreeCGU}
                    className="px-6 max-sm:text-sm py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <div className='flex items-center gap-2'><Loader2 className='w-4 h-4 animate-spin' />Chargement...</div> : 'Finaliser l\'inscription'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#ed7e0f]" />
              Exigences du mot de passe
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Au moins 8 caractères</li>
              <li>• Au moins une lettre majuscule</li>
              <li>• Au moins un chiffre</li>
              <li>• Les deux mots de passe doivent correspondre</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ValidationPage;
