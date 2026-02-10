import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Rocket,
    Flame,
    Zap,
    CheckCircle2,
    Coins,
    ArrowLeft,
    Sparkles,
    Trophy,
    PlusCircle,
    Gem
} from 'lucide-react';
import { useCheckAuthQuery } from '@/services/auth';
import { useGetProductByUrlQuery } from '@/services/guardService';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { Button } from '@/components/ui/button';
import { useBoostProductMutation, useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import { redirectToLogin } from '@/lib/redirectToLogin';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from "qrcode.react";

// Options de boost statiques
const BOOST_OPTIONS = [
    {
        id: 'boost_24h',
        duration: 1,
        label: 'Flash 24h',
        price: 500,
        icon: Zap,
        color: 'bg-[#6e0a13]',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        description: 'Pic de visibilité immédiat',
        features: ['Top des recherches', 'Badge "Flash"', 'Visibilité x5']
    },
    {
        id: 'boost_3d',
        duration: 3,
        label: 'Populaire 3 Jours',
        price: 1200,
        icon: Flame,
        color: 'bg-[#6e0a13]',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        description: 'Idéal pour le week-end',
        popular: true,
        features: ['Top des recherches', 'Badge "Hot"', 'Visibilité x10', 'Recommandé']
    },
    {
        id: 'boost_7d',
        duration: 7,
        label: 'Vedette 7 Jours',
        price: 2500,
        icon: Trophy,
        color: 'bg-[#6e0a13]',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        description: 'Domination totale',
        features: ['Top des recherches', 'Badge "Star"', 'Visibilité x20', 'Support prioritaire']
    }
];

const ProductBoostPage: React.FC = () => {
    const navigate = useNavigate();
    const { productUrl } = useParams<{ productUrl: string }>();
    const [selectedOption, setSelectedOption] = useState<typeof BOOST_OPTIONS[0] | null>(null);

    const [boostProduct] = useBoostProductMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);

    const { data: checkAuth, isLoading: authLoading } = useCheckAuthQuery();
    const { data: { data: sellerData } = {}, isLoading: sellerLoading } = useCurrentSellerQuery<SellerResponse>('seller');
    const { data: productData, isLoading: productLoading } = useGetProductByUrlQuery(productUrl || '');

    const userCoins = sellerData?.shop.coins ? parseInt(sellerData.shop.coins) : 0;
    const product = productData?.data;

    if (authLoading || sellerLoading || productLoading) {
        return <div className='flex justify-center items-center h-screen bg-gray-50'><IsLoadingComponents isLoading={true} /></div>
    }

    if (!checkAuth?.isAuthenticated) {
        redirectToLogin({ redirectUrl: `/seller/product/boost/${productUrl}` });
        return null;
    }

    const handleSelect = (option: typeof BOOST_OPTIONS[0]) => {
        setSelectedOption(option);
    };

    const handlePayment = async () => {
        if (!selectedOption || !product) return;

        setIsProcessing(true);

        // Simulation délai réseau
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const response = await boostProduct({
                product_id: product.id,
                boost_type: selectedOption.id,
                duration: selectedOption.duration,
                coins: selectedOption.price
            });

            if ('data' in response && response.data.status === 1) {
                setPaymentId(response.data.paymentId);
                setShowSuccess(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { x: 0.5, y: 0.6 },

                });
            }
        } catch (e) {
            console.error("Boost failed", e);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateReceipt = async () => {
        if (!paymentId || !selectedOption || !product) return;
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(237, 126, 15);
            doc.text('Akevas Boost', 105, 20, { align: 'center' });

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Reçu de Transaction', 105, 30, { align: 'center' });

            doc.setFontSize(12);
            doc.text(`ID Transaction: ${paymentId}`, 20, 50);
            doc.text(`Produit: ${product.product_name}`, 20, 60);
            doc.text(`Formule: ${selectedOption.label}`, 20, 70);
            doc.text(`Montant: ${selectedOption.price} Coins`, 20, 80);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90);

            doc.save(`akevas-boost-${paymentId}.pdf`);
        } catch (error) {
            console.error('Erreur PDF', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafc] text-slate-800 font-sans selection:bg-orange-100">

            {/* Navbar Transparente et Sticky */}
            <div className="fixed top-0 inset-x-0 z-40 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
                    >
                        <div className="bg-white border-2 border-slate-100 rounded-full p-1 group-hover:border-slate-300 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-semibold text-sm">Retour</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Votre Solde</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900 text-white pl-4 pr-2 py-1.5 rounded-full shadow-lg shadow-slate-200">
                            <div className="flex flex-col leading-none">
                                <span className="font-bold font-mono text-lg">{userCoins.toLocaleString()}</span>
                            </div>
                            <div className="bg-[#ed7e0f] w-8 h-8 rounded-full flex items-center justify-center text-white shadow-inner">
                                <Coins size={16} className="fill-white" />
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate('/recharge')}
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 w-10 h-10"
                            title="Recharger"
                        >
                            <PlusCircle size={20} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-24 pb-32 max-w-6xl mx-auto px-4 lg:px-8">

                {/* En-tête + Produit */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:w-1/2 space-y-6 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-[#ed7e0f] rounded-full text-sm font-bold border border-orange-100 shadow-sm">
                            <Gem size={16} /> Boostez vos ventes
                        </div>
                        <h1 className="text-2xl md:text-2xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                            Une visibilité <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ed7e0f] to-amber-500">
                                spectaculaire.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Propulsez votre produit en tête des résultats. Des millions d'acheteurs attendent de le découvrir. Choisissez votre impact.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-1/2 w-full max-w-md"
                    >
                        <div className="relative bg-white rounded-[2rem] p-3 shadow-2xl shadow-slate-200 border border-slate-100">
                            <div className="aspect-[4/2] rounded-[1.5rem] overflow-hidden relative group">
                                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-1' />
                                {product?.product_profile ? (
                                    <img
                                        src={product.product_profile}
                                        alt={product.product_name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        Image non disponible
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="text-xl font-bold truncate">{product?.product_name}</h3>
                                    <p className="opacity-90 font-medium">{product?.product_price} XAF</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Grille d'options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BOOST_OPTIONS.map((option, idx) => {
                        const isSelected = selectedOption?.id === option.id;
                        const Icon = option.icon;

                        return (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                onClick={() => handleSelect(option)}
                                className={`
                                    group relative cursor-pointer rounded-[2rem] p-1 
                                    transition-all duration-500 hover:-translate-y-2
                                    ${isSelected ? 'z-10' : 'hover:z-10'}
                                `}
                            >
                                {/* Selection Glow/Border */}
                                <div className={`absolute inset-0 rounded-[2rem] transition-colors duration-300 ${isSelected ? 'bg-[#6e0a13]' : 'bg-transparent group-hover:bg-slate-200'}`} />

                                <div className={`
                                    relative h-full bg-white rounded-[1.8rem] p-6 lg:p-8 flex flex-col gap-6
                                    transition-transform duration-300
                                    ${isSelected ? 'translate-x-[1px] translate-y-[1px]' : 'bg-white'}
                                `}>
                                    {/* Popular Badge */}
                                    {option.popular && (
                                        <div className="absolute top-0 right-0 -mt-3 mr-6">
                                            <span className="bg-[#6e0a13] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-wider flex items-center gap-1.5 transform group-hover:scale-110 transition-transform">
                                                <Flame size={12} fill="white" /> Populaire
                                            </span>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`
                                            w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl
                                            ${option.color} 
                                            group-hover:scale-110 transition-transform duration-500
                                        `}>
                                            <Icon size={32} />
                                        </div>

                                        {/* Selection Check */}
                                        <div className={`
                                            w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                            ${isSelected
                                                ? 'border-[#6e0a13] bg-[#6e0a13] scale-100'
                                                : 'border-slate-200 scale-90 opacity-0 group-hover:opacity-100'}
                                        `}>
                                            <CheckCircle2 size={20} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-[#6e0a13] transition-colors">{option.label}</h3>
                                        <p className="text-slate-500 font-medium mt-2 leading-relaxed">{option.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="py-6 border-t border-dashed border-slate-100">
                                        <div className="flex items-end gap-1.5">
                                            <span className={`text-5xl font-black tracking-tighter transition-colors ${isSelected ? 'text-[#6e0a13]' : 'text-slate-900'}`}>
                                                {option.price}
                                            </span>
                                            <div className="flex flex-col mb-1.5">
                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Coins</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4">
                                        {option.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 group/item">
                                                <div className={`mt-0.5 p-0.5 rounded-full transition-colors ${isSelected ? 'bg-[#6e0a13]/10 text-[#6e0a13]' : 'bg-slate-100 text-slate-400 group-hover/item:text-[#6e0a13] group-hover/item:bg-[#6e0a13]/10'}`}>
                                                    <CheckCircle2 size={14} />
                                                </div>
                                                <span className="font-medium group-hover/item:text-slate-900 transition-colors">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

            </div>

            {/* Barre d'action flottante (Bottom Sheet) */}
            <AnimatePresence>
                {selectedOption && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 p-4 lg:p-6"
                    >
                        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* Infos Sélection */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedOption.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                    <selectedOption.icon size={26} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sélection</p>
                                    <h4 className="text-lg font-bold text-slate-900 leading-tight">{selectedOption.label}</h4>
                                    <p className="text-sm text-slate-500">{selectedOption.duration} jours de visibilité</p>
                                </div>
                            </div>

                            {/* Action & Prix */}
                            <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total</p>
                                    <p className="text-3xl font-black text-slate-900">{selectedOption.price} <span className="text-sm text-slate-400 font-medium">Coins</span></p>
                                </div>

                                {userCoins < selectedOption.price ? (
                                    <Button
                                        onClick={() => navigate('/recharge')}
                                        className="h-14 px-8 rounded-2xl font-bold text-lg w-full md:w-auto bg-[#6e0a13] text-white hover:bg-black shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <PlusCircle className="mr-2" /> Recharger ({selectedOption.price - userCoins} manquants)
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="h-14 px-8 rounded-2xl font-bold text-lg w-full md:w-auto bg-gradient-to-r from-[#ed7e0f] to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center gap-2">
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} >
                                                    <Sparkles size={20} />
                                                </motion.div>
                                                Lancement...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Rocket size={20} />
                                                Booster maintenant
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Succès */}
            <AnimatePresence>
                {showSuccess && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-green-50 to-white -z-10" />

                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-500/30">
                                <CheckCircle2 size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 text-center mb-2">Boost Activé !</h3>
                            <p className="text-slate-500 text-center mb-8">Votre produit est maintenant en orbite. Préparez-vous au décollage des ventes.</p>

                            {paymentId && (
                                <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <QRCodeCanvas value={paymentId} size={120} className="mb-3 mix-blend-multiply opacity-90" />
                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full tracking-wider">{paymentId}</span>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button onClick={generateReceipt} variant="outline" className="w-full rounded-2xl h-14 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-bold transition-all">
                                    Télécharger le reçu
                                </Button>
                                <Button onClick={() => navigate(-1)} className="w-full bg-[#ed7e0f] text-white rounded-2xl h-14 hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20 transition-all">
                                    Retour
                                </Button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ProductBoostPage;
