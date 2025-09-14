import React, { useState } from 'react';
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




export default function PaymentTicketPage() {
  const { ref } = useParams();
  const { data: payment, isLoading } = useShowPaymentWithReferenceQuery(ref);
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

  const orders = payment.order; // Access the entire order array
  // For simplicity, using the status of the first order for the main badge if multiple orders exist
  const mainOrder = orders[0];
  const status = statusMap[mainOrder.status] || statusMap['0'];

  // Combiner les deux types de détails de commande de TOUTES les commandes
  const allOrderItems = [] as any[];
  orders.forEach((order: any) => {
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
            type: 'variation',
            orderId: order.id // Ajouter l'ID de la commande parente
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
          type: 'simple',
          orderId: order.id // Ajouter l'ID de la commande parente
        });
      });
    }
  });

  return (
    <>
      <div
        className="max-w-2xl mx-auto px-2 py-4 sm:px-4 sm:py-10"
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
            {orders.length > 1 ? (
              <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-lg">
                Commandes liées : {orders.map((o: any) => `#${o.id}`).join(', ')}
              </Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-lg">
                Commande : #{mainOrder.id}
              </Badge>
            )}

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
              <div className="font-medium text-xs sm:text-base ml-2 sm:ml-4">{mainOrder.created_at.split('T')[0]}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-2 mt-4">
            <div className="flex flex-row items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium text-xs sm:text-base">Emplacement de livraison :</span>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm break-words">
              {mainOrder.quarter_delivery !== null ? mainOrder.quarter_delivery : mainOrder.emplacement}
              {mainOrder.emplacement == null && mainOrder.addresse}
            </span>
          </div>
        </Card>

        {/* Détails des commandes */}
        {orders.map((order: any) => (
          <Card key={order.id} className="p-4 sm:p-6 mb-4 sm:mb-6 rounded-2xl shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Détails de la commande #{order.id}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p><strong>Statut:</strong> <Badge className={`${statusMap[order.status]?.color}`}>{statusMap[order.status]?.label}</Badge></p>
                <p><strong>Total:</strong> {order.total_amount} XAF</p>
                <p><strong>Articles:</strong> {order.itemsCount}</p>
              </div>
              <div>
                <p><strong>Livraison:</strong> {order.fee_of_shipping} XAF</p>
                <p><strong>Adresse:</strong> {order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}{order.emplacement == null && order.addresse}</p>
                <p><strong>Client:</strong> {order.userName} ({order.userPhone})</p>
              </div>
            </div>

            <h3 className="text-md sm:text-lg font-semibold mt-6 mb-4">Articles de la commande #{order.id}</h3>
            <div className="space-y-3">
              {allOrderItems.filter((item: any) => item.orderId === order.id).map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Image'; }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    {item.type === 'variation' && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {item.color && <span>Couleur: {item.color}</span>}
                        {item.size && <span>Taille: {item.size}</span>}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{item.total} XAF</span>
                </div>
              ))}
            </div>
          </Card>
        ))}

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
                date: mainOrder.created_at,
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
            setIsDownloading(true);
            try {
              // Créer un élément temporaire pour le téléchargement avec une résolution plus élevée
              const tempDiv = document.createElement('div');
              tempDiv.style.position = 'absolute';
              tempDiv.style.left = '-9999px';
              tempDiv.style.top = '0';
              tempDiv.style.width = '800px'; // Augmenter la largeur pour une meilleure résolution
              tempDiv.style.backgroundColor = '#ffffff';
              tempDiv.style.padding = '40px';
              tempDiv.style.fontFamily = 'Arial, sans-serif';
              tempDiv.style.fontSize = '16px';
              tempDiv.style.lineHeight = '1.4';
              
              // Créer le contenu HTML pour le téléchargement avec un meilleur layout
              tempDiv.innerHTML = `
                <div style="max-width: 720px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                  <!-- Header Card -->
                  <div style="padding: 32px; margin-bottom: 32px; border: 3px solid #dcfce7; border-radius: 20px; background: linear-gradient(135deg, #ffffff 0%, #f8fffe 100%);">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">✓</div>
                      <div>
                        <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #1f2937; letter-spacing: -0.5px;">Paiement réussi</h1>
                        <p style="color: #6b7280; font-size: 16px; margin: 6px 0 0 0; font-weight: 500;">
                          Merci pour votre achat, <strong style="color: #1f2937;">${payment.user}</strong> !
                        </p>
                      </div>
                    </div>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
                      <span style="background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);">
                        Réf. paiement : ${payment.transaction_ref}
                      </span>
                      <span style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);">
                        ${orders.length > 1 ? `Commandes liées : ${orders.map((o: any) => `#${o.id}`).join(', ')}` : `Commande : #${mainOrder.id}`}
                      </span>
                      <span style="background: ${status.color.includes('green') ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : status.color.includes('blue') ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : status.color.includes('yellow') ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'linear-gradient(135deg, #fecaca, #fca5a5)'}; color: ${status.color.includes('green') ? '#166534' : status.color.includes('blue') ? '#1e40af' : status.color.includes('yellow') ? '#92400e' : '#991b1b'}; padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        ${status.label}
                      </span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 20px; background: rgba(34, 197, 94, 0.05); border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.1);">
                      <div>
                        <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">Montant payé</div>
                        <div style="font-size: 32px; font-weight: bold; color: #15803d; text-shadow: 0 2px 4px rgba(21, 128, 61, 0.1);">${payment.price} XAF</div>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px; font-weight: 500;">Date de commande</div>
                        <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${mainOrder.created_at.split('T')[0]}</div>
                      </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: rgba(107, 114, 128, 0.05); border-radius: 12px;">
                      <div style="width: 24px; height: 24px; color: #6b7280; margin-top: 2px; font-size: 18px;">📍</div>
                      <div>
                        <span style="color: #374151; font-weight: 600; font-size: 16px;">Emplacement de livraison :</span>
                        <div style="color: #6b7280; font-size: 14px; margin-top: 4px; word-break: break-word; line-height: 1.5;">
                          ${mainOrder.quarter_delivery !== null ? mainOrder.quarter_delivery : mainOrder.emplacement || mainOrder.addresse}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- QR Code Card -->
                  <div style="padding: 32px; display: flex; flex-direction: column; align-items: center; border-radius: 20px; background: linear-gradient(135deg, #ffffff 0%, #f8fffe 100%); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 2px solid #e5e7eb;">
                    <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; color: #1f2937;">
                      <span style="width: 28px; height: 28px; font-size: 20px;">📱</span> QR Code du ticket
                    </h2>
                    <div id="qr-container" style="width: 200px; height: 200px; background: white; border: 3px solid #e5e7eb; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
                      <!-- Le QR code sera généré ici -->
                    </div>
                    <div style="font-size: 14px; color: #6b7280; margin-top: 16px; text-align: center; font-weight: 500; line-height: 1.5;">
                      Scannez pour vérifier ou partager ce ticket
                    </div>
                  </div>
                </div>
              `;
              
              document.body.appendChild(tempDiv);

              // Générer le QR code dans le conteneur avec une résolution plus élevée
              const qrContainer = tempDiv.querySelector('#qr-container');
              if (qrContainer) {
                // Utiliser QRCodeCanvas pour générer le QR code
                const QRCodeCanvas = (await import('qrcode.react')).QRCodeCanvas;
                const qrElement = document.createElement('div');
                qrElement.style.width = '180px';
                qrElement.style.height = '180px';
                qrElement.style.display = 'flex';
                qrElement.style.alignItems = 'center';
                qrElement.style.justifyContent = 'center';
                qrContainer.innerHTML = '';
                qrContainer.appendChild(qrElement);

                // Rendre le QR code avec React
                const { createRoot } = await import('react-dom/client');
                const root = createRoot(qrElement);
                root.render(
                  React.createElement(QRCodeCanvas, {
                    value: JSON.stringify({
                      ref: payment.transaction_ref,
                      user: payment.user,
                      amount: payment.price,
                      date: mainOrder.created_at,
                      products: allOrderItems.map((item: any) => item.name)
                    }),
                    size: 180, // Taille plus grande pour une meilleure résolution
                    level: "H",
                    includeMargin: true,
                    imageSettings: {
                      src: '',
                      height: 0,
                      width: 0,
                      excavate: true,
                    }
                  })
                );
              }

              // Attendre que le QR code soit rendu
              await new Promise(resolve => setTimeout(resolve, 800));

              // Capturer le contenu avec une résolution plus élevée
              const canvas = await html2canvas(tempDiv, {
                scale: 3, // Augmenter l'échelle pour une meilleure résolution
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 800,
                height: tempDiv.scrollHeight,
                logging: false,
                imageTimeout: 0,
                removeContainer: false
              });

              // Nettoyer l'élément temporaire
              document.body.removeChild(tempDiv);

              const imgData = canvas.toDataURL('image/png', 1.0); // Qualité maximale
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
                compress: true
              });

              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const margin = 40; // Marges plus grandes
              const imgWidth = pageWidth - (2 * margin);
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              // Ajuster la hauteur si nécessaire
              if (imgHeight <= pageHeight - (2 * margin)) {
                pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
              } else {
                // Redimensionner pour tenir sur une page
                const adjustedHeight = pageHeight - (2 * margin);
                const adjustedWidth = (canvas.width * adjustedHeight) / canvas.height;
                pdf.addImage(imgData, 'PNG', margin, margin, adjustedWidth, adjustedHeight, undefined, 'FAST');
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