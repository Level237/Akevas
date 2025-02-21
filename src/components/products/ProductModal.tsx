import { Product } from "@/types/products";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";



import { ChevronRight, Minus, Plus,ShoppingCart, Star, X } from "lucide-react";

import AsyncLink from "../ui/AsyncLink";

export default function ProductModal({product,isOpen,onClose}:{product:Product,isOpen:boolean,onClose:()=>void}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Implémentez la logique d'ajout au panier
    
    setSelectedImage(null)
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={()=>{
            setSelectedImage(null)
            onClose()
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
            
            <div className="inline-block w-full max-w-5xl my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl overflow-hidden"
                 onClick={e => e.stopPropagation()}>
              <div className="relative grid max-sm:grid-cols-1 max-sm:gap-0 grid-cols-[1fr,1.2fr] gap-0">
                {/* Colonne gauche - Images */}
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
                      onClick={() => setSelectedImage(null)}
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
                        onClick={() => setSelectedImage(idx)}
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

                {/* Colonne droite - Détails */}
                <div className="p-8 flex flex-col h-full">
                  <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <X className="w-5 h-5" />
                  </button>

                  {/* En-tête produit */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">

                      

                      <span className="px-3 py-1 bg-gray-100 max-sm:text-xs rounded-full">{product.product_categories[0].category_name}</span>

                      <ChevronRight className="w-4 h-4" />
                      <span className="px-3 py-1 bg-gray-100 rounded-full">Code: {product.shop_key}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {product.product_name}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="ml-1 font-medium">3</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">12 avis</span>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                        Premium
                      </span>
                    </div>
                  </div>

                  {/* Prix et description */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {product.product_price} FCFA
                        </span>
                        
                      
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {product.product_description}
                    </p>
                  </div>

                  {/* Informations boutique */}
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center">
                        <img src={product.shop_profile || '/default-shop.png'} alt="Logo boutique" className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.shop_key}</h4>
                        <p className="text-sm text-gray-600">Membre depuis {new Date(product.shop_created_at).toLocaleDateString("fr-FR",{
                          year:"numeric",
                          month:"long",
                        })}</p>
                      </div>
                      <AsyncLink to={`/shop/${product.shop_id}`} className="ml-auto text-[#ed7e0f] hover:underline text-sm font-medium">
                        Voir la boutique
                      </AsyncLink>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white p-2 rounded-lg">
                        <div className="font-medium text-gray-900">98%</div>
                        <div className="text-xs text-gray-600">Satisfaction</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <div className="font-medium text-gray-900">24h</div>
                        <div className="text-xs text-gray-600">Délai réponse</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <div className="font-medium text-gray-900">+500</div>
                        <div className="text-xs text-gray-600">Ventes</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-gray-50">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="p-3 text-gray-600 hover:text-gray-900"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="p-3 text-gray-600 hover:text-gray-900"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#ed7e0f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};