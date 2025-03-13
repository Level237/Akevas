import { Star } from "lucide-react";


export function ProductReview() {

    return (
        <>
            <div className="space-y-8 mx-44">
                {/* Résumé des avis */}
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

                {/* Liste des avis */}
                <div className="space-y-6">
                    {/* ... existing reviews ... */}
                </div>

                {/* Formulaire d'avis */}
                <div className="border-t pt-8 mt-8">
                    <h3 className="text-lg font-semibold mb-4">Donnez votre avis</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <div className="flex gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="text-gray-300 hover:text-yellow-400"
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Votre commentaire
                            </label>
                            <textarea
                                rows={4}
                                className="w-full rounded-lg border-gray-200 resize-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f]"
                                placeholder="Partagez votre expérience avec ce produit..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#ed7e0f] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#ed7e0f]/80 transition-colors"
                        >
                            Publier mon avis
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}