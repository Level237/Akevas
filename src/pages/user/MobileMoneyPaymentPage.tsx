// src/pages/seller/OrangeMoneyPaymentPage.tsx
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInitProductPaymentMutation, useVerifyPaymentQuery } from '@/services/auth';


export default function MobileMoneyPaymentPage() {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'initializing' | 'waiting' | 'failed' | 'success'>('initializing');
  const [message, setMessage] = useState("Patientez, votre paiement est en cours d'initialisation...");
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const pollingInterval = 5000; // 5 seconds interval for polling
  
  // Get phone from session storage (you could use a different method)
 
  const formDataPayment = JSON.parse(sessionStorage.getItem('formDataPayment') || '{}');
  console.log(formDataPayment)
  let variations=null;
  let productsPayments=null;
  if(formDataPayment.hasVariation && formDataPayment.s==0){
    variations=formDataPayment.variations;
  }
  if(formDataPayment.s==1){
    productsPayments=formDataPayment.productsPayments
  }
  
  // RTK Query hooks
  const [initPayment] = useInitProductPaymentMutation();
  const { data: verificationData} = useVerifyPaymentQuery(paymentRef || '', {
    pollingInterval: pollingEnabled ? pollingInterval : 0,
    skip: !pollingEnabled || !paymentRef
  });
 
  
  // Timer refs for cleanup
  const timersRef = useRef<number[]>([]);
  
  // Initialize payment on component mount
  useEffect(() => {
    const initializePayment = async () => {
      try {
        let formData;
        if(formDataPayment.s==0){
          formData = {
            phone:formDataPayment.phone,
            paymentPhone:formDataPayment.paymentPhone,
            productId: formDataPayment.productId,
            s: formDataPayment.s,
            quantity: formDataPayment.quantity,
            methodChanel:formDataPayment.paymentMethod,
            amount: formDataPayment.amount,
            price: formDataPayment.price,
            quarter_delivery: formDataPayment.quarter_delivery,
            shipping: formDataPayment.shipping,
            address: formDataPayment.address,
            hasVariation:formDataPayment.hasVariation,
            productVariationId: variations?.productVariationId || null,
            attributeVariationId: variations?.attributeVariationId || null
          }
        }else{
          formData = {
            phone:formDataPayment.phone,
            paymentPhone:formDataPayment.paymentPhone,
            s: formDataPayment.s,
            productsPayments:productsPayments,
            quantity: formDataPayment.quantity,
            methodChanel:formDataPayment.paymentMethod,
            amount: formDataPayment.amount,
            quarter_delivery: formDataPayment.quarter_delivery,
            shipping: formDataPayment.shipping,
            address: formDataPayment.address,
          }
        }
       
        const response = await initPayment(formData);
        console.log(response)
        if (response.data.statusCharge === "Accepted") {
          setPaymentRef(response.data.reference);
          setPaymentStatus('waiting');
          if(formDataPayment.paymentMethod==="cm.orange"){
            setMessage("Confirmez votre transaction en composant #150*50#");
          }else{
            setMessage("Confirmez votre transaction en composant *126#");
          }
          
          setPollingEnabled(true);
        } else {
          setPaymentStatus('failed');
          setMessage("L'initialisation du paiement a échoué. Veuillez réessayer.");
        }
        
      } catch (error) {
        setPaymentStatus('failed');
        setMessage("Impossible d'initialiser le paiement. Veuillez réessayer plus tard.");
      }
    };
    
    const timer = window.setTimeout(initializePayment, 1500);
    timersRef.current.push(timer);
    
    return () => {
      timersRef.current.forEach(timer => window.clearTimeout(timer));
    };
  }, []);
  
  // Listen for payment verification updates
  //console.log(verificationData)
  useEffect(() => {
    if (!verificationData) return;
    console.log(verificationData.status)
    if (verificationData.status === 'complete') {
      setPaymentStatus('success');
      setMessage("Paiement confirmé! Redirection vers votre compte...");
      setPollingEnabled(false);
      
      // Redirect after success
      const timer = window.setTimeout(() => {
        //navigate('/seller/confirmation');
      }, 3000);
      timersRef.current.push(timer);
      
    } else if (verificationData.status === 'failed') {
      setPaymentStatus('failed');
      setMessage("Paiement échoué ou annulé. Veuillez réessayer.");
      setPollingEnabled(false);
    }
    // Continue polling if status is pending
  }, [verificationData]);
  
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
    <div className={`relative min-h-screen bg-gradient-to-br ${formDataPayment.paymentMethod==="cm.orange" ? "from-orange-50 to-orange-100" : "from-[#Ffff00] to-orange-[#Ffff00]"  }  flex items-center justify-center p-4`}>
      {/* Background graphics */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={`absolute right-0 top-0 w-1/2 h-1/2 ${formDataPayment.paymentMethod==="cm.orange" ? "bg-orange-200" : "bg-[#Ffff00]"} rounded-full opacity-20 blur-3xl transform translate-x-1/3 -translate-y-1/3`}></div>
        <div className={`absolute left-0 bottom-0 w-1/2 h-1/2 ${formDataPayment.paymentMethod==="cm.orange" ? "bg-orange-300" : "bg-[#Ffff00]"} rounded-full opacity-20 blur-3xl transform -translate-x-1/3 translate-y-1/3`}></div>
      </div>
      
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className={`fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl border  ${formDataPayment.paymentMethod==="cm.orange" ? "border-orange-100" : "border-[#Ffff00]"} transition-all duration-300 group`}
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
        <div className={`bg-gradient-to-r  ${formDataPayment.paymentMethod==="cm.orange" ? "from-[#ff7900] to-[#ff5400]" : "from-[#Ffff00] to-[#Ffff10]"}  p-6 text-white`}>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2 shadow-md">
              <Phone className={`w-6 h-6  ${formDataPayment.paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"} `} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${formDataPayment.paymentMethod==="cm.orange" ? "text-white" : "text-blue-600"} `}>{formDataPayment.paymentMethod==="cm.orange" ? "Orange Money" : "MTN MONEY"}</h2>
              <p className={` text-sm ${formDataPayment.paymentMethod==="cm.orange" ? "text-white/80" : "text-blue-600"}`}>Paiement sécurisé</p>
            </div>
          </div>
        </div>
        
        {/* Payment details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Numéro</span>
            <span className="font-semibold text-gray-800">{formDataPayment.paymentPhone}</span>
          </div>
          
          <div className="flex justify-between items-baseline border-t border-dashed border-gray-300 pt-3 mt-3">
            <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className={`text-2xl font-bold ${formDataPayment.paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"} `}>{formDataPayment.amount} XAF</span>
          </div>
        </div>
        
        {/* Status content */}
        <div className="p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
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
                  className={`w-16 h-16 mb-5  ${formDataPayment.paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"}`}
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
                  className={`w-16 h-16 mb-5 ${formDataPayment.paymentMethod==="cm.orange" ? "text-[#ff7900]" : "text-blue-600"}`}
                >
                  <Clock size={64} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">En attente de confirmation</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className={` p-3 rounded-xl text-sm ${formDataPayment.paymentMethod==="cm.orange" ? "bg-orange-100 text-orange-800" : "text-blue-800 bg-blue-100"}  font-medium`}>
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
                  className={` ${formDataPayment.paymentMethod==="cm.orange" ? "bg-[#ff7900] hover:bg-[#e56800]" : "bg-blue-800 hover:bg-blue-800/80"} text-white `}
                >
                  Réessayer
                </Button>
              </motion.div>
            )}
            
            {paymentStatus === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="w-16 h-16 mb-5 text-green-500"
                >
                  <CheckCircle size={64} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">Paiement réussi!</h3>
                <p className="text-gray-600">{message}</p>
              </motion.div>
            )}
          </AnimatePresence>
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