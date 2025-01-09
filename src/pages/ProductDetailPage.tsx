import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  ArrowRight,
  MessageCircle,
  ThumbsUp,
  ChevronDown
} from 'lucide-react';
import shoes from "../assets/shoes1.webp"
import Header from '@/components/ui/header';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  // Mock data - À remplacer par les données de l'API
  const product = {
    id,
    name: 'Figurine Collector Demon Slayer',
    description: `Figurine collector édition limitée de Tanjiro Kamado en pose de combat.
    Fabriquée avec les meilleurs matériaux et une attention particulière aux détails.
    
    Caractéristiques:
    - Hauteur: 24cm
    - Matériau: PVC et ABS
    - Peinture de haute qualité
    - Base incluse
    - Certificat d'authenticité`,
    price: 129.99,
    originalPrice: 159.99,
    images: [
      shoes,
      shoes,
      shoes,
      shoes
    ],
    rating: 4.8,
    reviewCount: 128,
    storeCode: 'JP_STORE_8472',
    category: 'Figurines',
    tags: ['Premium', 'Collector', 'Demon Slayer'],
    variants: {
      sizes: [
        { id: 's1', name: '18cm', value: '18cm', inStock: true },
        { id: 's2', name: '24cm', value: '24cm', inStock: true, price: 149.99 }
      ]
    },
    specifications: [
      { name: 'Marque', value: 'Demon Slayer Official' },
      { name: 'Matériau', value: 'PVC, ABS' },
      { name: 'Hauteur', value: '24cm' },
      { name: 'Poids', value: '800g' },
      { name: 'Origine', value: 'Japon' }
    ],
    reviews: [
      {
        id: 1,
        user: 'Alex D.',
        rating: 5,
        date: '2024-12-28',
        content: 'Qualité exceptionnelle, les détails sont incroyables !',
        likes: 12,
        images: ['/images/reviews/review1.jpg']
      },
      // Ajoutez plus d'avis
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Accueil</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <a href="/category/figurines" className="hover:text-gray-900">Figurines</a>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">Demon Slayer</span>
        </nav>

        {/* Section principale */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 gap-8 p-8">
            {/* Galerie d'images */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors
                      ${selectedImage === idx ? 'border-[#ed7e0f]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informations produit */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 rounded-full">
                    Premium
                  </span>
                  <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                    <span className="ml-1 text-gray-500">
                      ({product.reviewCount} avis)
                    </span>
                  </div>
                  <span className="text-gray-500">
                    Code: {product.storeCode}
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.price} €
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {product.originalPrice} €
                    </span>
                  )}
                </div>

                {/* Variants */}
                {Object.entries(product.variants).map(([type, variants]) => (
                  <div key={type} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variants.map(variant => (
                        <button
                          key={variant.id}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200"
                        >
                          {variant.name}
                          {variant.price && ` (+${variant.price - product.price}€)`}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quantité et ajout au panier */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>

                  <button className="flex-1 bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors">
                    Ajouter au panier
                  </button>
                </div>

                {/* Informations de livraison */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Livraison gratuite
                      </p>
                      <p className="text-sm text-gray-500">
                        Livraison estimée : 3-5 jours ouvrés
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#ed7e0f]" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Garantie premium
                      </p>
                      <p className="text-sm text-gray-500">
                        30 jours satisfait ou remboursé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                Avis ({product.reviewCount})
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
                  <p className="whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {selectedTab === 'specifications' && (
                <div className="grid grid-cols-2 gap-6">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 border-b"
                    >
                      <span className="text-gray-600">{spec.name}</span>
                      <span className="font-medium text-gray-900">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
                  {product.reviews.map(review => (
                    <div
                      key={review.id}
                      className="border-b last:border-0 pb-6 mb-6 last:pb-0 last:mb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {review.user}
                            </span>
                            <div className="flex items-center text-yellow-400">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{review.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-gray-900">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{review.content}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2">
                          {review.images.map((image, idx) => (
                            <div
                              key={idx}
                              className="w-20 h-20 rounded-lg overflow-hidden"
                            >
                              <img
                                src={image}
                                alt={`Review ${review.id} image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
