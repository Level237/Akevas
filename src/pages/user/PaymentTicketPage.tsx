import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useShowPaymentWithReferenceQuery } from '@/services/auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '@/assets/logo.png';

const statusMap: Record<string, { label: string; color: string }> = {
  '0': { label: 'En attente', color: 'text-yellow-600' },
  '1': { label: 'En cours de livraison', color: 'text-blue-600' },
  '2': { label: 'Livré', color: 'text-green-600' },
  '3': { label: 'Annulé', color: 'text-red-600' },
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Ticket introuvable</h2>
          <Button onClick={() => window.location.href = '/'}>Retour à l'accueil</Button>
        </Card>
      </div>
    );
  }

  const mainOrder = payment.order[0];
  const status = statusMap[mainOrder.status] || statusMap['0'];
  const date = new Date(mainOrder.created_at).toLocaleDateString('fr-FR');

  // Aggregate all products
  const allProducts: any[] = [];
  payment.order.forEach((order: any) => {
    if (order.orderVariations) {
      order.orderVariations.forEach((item: any) => {
        const variation = item.variation_attribute?.product_variation;
        if (variation) {
          allProducts.push({
            name: variation.product_name,
            details: `${variation.color?.name || ''} ${item.variation_attribute.value || ''}`.trim(),
            quantity: item.variation_quantity,
            price: item.variation_price,
            total: item.variation_quantity * item.variation_price
          });
        }
      });
    }
    if (order.order_details) {
      order.order_details.forEach((item: any) => {
        if (item.product) {
          allProducts.push({
            name: item.product.product_name,
            details: '-',
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price
          });
        }
      });
    }
  });

  // Barcode simulation (CSS)
  const Barcode = () => (
    <div className="flex flex-col items-center justify-center w-full h-16 bg-white">
      <div className="flex items-end h-12 gap-[2px] w-48 justify-center overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="bg-black"
            style={{
              width: Math.random() > 0.5 ? '2px' : '4px',
              height: '100%'
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono tracking-widest mt-1">{payment.transaction_ref}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden mb-8 print:shadow-none">
        {/* Document Border Container */}
        <div className="border-4 border-gray-800 m-2 p-1">
          <div className="border-2 border-gray-800">
            
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-gray-800">
              {/* Logo Area */}
              <div className="p-4 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-gray-800">
                <img src={logo} alt="Akevas Logo" className="h-20 object-contain mb-2" />
                <div className="text-xs font-bold text-center uppercase tracking-wider">République du Cameroun</div>
                <div className="text-[10px] text-center text-gray-600 uppercase">Paix - Travail - Patrie</div>
              </div>

              {/* Center Title Area */}
              <div className="flex flex-col justify-center text-center p-2 border-b-2 md:border-b-0 md:border-r-2 border-gray-800">
                 <Barcode />
                 <div className="border-t-2 border-gray-800 mt-2 pt-2">
                    <h1 className="font-bold text-lg uppercase leading-tight">Reçu de Paiement /<br/>Payment Receipt</h1>
                    <h2 className="font-bold text-md uppercase mt-1 text-gray-700">Akevas Online Store</h2>
                 </div>
              </div>

              {/* QR Code Area */}
              <div className="p-4 flex items-center justify-center bg-white">
                <QRCodeCanvas
                  value={JSON.stringify({
                    ref: payment.transaction_ref,
                    user: payment.user,
                    amount: payment.price,
                    date: mainOrder.created_at
                  })}
                  size={120}
                  level="H"
                />
              </div>
            </div>

            {/* Blue Bar Title */}
            <div className="bg-blue-300 border-b-2 border-gray-800 py-1 px-4 text-center">
              <h3 className="font-bold text-sm uppercase tracking-wide">Informations sur le Paiement / Payment Information</h3>
            </div>

            {/* Information Grid */}
            <div className="text-sm">
              {/* Row 1: Name */}
              <div className="flex border-b border-gray-800">
                <div className="w-1/3 md:w-1/4 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Prénoms & Nom /<br/>Full Name
                </div>
                <div className="w-2/3 md:w-3/4 p-2 font-semibold uppercase flex items-center">
                  {payment.user}
                </div>
              </div>

              {/* Row 2: Reference & Date */}
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="flex w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="w-1/2 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Référence /<br/>Reference
                  </div>
                  <div className="w-1/2 p-2 flex items-center font-mono">
                    {payment.transaction_ref}
                  </div>
                </div>
                <div className="flex w-full md:w-1/2">
                  <div className="w-1/2 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Date /<br/>Date
                  </div>
                  <div className="w-1/2 p-2 flex items-center">
                    {date}
                  </div>
                </div>
              </div>

              {/* Row 3: Amount & Status */}
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="flex w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="w-1/2 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Montant /<br/>Amount
                  </div>
                  <div className="w-1/2 p-2 flex items-center font-bold text-lg">
                    {parseInt(payment.price).toLocaleString('fr-FR')} XAF
                  </div>
                </div>
                <div className="flex w-full md:w-1/2">
                  <div className="w-1/2 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Statut /<br/>Status
                  </div>
                  <div className={`w-1/2 p-2 flex items-center font-bold uppercase ${status.color}`}>
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Row 4: Purpose */}
              <div className="flex border-b border-gray-800">
                <div className="w-1/3 md:w-1/4 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Objet /<br/>Purpose
                </div>
                <div className="w-2/3 md:w-3/4 p-2 uppercase flex items-center">
                  {payment.payment_of}
                </div>
              </div>

               {/* Row 5: Orders */}
               <div className="flex border-b border-gray-800">
                <div className="w-1/3 md:w-1/4 bg-blue-50 p-2 font-bold border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Commandes /<br/>Orders
                </div>
                <div className="w-2/3 md:w-3/4 p-2 flex items-center text-xs">
                   {payment.order.map((o: any) => (
                     <span key={o.id} className="mr-2 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                       #{o.id} ({o.itemsCount} articles)
                     </span>
                   ))}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-blue-300 border-b-2 border-gray-800 py-1 px-4 text-center">
              <h3 className="font-bold text-sm uppercase tracking-wide">Détails des Produits / Product Details</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-800">
                    <th className="p-2 border-r border-gray-800 uppercase w-1/2">Désignation / Description</th>
                    <th className="p-2 border-r border-gray-800 uppercase text-center">Qté / Qty</th>
                    <th className="p-2 border-r border-gray-800 uppercase text-right">P.U / Unit Price</th>
                    <th className="p-2 uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((prod, idx) => (
                    <tr key={idx} className="border-b border-gray-800 last:border-b-0">
                      <td className="p-2 border-r border-gray-800">
                        <div className="font-bold">{prod.name}</div>
                        {prod.details !== '-' && <div className="text-gray-500 text-[10px]">{prod.details}</div>}
                      </td>
                      <td className="p-2 border-r border-gray-800 text-center">{prod.quantity}</td>
                      <td className="p-2 border-r border-gray-800 text-right">{parseInt(prod.price).toLocaleString('fr-FR')}</td>
                      <td className="p-2 text-right font-bold">{parseInt(prod.total).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


             {/* Footer Note */}
             <div className="bg-gray-50 border-t-2 border-gray-800 p-2 text-center text-[10px] uppercase text-gray-500">
                Ce document est un reçu électronique généré par Akevas. / This document is an electronic receipt generated by Akevas.
             </div>

          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 print:hidden">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={async () => {
            setIsDownloading(true);
            try {
              const tempDiv = document.createElement('div');
              tempDiv.style.position = 'absolute';
              tempDiv.style.left = '-9999px';
              tempDiv.style.width = '800px';
              tempDiv.style.backgroundColor = '#ffffff';
              
              // Helper to generate product rows for PDF
              const productRows = allProducts.map(prod => `
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px; border-right: 1px solid #1f2937;">
                    <div style="font-weight: bold; text-transform: uppercase;">${prod.name}</div>
                    ${prod.details !== '-' ? `<div style="color: #6b7280; font-size: 10px;">${prod.details}</div>` : ''}
                  </td>
                  <td style="padding: 8px; border-right: 1px solid #1f2937; text-align: center;">${prod.quantity}</td>
                  <td style="padding: 8px; border-right: 1px solid #1f2937; text-align: right;">${parseInt(prod.price).toLocaleString('fr-FR')}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold;">${parseInt(prod.total).toLocaleString('fr-FR')}</td>
                </tr>
              `).join('');

              tempDiv.innerHTML = `
                <div style="padding: 20px; font-family: sans-serif; color: #000;">
                  <div style="border: 4px solid #1f2937; padding: 4px;">
                    <div style="border: 2px solid #1f2937;">
                      
                      <!-- Header -->
                      <div style="display: flex; border-bottom: 2px solid #1f2937;">
                        <div style="width: 30%; padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 2px solid #1f2937;">
                          <img src="${logo}" style="height: 80px; object-fit: contain; margin-bottom: 8px;" />
                          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase;">République du Cameroun</div>
                        </div>
                        <div style="width: 40%; display: flex; flex-direction: column; text-align: center; border-right: 2px solid #1f2937;">
                           <div style="padding: 10px; display: flex; justify-content: center; align-items: flex-end; height: 50px; gap: 2px;">
                              ${Array.from({ length: 30 }).map(() => `<div style="width: ${Math.random() > 0.5 ? '2px' : '4px'}; height: 100%; background: black;"></div>`).join('')}
                           </div>
                           <div style="font-family: monospace; font-size: 12px; letter-spacing: 2px; margin-bottom: 8px;">${payment.transaction_ref}</div>
                           <div style="border-top: 2px solid #1f2937; padding: 8px;">
                              <h1 style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2;">Reçu de Paiement /<br/>Payment Receipt</h1>
                           </div>
                        </div>
                        <div style="width: 30%; padding: 16px; display: flex; align-items: center; justify-content: center;" id="pdf-qr-container">
                        </div>
                      </div>

                      <!-- Blue Bar -->
                      <div style="background-color: #93c5fd; border-bottom: 2px solid #1f2937; padding: 4px 16px; text-align: center;">
                        <h3 style="font-weight: bold; font-size: 12px; text-transform: uppercase; margin: 0;">Informations sur le Paiement / Payment Information</h3>
                      </div>

                      <!-- Grid -->
                      <div style="font-size: 12px;">
                        <!-- Row 1 -->
                        <div style="display: flex; border-bottom: 1px solid #1f2937;">
                          <div style="width: 30%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Prénoms & Nom /<br/>Full Name</div>
                          <div style="width: 70%; padding: 8px; font-weight: 600; text-transform: uppercase;">${payment.user}</div>
                        </div>
                        <!-- Row 2 -->
                        <div style="display: flex; border-bottom: 1px solid #1f2937;">
                          <div style="width: 50%; display: flex; border-right: 1px solid #1f2937;">
                             <div style="width: 50%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Référence /<br/>Ref</div>
                             <div style="width: 50%; padding: 8px; font-family: monospace;">${payment.transaction_ref}</div>
                          </div>
                          <div style="width: 50%; display: flex;">
                             <div style="width: 50%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Date /<br/>Date</div>
                             <div style="width: 50%; padding: 8px;">${date}</div>
                          </div>
                        </div>
                        <!-- Row 3 -->
                        <div style="display: flex; border-bottom: 1px solid #1f2937;">
                          <div style="width: 50%; display: flex; border-right: 1px solid #1f2937;">
                             <div style="width: 50%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Montant /<br/>Amount</div>
                             <div style="width: 50%; padding: 8px; font-weight: bold; font-size: 14px;">${parseInt(payment.price).toLocaleString('fr-FR')} XAF</div>
                          </div>
                          <div style="width: 50%; display: flex;">
                             <div style="width: 50%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Statut /<br/>Status</div>
                             <div style="width: 50%; padding: 8px; font-weight: bold; text-transform: uppercase;">${status.label}</div>
                          </div>
                        </div>
                        <!-- Row 4 -->
                        <div style="display: flex; border-bottom: 1px solid #1f2937;">
                          <div style="width: 30%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Objet /<br/>Purpose</div>
                          <div style="width: 70%; padding: 8px; text-transform: uppercase;">${payment.payment_of}</div>
                        </div>
                         <!-- Row 5 -->
                        <div style="display: flex; border-bottom: 1px solid #1f2937;">
                          <div style="width: 30%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Commandes /<br/>Orders</div>
                          <div style="width: 70%; padding: 8px;">${payment.order.map((o: any) => `#${o.id}`).join(', ')}</div>
                        </div>
                      </div>

                      <!-- Product List Header -->
                      <div style="background-color: #93c5fd; border-bottom: 2px solid #1f2937; padding: 4px 16px; text-align: center;">
                        <h3 style="font-weight: bold; font-size: 12px; text-transform: uppercase; margin: 0;">Détails des Produits / Product Details</h3>
                      </div>

                      <!-- Product Table -->
                      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                          <tr style="background-color: #eff6ff; border-bottom: 1px solid #1f2937;">
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: left; width: 50%;">Désignation / Description</th>
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: center;">Qté / Qty</th>
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: right;">P.U / Unit Price</th>
                            <th style="padding: 8px; text-align: right;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${productRows}
                        </tbody>
                      </table>

                      <!-- Footer -->
                      <div style="background-color: #f9fafb; border-top: 2px solid #1f2937; padding: 8px; text-align: center; font-size: 9px; text-transform: uppercase; color: #6b7280;">
                        Ce document est un reçu électronique généré par Akevas. / This document is an electronic receipt generated by Akevas.
                      </div>

                    </div>
                  </div>
                </div>
              `;

              document.body.appendChild(tempDiv);

              // Render QR Code for PDF
              const qrContainer = tempDiv.querySelector('#pdf-qr-container');
              if (qrContainer) {
                const QRCodeCanvas = (await import('qrcode.react')).QRCodeCanvas;
                const qrElement = document.createElement('div');
                const { createRoot } = await import('react-dom/client');
                const root = createRoot(qrElement);
                root.render(
                  React.createElement(QRCodeCanvas, {
                    value: JSON.stringify({ ref: payment.transaction_ref }),
                    size: 100,
                    level: "H"
                  })
                );
                qrContainer.appendChild(qrElement);
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render
              }

              const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
              });

              document.body.removeChild(tempDiv);

              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
              });

              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
              
              pdf.addImage(imgData, 'PNG', 0, 40, pdfWidth, pdfHeight);
              pdf.save(`recu-akevas-${payment.transaction_ref}.pdf`);

            } catch (error) {
              console.error('Download error:', error);
            } finally {
              setIsDownloading(false);
            }
          }}
          disabled={isDownloading}
        >
          {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Télécharger le reçu
        </Button>
      </div>
    </div>
  );
} 