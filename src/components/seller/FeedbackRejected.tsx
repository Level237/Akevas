import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";


const FeedbackRejected = ({ feedbacks, isLoading }: { feedbacks: any, isLoading: boolean }) => {
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
        <div className="flex justify-end">
          <Link
            to={`/seller/update-docs`}
            className="  bg-rose-600 p-2 rounded-lg hover:bg-rose-700 text-white"
          >
            Mettre à jour vos documents
          </Link>
        </div>

      </div>
    </Card>
  );
};

export default FeedbackRejected; 