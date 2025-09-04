import { Card } from "@/components/ui/card";
import { AlertCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";


const FeedbackRejected = ({ feedbacks, isLoading }: { feedbacks: any, isLoading: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!feedbacks || feedbacks.length === 0) {
    return null; // ou un message par défaut si aucun feedback
  }

  return (
    <Card className="mt-8 p-6 border-rose-200 bg-rose-50">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Motifs du refus</h3>
        </div>

        <div className="space-y-2">
          {!isLoading && feedbacks.map((feedback: any) => (
            <div key={feedback.id} className="flex items-center gap-2 text-gray-700">
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
              <p className="truncate w-full">{feedback.message}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-600 p-2 rounded-lg hover:bg-rose-700 text-white"
          >
            Voir plus
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-900">Detail Motif du refus</h4>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4 mb-6">
                {feedbacks.map((feedback: any) => (
                  <div key={feedback.id} className="flex items-start gap-2 text-gray-700">
                    <span className="w-2 h-2 mt-2 bg-rose-500 rounded-full flex-shrink-0" />
                    <p className="whitespace-pre-line text-sm break-words">{feedback.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 max-sm:text-xs rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
                <Link
                  to={`/seller/update-docs`}
                  className="px-4 py-2 max-sm:text-xs rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center"
                  onClick={() => setIsModalOpen(false)} // Optionally close modal on navigate
                >
                  Mettre à jour vos documents
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackRejected; 