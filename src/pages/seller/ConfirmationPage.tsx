import { motion } from 'framer-motion';
import { 
  Download, 
  Check, 
  Coins, 
  Calendar, 
  Clock,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useGetTicketCoinQuery } from '@/services/sellerService';
import confetti from 'canvas-confetti'; // n'oubliez pas d'installer: npm install canvas-confetti
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type TicketCoin = {
  id: number | string;
  price: number | string;
  user: string;
  transaction_ref: string;
  payment_of: string;
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { ref } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError, refetch } = useGetTicketCoinQuery(ref as string, { skip: !ref });

  // Effet confetti lors du chargement de la page
  useState(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.6 }
    });
  });

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`recu-${ref}.pdf`);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!ref) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Référence manquante</h1>
          <p className="text-gray-600 mt-2">Aucune référence de transaction fournie.</p>
          <Button onClick={() => navigate(-1)} className="mt-6">Retour</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Chargement du ticket…</h1>
          <p className="text-gray-600 mt-2">Veuillez patienter.</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Erreur</h1>
          <p className="text-gray-600 mt-2">Impossible de charger le ticket. Réessayez.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => refetch()}>Réessayer</Button>
            <Button variant="outline" onClick={() => navigate('/seller/dashboard')}>Tableau de bord</Button>
          </div>
        </div>
      </div>
    );
  }

  const ticket = data as TicketCoin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* En-tête avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Paiement Confirmé !</h1>
          <p className="mt-1 text-gray-600">Votre achat de coins a été effectué avec succès.</p>
        </motion.div>

        {/* Ticket/Reçu */}
        <motion.div
          ref={ticketRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Partie supérieure du ticket */}
          <div className="bg-gradient-to-r from-[#ed7e0f] to-orange-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Montant payé</p>
                <p className="text-2xl font-bold">{String(ticket.price)} XAF</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Objet</p>
                <div className="flex items-center gap-1">
                  <Coins className="w-5 h-5" />
                  <span className="text-xl font-bold">{ticket.payment_of}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne en zigzag */}
          <div className="flex">
            <div className="h-2 w-2 rounded-full bg-gray-100 -ml-1"></div>
            {[...Array(30)].map((_, i) => (
              <div key={i} className="flex-1 h-[2px] bg-gray-200 my-[6px]"></div>
            ))}
            <div className="h-2 w-2 rounded-full bg-gray-100 -mr-1"></div>
          </div>

          {/* Détails de la transaction */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Date</span>
              </div>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Heure</span>
              </div>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Transaction ID</span>
              </div>
              <span className="font-medium">{ticket.transaction_ref}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Méthode</span>
              </div>
              <span className="font-medium">Mobile money</span>
            </div>

            {/* QR Code (optionnel) */}
            <div className="flex justify-center pt-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.transaction_ref}`}
                alt="QR Code"
                className="w-24 h-24 opacity-80"
              />
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-[#ed7e0f] hover:bg-orange-600 text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isDownloading ? "Téléchargement..." : "Télécharger le reçu"}
            </Button>

            
          </div>

          <Button
            onClick={() => navigate('/seller/dashboard')}
            variant="ghost"
            className="w-full py-4 rounded-lg flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 