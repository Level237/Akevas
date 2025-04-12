import { motion } from 'framer-motion';
import { 
  Download, 
  Check, 
  Coins, 
  Calendar, 
  Clock, 
  Share2, 
  ArrowLeft,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import confetti from 'canvas-confetti'; // n'oubliez pas d'installer: npm install canvas-confetti
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface TransactionDetails {
  transactionId: string;
  amount: number;
  coins: number;
  date: string;
  time: string;
  paymentMethod: string;
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [transactionId] = useState(() => "TRX" + Math.random().toString(36).substr(2, 9).toUpperCase());

  // Simuler les détails de la transaction (à remplacer par vos données réelles)
  const transaction: TransactionDetails = {
    transactionId,
    amount: 5000,
    coins: 250,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    paymentMethod: "NotchPay"
  };

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
      pdf.save(`recu-${transaction.transactionId}.pdf`);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Paiement Confirmé !</h1>
          <p className="mt-2 text-gray-600">Votre achat de coins a été effectué avec succès.</p>
        </motion.div>

        {/* Ticket/Reçu */}
        <motion.div
          ref={ticketRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Partie supérieure du ticket */}
          <div className="bg-gradient-to-r from-[#ed7e0f] to-orange-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Montant payé</p>
                <p className="text-3xl font-bold">{transaction.amount} XAF</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Coins reçus</p>
                <div className="flex items-center gap-1">
                  <Coins className="w-5 h-5" />
                  <span className="text-2xl font-bold">{transaction.coins}</span>
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
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Date</span>
              </div>
              <span className="font-medium">{transaction.date}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Heure</span>
              </div>
              <span className="font-medium">{transaction.time}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Transaction ID</span>
              </div>
              <span className="font-medium">{transaction.transactionId}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Méthode</span>
              </div>
              <span className="font-medium">{transaction.paymentMethod}</span>
            </div>

            {/* QR Code (optionnel) */}
            <div className="flex justify-center pt-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${transaction.transactionId}`}
                alt="QR Code"
                className="w-32 h-32 opacity-80"
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
          <div className="flex gap-4">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-[#ed7e0f] hover:bg-orange-600 text-white font-medium py-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
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

            <Button
              onClick={() => {
                // Logique de partage
              }}
              variant="outline"
              className="px-6 rounded-xl hover:bg-gray-50"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={() => navigate('/seller/dashboard')}
            variant="ghost"
            className="w-full py-6 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 