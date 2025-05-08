import React, { useCallback, useState, useEffect } from 'react';
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
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { data: { data: product } = {}, isLoading } = useGetProductByUrlQuery(url);
  const { data: { data: similarProducts } = {}, isLoading: isLoadingSimilarProducts } = useGetSimilarProductsQuery(product?.id);
  const [showCartButton, setShowCartButton] = useState(false);
  console.log(product)
  const dispatch = useDispatch();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const productId = product?.id
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  
  const handleAddToCart = useCallback(async () => {
    setIsLoadingCart(true);
    
    dispatch(addItem({ 
      product, 
      quantity,
      selectedVariation: selectedVariant 
    }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoadingCart(false);
    setShowCartButton(true);
  }, [dispatch, product, quantity, selectedVariant]);
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
  
  // Fonction utilitaire pour obtenir les informations de la première variation
  const getFirstVariationInfo = (product: any) => {
    if (!product?.variations || product.variations.length === 0) {
      return null;
    }

    const firstVariation = product.variations[0];

    // Cas où la variation a des attributs (comme dans l'exemple "polor" et "pantouffle")
    if (firstVariation.attributes && firstVariation.attributes.length > 0) {
      const firstAttr = firstVariation.attributes[0];
      return {
        price: firstAttr.price,
        quantity: firstAttr.quantity,
        image: firstVariation.images?.[0] || product.product_profile
      };
    }

    // Cas où la variation est simple (comme dans l'exemple "pljjfee")
    if (firstVariation.isColorOnly) {
      return {
        price: firstVariation.price,
        quantity: firstVariation.quantity,
        image: firstVariation.images?.[0] || product.product_profile
      };
    }

    return null;
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
          
        return {
          attributeVariationId: selectedAttr.id,
          productVariationId: currentVariant.id,
          price: selectedAttr.price,
          quantity: selectedAttr.quantity,
          mainImage: currentVariant.images?.[0],
          images: currentVariant.images?.map((path: string) => ({ path })) || [],
          color: currentVariant.color,
          variantName: currentVariant.color.name,
          attribute: selectedAttr.value
        };
      }
      
      // Cas où la variation est simple (couleur uniquement)
      return {
        attributeVariationId: null,
        productVariationId: currentVariant.id,
        price: currentVariant.price,
        quantity: currentVariant.quantity,
        mainImage: currentVariant.images?.[0],
        images: currentVariant.images?.map((path: string) => ({ path })) || [],
        color: currentVariant.color,
        variantName: currentVariant.color.name,
        attribute: null
      };
    }

    // Si le produit n'a pas de variations
    return {
      attributeVariationId: null,
      productVariationId: null,
      price: product?.product_price,
      quantity: product?.product_quantity,
      mainImage: product?.product_profile,
      images: product?.product_images || [],
      color: null,
      variantName: null,
      attribute: null
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="">
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
                    {getProductQuantity() > 0 ? <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      En stock
                      
                    </span> : <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                      Rupture de stock
                      
                    </span>}
                    
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
                  <span className="text-4xl font-bold text-[#ed7e0f]">
                    {currentInfo.price} FCFA
                  </span>
                  {/* Description courte */}
                  <p className="text-gray-800 font-bold line-clamp-3">{product.product_description}</p>
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
                                className={`flex items-center p-2 border rounded-lg transition-all ${
                                  selectedVariant?.id === variation.id
                                    ? 'border-[#ed7e0f] bg-[#ed7e0f]/5 ring-1 ring-[#ed7e0f]/20'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                              >
                                <div className="w-12 h-12 mr-3 rounded-md overflow-hidden">
                                  <img
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
                                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                      selectedAttribute === attr.value
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
                      <span className="ml-1 text-gray-500">({product.reviewCount} avis)</span>
                    </div>
                    <div className="text-gray-500">{product.count_seller} vendus</div>
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
                    {getProductQuantity() > 0 && (
                      <span className="text-sm text-gray-500">
                        Stock disponible: {getProductQuantity()} unités
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
