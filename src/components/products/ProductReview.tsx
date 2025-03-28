import { useCheckAuthQuery, useMakeReviewMutation } from "@/services/auth";
import { Loader2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { redirectToLogin } from "@/lib/redirectToLogin";
import { useGetListReviewsQuery } from "@/services/auth";



export function ProductReview(reviews: any) {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [makeReview] = useMakeReviewMutation()
    const { data, isLoading } = useCheckAuthQuery()
    const {data:reviewsData,isLoading:isLoadingReviews}=useGetListReviewsQuery(reviews.productId)
    const url=window.location.pathname
    const [loading,setLoading]=useState(false)
    const [showAllReviews, setShowAllReviews] = useState(false);
    const REVIEWS_TO_SHOW = 5;

    const visibleReviews = showAllReviews 
        ? reviewsData 
        : reviewsData?.slice(0, REVIEWS_TO_SHOW);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
     
       
        if(comment===""){
            return;
        }
        setLoading(true)
        await new Promise(resolve=>setTimeout(resolve,2000))
        await makeReview({ formData: { rating, comment }, productId: reviews.productId })
        setRating(0)
        setComment("")
        setLoading(false)
    };

    // Fonction pour générer l'avatar avec les initiales
    const getInitials = (name: string) => {
        return name.split(' ')[0][0].toUpperCase();
    };

    return (
        <div className="space-y-8 mx-auto max-sm:max-w-full max-w-4xl px-4 max-sm:px-0 max-sm:mb-12">
            {/* Résumé des avis */}

            {reviews?.reviews?.length > 0 && (
            <div className="flex gap-8 p-6 bg-gray-50 rounded-xl">
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">4.8</div>
                    <div className="flex items-center justify-center text-yellow-400 my-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">Basé sur 128 avis</div>
                </div>
                <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 mb-2">
                            <span className="w-8 text-sm text-gray-600">{stars}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}` }}
                                />
                            </div>
                            <span className="w-8 text-sm text-gray-600">
                                {stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}
                            </span>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {/* Liste des avis */}
            <div className="space-y-6">
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
                        <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
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
            </div>

            {/* Formulaire d'avis */}
            {!isLoading && data?.isAuthenticated === true ? (
                <div className="border-t pt-8 mt-24">
                    <h3 className="text-lg font-semibold mb-4">Donnez votre avis</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                        <div className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(i + 1)}
                                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                                >
                                    <Star className={`w-8 h-8 ${i < rating ? 'text-yellow-400 fill-current' : 'fill-current'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div >
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Votre commentaire
                        </label>
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border-[0.2px] border-[#ed7e0f] p-4 rounded-lg resize-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f]"
                            placeholder="Partagez votre expérience avec ce produit..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
                    >
                        {loading ? <div className="flex items-center justify-center gap-2"> <h2>En Cours  </h2> <Loader2 className='w-4 h-4 animate-spin' /></div> : <span>Publier mon avis</span>}
                    </button>
                </form>
            </div>
            ) : (
                <div className="border-t pt-8 mt-24 text-center">
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
                </div>
            )}
        </div>
    );
}