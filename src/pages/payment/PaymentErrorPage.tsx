import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">Échec du paiement</h1>
        <p className="text-gray-700 mb-6 text-center">Le paiement a échoué. Cela peut être dû à un problème de connexion ou de solde insuffisant. Vous pouvez réessayer ou contacter le support.</p>
        <Link to="/cart" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium shadow transition-all mb-2">Réessayer le paiement</Link>
        <a href="mailto:support@akevas.com" className="text-red-700 hover:underline mt-2">Contacter le support</a>
      </div>
    </div>
  );
} 