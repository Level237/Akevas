import { useSearchByQueryQuery } from "@/services/guardService";
import {motion} from "framer-motion"
import { Clock, Search, TrendingUp, X } from "lucide-react"
import { useState } from "react";

export default function SearchResource({open}:{open:()=>void}){
  

      const [searchState, setSearchState] = useState({
        query: '',
      });

      const {data,isLoading,error}=useSearchByQueryQuery({query:searchState.query,userId:0})
      console.log(data)
      const searchHistory = [
        'Robe d\'été fleurie',
        'Nike Air Max',
        'Sac à main cuir',
        'Montre connectée'
      ];
      
      const trendingSearches = [
        'Sneakers tendance',
        'Robes de soirée',
        'Accessoires homme',
        'Bijoux argent'
      ];

    return (
        <>
                             <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="container mx-auto px-4">
              {/* Search Header */}
              <div className="flex items-center gap-4 py-4 border-b">
                <button onClick={open}>
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchState.query}
                    onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ed7e0f]"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Search Content */}
              <div className="py-6">
                {searchState.query ? (
                  <div>
                    {/* Résultats de recherche en direct ici */}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Historique de recherche */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recherches récentes
                      </h3>
                      <div className="space-y-2">
                        {searchHistory.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchState(prev => ({ ...prev, query: search }))}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tendances */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Tendances
                      </h3>
                      <div className="space-y-2">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchState(prev => ({ ...prev, query: search }))}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </>
    )
}