import { motion} from 'framer-motion';
import { Coins, CreditCard, Shield, Zap, X, Settings } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const creditPackages = [
  { id: 1, credits: 500, price: 500, popular: false },
  { id: 2, credits: 5000, price: 5000, popular: true },
  { id: 3, credits: 10000, price: 10000, popular: false },
];

export default function RechargePage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(2);
  const [customCredits, setCustomCredits] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const calculatePrice = (credits: number | null) => {
    if (credits === null || credits <= 0) return "0.00";
    const numCredits = Number(credits);
    // Prix dégressif selon le nombre de crédits
    if (numCredits >= 1000) return (numCredits * 0.15).toFixed(2);
    if (numCredits >= 500) return (numCredits * 0.18).toFixed(2);
    return (numCredits * 0.20).toFixed(2);
  };

  const getPricePerCredit = (credits: number | null) => {
    if (credits === null || credits <= 0) return "0.00";
    const numCredits = Number(credits);
    if (numCredits >= 1000) return "0.15";
    if (numCredits >= 500) return "0.18";
    return "0.20";
  };

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input to clear or start typing
    if (value === '') {
        setCustomCredits(null);
    } else {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0) { // Allow 0 or positive numbers
            setCustomCredits(numValue);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
    }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rechargez votre compte
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez le forfait qui correspond à vos besoins
          </p>
        </motion.div>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Zap,
              title: "Paiement instantané",
              description: "Crédits disponibles immédiatement après paiement"
            },
            {
              icon: Shield,
              title: "100% Sécurisé",
              description: "Vos transactions sont protégées et cryptées"
            },
            {
              icon: CreditCard,
              title: "Paiement flexible",
              description: "Plusieurs moyens de paiement acceptés"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#ed7e0f]/10 rounded-xl">
                  <feature.icon className="w-6 h-6 text-[#ed7e0f]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Forfaits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pkg.id * 0.1 }}
              className={`relative bg-white rounded-2xl p-6 ${
                selectedPackage === pkg.id
                  ? 'ring-2 ring-[#ed7e0f]'
                  : 'hover:shadow-lg'
              } transition-all duration-300 cursor-pointer`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#ed7e0f] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Plus populaire
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-[#ed7e0f]" />
              </div>

              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.credits} crédits
                </div>
                <div className="text-3xl font-bold text-[#ed7e0f]">
                  {pkg.price} XAF
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  selectedPackage === pkg.id
                    ? 'bg-[#ed7e0f] text-white'
                    : 'bg-[#ed7e0f]/10 text-[#ed7e0f] hover:bg-[#ed7e0f]/20'
                }`}
              >
                Sélectionner
              </button>
            </motion.div>
          ))}

          {/* Package personnalisé avec DialogTrigger */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`relative bg-gradient-to-br from-[#ed7e0f]/5 to-[#ed7e0f]/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-dashed border-[#ed7e0f]/30`}
              >
                <div className="flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-[#ed7e0f]" />
                </div>
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    Forfait personnalisé
                  </div>
                  <div className="text-gray-600">
                    Choisissez votre montant
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-white text-[#ed7e0f] border-[#ed7e0f]/50 hover:bg-[#ed7e0f] hover:text-white transition-colors duration-300"
                >
                  Personnaliser
                </Button>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-white rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">Personnalisez votre forfait</DialogTitle>
                <DialogDescription>
                  Entrez le nombre de crédits que vous souhaitez acheter.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <label htmlFor="custom-credits" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de crédits souhaités
                  </label>
                  <div className="relative">
                    <Input
                      id="custom-credits"
                      type="number"
                      min="1"
                      value={customCredits === null ? '' : customCredits}
                      onChange={handleCreditsChange}
                      className="pr-10"
                      placeholder="Ex: 150"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Coins className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix par crédit</span>
                    <span className="text-sm font-medium">
                      {getPricePerCredit(customCredits)}€
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix total estimé</span>
                    <motion.span
                      key={customCredits}
                      initial={isAnimating ? { scale: 1.1 } : { scale: 1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="text-lg font-bold text-[#ed7e0f]"
                    >
                      {calculatePrice(customCredits)}€
                    </motion.span>
                  </div>
                </div>
              </div>

              <DialogFooter className="sm:justify-end gap-2">
                 <DialogClose asChild>
                     <Button type="button" variant="secondary">
                         Annuler
                     </Button>
                 </DialogClose>
                 <Button
                   type="button"
                   className="bg-[#ed7e0f] hover:bg-[#d97100]"
                   disabled={!customCredits || customCredits <= 0}
                 >
                   Confirmer et Payer
                 </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bouton de paiement (vous devrez peut-être ajuster sa logique) */}
        {selectedPackage && !isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <Button size="lg" className="bg-[#ed7e0f] hover:bg-[#d97100] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
              Procéder au paiement ({creditPackages.find(p => p.id === selectedPackage)?.credits} crédits)
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 