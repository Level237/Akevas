import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCheckAuthQuery } from '@/services/auth';

interface CheckoutDrawerProps {
    onClose: () => void;
    product: any;
    selectedImage: number;
    quantity: number;
    setQuantity: (quantity: number) => void;
    currentInfo: {
        price: number;
        attributeVariationId: number;
        productVariationId: number;
        mainImage?: string;
        color?: {
            id: number;
            name: string;
            hex: string;
        };
        attribute?: string;
        variantName?: string;
        quantity: number;
        group?: string;
    };
    getAllImages: () => Array<{ path: string }>;
}

const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
    onClose,
    product,
    selectedImage,
    quantity,
    setQuantity,
    currentInfo,
    getAllImages,
}: CheckoutDrawerProps) => {
    const { data } = useCheckAuthQuery()

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (data) {
            setIsAuthenticated(true)
        }
    }, [data])


    // Fonction pour mettre à jour la quantité avec vérification
    const handleQuantityChange = (newQuantity: number) => {
        // S'assurer que la quantité ne dépasse pas le stock disponible
        const validQuantity = Math.min(Math.max(1, newQuantity), currentInfo.quantity);
        setQuantity(validQuantity);
    };
    console.log(currentInfo)
    const checkOutNavigation = () => {
        // Créer un objet avec les informations de variation
        const variationInfo = currentInfo.color ? {
            colorId: currentInfo.color.id,
            colorName: currentInfo.color.name,
            attribute: currentInfo.attribute,
            attributeVariationId: currentInfo.attributeVariationId,
            productVariationId: currentInfo.productVariationId,
            price: currentInfo.price,
            colorHex: currentInfo.color.hex,
            variantName: currentInfo.variantName,
            quantity: quantity
        } : null;

        // Encoder les informations de variation pour l'URL
        const variationParams = variationInfo
            ? `&variation=${encodeURIComponent(JSON.stringify(variationInfo))}`
            : '';

        if (isAuthenticated) {
            window.location.href = `/checkout?s=0&productId=${product.id}&quantity=${quantity}&price=${currentInfo.price * quantity}&name=${product.product_name}&residence=${product.residence}${variationParams}`;
        } else {
            window.location.href = `/login?redirect=checkout&s=0&productId=${product.id}&quantity=${quantity}&price=${currentInfo.price * quantity}&name=${product.product_name}&residence=${product.residence}${variationParams}`;
        }
    }

    return (
        <>
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Drawer */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
                <div className="space-y-6 max-w-7xl mx-auto">
                    {/* Barre de titre */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-xl font-semibold">Finaliser l'achat</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Contenu en grid sur desktop */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Informations produit */}
                        <div className="flex gap-4 bg-gray-50 p-4 rounded-xl lg:col-span-2">
                            <img
                                src={getAllImages()[selectedImage]?.path || product.product_profile}
                                alt={product.product_name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="font-medium text-lg">{product.product_name}</h4>
                                {/* Affichage des variations */}
                                {currentInfo.color && (
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: currentInfo.color.hex }}
                                            />
                                            <span className="text-sm text-gray-600">
                                                Couleur: {currentInfo.color.name}
                                            </span>
                                        </div>
                                        {currentInfo.attribute && (
                                            <div className="text-sm text-gray-600">
                                                Taille: {currentInfo.attribute}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-600">
                                            Stock disponible: {currentInfo.quantity}
                                        </div>
                                    </div>
                                )}
                                <p className="text-[#ed7e0f] font-bold text-xl mt-2">
                                    {currentInfo.price} FCFA
                                </p>
                            </div>
                        </div>

                        {/* Sélecteur de quantité */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Quantité
                            </label>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max={currentInfo.quantity}
                                    className="w-20 text-center bg-white border-0 rounded-lg shadow-sm"
                                />
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                    disabled={quantity >= currentInfo.quantity}
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                {currentInfo.quantity} unités disponibles
                            </p>
                        </div>
                    </div>

                    {/* Total et CTA */}
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-center">
                            <div className="flex items-center gap-8 text-lg font-medium">
                                <span>Total</span>
                                <span className="text-[#ed7e0f]">{currentInfo.price * quantity} FCFA</span>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={checkOutNavigation}
                                className="bg-[#ed7e0f] text-white px-12 py-4 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors w-full lg:w-auto"
                            >
                                Procéder à l'achat
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default CheckoutDrawer; 