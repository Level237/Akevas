import React, { useState } from 'react';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Share2, Filter, Plus, ShoppingBag } from 'lucide-react';
// À implémenter
import { motion } from 'framer-motion'; // Pour les animations
import { Product } from '@/types/products';
import AsyncLink from '@/components/ui/AsyncLink';
import MobileNav from '@/components/ui/mobile-nav';



const SellerCatalog: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { data: { data: seller } = {}, isLoading: sellerLoading } = useCurrentSellerQuery('seller');
    const shopId = seller?.shop?.shop_id;

    const products = seller?.shop?.products;

    const categories = ['all', ...new Set(products.map((p: any) => p.product_categories))];

    if (seller?.shop?.level === "1") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
                <p className="text-gray-600 text-center">
                    Votre boutique n'est pas encore validée, veuillez patienter.
                </p>
                <AsyncLink
                    to="/seller/dashboard"
                    className="bg-[#ed7e0f] mt-4 text-white px-4 py-2 rounded-lg hover:bg-[#ff8f1f] transition-colors"
                >
                    Retour au tableau de bord
                </AsyncLink>
            </div>
        );
    }

    if (seller?.shop?.products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <ShoppingBag className="w-12 h-12 text-gray-800 mb-4" />
                <p className="text-gray-600 text-center">
                    Votre catalogue est vide, veuillez ajouter des produits.
                </p>
                <AsyncLink
                    to="/seller/create-product"
                    className="bg-[#ed7e0f] mt-4 text-white px-4 py-2 rounded-lg hover:bg-[#ff8f1f] transition-colors"
                >
                    Ajouter un produit
                </AsyncLink>
            </div>
        );
    }
    if (sellerLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ed7e0f]" />
            </div>
        );
    }

    if (!shopId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h1>
                <p className="text-gray-600 text-center">
                    Vous devez être connecté en tant que vendeur pour accéder à cette page.
                </p>
            </div>
        );
    }

    const handleShare = async () => {
        try {
            const shareUrl = `${window.location.origin}/shop/${shopId}/catalog`;
            await navigator.share({
                title: `Catalogue de ${seller.shop.name}`,
                text: 'Découvrez mes produits !',
                url: shareUrl,
            });
        } catch (error) {
            console.error('Erreur lors du partage:', error);
        }
    };

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter((p: Product) => p.category === selectedCategory);
    console.log(filteredProducts);
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header with Add Product Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Mon Catalogue</h1>
                <div className="flex gap-2">
                    <AsyncLink
                        to="/seller/create-product"
                        className="flex items-center gap-2 bg-[#ed7e0f] text-white px-4 py-2 rounded-lg hover:bg-[#ff8f1f] transition-colors"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Ajouter un produit</span>
                    </AsyncLink>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Share2 size={20} />
                        <span className="hidden sm:inline">Partager</span>
                    </button>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">


            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 mb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product: Product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-40">
                            <img
                                src={product.product_profile}
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">{product.product_name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {product.product_description}
                            </p>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[#ed7e0f] font-bold">
                                    {product.product_price}
                                </span>
                                <span className="text-xs text-gray-500">{product.product_category}</span>
                            </div>
                            <div className="flex gap-2">
                                <AsyncLink
                                    to={`/seller/products/${product.id}/edit`}
                                    className="flex-1 text-center py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Modifier
                                </AsyncLink>
                                <AsyncLink
                                    to={`/produit/${product.product_url}`}
                                    className="flex-1 text-center py-2 text-sm bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ff8f1f] transition-colors"
                                >
                                    Voir
                                </AsyncLink>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
};

export default SellerCatalog; 