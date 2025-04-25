import React, { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Star,
  TrendingUp,
  Zap,
  Award,
  AlertCircle,
  Coins,
  CheckCircle,
  Download,
  RefreshCw,
  X,
  Crown
} from 'lucide-react';
import { useCheckAuthQuery } from '@/services/auth';
import { useGetSubscriptionQuery } from '@/services/guardService';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useBoostShopMutation, useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import { Input } from '@/components/ui/input';
import { redirectToLogin } from '@/lib/redirectToLogin';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from "qrcode.react";
import AsyncLink from '@/components/ui/AsyncLink';

const StoreBoostPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [boostShop]=useBoostShopMutation();
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'orange' | 'momo'>('card');
  const [isLoadingBoost] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const { data:checkAuth, isLoading } = useCheckAuthQuery();
  const { data: subscription, isLoading: isLoadingSubscription } = useGetSubscriptionQuery("guard");
  const {data: { data: sellerData }= {},isLoading:isLoadingSeller}=useCurrentSellerQuery<SellerResponse>('seller')
  const userCoins = sellerData?.shop.coins;
  const shopLevel = sellerData?.shop.level;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPaymentProcess, setShowPaymentProcess] = useState(false);
  const [boostStatus, setBoostStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [boostResponse, setBoostResponse] = useState<any>(null);
  const [isLevelError, setIsLevelError] = useState(false);
  if (isLoading || isLoadingSubscription) {
    return <div className='flex justify-center items-center h-screen'><IsLoadingComponents isLoading={isLoading || isLoadingSubscription} /></div>
  }

  const handlePlanSelection = (planId: string, planPrice: number) => {
    if (!isLoadingSeller ) {
      if(userCoins !==null && sellerData?.shop?.coins !==undefined && parseInt(sellerData.shop.coins) < planPrice) {
        setIsModalOpen(true);
        return;
      }
    }
    if (!isLoadingSeller && shopLevel && parseInt(shopLevel) <= 2) {
      setIsLevelError(true);
      return;
    }
    if(!isLoading && checkAuth?.isAuthenticated!==true){
        redirectToLogin({redirectUrl:"/seller/pro"})
    }
    const plan = subscription.find((p:any) => p.id === planId);
    setSelectedPlan(planId);
    setSelectedPlanDetails(plan);
    setIsDrawerOpen(true);
  };



  const generateReceipt = async (paymentId: string) => {
    try {
      // Créer le contenu du PDF
      const doc = new jsPDF();
      
      // Ajouter le titre
      doc.setFontSize(20);
      doc.text('Reçu de Transaction', 105, 20, { align: 'center' });
      
      // Ajouter les détails de la transaction
      doc.setFontSize(12);
      doc.text(`ID de Transaction: ${paymentId}`, 20, 40);
      doc.text(`Plan: ${selectedPlanDetails?.subscription_name}`, 20, 50);
      doc.text(`Durée: ${selectedPlanDetails?.subscription_duration} jours`, 20, 60);
      doc.text(`Coins dépensés: ${selectedPlanDetails?.subscription_price}`, 20, 70);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
      doc.text(`Heure: ${new Date().toLocaleTimeString()}`, 20, 90);
      
      // Ajouter le QR code
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(paymentId)}`;
      const qrCodeResponse = await fetch(qrCodeUrl);
      const qrCodeBlob = await qrCodeResponse.blob();
      const qrCodeDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(qrCodeBlob);
      });
      
      doc.addImage(qrCodeDataUrl as string, 'PNG', 85, 100, 40, 40);
      
      // Sauvegarder le PDF
      doc.save(`receipt-${paymentId}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du reçu:', error);
    }
  };

  const handleContinue = async () => {
    setIsDrawerOpen(false);
    setShowPaymentProcess(true);
    setBoostStatus('processing');

    try {
      const formData = {
        subscription_id: selectedPlanDetails?.id,
        coins: selectedPlanDetails?.subscription_price
      };

      const response = await boostShop(formData);
      setBoostResponse(response);
      
      if (response.data.status === 1 && response.data.paymentId) {
        setBoostStatus('success');
        // Déclencher l'animation confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.6 }
        });
        
        // Générer le reçu avec l'ID de paiement
        await generateReceipt(response.data.paymentId);
      } else {
        setBoostStatus('failed');
      }
    } catch (error) {
      setBoostStatus('failed');
      console.error('Erreur lors du boost:', error);
    }
  };

  const handleRetry = () => {
    setBoostStatus('processing');
    handleContinue();
  };

  if (isLevelError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-orange-100"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Niveau de boutique insuffisant
              </h3>
              <p className="text-gray-600 mb-8">
                Votre boutique doit être au moins de niveau 3 pour pouvoir accéder aux fonctionnalités de boost.
              </p>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <button
                onClick={() => window.history.back()}
                className="flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 
                  bg-orange-50 text-[#ed7e0f] hover:bg-orange-100"
              >
                Retour
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">


      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section avec animation */}
        {!isLoading && sellerData?.shop.isSubscribe===0 ?  <>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ed7e0f] to-orange-600">
            Boostez votre visibilité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Augmentez vos ventes en rendant votre boutique plus visible auprès de millions d'acheteurs potentiels
          </p>
        </motion.div>

        {/* Plans de boost avec nouveau design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {!isLoadingSubscription && subscription.map((plan:any, index:any) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.id===2 ? 'ring-2 ring-[#ed7e0f]' : ''
              }`}
            >
              {plan.id===2 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white px-6 py-2 text-sm font-medium rounded-full">
                  Recommandé
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {plan.subscription_name}
                </h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-[#ed7e0f]">{plan.subscription_price} XAF</span>
                  <span className="text-gray-500 ml-2">/ {plan.subscription_duration}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.descriptions.map((feature:any, index:any) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#ed7e0f] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature.description_name}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.id, plan.subscription_price)}
                  className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-300 
                    ${plan.recommended 
                      ? 'bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-orange-50 text-[#ed7e0f] hover:bg-[#ed7e0f] hover:text-white'
                    }`}
                >
                  {isLoadingBoost && plan.id===selectedPlan ? <div className='flex justify-center items-center'>En cours de traitement...</div> : 'Sélectionner ce plan'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal pour coins insuffisants */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                Coins insuffisants
              </DialogTitle>
              <DialogDescription>
                Vous n'avez pas assez de coins pour sélectionner ce plan. Veuillez recharger votre compte.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Annuler</Button>
              </DialogClose>
              <Button onClick={() => navigate('/recharge')} className="bg-[#ed7e0f] hover:bg-[#d97100]">
                Recharger votre compte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL DE PAIEMENT MODERNE */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent
            className="max-w-lg w-full rounded-t-3xl fixed bottom-0 left-1/2 -translate-x-1/2 mb-0 p-0 overflow-hidden shadow-2xl border-0"
            style={{ borderRadius: '2rem 2rem 0 0', marginBottom: 0 }}
          >
            <div className="bg-gradient-to-r from-[#ed7e0f]/10 to-orange-100 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Détails du paiement</h3>
                <DialogClose asChild>
                  <button className="p-2 rounded-full hover:bg-orange-50 transition">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </DialogClose>
              </div>
              {selectedPlanDetails && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold">{selectedPlanDetails.subscription_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-semibold">{selectedPlanDetails.subscription_duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix</span>
                    <span className="font-bold text-[#ed7e0f]">{selectedPlanDetails.subscription_price} XAF</span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Moyen de paiement</label>
                <div className="flex gap-3">
                  <Button
                    variant={selectedPayment === 'card' ? 'default' : 'outline'}
                    className={`flex-1 ${selectedPayment === 'card' ? 'bg-[#ed7e0f] text-white' : ''}`}
                    onClick={() => setSelectedPayment('card')}
                  >
                    Carte Bancaire
                  </Button>
                  <Button
                    variant={selectedPayment === 'orange' ? 'default' : 'outline'}
                    className={`flex-1 ${selectedPayment === 'orange' ? 'bg-[#ed7e0f] text-white' : ''}`}
                    onClick={() => setSelectedPayment('orange')}
                  >
                    Orange Money
                  </Button>
                  <Button
                    variant={selectedPayment === 'momo' ? 'default' : 'outline'}
                    className={`flex-1 ${selectedPayment === 'momo' ? 'bg-[#ed7e0f] text-white' : ''}`}
                    onClick={() => setSelectedPayment('momo')}
                  >
                    MoMo
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
                <Input
                  type="tel"
                  placeholder="Ex: 6 99 99 99 99"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="py-3 text-base bg-white/80 border-gray-300 focus:border-[#ed7e0f] focus:ring-2 focus:ring-[#ed7e0f]/30"
                />
              </div>

              <DialogFooter className="mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    // Ici tu peux lancer la logique de paiement selon le moyen choisi
                    // navigate(`/checkout/boost?plan=${selectedPlan}&paymethod=${selectedPayment}&phone=${phone}`);
                  }}
                  disabled={!phone || phone.length < 8}
                >
                  Continuer
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Avantages du boost */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            Pourquoi booster votre boutique ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Visibilité accrue</h3>
              <p className="text-gray-600">
                Apparaissez en priorité dans les résultats de recherche
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Plus de ventes</h3>
              <p className="text-gray-600">
                Augmentez significativement vos conversions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Badge spécial</h3>
              <p className="text-gray-600">
                Démarquez-vous avec un badge distinctif
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Support prioritaire</h3>
              <p className="text-gray-600">
                Bénéficiez d'une assistance personnalisée
              </p>
            </div>
          </div>
        </motion.div>
        </>: <>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ed7e0f] to-orange-600">
            Vous avez déjà un abonnement Pro actif
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-orange-100"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                <Crown className="w-10 h-10 text-[#ed7e0f]" />
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Profitez de tous les avantages Pro
                </h3>
                <p className="text-gray-600 mb-8">
                  Accédez à votre tableau de bord pour gérer votre boutique et suivre vos performances
                </p>
              </div>

              <div className="flex gap-4 w-full max-w-md">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 
                    bg-orange-50 text-[#ed7e0f] hover:bg-orange-100"
                >
                  Retour
                </button>
                
                <AsyncLink
                  to="/seller/dashboard"
                  className="flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 
                    bg-[#ed7e0f] text-white hover:bg-orange-600"
                >
                  Dashboard
                </AsyncLink>
              </div>
            </div>
          </motion.div>
        </motion.div>
        </>}
       
        
      </main>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{backdropFilter: 'blur(100px)'}}
              className="fixed inset-0 backdrop-blur-sm bg-black/90 z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed py-1 px-28 max-sm:px-2 inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-orange-100 w-full"
              style={{ minHeight: 340, maxWidth: '100vw' }}
            >
              <div className="flex justify-center items-center py-2">
                <div className="w-12 h-1.5 bg-orange-200 rounded-full" />
              </div>
              <div className="px-8 pb-8 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Confirmer l'achat du plan</h3>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-orange-50 transition"
                    aria-label="Fermer"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {selectedPlanDetails && (
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-semibold">{selectedPlanDetails.subscription_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-semibold">{selectedPlanDetails.subscription_duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-bold flex items-center gap-1 text-[#ed7e0f]">{selectedPlanDetails.subscription_price} <Coins className="w-4 h-4" /></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Votre solde</span>
                      <span className={`font-bold flex items-center gap-1 ${parseInt(userCoins ?? '0') >= selectedPlanDetails.subscription_price ? 'text-green-600' : 'text-red-600'}`}>
                        {userCoins} <Coins className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-orange-50 p-4 mb-6 flex items-center gap-3">
                  <Coins className="w-6 h-6 text-[#ed7e0f]" />
                  <span className="text-sm text-[#ed7e0f] font-medium">
                    Le paiement se fera par déduction de vos coins.
                  </span>
                </div>

                <div className='flex justify-center gap-6 items-center'>
                <Button
                  className="w-full h-12 bg-transparent text-[#ed7e0f] border border-[#ed7e0f] font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-transparent transition-all duration-300 text-lg"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    // Lancer la logique de paiement par coins ici
                    // navigate(`/checkout/boost?plan=${selectedPlan}&paymethod=coins`);
                  }}
                  
                >
                 Annuler
                </Button>
                <Button
                  className="w-full h-12 bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  onClick={handleContinue}
                  disabled={parseInt(userCoins ?? '0') < selectedPlanDetails?.subscription_price}
                >
                  Continuer
                </Button>
                </div>
                {parseInt(userCoins ?? '0') < selectedPlanDetails?.subscription_price && (
                  <div className="text-center text-sm text-red-500 mt-3">
                    Solde insuffisant pour ce plan.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentProcess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 to-orange-100"
          >
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
              onClick={() => setShowPaymentProcess(false)}
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
                          <span className="font-semibold">{selectedPlanDetails?.subscription_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Durée</span>
                          <span className="font-semibold">{selectedPlanDetails?.subscription_duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Coins dépensés</span>
                          <span className="font-semibold text-[#ed7e0f]">{selectedPlanDetails?.subscription_price} coins</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Nouveau solde</span>
                          <span className="font-semibold text-[#ed7e0f]">
                            {parseInt(userCoins ?? '0') - (selectedPlanDetails?.subscription_price ?? 0)} coins
                          </span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {boostStatus === 'processing' && (
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

                      {boostStatus === 'success' && (
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
                          
                          {boostResponse?.data?.paymentId && (
                            <div className="space-y-6">
                              <div className="bg-white p-4 rounded-xl shadow-lg">
                                <QRCodeCanvas
                                  value={boostResponse.data.paymentId}
                                  size={120}
                                  bgColor="#ffffff"
                                  fgColor="#000000"
                                  level="H"
                                  className="mx-auto"
                                />
                              </div>

                              <Button
                                className="bg-[#ed7e0f] hover:bg-[#d97100] text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => generateReceipt(boostResponse.data.paymentId)}
                              >
                                <Download className="w-5 h-5" />
                                <span>Télécharger le reçu</span>
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {boostStatus === 'failed' && (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreBoostPage;
