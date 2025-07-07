// src/pages/seller/OrangeMoneyPaymentPage.tsx
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useInitCoinPaymentMutation, useVerifyCoinPaymentMutation} from '@/services/sellerService';
import { useControlPaymentMutation, useValidatePaymentCoinMutation } from '@/services/auth';

export default function MobileMoneyPaymentPage() {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'initializing' | 'waiting' | 'failed' | 'success'|'loading'>('initializing');
  const [message, setMessage] = useState("Patientez, votre paiement est en cours d'initialisation...");
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const pollingInterval = 5000; // 5 seconds interval for polling
  const [isControlPayment,setIsControlPayment,]=useState(false)
  const [controlPayment] = useControlPaymentMutation();
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
  const [step, setStep] = useState<'start' | 'processing'>('start');
  let isActiveWebhook = false;
  const timeoutRef = useRef<any>(null);
  // Get phone from session storage (you could use a different method)
  const phone = sessionStorage.getItem('phone') || '';
  const delay = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
  // Get credits and amount from URL or session
  const coins = parseInt(sessionStorage.getItem('coins') || '0');
  const amount = parseInt(sessionStorage.getItem('amount') || '0');
  let isActive = true;
  const paymentMethod=sessionStorage.getItem('paymentMethod')
  console.log(paymentMethod)
  // RTK Query hooks
  const [initPayment] = useInitCoinPaymentMutation();
  const [verificationData] = useVerifyCoinPaymentMutation();
 
  const [validatePaymentCoin] = useValidatePaymentCoinMutation();
  // Timer refs for cleanup
  const timersRef = useRef<number[]>([]);
  

  const pollStatus = async () => {
   
   
    if(!isActive){
      return;
    }
    else{
      const responseData = await verificationData({reference:paymentRef});
    
    
    if (!responseData) return;
   console.log(responseData)
    if (responseData && responseData.data.status === 'complete') {
      isActive=false;

      await validatePaymentCoin({reference:paymentRef,amount:amount})
      setIsGeneratingTicket(true);
      setPaymentStatus('loading');
      setTimeout(() => {
        
        setIsControlPayment(true)
      }, 10000)
      clearTimeout(timeoutRef.current);
      // Redirect after success
      
      
    } else if (responseData.data.status === 'failed') {
      setPaymentStatus('failed');
      isActive=false;
      setMessage("Paiement échoué ou annulé. Veuillez réessayer.");
      
      
    }else if(responseData.data.status==="processing"){

      
      
      timeoutRef.current = setTimeout(pollStatus, delay);
        
    }
   
    }
      
  };

  useEffect(() => {
    let controlTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;
    const doControlPayment = async () => {
      // On reconstitue le formData comme pour le paiement
      let controlFormData;
     
        controlFormData = {
          reference: paymentRef,
        };
     
      
      try {
        const response = await controlPayment(controlFormData);
        console.log(response)
        if (!isUnmounted && response && response.data) {
          if (response.data.status === 200) {
            console.log('good')
            setPaymentStatus('success')
            setIsControlPayment(true);
            setIsGeneratingTicket(false);
          } else if (response.data.status === 400) {
            // On continue à contrôler
           console.log("nothing")
           setIsControlPayment(false);
           setIsGeneratingTicket(true);
           setPaymentStatus('loading');
            controlTimeout = setTimeout(doControlPayment, 3000);
          }
        }
      } catch (e) {
        // En cas d'erreur, on continue à contrôler
        if (!isUnmounted) {
          controlTimeout = setTimeout(doControlPayment, 3000);
        }
      }
    };
    if (isControlPayment) {
      doControlPayment();
    }
    return () => {
      isUnmounted = true;
      if (controlTimeout) clearTimeout(controlTimeout);
    };
  }, [isControlPayment]);

  useEffect(() => {
    pollStatus();
    // Continue polling if status is pending

    return () => clearTimeout(timeoutRef.current); // nettoyage
  }, [paymentRef]);

  const initializePayment = async () => {
    try {
      const formData = {
        phone,
        amount,
        coins,
        paymentMethod
      }
      setStep('processing');
    setPaymentStatus('initializing');
      const response = await initPayment(formData);
      console.log(response)
      if (response.data.statusCharge === "Accepted") {
        setPaymentRef(response.data.reference);
        setPaymentStatus('waiting');
        if(paymentMethod==="cm.orange"){
          setMessage("Confirmez votre transaction en composant #150*50#");
        }else{
          setMessage("Confirmez votre transaction en composant *126#");
        }
      } else {
        setPaymentStatus('failed');
        setMessage("L'initialisation du paiement a échoué. Veuillez réessayer.");
      }
    } catch (error) {
      setPaymentStatus('failed');
      setMessage("Impossible d'initialiser le paiement. Veuillez réessayer plus tard.");
    }
  };
  // Initialize payment on component mount
 
  
  // Listen for payment verification updates
 
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => window.clearTimeout(timer));
    };
  }, []);
  
  const handleRetry = () => {
    if (paymentStatus === 'failed') {
      window.location.reload();
    }
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${paymentMethod==="cm.orange" ? "from-orange-50 to-orange-100" : "from-[#Ffff00] to-orange-[#Ffff00]"  }  flex items-center justify-center p-4`}>
      {/* Background graphics */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={`absolute right-0 top-0 w-1/2 h-1/2 ${paymentMethod==="cm.orange" ? "bg-orange-200" : "bg-[#Ffff00]"} rounded-full opacity-20 blur-3xl transform translate-x-1/3 -translate-y-1/3`}></div>
        <div className={`absolute left-0 bottom-0 w-1/2 h-1/2 ${paymentMethod==="cm.orange" ? "bg-orange-300" : "bg-[#Ffff00]"} rounded-full opacity-20 blur-3xl transform -translate-x-1/3 translate-y-1/3`}></div>
      </div>
      
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className={`fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl border  ${paymentMethod==="cm.orange" ? "border-orange-100" : "border-[#Ffff00]"} transition-all duration-300 group`}
      >
        <X className="w-5 h-5 text-gray-600 group-hover:text-[#ed7e0f] transition-colors" />
      </motion.button>
      
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Orange Money brand header */}
        <div className={`bg-gradient-to-r  ${paymentMethod==="cm.orange" ? "from-[#ff7900] to-[#ff5400]" : "from-[#Ffff00] to-[#Ffff10]"}  p-6 text-white`}>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2 shadow-md">
              <Phone className={`w-6 h-6  ${paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"} `} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${paymentMethod==="cm.orange" ? "text-white" : "text-blue-600"} `}>{paymentMethod==="cm.orange" ? "Orange Money" : "MTN MONEY"}</h2>
              <p className={` text-sm ${paymentMethod==="cm.orange" ? "text-white/80" : "text-blue-600"}`}>Paiement sécurisé</p>
            </div>
          </div>
        </div>
        
        {/* Payment details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Numéro</span>
            <span className="font-semibold text-gray-800">{phone}</span>
          </div>
          
          <div className="flex justify-between items-baseline border-t border-dashed border-gray-300 pt-3 mt-3">
            <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className={`text-2xl font-bold ${paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"} `}>{amount} XAF</span>
          </div>
        </div>
        
        {/* Status content */}
        <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
          {step === 'start' ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Phone className={`w-12 h-12 mb-5 ${paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"} `} />
              <h2 className="text-xl font-bold mb-2">Démarrer le paiement</h2>
              <p className="mb-6 text-gray-600">
                Cliquez sur le bouton ci-dessous pour lancer le processus de paiement mobile money.
              </p>
              <Button
                onClick={initializePayment}
                className={` ${paymentMethod==="cm.orange" ? "bg-[#ff7900] hover:bg-[#ff7900]/80" : "bg-blue-600 hover:bg-blue-700"}  text-white px-6 py-2 rounded-lg`}
              >
                Démarrer le paiement
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {paymentStatus === 'initializing' && (
                <motion.div
                  key="initializing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className={`w-16 h-16 mb-5  ${paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"}`}
                  >
                    <RefreshCw size={64} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Initialisation du paiement</h3>
                  <p className="text-gray-600">{message}</p>
                </motion.div>
              )}
              
              {paymentStatus === 'waiting' && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className={`w-16 h-16 mb-5 ${paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"}`}
                  >
                    <Clock size={64} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">En attente de confirmation</h3>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <div className={` p-3 rounded-xl text-sm ${paymentMethod==="cm.orange" ? "bg-orange-100 text-orange-800" : "text-blue-800 bg-blue-100"}  font-medium`}>
                    #150*50#
                  </div>
                </motion.div>
              )}
              
              {paymentStatus === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 mb-5 text-red-500">
                    <AlertCircle size={64} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-red-600">Échec du paiement</h3>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <Button 
                    onClick={handleRetry}
                    className={` ${paymentMethod==="cm.orange" ? "bg-[#ff7900] hover:bg-[#e56800]" : "bg-blue-800 hover:bg-blue-800/80"} text-white `}
                  >
                    Réessayer
                  </Button>
                </motion.div>
              )}
              
              {isGeneratingTicket && !isControlPayment && paymentStatus==="loading" && (
                    <div className="flex flex-col items-center mt-8 gap-4">
                      <motion.div
                        className="relative flex items-center justify-center w-16 h-16"
                        initial={{ scale: 0.8, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                      >
                        <motion.span
                          className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"
                          style={{ borderTopColor: "#3b82f6" }}
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                        />
                        <RefreshCw size={36} className="text-blue-500 z-10" />
                      </motion.div>
                      <div className="flex flex-col items-center">
                        <span className="text-base font-semibold text-blue-700 mb-1">
                          Génération du ticket en cours...
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Merci de patienter pendant la finalisation de votre paiement.
                        </span>
                      </div>
                    </div>
                  )}
              {paymentStatus === 'success' && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mt-8 gap-4"
              >
                <div className="w-16 h-16 mb-4 text-green-500">
                  <CheckCircle size={64} />
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg font-semibold text-green-700 mb-2">
                    Ticket de paiement prêt !
                  </span>
                  <span className="text-sm text-gray-600 mb-6">
                    Votre ticket de paiement a été généré avec succès. Téléchargez-le pour vos archives.
                  </span>
                </div>
                <Link
                  
                  to={`/user/payment/${paymentRef}`}
                  className={`${paymentMethod==="cm.orange" ? "bg-[#ff7900] hover:bg-[#ff7900]/80" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  Voir le ticket
                </Link>
              </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        
        {/* Footer with transaction info */}
        <div className="bg-gray-50 p-4 text-xs text-center text-gray-500 border-t border-gray-200">
          {paymentRef ? 
            <p>Référence transaction: <span className="font-mono">{paymentRef}</span></p> :
            <p>En attente de référence de transaction...</p>
          }
        </div>
      </motion.div>
    </div>
  );
}