import React, { useState, useEffect } from 'react';
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
  MessageCircle,
} from 'lucide-react';

import Header from '@/components/ui/header';
import MobileNav from '@/components/ui/mobile-nav';
import { useGetProductByUrlQuery, useGetSimilarProductsQuery } from '@/services/guardService';
import SimilarProducts from '@/components/products/SimilarProducts';
import { addItem } from '@/store/cartSlice';
import { useDispatch } from 'react-redux';
import AsyncLink from '@/components/ui/AsyncLink';
import CheckoutDrawer from '@/components/ui/CheckoutDrawer';
import { ProductReview } from '@/components/products/ProductReview';
import OptimizedImage from '@/components/OptimizedImage';
import { toast } from 'sonner';

// Skeleton Loader Component
const ProductDetailSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-2">
    {/* Left column - Images */}
    <div className="lg:col-span-4">
      <div className="sticky top-8">
        <div className="bg-white flex flex-col-reverse lg:flex-row items-start gap-4 rounded-2xl shadow-sm p-4">
          {/* Thumbnails */}
          <div className="flex flex-col w-full lg:w-56 gap-4 relative">
            <div className="flex lg:flex-col gap-2 px-1">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 h-14 w-14 rounded-lg bg-gray-200"
                />
              ))}
            </div>
          </div>
          {/* Main image */}
          <div className="relative w-full lg:w-[60rem] bg-gray-200 rounded-lg overflow-hidden mb-4 h-[300px] lg:h-96" />
        </div>
      </div>
    </div>
    {/* Center column - Product info */}
    <div className="lg:col-span-5">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            <div className="h-6 w-24 rounded-full bg-gray-200" />
          </div>
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-10 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          {/* Variants */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="space-y-4">
                <div className="h-6 w-40 rounded bg-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex items-center p-2 border rounded-lg bg-gray-100">
                      <div className="w-12 h-12 mr-3 rounded-md bg-gray-200" />
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full border mr-2 bg-gray-200" />
                          <div className="h-4 w-16 rounded bg-gray-200" />
                        </div>
                        <div className="h-4 w-20 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="px-4 py-2 border rounded-lg bg-gray-200 w-16 h-8" />
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full border bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            </div>
          </div>
          {/* Price and discount */}
          <div className="p-4 rounded-xl">
            <div className="flex items-baseline gap-2">
              <div className="h-6 w-24 rounded bg-gray-200" />
              <div className="h-6 w-12 rounded bg-gray-200" />
            </div>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-200" />
              <div className="h-4 w-8 rounded bg-gray-200" />
              <div className="h-4 w-12 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
          {/* Quantity and stock */}
          <div className="flex items-center justify-between py-4 border-t border-b">
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="flex items-center border rounded-lg">
                <div className="w-8 h-8 bg-gray-200" />
                <div className="w-16 h-8 bg-gray-200" />
                <div className="w-8 h-8 bg-gray-200" />
              </div>
            </div>
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
    {/* Right column - Delivery and CTA */}
    <div className="lg:col-span-3">
      <div className="sticky top-8">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div className="w-5 h-5 rounded-full bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div className="w-4 h-4 rounded-full bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div className="w-4 h-4 rounded-full bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            </div>
            <div className="border-t my-4"></div>
            <div className="text-center flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded bg-gray-200" />
            </div>
            <div className="space-y-3 mt-6">
              <div className="w-full h-12 rounded-xl bg-gray-200" />
              <div className="w-full h-12 rounded-xl bg-gray-200" />
              <div className="w-full h-12 rounded-xl bg-gray-200" />
              <div className="border-t pt-4">
                <div className="w-full h-12 rounded-xl bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200 mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailPage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  console.log(mousePosition)
  const { data: { data: product } = {}, isLoading } = useGetProductByUrlQuery(url);
  const { data: { data: similarProducts } = {}, isLoading: isLoadingSimilarProducts } = useGetSimilarProductsQuery(product?.id);
  const [showCartButton, setShowCartButton] = useState(false);
  const dispatch = useDispatch();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const productId = product?.id
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  console.log(product)
  const handleAddToCart = async () => {
    setIsLoadingCart(true);

    // Si selectedVariant a des attributs, transformer l'array en objet unique
    let modifiedSelectedVariant = selectedVariant;
    if (selectedVariant?.attributes && selectedVariant.attributes.length > 0) {
      const foundAttribute = selectedVariant.attributes.find((variant: any) => variant.value === currentInfo.attribute);
      if (foundAttribute) {
        modifiedSelectedVariant = {
          ...selectedVariant,
          attributes: foundAttribute // Remplacer l'array par l'objet unique
        };
      }
    }

    dispatch(addItem({
      product,
      quantity,
      selectedVariation: modifiedSelectedVariant
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Produit ajouté au panier avec succès", {
      position: "top-center",
      duration: 6000,
      style: {
        backgroundColor: "#ed7e0f",
        color: "#fff",
        zIndex: 98888000
      },
      action: {
        label: "Voir le panier",
        onClick: () => window.location.href = "/cart"
      }
    })
    setIsLoadingCart(false);
    setShowCartButton(true);
  };

  // Helper function to get all images
  const getAllImages = () => {
    if (selectedVariant) {
      // Si une variante est sélectionnée, retourner toutes ses images
      return selectedVariant.images?.map((path: any) => ({ path })) || [];
    }
    // Sinon, retourner les images du produit principal
    const mainImage = { path: product?.product_profile };
    const productImages = product?.product_images || [];
    return [mainImage, ...productImages];
  };

  // Modifier l'useEffect pour initialiser la première variation et son premier attribut
  useEffect(() => {
    if (product?.variations && product.variations.length > 0 && !selectedVariant) {
      const firstVariation = product.variations[0];
      setSelectedVariant(firstVariation);
      // Si la variation a des attributs, sélectionner le premier
      if (firstVariation.attributes && firstVariation.attributes.length > 0) {
        setSelectedAttribute(firstVariation.attributes[0].value);
      }
      setSelectedImage(0);
    }
  }, [product, selectedVariant]);

  // Modifier getCurrentProductInfo pour gérer les attributs
  const getCurrentProductInfo = () => {
    if (product?.variations && product.variations.length > 0) {
      const currentVariant = selectedVariant || product.variations[0];

      // Cas où la variation a des attributs
      if (currentVariant.attributes && currentVariant.attributes.length > 0) {
        const selectedAttr = currentVariant.attributes.find((attr: any) => attr.value === selectedAttribute)
          || currentVariant.attributes[0];

        // Calculer le prix en gros si applicable
        let finalPrice = selectedAttr.price;
        let wholesaleInfo = null;

        if (product.productWholeSales && product.productWholeSales.length > 0) {
          // Trier par quantité minimum décroissante pour trouver le bon niveau
          const sortedWholesale = Array.from(product.productWholeSales).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));

          // Trouver le niveau de gros applicable pour cette quantité
          for (const wholesale of sortedWholesale as any[]) {
            if (quantity >= Number(wholesale.min_quantity)) {
              finalPrice = Number(wholesale.wholesale_price);
              wholesaleInfo = wholesale;
              break;
            }
          }
        }

        return {
          attributeVariationId: selectedAttr.id,
          productVariationId: currentVariant.id,
          price: finalPrice,
          quantity: selectedAttr.quantity,
          mainImage: currentVariant.images?.[0],
          images: currentVariant.images?.map((path: string) => ({ path })) || [],
          color: currentVariant.color,
          variantName: currentVariant.color.name,
          attribute: selectedAttr.value,
          wholesaleInfo,
          originalPrice: selectedAttr.price
        };
      }

      // Cas où la variation est simple (couleur uniquement)
      let finalPrice = currentVariant.price;
      let wholesaleInfo = null;

      if (product.productWholeSales && product.productWholeSales.length > 0) {
        const sortedWholesale = Array.from(product.productWholeSales).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));

        for (const wholesale of sortedWholesale as any[]) {
          if (quantity >= Number(wholesale.min_quantity)) {
            finalPrice = Number(wholesale.wholesale_price);
            wholesaleInfo = wholesale;
            break;
          }
        }
      }

      return {
        attributeVariationId: null,
        productVariationId: currentVariant.id,
        price: finalPrice,
        quantity: currentVariant.quantity,
        mainImage: currentVariant.images?.[0],
        images: currentVariant.images?.map((path: string) => ({ path })) || [],
        color: currentVariant.color,
        variantName: currentVariant.color.name,
        attribute: null,
        wholesaleInfo,
        originalPrice: currentVariant.price
      };
    }

    // Si le produit n'a pas de variations
    let finalPrice = product?.product_price;
    let wholesaleInfo = null;

    if (product?.productWholeSales && product.productWholeSales.length > 0) {
      const sortedWholesale = Array.from(product.productWholeSales).sort((a: any, b: any) => Number(b.min_quantity) - Number(a.min_quantity));

      for (const wholesale of sortedWholesale as any[]) {
        if (quantity >= Number(wholesale.min_quantity)) {
          finalPrice = Number(wholesale.wholesale_price);
          wholesaleInfo = wholesale;
          break;
        }
      }
    }

    return {
      attributeVariationId: null,
      productVariationId: null,
      price: finalPrice,
      quantity: product?.product_quantity,
      mainImage: product?.product_profile,
      images: product?.product_images || [],
      color: null,
      variantName: null,
      attribute: null,
      wholesaleInfo,
      originalPrice: product?.product_price
    };
  };

  // Modifier la fonction getProductQuantity pour utiliser currentInfo
  const getProductQuantity = () => {
    return currentInfo.quantity || 0;
  };

  // Get current product information
  const currentInfo = getCurrentProductInfo();

  // Modifier handleVariantSelect pour gérer la sélection de variante
  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    // Réinitialiser l'attribut sélectionné avec le premier de la nouvelle variante
    if (variant.attributes && variant.attributes.length > 0) {
      setSelectedAttribute(variant.attributes[0].value);
    } else {
      setSelectedAttribute(null);
    }
    setSelectedImage(0);
  };

  // Ajouter un gestionnaire pour la sélection d'attribut
  const handleAttributeSelect = (value: string) => {
    setSelectedAttribute(value);
  };

  // Modifier le gestionnaire de clic sur l'image principale
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Gestion du zoom
    if (isZoomed) {
      e.stopPropagation();
      setIsZoomed(false);
      return;
    }

    // Si on clique sur une image de la liste des images du produit principal
    const allImages = getAllImages();
    const currentImage = allImages[selectedImage];

    // Si l'image cliquée est une image du produit principal et qu'une variante est sélectionnée
    if (selectedVariant && currentImage?.path === product?.product_profile) {
      setSelectedVariant(null); // Désélectionner la variante
      setSelectedImage(0); // Revenir à la première image du produit
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

  // Fonction pour ouvrir WhatsApp
  const openWhatsApp = () => {
    const message = `Bonjour ! J'aimerai avoir plus de détails sur ce produit : ${product?.product_name}\n\nLien du produit : ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/237678080249?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="">
        {/* Skeleton Loader */}
        {isLoading && (
          <div className="px-2 py-4 sm:px-6 md:px-12 lg:px-24">
            <ProductDetailSkeleton />
          </div>
        )}

        {/* Cas où le produit n'est pas trouvé */}
        {!isLoading && !product && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
            <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <AsyncLink
              to="/shops"
              className="bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors"
            >
              Découvrir nos boutiques
            </AsyncLink>
          </div>
        )}
        {!isLoading && product && product.status === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non Accessible</h2>
            <p className="text-gray-600 mb-8">Le produit que vous recherchez n'est pas encore accessible.</p>
            <AsyncLink
              to="/shops"
              className="bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors"
            >
              Découvrir nos boutiques
            </AsyncLink>
          </div>
        )}
        {/* Fil d'Ariane */}
        {!isLoading && product && product.status === 1 && <nav className="flex max-sm:mx-9 items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Accueil</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{product?.product_name}</span>
        </nav>}


        {!isLoading && product && product.status === 1 && (
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
                        {getAllImages().map((image: any, idx: any) => (
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
                            <OptimizedImage
                              src={image.path}
                              alt={`${product.product_name} ${idx + 1}`}
                              className="w-full h-full object-cover"

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
                      <OptimizedImage
                        src={getAllImages()[selectedImage]?.path || product.product_profile}
                        alt={product.product_name}
                        className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}

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
                    {getProductQuantity() > 0 ? <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      En stock

                    </span> : <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                      Rupture de stock

                    </span>}

                  </div>

                  <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>

                  {/* Affichage du prix avec gestion du gros */}
                  <div className="space-y-2">
                    {currentInfo.wholesaleInfo ? (
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl max-sm:text-3xl font-bold text-[#ed7e0f]">
                            {currentInfo.price} FCFA
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            {currentInfo.originalPrice} FCFA
                          </span>
                          <span className="px-2 py-1 text-sm font-bold text-white bg-green-500 rounded">
                            -{Math.round(((Number(currentInfo.originalPrice) - Number(currentInfo.price)) / Number(currentInfo.originalPrice)) * 100)}%
                          </span>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          🏪 Tarif gros appliqué (à partir de {(currentInfo.wholesaleInfo as any)?.min_quantity} unités)
                        </div>
                      </div>
                    ) : (
                      <span className="text-4xl max-sm:text-3xl font-bold text-[#ed7e0f]">
                        {currentInfo.price} FCFA
                      </span>
                    )}
                  </div>
                  {/* Description courte */}
                  <p className="text-gray-800  line-clamp-3">{product.product_description}</p>
                  {/* Variants */}
                  {product?.variations && product.variations.length > 0 && (
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        {/* Grille des variations */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Options disponibles</h3>

                          {/* Sélection de la couleur */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {product.variations.map((variation: any) => (
                              <button
                                key={variation.id}
                                onClick={() => handleVariantSelect(variation)}
                                className={`flex items-center p-2 border rounded-lg transition-all ${selectedVariant?.id === variation.id
                                  ? 'border-[#ed7e0f] bg-[#ed7e0f]/5 ring-1 ring-[#ed7e0f]/20'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                  }`}
                              >
                                <div className="w-12 h-12 mr-3 rounded-md overflow-hidden">
                                  <OptimizedImage
                                    src={variation.images?.[0]}
                                    alt={variation.color.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center mb-1">
                                    <div
                                      className="w-3 h-3 rounded-full border mr-2"
                                      style={{ backgroundColor: variation.color.hex }}
                                    />
                                    <span className="font-medium text-sm text-gray-900">{variation.color.name}</span>
                                  </div>
                                  <div className="text-sm font-bold text-[#ed7e0f]">
                                    {variation.attributes?.[0]?.price || variation.price} FCFA
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Sélection de la taille/pointure si la variante en a */}
                          {selectedVariant?.attributes && selectedVariant.attributes.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Taille</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedVariant.attributes.map((attr: any) => (
                                  <button
                                    key={attr.id}
                                    onClick={() => handleAttributeSelect(attr.value)}
                                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${selectedAttribute === attr.value
                                      ? 'border-[#ed7e0f] bg-[#ed7e0f]/5 text-[#ed7e0f]'
                                      : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                  >
                                    {attr.value}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Informations de la variation sélectionnée */}
                      {currentInfo.variantName && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            {currentInfo.color && (
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: currentInfo.color.hex }}
                              />
                            )}
                            <h4 className="font-medium text-gray-900">
                              {currentInfo.variantName}
                              {currentInfo.attribute && ` - Taille ${currentInfo.attribute}`}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Prix et stock</span>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{currentInfo.quantity} en stock</span>
                              <span className="font-bold text-[#ed7e0f]">{currentInfo.price} FCFA</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section Vente en Gros */}
                  {product?.productWholeSales && product.productWholeSales.length > 0 && (
                    <div className="mt-6 p-3 bg-white border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🏪</span>
                        <span className="text-sm font-semibold text-gray-700">Prix en gros</span>
                      </div>
                      <table className="w-full text-xs text-gray-700">
                        <thead>
                          <tr>
                            <th className="text-left font-medium pb-1">Qté min.</th>
                            <th className="text-left font-medium pb-1">Prix/unité</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(product.productWholeSales)
                            .sort((a: any, b: any) => Number(a.min_quantity) - Number(b.min_quantity))
                            .map((wholesale: any) => {
                              const isStockInsufficient = Number(wholesale.min_quantity) > getProductQuantity();
                              const isSelected = quantity === Number(wholesale.min_quantity) && !isStockInsufficient;
                              return (
                                <tr key={wholesale.id} className={isSelected ? "bg-[#ed7e0f]/10" : ""}>
                                  <td className="py-1">{wholesale.min_quantity}+</td>
                                  <td className="py-1 font-semibold">{Number(wholesale.wholesale_price).toLocaleString()} FCFA</td>
                                  <td>
                                    <button
                                      onClick={() => {
                                        if (isStockInsufficient) {
                                          toast.error(
                                            `Stock insuffisant ! Le stock actuel (${getProductQuantity()} unités) ne permet pas d'atteindre le seuil de ${wholesale.min_quantity} unités pour ce tarif.`,
                                            {
                                              duration: 4000,
                                              position: "top-center",
                                            }
                                          );
                                        } else {
                                          setQuantity(Number(wholesale.min_quantity));
                                        }
                                      }}
                                      disabled={isStockInsufficient}
                                      className={`px-2 py-1 rounded text-xs font-medium border transition-all
                                        ${isSelected
                                          ? 'bg-[#ed7e0f] text-white border-[#ed7e0f]'
                                          : isStockInsufficient
                                            ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#ed7e0f]'
                                        }`}
                                    >
                                      {isStockInsufficient ? "Indisponible" : "Choisir"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      {(() => {
                        const insufficientWholesales = Array.from(product.productWholeSales)
                          .filter((w: any) => Number(w.min_quantity) > getProductQuantity());
                        if (insufficientWholesales.length > 0) {
                          return (
                            <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700">
                              <span className="text-yellow-600">⚠️</span>
                              <span>
                                Certains tarifs nécessitent plus d'unités que le stock disponible ({getProductQuantity()} unités)
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
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
                      <span className="ml-1 font-medium">{product.review_average}</span>
                      <span className="ml-1 text-gray-500 max-sm:text-sm">({product.reviewCount} avis)</span>
                    </div>
                    <div className="text-gray-500 max-sm:text-sm">{product.count_seller} vendus</div>
                    <div className="text-gray-500 max-sm:text-sm">Code: {product.shop_key}</div>
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
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(getProductQuantity(), parseInt(e.target.value) || 1));
                            setQuantity(val);
                          }}
                          max={getProductQuantity()}
                          min={1}
                          className="w-16  text-center border-x"
                        />
                        <button
                          onClick={() => setQuantity(Math.min(getProductQuantity(), quantity + 1))}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {getProductQuantity() > 0 && (
                      <span className="text-sm max-sm:text-xs text-gray-500">
                        Stock disponible: {getProductQuantity()} unités
                      </span>
                    )}
                  </div>

                  {/* Indicateur de tarif gros */}
                  {product?.productWholeSales && product.productWholeSales.length > 0 && (
                    <div className="py-3 border-b">
                      <div className="space-y-2">
                        {/* Niveau actuel */}
                        {currentInfo.wholesaleInfo ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-green-600 font-medium">
                              Tarif gros actuel : {Number((currentInfo.wholesaleInfo as any)?.wholesale_price).toLocaleString()} FCFA/unité
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            <span className="text-gray-600">
                              Tarif normal : {Number(currentInfo.originalPrice).toLocaleString()} FCFA/unité
                            </span>
                          </div>
                        )}

                        {/* Prochain seuil */}
                        {(() => {
                          const nextWholesale = Array.from(product.productWholeSales)
                            .sort((a: any, b: any) => Number(a.min_quantity) - Number(b.min_quantity))
                            .find((w: any) => Number(w.min_quantity) > quantity);

                          if (nextWholesale) {
                            const remaining = Number((nextWholesale as any).min_quantity) - quantity;
                            return (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                <span className="text-blue-600">
                                  +{remaining} unité{remaining > 1 ? 's' : ''} pour le tarif {Number((nextWholesale as any).wholesale_price).toLocaleString()} FCFA/unité
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  )}
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
                        <span className="text-gray-600 text-xs">Vendu par :</span> <OptimizedImage src={product.shop_profile} alt="" className="w-5 h-5 rounded-full" />
                        <span className="text-gray-600 text-xs">{product.shop_key || "CRTORRS S..."}</span>
                        <AsyncLink to={`/shop/${product.shop_id}`} className="text-[#ed7e0f] text-xs hover:underline ml-2">
                          Visiter la boutique
                        </AsyncLink>
                      </div>

                      {/* Livraison */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Livraison: 1-3 jours</span>
                      </div>

                      {/* Prix de livraison */}


                      {/* Sécurité */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Paiement sécurisé</span>
                      </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t my-4"></div>

                    {/* Prix total */}
                    <div className="text-center flex items-center justify-between">
                      <p className="text-sm text-gray-500">Prix total :</p>
                      <p className="text-2xl max-sm:text-xl font-bold text-[#ed7e0f] mt-1">
                        {(Number(currentInfo.price) * quantity).toLocaleString()} FCFA
                      </p>
                    </div>

                    {/* CTA Buttons */}

                    <div className="space-y-3 mt-6">
                      {getProductQuantity() > 0 &&
                        <button
                          onClick={() => setIsDrawerOpen(true)}
                          disabled={getProductQuantity() == 0}
                          className={`w-full px-6 py-3.5 rounded-xl font-medium transition-colors ${getProductQuantity() === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90'
                            }`}
                        >

                          {getProductQuantity() == 0 ? 'Rupture de stock' : 'Acheter maintenant'}
                        </button>
                      }

                      {getProductQuantity() == 0 &&
                        <div className='px-3 py-4 text-sm text-center font-medium bg-red-100 text-red-800 rounded-full'>
                          Rupture de stock
                        </div>
                      }

                      {!showCartButton ? (
                        <button
                          onClick={handleAddToCart}
                          disabled={isLoadingCart || getProductQuantity() == 0}
                          className={`w-full px-6 py-3.5 flex items-center justify-center gap-2 rounded-xl font-medium transition-colors ${getProductQuantity() == 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}>
                          {isLoadingCart ? (
                            <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent rounded-full">
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              {getProductQuantity() == 0 ? 'Rupture de stock' : 'Ajouter au panier'}
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


                      <div className="border-t pt-4">
                        <button
                          onClick={openWhatsApp}
                          className="w-full bg-green-500 text-white px-6 py-3.5 flex items-center justify-center gap-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Assistance produit
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Réponse rapide garantie
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {
          !isLoading && product && product.status === 1 && <SimilarProducts similarProducts={similarProducts} isLoadingSimilarProducts={isLoadingSimilarProducts} />
        }

        {/* Description et avis */}
        {!isLoading && product && product.status === 1 && (
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
                    <ProductReview reviews={product.reviews} productId={productId} />
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
