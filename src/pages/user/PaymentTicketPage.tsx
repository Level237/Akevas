import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Package, MapPin, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useShowPaymentWithReferenceQuery } from '@/services/auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Remplacer ceci par un vrai hook RTK Query ou fetch selon votre API


const statusMap: Record<string, { label: string; color: string }> = {
  '0': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  '1': { label: 'En cours de livraison', color: 'bg-blue-100 text-blue-800' },
  '2': { label: 'Livré', color: 'bg-green-100 text-green-800' },
  '3': { label: 'Annulé', color: 'bg-red-100 text-red-800' },
};

export default function PaymentTicketPage() {
  const { ref } = useParams();
  const {data:payment,isLoading}=useShowPaymentWithReferenceQuery(ref)
  const ticketRef = useRef<HTMLDivElement>(null);
  if (isLoading || !payment) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  const order = payment.order;
  const status = statusMap[order.status] || statusMap['0'];
  const details = order.order_details;
  
  
  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-10" ref={ticketRef}>
        <Card className="p-6 mb-6 shadow-xl border-2 border-green-100">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <div>
              <h1 className="text-2xl font-bold">Paiement réussi</h1>
              <p className="text-gray-600 text-sm">Merci pour votre achat, {payment.user} !</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center mb-2">
            <Badge className="bg-green-100 text-green-800">Réf. paiement : {payment.transaction_ref}</Badge>
            <Badge className={status.color}>{status.label}</Badge>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2">
            <div>
              <div className="text-lg font-semibold">Montant payé</div>
              <div className="text-2xl font-bold text-green-700">{payment.price} XAF</div>
            </div>
            <div className="md:ml-auto">
              <div className="text-sm text-gray-500">Date de commande</div>
              <div className="font-medium">{order.created_at.split('T')[0]}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Emplacement de livraison :</span>
            <span className="text-gray-600">{order.quarter_delivery !== null ? order.quarter_delivery : order.emplacement}
            {order.emplacement == null && order.addresse}</span>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Détails de la commande</h2>
          <div className="space-y-4">
            {details.map((item: any) => {
              // Mapping inspiré de OrderDetailPage.tsx
              let name = 'Produit inconnu';
              let color = '';
              let size = '';
              let quantity = 1;
              let price = 0;
              let image = '';
              let total = 0;

              // Cas 1: variation_attribute (couleur + taille/pointure)
              if (item.variation_attribute && item.variation_attribute.product_variation) {
                const variation = item.variation_attribute.product_variation;
                name = variation.product_name || 'Produit inconnu';
                color = variation.color?.name || '';
                size = item.variation_attribute.value || '';
                quantity = item.variation_quantity;
                price = item.variation_price;
                image = variation.images?.[0]?.path || '';
                total = parseInt(item.variation_quantity) * parseFloat(item.variation_price);
              }
              // Cas 2: product_variation (couleur seule)
              else if (item.product_variation) {
                name = item.product_variation.product_name || 'Produit inconnu';
                color = item.product_variation.color?.name || '';
                size = '';
                quantity = item.variation_quantity;
                price = item.variation_price;
                image = item.product_variation.images?.[0]?.path || '';
                total = parseInt(item.variation_quantity) * parseFloat(item.variation_price);
              }
              // Cas 3: produit simple
              else {
                name = item.product?.name || 'Produit inconnu';
                color = '';
                size = '';
                quantity = item.quantity || 1;
                price = item.price || 0;
                image = item.product?.product_profile || '';
                total = (item.quantity || 1) * (item.price || 0);
              }

              return (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                  <img
                    src={image}
                    alt={name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{name}</div>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-gray-600">Quantité: {quantity}</span>
                      {color && (
                        <Badge variant="outline" className="text-xs">{color}</Badge>
                      )}
                      {size && (
                        <Badge variant="outline" className="text-xs">{size}</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Prix unitaire: {price} XAF</div>
                  </div>
                  <div className="text-right font-semibold">{total} XAF</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sous-total ({order.itemsCount} article(s))</span>
              <span className="font-medium">{order.total_amount} XAF</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Frais de livraison</span>
              <span className="font-medium">{order.fee_of_shipping || 0} XAF</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold">{order.total_amount} XAF</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><QrCode className="w-5 h-5" /> QR Code du ticket</h2>
          <QRCodeCanvas
            value={JSON.stringify({
              ref: payment.transaction_ref,
              user: payment.user,
              amount: payment.price,
              date: order.created_at,
              products: details.map((item: any) => item.product_variation?.product_name)
            })}
            size={160}
            level="H"
            includeMargin={true}
          />
          <div className="text-xs text-gray-500 mt-2">Scannez pour vérifier ou partager ce ticket</div>
        </Card>
      </div>
      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
          onClick={async () => {
            if (!ticketRef.current) return;
            const canvas = await html2canvas(ticketRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 40;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save(`ticket-${payment.transaction_ref}.pdf`);
          }}
        >
          Télécharger le ticket
        </Button>
      </div>
    </>
  );
} 