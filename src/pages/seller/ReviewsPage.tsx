import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useCurrentSellerQuery } from '@/services/sellerService';
import { SellerResponse } from '@/types/seller';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { Star, ThumbsUp, MessageCircle, Filter, Search, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { useGetListShopReviewsQuery } from '@/services/auth';

const ReviewsPage = () => {
  const { data: { data: sellerData } = {}, isLoading } = useCurrentSellerQuery<SellerResponse>('seller');
  const [activeFilter, setActiveFilter] = useState('all');
  const {data:reviewsData,isLoading:isLoadingReviews}=useGetListShopReviewsQuery(sellerData?.shop.shop_id)
  console.log(reviewsData)
  // Fonction pour calculer la moyenne des étoiles
 
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête avec statistiques */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{sellerData?.shop?.review_average}/5</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total des avis</p>
                  <p className="text-2xl font-bold text-gray-900">{sellerData?.shop?.reviewCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <ThumbsUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux de satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans les avis..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filtrer
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <BarChart2 className="w-4 h-4" />
                  Analyser
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Distribution des notes */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribution des notes</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{rating} étoiles</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Liste des avis */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            {/* Exemple d'avis */}
            {!isLoadingReviews && reviewsData.map((review:any) => (
              <Card key={review} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/150?img=${review.user_id}`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">#{review.userName}</h4>
                      <span className="text-sm text-gray-500"> {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">
                      {review.comment}
                    </p>
                   
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default ReviewsPage; 