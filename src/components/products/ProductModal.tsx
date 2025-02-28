import { Product } from "@/types/products";
import { useState, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ChevronRight, Minus, Plus, ShoppingCart, Star, X, Eye, CreditCard } from "lucide-react";

import AsyncLink from "../ui/AsyncLink";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";

// Définition des interfaces
interface ImageGalleryProps {
  product: Product;
  selectedImage: number | null;
  onImageSelect: (index: number | null) => void;
}

interface ActionButtonsProps {
  quantity: number;
  isLoading: boolean;
  showCartButton: boolean;
  onQuantityDecrease: () => void;
  onQuantityIncrease: () => void;
  onAddToCart: () => Promise<void>;
  product: Product;
}

export default function ProductModal({ product, isOpen, onClose }: { product: Product, isOpen: boolean, onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartButton, setShowCartButton] = useState(false);
  const dispatch = useDispatch();

  // 1. Extraire les handlers et les mémoriser
  const handleQuantityDecrease = useCallback(() => {
    setQuantity(q => Math.max(1, q - 1));
  }, []);

  const handleQuantityIncrease = useCallback(() => {
    setQuantity(q => q + 1);
  }, []);

  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    dispatch(addItem({ product, quantity }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setShowCartButton(true);
  }, [dispatch, product, quantity]);

  const handleOnClose = useCallback(() => {
    setSelectedImage(null);
    setQuantity(1);
    onClose();
  }, [onClose]);

  // 2. Extraire les composants qui peuvent changer fréquemment
  const ImageGallery = memo(({ product, selectedImage, onImageSelect }: ImageGalleryProps) => (
    <div className="bg-gray-50 p-8">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-lg">
        <img
          src={selectedImage === null ? product.product_profile : product.product_images[selectedImage].path}
          alt={product.product_name}
          className="w-full h-full object-cover"
        />

        <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
          Nouveau
        </span>

      </div>
      <div className="grid grid-cols-4 gap-3">
        <button
          className={`aspect-square rounded-lg overflow-hidden border-2 shadow-sm hover:shadow-md transition-all
            ${selectedImage === null ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20' : 'border-transparent'}`}
          onClick={() => onImageSelect(null)}
        >
          <img
            src={product.product_profile}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </button>
        {product.product_images.map((image, idx) => (
          <button
            key={idx}
            className={`aspect-square rounded-lg overflow-hidden border-2 shadow-sm hover:shadow-md transition-all
              ${selectedImage === idx ? 'border-[#ed7e0f] ring-2 ring-[#ed7e0f]/20' : 'border-transparent'}`}
            onClick={() => onImageSelect(idx)}
          >
            <img
              src={image.path}
              alt={`${product.product_name} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  ));

  const ActionButtons = memo(({
    quantity,
    isLoading,
    showCartButton,
    onQuantityDecrease,
    onQuantityIncrease,
    onAddToCart,
    product
  }: ActionButtonsProps) => (
    <div className="space-y-4">
      {/* Quantité et Acheter maintenant */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-lg bg-gray-50">
          <button
            onClick={onQuantityDecrease}
            className="p-3 text-gray-600 hover:text-gray-900 transition-colors"
            disabled={isLoading}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={onQuantityIncrease}
            className="p-3 text-gray-600 hover:text-gray-900 transition-colors"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Boutons d'action modernisés */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onAddToCart}
          className="w-full bg-[#6e0a13] text-white px-6 py-3.5 rounded-xl font-medium transition-all transform active:scale-95 hover:bg-[#5d0810] flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Acheter maintenant
        </button>

        {!showCartButton ? (
          <button
            onClick={onAddToCart}
            disabled={isLoading}
            className="w-full bg-white border-2 border-[#ed7e0f] text-[#ed7e0f] px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
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

        <AsyncLink
          to={`/produit/${product.product_url}`}
          className="w-full bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <Eye className="w-5 h-5" />
          Voir le détail
        </AsyncLink>
      </div>
    </div>
  ));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={handleOnClose}
        >
          <div className="min-h-screen px-4 max-sm:px-0 text-center">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />

            <div className="inline-block w-full max-w-5xl my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="relative grid max-sm:grid-cols-1 grid-cols-[1fr,1.2fr] gap-0">
                {/* Colonne gauche - Images */}
                <ImageGallery
                  product={product}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />

                {/* Colonne droite - Détails */}
                <div className="p-8 flex flex-col h-full">
                  <button onClick={handleOnClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <X className="w-5 h-5" />
                  </button>

                  {/* En-tête produit */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">{product.product_categories[0].category_name}</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Code: {product.shop_key}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {product.product_name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1 font-medium">4.5</span>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                        Premium
                      </span>
                    </div>
                  </div>

                  {/* Prix et description */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.product_price} FCFA
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {product.product_description}
                    </p>
                  </div>

                  {/* Informations boutique simplifiées */}
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 p-2 flex items-center justify-center">
                        <img src={product.shop_profile || '/default-shop.png'} alt="Logo boutique" className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.shop_key}</h4>
                        <AsyncLink to={`/shop/${product.shop_id}`} className="text-[#ed7e0f] hover:underline text-sm">
                          Voir la boutique
                        </AsyncLink>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <ActionButtons
                    quantity={quantity}
                    isLoading={isLoading}
                    showCartButton={showCartButton}
                    onQuantityDecrease={handleQuantityDecrease}
                    onQuantityIncrease={handleQuantityIncrease}
                    onAddToCart={handleAddToCart}
                    product={product}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};