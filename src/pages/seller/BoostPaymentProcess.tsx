import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoostShopMutation } from '@/services/sellerService';
import { CheckCircle, AlertCircle, Download, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface BoostPaymentProcessProps {
  subscriptionDetails: {
    id: string;
    name: string;
    duration: string;
    price: number;
  };
  userCoins: number;
  onClose: () => void;
}

const BoostPaymentProcess: React.FC<BoostPaymentProcessProps> = ({
  subscriptionDetails,
  userCoins,
  onClose
}) => {
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [boostShop, { isLoading }] = useBoostShopMutation();
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    const processBoost = async () => {
      try {
        const formData = {
          subscription_id: subscriptionDetails.id,
          coins: subscriptionDetails.price
        };

        const response = await boostShop(formData).unwrap();
        
        if (response.status === 1) {
          setStatus('success');
          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 }
          });
          // Generate receipt URL (you'll need to implement this)
          setReceiptUrl('/receipts/boost-' + Date.now() + '.pdf');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('failed');
      }
    };

    processBoost();
  }, []);

  const handleRetry = () => {
    setStatus('processing');
    // Retry logic will be handled by the useEffect
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Background graphics */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-orange-200 rounded-full opacity-20 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-orange-300 rounded-full opacity-20 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl border border-orange-100 transition-all duration-300 group"
      >
        <X className="w-5 h-5 text-gray-600 group-hover:text-[#ed7e0f] transition-colors" />
      </motion.button>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Processus de Boost</h2>
              <p className="text-gray-600 text-lg">Votre boutique est en cours de boost</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la transaction</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan sélectionné</span>
                    <span className="font-semibold">{subscriptionDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-semibold">{subscriptionDetails.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Coins dépensés</span>
                    <span className="font-semibold text-[#ed7e0f]">{subscriptionDetails.price} coins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nouveau solde</span>
                    <span className="font-semibold text-[#ed7e0f]">{userCoins - subscriptionDetails.price} coins</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-orange-50 p-6 rounded-2xl flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-16 h-16 text-[#ed7e0f] mb-4"
                    >
                      <RefreshCw size={64} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Traitement en cours</h3>
                    <p className="text-gray-600">Veuillez patienter pendant le traitement de votre demande</p>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-50 p-6 rounded-2xl flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Boost réussi!</h3>
                    <p className="text-gray-600 mb-6 text-center">Votre boutique a été boostée avec succès</p>
                    {receiptUrl && (
                      <Button
                        className="bg-[#ed7e0f] hover:bg-[#d97100] text-white"
                        onClick={() => window.open(receiptUrl, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le reçu
                      </Button>
                    )}
                  </motion.div>
                )}

                {status === 'failed' && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-50 p-6 rounded-2xl flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Échec du boost</h3>
                    <p className="text-gray-600 mb-6 text-center">Une erreur est survenue lors du boost de votre boutique</p>
                    <Button
                      className="bg-[#ed7e0f] hover:bg-[#d97100] text-white"
                      onClick={handleRetry}
                    >
                      Réessayer
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BoostPaymentProcess; 