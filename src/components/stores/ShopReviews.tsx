import { Star } from "lucide-react";
import { useState } from "react";

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
const ShopReviews=()=>{

    const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Ici, ajoutez la logique pour envoyer la note à votre API
    await new Promise(resolve => setTimeout(resolve, 1000));
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

        {/* Liste des avis */}
        <div className="space-y-6 mb-8">
          {/* Exemple d'avis */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">il y a 2 jours</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Excellent service, je recommande vivement !</p>
          </div>
        </div>

        {/* Formulaire d'avis */}
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
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-[#ed7e0f] focus:ring-[#ed7e0f]"
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
      </div>
    )
}

export default ShopReviews;