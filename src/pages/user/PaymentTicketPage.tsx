import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, MapPin, QrCode, Download, Loader2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useShowPaymentWithReferenceQuery } from '@/services/auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const statusMap: Record<string, { label: string; color: string }> = {
  '0': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  '1': { label: 'En cours de livraison', color: 'bg-blue-100 text-blue-800' },
  '2': { label: 'Livré', color: 'bg-green-100 text-green-800' },
  '3': { label: 'Annulé', color: 'bg-red-100 text-red-800' },
};


const TAX_RATE = 0.05;

export default function PaymentTicketPage() {
  const { ref } = useParams();
  const { data: payment, isLoading } = useShowPaymentWithReferenceQuery(ref);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading || !payment) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  if (payment && payment.code === 404) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-100">
        <Card className="p-10 rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-md text-center max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 rounded-full p-4 mb-4 animate-bounce">
              <svg className="w-10 h-10 text-[#ed7e0f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-[#ed7e0f] mb-2 tracking-tight">Ticket introuvable</h2>
            <p className="text-gray-500 mb-6 text-base">
              Oups ! Aucun ticket ne correspond à cette référence.<br />
              Veuillez vérifier le lien ou réessayer plus tard.
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-[#ed7e0f] to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-200"
            >
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const order = payment.order;
  const status = statusMap[order.status] || statusMap['0'];

  // Combiner les deux types de détails de commande
  const allOrderItems = [] as any[];

  // Ajouter les produits avec variation (orderVariations)
  if (order.orderVariations && order.orderVariations.length > 0) {
    order.orderVariations.forEach((item: any) => {
      if (item.variation_attribute && item.variation_attribute.product_variation) {
        const variation = item.variation_attribute.product_variation;
        const attributeValue = item.variation_attribute.value;

        allOrderItems.push({
          id: item.id,
          name: variation.product_name || 'Produit inconnu',
          color: variation.color?.name || '',
          size: attributeValue || '',
          quantity: parseInt(item.variation_quantity),
          price: parseFloat(item.variation_price),
          image: variation.images?.[0]?.path || '',
          total: parseInt(item.variation_quantity) * parseFloat(item.variation_price),
          type: 'variation'
        });
      }
    });
  }

  // Ajouter les produits sans variation (order_details)
  if (order.order_details && order.order_details.length > 0) {
    order.order_details.forEach((item: any) => {
      allOrderItems.push({
        id: item.id,
        name: item.product?.product_name || 'Produit inconnu',
        color: '',
        size: '',
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        image: item.product?.product_profile || '',
        total: parseInt(item.quantity) * parseFloat(item.price),
        type: 'simple'
      });
    });
  }

  return (
    <>
      <div
        className="max-w-2xl mx-auto px-2 py-4 sm:px-4 sm:py-10"
        ref={ticketRef}
        style={{
          minWidth: '320px', // Largeur minimale pour mobile
          width: '100%'
        }}
      >
        {/* Header Card */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl border-2 border-green-100 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <CheckCircle className="w-12 h-12 sm:w-10 sm:h-10 text-green-500 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">Paiement réussi</h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Merci pour votre achat, <span className="font-semibold">{payment.user}</span> !
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center sm:items-start mb-2">
            <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 py-1 rounded-lg">
              Réf. paiement : {payment.transaction_ref}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-lg">
              Commande : #{order.id}
            </Badge>
            <Badge className={`${status.color} text-xs sm:text-sm px-2 py-1 rounded-lg`}>
              {status.label}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
            <div className="flex flex-row items-center justify-between w-full sm:w-auto">
              <div className="text-base sm:text-lg font-semibold">Montant payé</div>
              <div className="text-lg sm:text-2xl font-bold text-green-700 ml-2 sm:ml-4">{payment.price} XAF</div>
            </div>
            <div className="flex flex-row items-center justify-between w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
              <div className="text-xs sm:text-sm text-gray-500">Date de commande</div>
              <div className="font-medium text-xs sm:text-base ml-2 sm:ml-4">{order.created_at.split('T')[0]}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-2 mt-4">
            <div className="flex flex-row items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium text-xs sm:text-base">Emplacement de livraison :</span>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm break-words">
              {order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}
              {order.emplacement == null && order.addresse}
            </span>
          </div>
        </Card>

        {/* QR Code Card */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col items-center rounded-2xl">
          <h2 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
            <QrCode className="w-5 h-5" /> QR Code du ticket
          </h2>
          <div className="flex justify-center w-full">
            <QRCodeCanvas
              value={JSON.stringify({
                ref: payment.transaction_ref,
                user: payment.user,
                amount: payment.price,
                date: order.created_at,
                products: allOrderItems.map((item: any) => item.name)
              })}
              size={140}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Scannez pour vérifier ou partager ce ticket
          </div>
        </Card>
      </div>
      <div className="fixed bottom-0 max-sm:relative max-sm:mb-12  left-0 w-full bg-white z-20 px-2 py-3 sm:static sm:bg-transparent sm:py-0 flex justify-center shadow-[0_-2px_12px_-4px_rgba(0,0,0,0.08)] sm:shadow-none">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-lg"
          onClick={async () => {
            if (!ticketRef.current) return;
            setIsDownloading(true);
            try {
              // Optimisations pour mobile
              const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: Math.max(320, ticketRef.current.scrollWidth),
                height: ticketRef.current.scrollHeight,
                scrollX: 0,
                scrollY: 0
              });

              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
                compress: true
              });

              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const margin = 20;
              const imgWidth = pageWidth - (2 * margin);
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              // Si l'image est trop haute, on la divise sur plusieurs pages
              if (imgHeight <= pageHeight - (2 * margin)) {
                // Une seule page
                pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
              } else {
                // Plusieurs pages - réserver de l'espace pour le QR code sur la dernière page
                const qrCodeHeight = 200; // Hauteur approximative pour le QR code + titre
                const availableHeight = pageHeight - (2 * margin) - qrCodeHeight;

                let heightLeft = imgHeight;
                let currentPage = 1;

                while (heightLeft > 0) {
                  const isLastPage = heightLeft <= availableHeight;
                  const currentHeight = Math.min(
                    isLastPage ? availableHeight : pageHeight - (2 * margin),
                    heightLeft
                  );

                  const currentCanvas = document.createElement('canvas');
                  currentCanvas.width = canvas.width;
                  currentCanvas.height = currentHeight;
                  const ctx = currentCanvas.getContext('2d');

                  if (ctx) {
                    ctx.drawImage(
                      canvas,
                      0, (imgHeight - heightLeft) * (canvas.width / imgWidth),
                      canvas.width, currentHeight * (canvas.width / imgWidth),
                      0, 0,
                      canvas.width, currentHeight
                    );
                  }

                  const currentImgData = currentCanvas.toDataURL('image/png');
                  pdf.addImage(currentImgData, 'PNG', margin, margin, imgWidth, currentHeight);

                  heightLeft -= currentHeight;
                  if (heightLeft > 0) {
                    pdf.addPage();
                    currentPage++;
                  }
                }

                // Ajouter le QR code sur la dernière page
                if (currentPage > 1) {
                  // Trouver le composant QRCodeCanvas existant dans le DOM
                  const existingQRCode = document.querySelector('canvas');
                  if (existingQRCode) {
                    const qrImgData = existingQRCode.toDataURL('image/png');
                    pdf.addImage(qrImgData, 'PNG', margin, margin + availableHeight, 140, 200);
                  }
                }
              }

              pdf.save(`ticket-${payment.transaction_ref}.pdf`);
            } catch (error) {
              console.error('Error downloading ticket:', error);
            } finally {
              setIsDownloading(false);
            }
          }}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isDownloading ? 'Téléchargement...' : 'Télécharger le ticket'}
        </Button>
      </div>
    </>
  );
} 