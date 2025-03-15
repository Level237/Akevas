import { redirectToLogin } from "@/lib/redirectToLogin";
import { useCheckAuthQuery, useGetListShopReviewsQuery, useMakeReviewShopMutation } from "@/services/auth";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface StoreReview {
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    date: string;
    rating: number;
    comment: string;
  }

const reviews: StoreReview[] = [
    {
      id: 'review-1',
      userId: 'user-1',
      userName: 'John Doe',
      userImage: 'https://picsum.photos/200/300',
      date: '2024-03-12',
      rating: 5,
      comment: 'Très bonne boutique ! Les produits sont de qualité et les prix sont raisonnables.'
    },
    {
      id: 'review-2',
      userId: 'user-2',
      userName: 'Jane Doe',
      userImage: 'https://picsum.photos/200/301',
      date: '2024-03-15',
      rating: 4,
      comment: 'Boutique sympa, mais les délais de livraison sont un peu longs.'
    }
  ];
const ShopReviews=({shopId}:{shopId:string | null})=>{

    const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useCheckAuthQuery()
    const [makeReviewShop]=useMakeReviewShopMutation()
    const [showAllReviews, setShowAllReviews] = useState(false);
    const REVIEWS_TO_SHOW = 5;
    const {data:reviewsData,isLoading:isLoadingReviews}=useGetListShopReviewsQuery(shopId)
    console.log(reviewsData)
    const getInitials = (name: string) => {
        return name.split(' ')[0][0].toUpperCase();
    };
    const visibleReviews = showAllReviews 
        ? reviewsData 
        : reviewsData?.slice(0, REVIEWS_TO_SHOW);
    const url=window.location.pathname
  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Ici, ajoutez la logique pour envoyer la note à votre API
    await new Promise(resolve => setTimeout(resolve, 1000));
    const res=await makeReviewShop({ formData: { rating, comment }, shopId: shopId })
    console.log(res)
    setIsSubmitting(false);
    setRating(0);
    setComment('');
  };
    return (
        <div className="max-w-3xl mx-auto">
        {/* En-tête des statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#ed7e0f]">4.8</div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#ed7e0f]">127</div>
            <div className="text-sm text-gray-600">Avis clients</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#ed7e0f]">98%</div>
            <div className="text-sm text-gray-600">Recommandent</div>
          </div>
        </div>
        {!isLoadingReviews && reviewsData?.length === 0 && 
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-medium">Aucun commentaire disponible</p>
                        <p className="text-gray-400 text-sm mt-1">Soyez le premier à donner votre avis !</p>
                    </div>
                        }
                           {!isLoadingReviews && visibleReviews?.map((review: any) => (
                        <div key={review.id} className="bg-white p-6 mb-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ed7e0f] to-[#f4a340] flex items-center justify-center text-white font-medium">
                                        {getInitials(review.userName)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900">{review.userName}</h4>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-yellow-400 mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'stroke-current fill-none'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mt-3">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                      {/* Bouton Voir plus/moins */}
                {!isLoadingReviews && reviewsData?.length > REVIEWS_TO_SHOW && (
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="w-full group flex items-center justify-center gap-2 py-4 px-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-900"
                    >
                        <span className="font-medium">
                            {showAllReviews ? 'Voir moins' : `Voir tous les avis (${reviewsData.length})`}
                        </span>
                        {showAllReviews ? (
                            <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                        ) : (
                            <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                        )}
                    </button>
                )}


        {/* Formulaire d'avis */}
        {!isLoading && data?.isAuthenticated === true ? (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Donnez votre avis</h2>
                    <form onSubmit={handleSubmitRating} className="space-y-6">
                      <div className="flex flex-col items-start gap-2">
                        <label className="text-sm font-medium text-gray-700">Votre note</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="transition-transform hover:scale-110 focus:outline-none"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= (hoveredRating || rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
          
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                          Votre commentaire
                        </label>
                        <textarea
                          id="comment"
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                         className="w-full border-[0.2px] border-[#ed7e0f] p-4 rounded-lg resize-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f]"
                          placeholder="Partagez votre expérience avec cette boutique..."
                        />
                      </div>
          
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || !rating}
                          className={`
                            px-6 py-3 rounded-xl font-medium text-white
                            transition-all duration-200
                            ${rating 
                              ? 'bg-[#ed7e0f] hover:bg-[#ed7e0f]/90' 
                              : 'bg-gray-300 cursor-not-allowed'
                            }
                            flex items-center gap-2
                          `}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Envoi en cours...
                            </>
                          ) : (
                            'Envoyer mon avis'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
        ):                 <div className="border-t pt-8 mt-24 mb-24 text-center">
        <div className="mb-4 text-gray-600">
            <h3 className="text-lg font-semibold mb-2">Connectez-vous pour donner votre avis</h3>
            <p className="text-sm">Partagez votre expérience avec la communauté</p>
        </div>
        <Button
            onClick={() => redirectToLogin({ redirectUrl: url, })}
            className=" bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
        >
            Se connecter
        </Button>
    </div>}

      </div>
    )
}

export default ShopReviews;