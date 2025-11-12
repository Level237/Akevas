import { Card } from "@/components/ui/card";
import { AlertCircle, Package, XCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface RejectedProduct {
  id: number;
  name: string;
  reason?: string;
  rejectedAt?: string;
}

interface RejectedProductAlertProps {
  rejectedCount?: number;
  rejectedProducts?: RejectedProduct[];
  onLearnMore?: () => void;
  showModal?: boolean;
}

const RejectedProductAlert = ({ 
  rejectedCount = 1, 
  rejectedProducts = [],
  onLearnMore,
  showModal = false 
}: RejectedProductAlertProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mt-8 p-6 border-rose-200 bg-rose-50 shadow-sm">
          <div className="flex items-start justify-between gap-4 max-sm:flex-col">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-rose-600" />
                  <h3 className="font-semibold text-rose-900">
                    {rejectedCount > 1 
                      ? `Vous avez ${rejectedCount} produits qui ont été rejetés`
                      : "Vous avez un produit qui a été rejeté"
                    }
                  </h3>
                </div>
                
                <p className="text-sm text-rose-700">
                  {rejectedCount > 1
                    ? "Plusieurs de vos produits n'ont pas été approuvés. Consultez les détails pour connaître les raisons du refus."
                    : "Votre produit n'a pas été approuvé. Consultez les détails pour connaître les raisons du refus."
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-2 max-sm:w-full">
              {showModal && rejectedProducts.length > 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white px-4 py-2 rounded-lg hover:bg-rose-100 text-rose-600 text-sm font-medium transition-colors border border-rose-300 flex items-center gap-2"
                >
                  Voir détails
                </button>
              )}
              <Link
                to="/seller/products?r=1"
                onClick={onLearnMore}
                className="bg-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 text-white text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
              >
                En savoir plus
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modale des détails */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-rose-600" />
                  <h4 className="text-xl font-bold text-gray-900">Produits rejetés</h4>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {rejectedProducts.length > 0 ? (
                  rejectedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="p-4 bg-rose-50 rounded-lg border border-rose-200"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 mt-2 bg-rose-500 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{product.name}</h5>
                          {product.reason && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Raison :</span> {product.reason}
                            </p>
                          )}
                          {product.rejectedAt && (
                            <p className="text-xs text-gray-500">
                              Rejeté le {new Date(product.rejectedAt).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucun détail disponible</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 max-sm:text-xs rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
                <Link
                  to="/seller/products?r=1"
                  className="px-4 py-2 max-sm:text-xs rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Gérer mes produits
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RejectedProductAlert;
