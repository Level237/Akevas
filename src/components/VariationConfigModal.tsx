import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Package, AlertCircle } from 'lucide-react';

interface WholesalePrice {
    min_quantity: number;
    wholesale_price: number;
}

interface VariationConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { quantity: number; wholesalePrices?: WholesalePrice[] }) => void;
    isWholesale: boolean;
    attributeName: string;
    attributeValue: string;
    colorName: string;
    colorHex: string;
}

const VariationConfigModal: React.FC<VariationConfigModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isWholesale,
    attributeName,
    attributeValue,
    colorName,
    colorHex
}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [wholesalePrices, setWholesalePrices] = useState<WholesalePrice[]>([
        { min_quantity: 10, wholesale_price: 0 }
    ]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setWholesalePrices([{ min_quantity: 10, wholesale_price: 0 }]);
            setError(null);
        }
    }, [isOpen]);

    const handleAddPrice = () => {
        setWholesalePrices([...wholesalePrices, { min_quantity: 0, wholesale_price: 0 }]);
    };

    const handleRemovePrice = (index: number) => {
        setWholesalePrices(wholesalePrices.filter((_, i) => i !== index));
    };

    const handlePriceChange = (index: number, field: keyof WholesalePrice, value: number) => {
        const newPrices = [...wholesalePrices];
        newPrices[index] = { ...newPrices[index], [field]: value };
        setWholesalePrices(newPrices);
    };

    const handleConfirm = () => {
        if (quantity <= 0) {
            setError("La quantité en stock doit être supérieure à 0");
            return;
        }

        if (isWholesale) {
            if (wholesalePrices.length === 0) {
                setError("Veuillez ajouter au moins un prix de gros");
                return;
            }
            for (const price of wholesalePrices) {
                if (price.min_quantity <= 0 || price.wholesale_price <= 0) {
                    setError("Veuillez vérifier les quantités minimales et les prix");
                    return;
                }
            }
        }

        onConfirm({
            quantity,
            wholesalePrices: isWholesale ? wholesalePrices : undefined
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Configuration de la variation</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md border border-gray-200 text-xs font-medium text-gray-600">
                                <div className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: colorHex }} />
                                {colorName}
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="px-2 py-0.5 bg-white rounded-md border border-gray-200 text-xs font-medium text-gray-600">
                                {attributeName}: {attributeValue}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Stock Quantity */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantité en stock
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#ed7e0f]"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Wholesale Configuration */}
                    {isWholesale && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Prix de gros</h4>
                                <button
                                    onClick={handleAddPrice}
                                    className="text-sm text-[#ed7e0f] font-medium hover:text-[#ed7e0f]/80 flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter un palier
                                </button>
                            </div>

                            <div className="space-y-3">
                                {wholesalePrices.map((price, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Qté min.</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={price.min_quantity}
                                                    onChange={(e) => handlePriceChange(index, 'min_quantity', Number(e.target.value))}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Prix unitaire (FCFA)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={price.wholesale_price}
                                                    onChange={(e) => handlePriceChange(index, 'wholesale_price', Number(e.target.value))}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        {wholesalePrices.length > 1 && (
                                            <button
                                                onClick={() => handleRemovePrice(index)}
                                                className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-sm border border-gray-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-[#ed7e0f] text-white font-medium rounded-lg hover:bg-[#ed7e0f]/90 transition-colors shadow-sm shadow-orange-200"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariationConfigModal;
