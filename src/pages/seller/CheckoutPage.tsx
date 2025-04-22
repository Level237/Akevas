import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Shield, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import orangeLogo from '@/assets/orange.jpeg';
import momoLogo from '@/assets/momo.png';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

const PaymentMethodDisplay = ({ selectedMethod, onMethodChange }: { selectedMethod: 'cm.orange' | 'cm.mtn', onMethodChange: (method: 'cm.orange' | 'cm.mtn') => void }) => (
  <div className="space-y-4">
    <div className="flex gap-4">
      <button
        onClick={() => onMethodChange('cm.orange')}
        className={cn(
          "flex-1 p-4 rounded-xl border transition-all duration-200",
          selectedMethod === 'cm.orange' 
            ? "border-orange-400 bg-orange-50" 
            : "border-gray-200 hover:border-orange-200"
        )}
      >
        <img
          src={orangeLogo}
          alt="Orange Money"
          className="h-7 w-auto object-contain mx-auto"
        />
      </button>
      
      <button
        onClick={() => onMethodChange('cm.mtn')}
        className={cn(
          "flex-1 p-4 rounded-xl border transition-all duration-200",
          selectedMethod === 'cm.mtn'
            ? "border-purple-400 bg-purple-50"
            : "border-gray-200 hover:border-purple-200"
        )}
      >
        <img
          src={momoLogo}
          alt="MTN Mobile Money"
          className="h-7 w-auto object-contain mx-auto"
        />
      </button>
    </div>
    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-100 shadow-sm">
      <span className="text-base font-medium text-gray-700">Paiement Mobile Sécurisé</span>
      <Shield className="w-5 h-5 text-green-600" />
    </div>
  </div>
);

export default function CheckoutRechargePage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const credits = parseInt(params.get('credits') || '0');
  const [price] = useState<number>(credits);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cm.orange' | 'cm.mtn'>('cm.orange');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const validatePhoneNumber = (number: string, method: 'cm.orange' | 'cm.mtn'): boolean => {
    const cleanNumber = number.replace(/\s+/g, '');
    if (cleanNumber.length !== 9) return false;

    if (method === 'cm.orange') {
      return /^(69[0123456789]|65|65[456])\d{6}$/.test(cleanNumber);
    } else { // momo
      return /^(67|65[23]|683)\d{6}$/.test(cleanNumber);
    }
  };

  const isPhoneNumberValid = validatePhoneNumber(phoneNumber, paymentMethod);
  console.log(isPhoneNumberValid)
  const handlePayment = async() => {
    sessionStorage.setItem('coins', credits.toString());
    sessionStorage.setItem('amount', price.toFixed(2));
    sessionStorage.setItem('phone', phoneNumber);
    sessionStorage.setItem('paymentMethod', paymentMethod);
    window.location.href = '/payment/mobile-money';
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ 
          scale: 1.05,
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/recharge')}
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl border border-orange-100 transition-all duration-300 group"
      >
        <X className="w-5 h-5 text-gray-600 group-hover:text-[#ed7e0f] transition-colors" />
      </motion.button>
      
      <div 
        aria-hidden="true" 
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40"
      >
        <div className="blur-[150px] h-64 bg-gradient-to-br from-[#FFDDBB] to-[#FFAA77] "></div>
        <div className="blur-[150px] h-80 bg-gradient-to-r from-[#FFEDD5] to-[#FED7AA] "></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30"
      >
        <div className="p-8 border-b border-orange-100/50">
           <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 tracking-tight">
             Recharger vos coins
           </h1>
           <div className="flex justify-between items-baseline mb-2">
             <span className="text-gray-600 text-sm">Nombre de coins</span>
             <span className="font-semibold text-gray-800">{credits}</span>
           </div>
           <div className="flex justify-between items-baseline border-t border-dashed border-gray-300 pt-3 mt-3">
             <span className="text-lg font-semibold text-gray-700">Total</span>
             <span className="text-3xl font-bold text-[#ed7e0f]">{price.toFixed(2)} XAF</span>
           </div>
        </div>

        <div className="p-8 space-y-6">
          <PaymentMethodDisplay selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />

          <div className="space-y-2">
            <Label htmlFor="phone-number" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Phone className="w-4 h-4 text-gray-500"/>
              Numéro {paymentMethod === 'cm.orange' ? 'Orange Money' : 'MTN Mobile Money'}
            </Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder={paymentMethod === 'cm.orange' ? "Ex: 696000000" : "Ex: 670000000"}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={cn(
                "py-3 text-base bg-white/70 border-gray-300 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/30 transition-shadow duration-200",
                !isPhoneNumberValid && phoneNumber.length > 0 ? 'border-red-400 focus:ring-red-400/30' : ''
              )}
              required
            />
            {!isPhoneNumberValid && phoneNumber.length > 0 && (
              <p className="text-xs text-red-600">
                {paymentMethod === 'cm.orange' 
                  ? "Le numéro doit commencer par 69, 65 ou 654/655/656 (9 chiffres)" 
                  : "Le numéro doit commencer par 67, 652/653 ou 683 (9 chiffres)"}
              </p>
            )}
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#ed7e0f] to-orange-600 hover:from-orange-600 hover:to-[#ed7e0f] text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            onClick={handlePayment}
            disabled={!isPhoneNumberValid || isProcessing}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Lock className="w-5 h-5 transition-transform duration-300 group-hover:rotate-[-10deg]" />
            )}
            <span>
              {isProcessing ? 'Vérification...' : `Payer ${price.toFixed(2)} XAF`}
            </span>
            {!isProcessing && <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1"/>}
          </Button>

          <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-green-600" /> Transaction sécurisée et rapide.
          </p>
        </div>
      </motion.div>
    </div>
  );
}