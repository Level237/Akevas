import React, { useState, useEffect } from 'react';
import { X, Package, Palette, Loader2 } from 'lucide-react';

interface ProductTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (productType: 'simple' | 'variable', isWholesale: boolean) => void;
    initialProductType?: 'simple' | 'variable' | null;
    initialIsWholesale?: boolean | null;
}

const ProductTypeModal: React.FC<ProductTypeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialProductType = null,
    initialIsWholesale = null
}) => {
    const [modalStep, setModalStep] = useState<'type' | 'wholesale'>('type');
    const [selectedProductType, setSelectedProductType] = useState<'simple' | 'variable' | null>(initialProductType);
    const [isWholesale, setIsWholesale] = useState<boolean | null>(initialIsWholesale);
    const [isLoading, setIsLoading] = useState(false);

    // Réinitialiser les états quand le modal s'ouvre
    useEffect(() => {
        if (isOpen) {
            setModalStep('type');
            setSelectedProductType(initialProductType);
            setIsWholesale(initialIsWholesale);
        }
    }, [isOpen, initialProductType, initialIsWholesale]);

    const handleConfirm = async () => {
        if (!selectedProductType) return;

        if (modalStep === 'type') {
            setModalStep('wholesale');
        } else if (modalStep === 'wholesale') {
            if (isWholesale === null) return;

            setIsLoading(true);
            try {
                await onConfirm(selectedProductType, isWholesale);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBackStep = () => {
        if (modalStep === 'wholesale') {
            setModalStep('type');
            setIsWholesale(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-lg">
                {/* Header simple */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${modalStep === 'type' ? 'bg-[#ed7e0f] text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    1
                                </div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${modalStep === 'wholesale' ? 'bg-[#ed7e0f] text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    2
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {modalStep === 'type' ? 'Type de produit' : 'Mode de vente'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {modalStep === 'type' ? 'Étape 1 sur 2' : 'Étape 2 sur 2'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Étape 1: Sélection du type de produit */}
                    {modalStep === 'type' && (
                        <div>
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Quel type de produit ?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Choisissez le format adapté à votre produit
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Produit Simple */}
                                <button
                                    onClick={() => setSelectedProductType('simple')}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedProductType === 'simple'
                                        ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                                        : 'border-gray-200 hover:border-[#ed7e0f]/50 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedProductType === 'simple'
                                            ? 'bg-[#ed7e0f] text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Produit Simple</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Un seul prix, une seule référence. Idéal pour les accessoires et articles uniques.
                                            </p>
                                        </div>
                                        {selectedProductType === 'simple' && (
                                            <div className="w-5 h-5 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Produit Variable */}
                                <button
                                    onClick={() => setSelectedProductType('variable')}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedProductType === 'variable'
                                        ? 'border-[#ed7e0f] bg-[#ed7e0f]/5'
                                        : 'border-gray-200 hover:border-[#ed7e0f]/50 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedProductType === 'variable'
                                            ? 'bg-[#ed7e0f] text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Palette className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Produit Variable</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Plusieurs variations, tailles, couleurs. Parfait pour vêtements et chaussures.
                                            </p>
                                        </div>
                                        {selectedProductType === 'variable' && (
                                            <div className="w-5 h-5 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 2: Configuration de la vente */}
                    {modalStep === 'wholesale' && (
                        <div>
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Mode de vente
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Choisissez votre stratégie de vente
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Vente au détail */}
                                <button
                                    onClick={() => setIsWholesale(false)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isWholesale === false
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isWholesale === false
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <span className="text-lg">🛍️</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Vente au détail</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Vente individuelle aux clients finaux. Prix unitaire.
                                            </p>
                                        </div>
                                        {isWholesale === false && (
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Vente en gros */}
                                <button
                                    onClick={() => setIsWholesale(true)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isWholesale === true
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isWholesale === true
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <span className="text-lg">📦</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Vente en gros</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Vente en grandes quantités aux revendeurs. Tarifs préférentiels.
                                            </p>
                                        </div>
                                        {isWholesale === true && (
                                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Boutons de navigation */}
                    <div className="mt-8 flex justify-between items-center">
                        {modalStep === 'wholesale' && (
                            <button
                                onClick={handleBackStep}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                ← Retour
                            </button>
                        )}

                        <button
                            onClick={handleConfirm}
                            disabled={
                                (modalStep === 'type' && !selectedProductType) ||
                                (modalStep === 'wholesale' && isWholesale === null) ||
                                isLoading
                            }
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${((modalStep === 'type' && selectedProductType) ||
                                (modalStep === 'wholesale' && isWholesale !== null)) && !isLoading
                                ? 'bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Chargement...</span>
                                </div>
                            ) : (
                                <span>{modalStep === 'type' ? 'Continuer' : 'Terminer'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTypeModal;
