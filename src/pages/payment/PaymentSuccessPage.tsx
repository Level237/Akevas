import { CheckCircle } from 'lucide-react';
import { Link} from 'react-router-dom';

export default function PaymentSuccessPage() {
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ed7e0f]/50 to-[#ed7e0f]/10 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-[#ed7e0f] mb-4" />
        <h1 className="text-2xl font-bold text-[#ed7e0f] mb-2">Paiement réussi !</h1>
        <p className="text-gray-700 mb-6 text-center">Votre paiement a été effectué avec succès. Merci pour votre confiance !</p>
       
          <Link to={`/user/order/`} className="bg-[#ed7e0f]  hover:bg-[#ed7e0f]/90 text-white px-6 py-2 rounded-lg font-medium shadow transition-all mb-2">Voir ma commande</Link>
    
        <Link to="/" className="text-[#ed7e0f] hover:underline mt-2">Retour à l'accueil</Link>
      </div>
    </div>
  );
} 