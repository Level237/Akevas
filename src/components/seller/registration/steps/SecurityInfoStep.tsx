import React, { useState } from 'react';
import { SellerFormData } from '@/types/seller-registration.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityInfoStepProps {
  data: SellerFormData['securityInfo'];
  onUpdate: (data: Partial<SellerFormData>) => void;
}

const SecurityInfoStep: React.FC<SecurityInfoStepProps> = ({ data, onUpdate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Vérifier la force du mot de passe
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Vérifier si les mots de passe correspondent
    if (name === 'confirmPassword') {
      setPasswordMatch(data.password === value);
    }

    onUpdate({
      securityInfo: {
        ...data,
        [name]: value,
      },
    });
  };

  const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    if (length < 8) return 'weak';
    if (hasLower && hasUpper && hasNumber && hasSpecial && length >= 12) return 'strong';
    return 'medium';
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <ShieldCheck className="w-12 h-12 mx-auto text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sécurisez votre compte</h2>
          <p className="text-gray-500">
            Créez un mot de passe fort pour protéger votre compte vendeur
          </p>
        </div>

        <Card className="p-6 bg-white shadow-lg">
          <div className="space-y-6">
            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={handleChange}
                  className="pr-10 py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Indicateur de force du mot de passe */}
              <div className="space-y-2">
                <div className="flex gap-2 h-1">
                  <div className={`flex-1 rounded ${passwordStrength === 'weak' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                  <div className={`flex-1 rounded ${passwordStrength === 'medium' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                  <div className={`flex-1 rounded ${passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                </div>
                <p className="text-sm text-gray-500">
                  Force: {passwordStrength === 'weak' ? 'Faible' : passwordStrength === 'medium' ? 'Moyenne' : 'Forte'}
                </p>
              </div>
            </div>

            {/* Confirmation du mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmez le mot de passe <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className="pr-10 py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 
                    focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Retapez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Message d'erreur si les mots de passe ne correspondent pas */}
            {!passwordMatch && data.confirmPassword && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Les mots de passe ne correspondent pas
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        {/* Règles de mot de passe */}
        <Card className="p-4 bg-[#ed7e0f]/10 border border-[#ed7e0f]/20">
          <div className="space-y-2">
            <h3 className="font-medium text-[#ed7e0f] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Règles de sécurité
            </h3>
            <ul className="text-sm text-[#ed7e0f] space-y-1 list-disc list-inside">
              <li>Au moins 8 caractères</li>
              <li>Au moins une lettre majuscule</li>
              <li>Au moins une lettre minuscule</li>
              <li>Au moins un chiffre</li>
              <li>Au moins un caractère spécial (!@#$%^&*)</li>
            </ul>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SecurityInfoStep;
