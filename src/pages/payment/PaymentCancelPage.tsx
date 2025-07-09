import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
        <XCircle className="w-20 h-20 text-orange-400 mb-4" />
        <h1 className="text-2xl font-bold text-orange-700 mb-2">Paiement annulé</h1>
        <p className="text-gray-700 mb-6 text-center">Vous avez annulé le paiement. Si c'est une erreur, vous pouvez réessayer ou revenir à la boutique.</p>
        <Link to="/cart" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow transition-all mb-2">Réessayer le paiement</Link>
        <Link to="/" className="text-orange-700 hover:underline mt-2">Retour à la boutique</Link>
      </div>
    </div>
  );
} 