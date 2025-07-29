import React, { useState } from 'react';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { Share2, Plus, ShoppingBag, Search, Grid, List, Copy, Check, Facebook, MessageCircle, Twitter, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Product } from '@/types/products';
import AsyncLink from '@/components/ui/AsyncLink';
import MobileNav from '@/components/ui/mobile-nav';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SellerCatalog: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { data: { data: seller } = {}, isLoading: sellerLoading } = useCurrentSellerQuery('seller');
    const shopId = seller?.shop?.shop_id;
    const products = seller?.shop?.products;

    if (seller?.shop?.level === "1") {
        return (
            <div className="flex flex-col  items-center justify-center min-h-screen p-4">
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
            <div className="flex items-center  justify-center min-h-screen">
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

    const handleShare = () => {
        setIsShareDialogOpen(true);
    };

    const handleCopyLink = async () => {
        const shareUrl = `${window.location.origin}/shop/${shopId}/catalog`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Erreur lors de la copie:', error);
        }
    };

    const filteredProducts = products?.filter((product: Product) => 
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === 'all' || product.product_categories.some(cat => cat.category_name === selectedCategory))
    );

    const categories = ['all', ...new Set(products?.flatMap((p: Product) => 
        p.product_categories.map(cat => cat.category_name)
    ) || [])] as string[];

    return (
        <div className="min-h-screen mx-24 max-sm:mx-4 bg-gray-50">
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Partager votre catalogue</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                            <Input 
                                readOnly 
                                value={`${window.location.origin}/shop/${shopId}/catalog`}
                                className="bg-transparent border-none focus-visible:ring-0"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a 
                                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/shop/${shopId}/catalog`}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="flex items-center justify-center gap-2 p-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1865D3] transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                                Facebook
                            </a>

                            <a
                                href={`https://twitter.com/intent/tweet?url=${window.location.origin}/shop/${shopId}/catalog`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                                Twitter
                            </a>

                            <a
                                href={`https://wa.me/?text=${window.location.origin}/shop/${shopId}/catalog`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                            </a>

                            <a
                                href={`https://telegram.me/share/url?url=${window.location.origin}/shop/${shopId}/catalog`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                Telegram
                            </a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Hero Section */}
                <div className="bg-[#6e0a13] rounded-2xl p-8 mb-8 text-white">
                    <h1 className="text-3xl max-sm:text-xl font-bold mb-2">Mon Catalogue</h1>
                    <p className="opacity-90 max-sm:text-sm">Gérez et partagez vos produits facilement</p>
                    <div className="flex gap-4 mt-6">
                    <AsyncLink
                        to="/seller/create-product"
                            className="flex items-center gap-2 bg-[#ed7e0f] px-6 py-3 max-sm:px-2 max-sm:py-2 rounded-lg hover:bg-gray-100 transition-all"
                    >
                        <Plus className='max-sm:hidden ' />
                            <span className='max-sm:text-xs'>Ajouter un produit</span>
                    </AsyncLink>
                    <button
                        onClick={handleShare}
                            className="flex items-center gap-2 bg-[#ed7e0f]/20 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-[#ed7e0f]/30 transition-all border border-white/20"
                    >
                        <Share2 className='max-sm:w-4 max-sm:h-4' />
                            <span className='max-sm:text-xs'>Partager</span>
                    </button>
                </div>
            </div>

                {/* Search and Filters Bar */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                type="text"
                                placeholder="Rechercher un produit..."
                                className="pl-10 w-full max-sm:placeholder:text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex max-sm:flex-col gap-4">
                            <select
                                className="px-4 py-2 max-sm:text-sm border rounded-lg bg-gray-50 text-gray-700"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'Toutes les catégories' : category}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2 max-sm:hidden border rounded-lg p-1 bg-gray-50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
            </div>

                {/* Products Display */}
                <AnimatePresence>
                    {viewMode === 'grid' ? (
                        <div 
                            className="grid mb-12  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            
                        >
                            {filteredProducts?.map((product: Product) => (
                                <div
                                    key={product.id}
                                   
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={product.product_profile}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-[#ed7e0f] transition-colors">
                                                {product.product_name}
                                            </h3>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                {product.product_categories[0]?.category_name}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {product.product_description}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[#ed7e0f] text-xl font-bold">
                                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(Number(product.product_price))}
                                            </span>
                                        </div>
                                        <div className="flex gap-3">
                                            <AsyncLink
                                                to={`/`}
                                                className="flex-1 text-center py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Modifier
                                            </AsyncLink>
                                            <a
                                                href={`https:/akevas.com/produit/${product.product_url}`}
                                                target='_blank'
                                                className="flex-1 text-center py-2.5 text-sm bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ff8f1f] transition-colors"
                                            >
                                                Voir
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div 
                            className="flex flex-col gap-4"
                        >
                            {filteredProducts?.map((product: Product) => (
                    <div
                        key={product.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex"
                        >
                                    <div className="w-48 h-48 flex-shrink-0">
                            <img
                                src={product.product_profile}
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                                    <div className="flex-1 p-6 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {product.product_name}
                                            </h3>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                {product.product_categories[0]?.category_name}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 flex-1 mb-4">
                                {product.product_description}
                            </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#ed7e0f] text-2xl font-bold">
                                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(Number(product.product_price))}
                                </span>
                                            <div className="flex gap-3">
                                <AsyncLink
                                    to={`/seller/products/${product.id}/edit`}
                                                    className="px-6 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Modifier
                                </AsyncLink>
                                <AsyncLink
                                    to={`/produit/${product.product_url}`}
                                                    className="px-6 py-2.5 text-sm bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ff8f1f] transition-colors"
                                >
                                    Voir
                                </AsyncLink>
                                            </div>
                            </div>
                        </div>
                    </div>
                ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
            <MobileNav />
        </div>
    );
};

export default SellerCatalog; 