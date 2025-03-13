import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Truck,
  Shield,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';

import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetProductByUrlQuery, useGetSimilarProductsQuery } from '@/services/guardService';
import { Variant } from '@/types/products';
import SimilarProducts from '@/components/products/SimilarProducts';
import { addItem } from '@/store/cartSlice';
import { useDispatch } from 'react-redux';
import AsyncLink from '@/components/ui/AsyncLink';
import CheckoutDrawer from '@/components/ui/CheckoutDrawer';
import { ProductReview } from '@/components/products/ProductReview';

const ProductDetailPage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { data: { data: product } = {}, isLoading } = useGetProductByUrlQuery(url);
  const { data: { data: similarProducts } = {}, isLoading: isLoadingSimilarProducts } = useGetSimilarProductsQuery(product?.id);
  const [showCartButton, setShowCartButton] = useState(false);
  const dispatch = useDispatch();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddToCart = useCallback(async () => {
    setIsLoadingCart(true);
    dispatch(addItem({ product, quantity }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoadingCart(false);
    setShowCartButton(true);
  }, [dispatch, product, quantity]);
  // Helper function to get all images
  const getAllImages = () => {
    const mainImage = { path: product?.product_profile };
    const productImages = product?.product_images || [];
    const variantImages = product?.variants?.flatMap((variant: Variant) => [
      { path: variant.image },
      ...(variant.images || [])
    ]) || [];

    return [mainImage, ...productImages, ...variantImages];
  };

  // Helper function to get current price and images
  const getCurrentProductInfo = () => {
    if (selectedVariant) {
      return {
        price: selectedVariant.price,
        mainImage: selectedVariant.image,
        images: selectedVariant.images || []  // Assuming variants have their own images
      };
    }
    return {
      price: product?.product_price,
      mainImage: product?.product_profile,
      images: product?.product_images || []
    };
  };

  // Get current product information
  const currentInfo = getCurrentProductInfo();

  // Modifier le gestionnaire de sélection de variant
  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    // Trouver l'index de l'image du variant dans la liste complète des images
    const allImages = getAllImages();
    const variantImageIndex = allImages.findIndex(img => img.path === variant.image);
    if (variantImageIndex !== -1) {
      setSelectedImage(variantImageIndex);
    }
  };

  // Modifier le gestionnaire de clic sur l'image principale
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Gestion du zoom
    if (isZoomed) {
      e.stopPropagation();
      setIsZoomed(false);
      return;
    }

    // Si on est sur l'image principale, réinitialiser les informations du produit
    const allImages = getAllImages();
    if (allImages[selectedImage]?.path === product?.product_profile) {
      setSelectedVariant(null);
      setSelectedImage(0); // Retour à la première image
    }
  };

  // Fonction pour gérer la navigation des images
  const navigateImage = (direction: 'next' | 'prev') => {
    const allImages = getAllImages();
    if (direction === 'next') {
      setSelectedImage((prev: number) => (prev === allImages.length - 1 ? 0 : prev + 1));
    } else {
      setSelectedImage((prev: number) => (prev === 0 ? allImages.length - 1 : prev - 1));
    }
  };

  // Fonction pour gérer le zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="">
        {/* Fil d'Ariane */}
        <nav className="flex max-sm:mx-9 items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Accueil</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{product?.product_name}</span>
        </nav>

        {!isLoading && product && (
          <div className="grid grid-cols-1  sticky lg:grid-cols-12 gap-2">

            {/* Colonne gauche - Images */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <div className="bg-white flex flex-col-reverse lg:flex-row items-start gap-4 rounded-2xl shadow-sm p-4">
                  {/* Barre d'images miniatures */}
                  <div className="flex flex-col w-full lg:w-56 gap-4 relative">
                    {/* Navigation buttons - Masqués sur mobile */}
                    <button
                      onClick={() => {
                        const container = document.getElementById('images-container');
                        if (container) container.scrollBy({ left: -80, behavior: 'smooth' });
                      }}
                      className="hidden lg:block absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    </button>

                    <div
                      id="images-container"
                      className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:h-[480px] relative scroll-smooth"
                      style={{
                        scrollSnapType: 'x mandatory lg:y mandatory',
                        scrollPadding: '0 1rem',
                      }}
                    >
                      <div className="flex lg:flex-col gap-2 px-1">
                        {getAllImages().map((image, idx) => (
                          <button
                            key={idx}
                            onClick={(e: any) => handleImageClick(e)}
                            onMouseEnter={() => setSelectedImage(idx)}
                            className={`flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all duration-200
                              ${selectedImage === idx
                                ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20'
                                : 'border-transparent hover:border-gray-200'
                              }
                              scroll-snap-align-start`}
                          >
                            <img
                              src={image.path}
                              alt={`${product.product_name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                              title={image.path === product?.product_profile ? "Image principale du produit" : ""}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const container = document.getElementById('images-container');
                        if (container) container.scrollBy({ left: 80, behavior: 'smooth' });
                      }}
                      className="hidden lg:block absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Image principale */}
                  <div
                    className="relative w-full lg:w-[60rem] bg-black rounded-lg overflow-hidden mb-4 group"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    onClick={handleImageClick}
                  >
                    <motion.div
                      className="relative w-full h-[300px] lg:h-96"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={getAllImages()[selectedImage]?.path || product.product_profile}
                        alt={product.product_name}
                        className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                        style={
                          isZoomed
                            ? {
                              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                            }
                            : undefined
                        }
                      />
                    </motion.div>

                    {/* Navigation buttons */}
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('prev');
                        }}
                        className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('next');
                        }}
                        className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </div>

                    {/* Indicateur de zoom */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {isZoomed ? 'Cliquez pour dézoomer' : 'Survolez pour zoomer'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne centrale - Informations produit */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                {/* En-tête du produit */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                      Premium
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      En stock
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
                  <span className="text-4xl font-bold text-[#ed7e0f]">
                    {currentInfo.price} FCFA
                  </span>
                  {/* Description courte */}
                  <p className="text-gray-800 font-bold line-clamp-3">{product.product_description}</p>
                  {/* Variants */}
                  {product?.variants && product.variants.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700">Variantes</h3>
                      <div className="flex flex-wrap gap-3">
                        {product.variants.map((variant: Variant) => (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(variant)}
                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all
                              ${selectedVariant?.id === variant.id
                                ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20 bg-[#ed7e0f]/5'
                                : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <img
                              src={variant.image}
                              alt={variant.variant_name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium">{variant.variant_name}</p>
                              <p className="text-sm text-gray-500">{variant.price} FCFA</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Prix et réduction avec design modernisé */}
                  <div className=" p-4 rounded-xl">
                    <div className="flex items-baseline gap-2">

                      {product.original_price && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            {product.original_price} FCFA
                          </span>
                          <span className="px-2 py-1 text-sm font-bold text-white bg-red-500 rounded">
                            -{Math.round((1 - product.product_price / product.original_price) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center gap-6 py-4 border-b">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">4.8</span>
                      <span className="ml-1 text-gray-500">(128 avis)</span>
                    </div>
                    <div className="text-gray-500">1250+ vendus</div>
                    <div className="text-gray-500">Code: {product.shop_key}</div>
                  </div>



                  {/* Quantité et Stock */}
                  <div className="flex items-center justify-between py-4 border-t border-b">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Quantité</span>
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center border-x"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {product.product_quantity && (
                      <span className="text-sm text-gray-500">
                        Stock disponible: {product.product_quantity} unités
                      </span>
                    )}
                  </div>
                </div>



              </div>
            </div>

            {/* Colonne droite - Sticky avec informations de livraison et CTA */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="space-y-4">
                    {/* Informations essentielles */}
                    <div className="space-y-3 text-sm">
                      {/* Vendeur */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        Vendu par : <img src={product.shop_profile} alt="" className="w-5 h-5 rounded-full" />
                        <span className="text-gray-600">{product.shop_key || "CRTORRS S..."}</span>
                      </div>

                      {/* Livraison */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Livraison: 7-15 jours</span>
                      </div>

                      {/* Prix de livraison */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <span className="text-gray-600">Frais de livraison</span>
                        <span className="font-medium">XAF52,692</span>
                      </div>

                      {/* Sécurité */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Paiement sécurisé</span>
                      </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t my-4"></div>

                    {/* Prix total */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="text-2xl font-bold text-[#ed7e0f] mt-1">
                        {currentInfo.price} FCFA
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 mt-6">
                      <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-full bg-[#ed7e0f] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors"
                      >
                        Acheter maintenant
                      </button>
                      {!showCartButton ? (
                        <button
                          onClick={handleAddToCart}
                          disabled={isLoadingCart}
                          className="w-full bg-gray-100 text-gray-700 px-6 py-3.5 flex items-center justify-center gap-2 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                          {isLoadingCart ? (
                            <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent rounded-full">
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              Ajouter au panier
                            </>
                          )}
                        </button>
                      ) : (
                        <AsyncLink
                          to="/cart"
                          className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Voir le panier
                        </AsyncLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <SimilarProducts similarProducts={similarProducts} isLoadingSimilarProducts={isLoadingSimilarProducts} />
        {/* Description et avis */}
        {!isLoading && product && (
          <>
            <div className="mt-8 bg-white rounded-2xl shadow-sm">
              {/* Onglets d'information */}
              <div className="border-t">
                <div className="flex border-b">
                  <button
                    onClick={() => setSelectedTab('description')}
                    className={`px-8 py-4 font-medium text-sm transition-colors relative
                    ${selectedTab === 'description' ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Description
                    {selectedTab === 'description' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedTab('specifications')}
                    className={`px-8 py-4 font-medium text-sm transition-colors relative
                    ${selectedTab === 'specifications' ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Spécifications
                    {selectedTab === 'specifications' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedTab('reviews')}
                    className={`px-8 py-4 font-medium text-sm transition-colors relative
                    ${selectedTab === 'reviews' ? 'text-[#ed7e0f]' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Avis ({product.reviews.length})
                    {selectedTab === 'reviews' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                      />
                    )}
                  </button>
                </div>

                <div className="p-8">
                  {selectedTab === 'description' && (
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line font-bold">
                        {product.product_description}
                      </p>
                    </div>
                  )}

                  {selectedTab === 'specifications' && (
                    <div className="grid grid-cols-2 gap-6">

                      <div

                        className="flex items-center justify-between py-3 border-b"
                      >
                        <span className="text-gray-600">12</span>
                        <span className="font-medium text-gray-900">
                          12
                        </span>
                      </div>

                    </div>
                  )}

                  {selectedTab === 'reviews' && (
                    <ProductReview reviews={product.reviews} />
                  )}
                </div>
              </div>
            </div>


          </>
        )}
      </main>
      <MobileNav />

      {/* Ajouter le drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <CheckoutDrawer

            onClose={() => setIsDrawerOpen(false)}
            product={product}
            selectedImage={selectedImage}
            quantity={quantity}
            setQuantity={setQuantity}
            currentInfo={getCurrentProductInfo()}
            getAllImages={getAllImages}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;