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

const getOrderItems = (order: any) => {
    const allOrderItems: any[] = [];
    // Vérifier si order existe
    if (!order) {
        return allOrderItems;
    }

    // Ajouter les produits avec variation (orderVariations)
    if (order.orderVariations && Array.isArray(order.orderVariations) && order.orderVariations.length > 0) {
        order.orderVariations.forEach((item: any) => {
            // Cas 1: variation_attribute existe avec product_variation
            if (item && item.variation_attribute && item.variation_attribute.product_variation) {
                const variation = item.variation_attribute.product_variation;
                const attributeValue = item.variation_attribute.value;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    hex : variation.color?.hex   || "",
                    size: attributeValue || '',
                    quantity: parseInt(item.variation_quantity) || 0,
                    price: parseFloat(item.variation_price) || 0,
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(item.variation_quantity) || 0) * (parseFloat(item.variation_price) || 0),
                    type: 'variation'
                });
            }
            // Cas 2: variation_attribute est null mais product_variation existe directement
            else if (item && item.product_variation) {
                const variation = item.product_variation;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    hex : variation.color?.hex   || "",
                    size: '',
                    quantity: parseInt(item.variation_quantity) || 0,
                    price: parseFloat(item.variation_price) || 0,
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(item.variation_quantity) || 0) * (parseFloat(item.variation_price) || 0),
                    type: 'variation'
                });
            }
        });
    }

    // Ajouter les produits sans variation (order_details)
    if (order.order_details && order.order_details.length > 0) {
        order.order_details.forEach((item: any) => {
            if (item && item.product) {
                allOrderItems.push({
                    id: item.id,
                    name: item.product?.product_name || 'Produit inconnu',
                    color: '',
                    size: '',
                    quantity: parseInt(item.quantity) || 0,
                    price: parseFloat(item.price) || 0,
                    image: item.product?.product_profile || '',
                    total: (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0),
                    type: 'simple'
                });
            }
        });
    }

    return allOrderItems;
};

export default function PaymentTicketPage() {
  const { ref } = useParams();
  const { data: payment, isLoading } = useShowPaymentWithReferenceQuery(ref);
  const [isDownloading, setIsDownloading] = useState(false);

  console.log(payment)
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
      const items = getOrderItems(order);
      allProducts.push(...items);
  });

  const TAX_RATE = 0.03; // 5% de TVA (Note: 0.03 is 3%, but comment says 5%. Keeping consistent with OrderDetailPage)
  const itemsTotal = allProducts.reduce((total: number, item: any) => total + item.total, 0);
  const shippingFee = Number(mainOrder?.fee_of_shipping || 0);
  const taxAmount = (itemsTotal + shippingFee) * TAX_RATE;
  const totalWithTax = itemsTotal + shippingFee + taxAmount;

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
    <div className="min-h-screen bg-gray-100 py-4 px-2 md:py-8 md:px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden mb-8 print:shadow-none">
        {/* Document Border Container */}
        <div className="border-4 border-gray-800 m-1 md:m-2 p-1">
          <div className="border-2 border-gray-800">
          
            <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-gray-800">
              {/* Logo Area */}
              <div className="p-4 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-gray-800">
                <img src={logo} alt="Akevas Logo" className="h-16 md:h-20 object-contain mb-2" />
              </div>

              {/* Center Title Area */}
              <div className="flex flex-col justify-center text-center p-2 border-b-2 md:border-b-0 md:border-r-2 border-gray-800">
                 <Barcode />
                 <div className="border-t-2 border-gray-800 mt-2 pt-2">
                    <h1 className="font-bold text-base md:text-lg uppercase leading-tight">Reçu de Paiement /<br/>Payment Receipt</h1>
                    <h2 className="font-bold text-sm md:text-md uppercase mt-1 text-gray-700">Akevas Online Store</h2>
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
                  size={100}
                  level="H"
                />
              </div> 
            </div>

            {/* Blue Bar Title */}
            <div className="bg-blue-300 border-b-2 border-gray-800 py-1 px-4 text-center">
              <h3 className="font-bold text-xs 
              
              
              md:text-sm uppercase tracking-wide">Informations sur le Paiement / Payment Information</h3>
            </div>

            {/* Information Grid */}
            <div className="text-sm">
              {/* Row 1: Name */}
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="w-full md:w-1/4 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Prénoms & Nom /<br/>Full Name
                </div>
                <div className="w-full md:w-3/4 p-2 font-semibold uppercase flex items-center">
                  {payment.user}
                </div>
              </div>

              {/* Row 2: Reference & Date */}
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="flex flex-col md:flex-row w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="w-full md:w-1/2 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Référence /<br/>Reference
                  </div>
                  <div className="w-full md:w-1/2 p-2 flex items-center font-mono">
                    {payment.transaction_ref}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-1/2">
                  <div className="w-full md:w-1/2 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Date /<br/>Date
                  </div>
                  <div className="w-full md:w-1/2 p-2 flex items-center">
                    {date}
                  </div>
                </div>
              </div>

              {/* Row 3: Amount & Status */}
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="flex flex-col md:flex-row w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-800">
                  <div className="w-full md:w-1/2 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Montant /<br/>Amount
                  </div>
                  <div className="w-full md:w-1/2 p-2 flex items-center font-bold text-lg">
                    {parseInt(payment.price).toLocaleString('fr-FR')} XAF
                  </div>
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-1/2">
                  <div className="w-full md:w-1/2 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                    Statut /<br/>Status
                  </div>
                  <div className={`w-full md:w-1/2 p-2 flex items-center font-bold uppercase ${status.color}`}>
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Row 4: Purpose */}
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="w-full md:w-1/4 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Objet /<br/>Purpose
                </div>
                <div className="w-full md:w-3/4 p-2 uppercase flex items-center">
                  {payment.payment_of}
                </div>
              </div>

               {/* Row 5: Orders */}
               <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="w-full md:w-1/4 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Commandes /<br/>Orders
                </div>
                <div className="w-full md:w-3/4 p-2 flex items-center text-xs flex-wrap">
                   {payment.order.map((o: any) => (
                     <span key={o.id} className="mr-2 mb-1 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                       #{o.id} ({o.itemsCount} articles)
                     </span>
                   ))}
                </div>
              </div>
                 {/* Row 6: Delivery Address */}
               <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="w-full md:w-1/2 bg-blue-50 p-2 font-bold border-b md:border-b-0 md:border-r border-gray-800 flex items-center text-xs md:text-sm uppercase">
                  Adresse de Livraison /<br/>Delivery Address
                </div>
                <div className="w-full md:w-1/2 p-2 flex flex-col justify-center text-xs uppercase">
                   <div className="font-bold">{mainOrder.userName}</div>
                   <div>{mainOrder.emplacement}</div>
                   <div>{mainOrder.userPhone}</div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-blue-300 border-b-2 border-gray-800 py-1 px-4 text-center">
              <h3 className="font-bold text-xs md:text-sm uppercase tracking-wide">Détails des Produits / Product Details</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] md:text-sm text-left">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-800">
                    <th className="p-1 md:p-2 border-r border-gray-800 uppercase w-10 md:w-16 text-center">Img</th>
                    <th className="p-1 md:p-2 border-r border-gray-800 uppercase w-1/2">Désignation / Description</th>
                    <th className="p-1 md:p-2 border-r border-gray-800 uppercase text-center">Qté</th>
                    <th className="p-1 md:p-2 border-r border-gray-800 uppercase text-right">P.U</th>
                    <th className="p-1 md:p-2 uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((prod, idx) => (
                    <tr key={idx} className="border-b border-gray-800 last:border-b-0">
                      <td className="p-1 md:p-2 border-r border-gray-800 text-center">
                        <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-8 h-8 md:w-10 md:h-10 object-cover mx-auto border border-gray-300"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Img'; }}
                        />
                      </td>
                      <td className="p-1 md:p-2 border-r border-gray-800">
                        
                        <div className="font-bold truncate max-w-[120px] md:max-w-none">{prod.name}</div>
                        {(prod.color || prod.size) && (
                            <div className="text-gray-500 text-[9px] md:text-[10px]">
                                {prod.color && <span className={`flex items-center`}>Couleur: <div className={`w-2 h-2 md:w-3 md:h-3 mr-1 ml-1 border rounded-full bg-[${prod.hex}]`}></div> {prod.hex}</span>}
                                {prod.size && <span className={`text-[9px] md:text-[10px] ${prod.size}`}>Taille: {prod.size}</span>}
                            </div>
                        )}
                      </td>
                      <td className="p-1 md:p-2 border-r border-gray-800 text-center">{prod.quantity}</td>
                      <td className="p-1 md:p-2 border-r border-gray-800 text-right whitespace-nowrap">{parseInt(prod.price).toLocaleString('fr-FR')}</td>
                      <td className="p-1 md:p-2 text-right font-bold whitespace-nowrap">{parseInt(prod.total).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-2 md:p-4 bg-gray-50 border-b-2 border-gray-800">
                        <div className="w-full md:w-1/2 text-xs">
                            <div className="flex justify-between mb-1">
                                <span className="uppercase">Sous-total / Subtotal:</span>
                                <span className="font-bold">{itemsTotal.toLocaleString('fr-FR')} XAF</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="uppercase">Frais de livraison / Shipping:</span>
                                <span className="font-bold">{shippingFee.toLocaleString('fr-FR')} XAF</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="uppercase">TVA / Tax (3%):</span>
                                <span className="font-bold">{taxAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAF</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-800 pt-1 mt-1 text-sm">
                                <span className="font-bold uppercase">Total (TTC):</span>
                                <span className="font-bold">{totalWithTax.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAF</span>
                            </div>
                        </div>
                      </div>

             {/* Footer Note */}
             <div className="bg-gray-50 border-t-2 border-gray-800 p-2 text-center text-[8px] md:text-[10px] uppercase text-gray-500">
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
              const productRows = allProducts.map(prod => {
                const details = [];
                if (prod.color) details.push(`Couleur: ${prod.color}`);
                if (prod.size) details.push(`Taille: ${prod.size}`);
                const detailsStr = details.join(' | ');

                return `
                <tr style="border-bottom: 1px solid #1f2937;">
                  <td style="padding: 8px; border-right: 1px solid #1f2937; text-align: center;">
                    ${prod.image ? `<img src="${prod.image}" style="width: 30px; height: 30px; object-fit: cover; border: 1px solid #ccc;" />` : '-'}
                  </td>
                  <td style="padding: 8px; border-right: 1px solid #1f2937;">
                    <div style="font-weight: bold; text-transform: uppercase;">${prod.name}</div>
                    ${detailsStr ? `<div style="color: #6b7280; font-size: 10px;">${detailsStr}</div>` : ''}
                  </td>
                  <td style="padding: 8px; border-right: 1px solid #1f2937; text-align: center;">${prod.quantity}</td>
                  <td style="padding: 8px; border-right: 1px solid #1f2937; text-align: right;">${parseInt(prod.price).toLocaleString('fr-FR')}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold;">${parseInt(prod.total).toLocaleString('fr-FR')}</td>
                </tr>
              `}).join('');

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
                         <!-- Row 6: Address -->
                        <div style="display: flex; border-bottom: 1px solid #1f2937;">
                          <div style="width: 30%; background-color: #eff6ff; padding: 8px; font-weight: bold; border-right: 1px solid #1f2937; text-transform: uppercase;">Adresse /<br/>Address</div>
                          <div style="width: 70%; padding: 8px; text-transform: uppercase;">
                             <div>${mainOrder.userName}</div>
                             <div>${mainOrder.emplacement}</div>
                             <div>${mainOrder.userPhone}</div>
                          </div>
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
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: center; width: 10%;">Img</th>
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: left; width: 40%;">Désignation / Description</th>
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: center;">Qté / Qty</th>
                            <th style="padding: 8px; border-right: 1px solid #1f2937; text-align: right;">P.U / Unit Price</th>
                            <th style="padding: 8px; text-align: right;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${productRows}

                        </tbody>
                      </table>

                      <!-- Totals -->
                      <div style="display: flex; justify-content: flex-end; padding: 16px; background-color: #f9fafb; border-bottom: 2px solid #1f2937;">
                        <div style="width: 50%; font-size: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="text-transform: uppercase;">Sous-total / Subtotal:</span>
                                <span style="font-weight: bold;">${itemsTotal.toLocaleString('fr-FR')} XAF</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="text-transform: uppercase;">Frais de livraison / Shipping Fee:</span>
                                <span style="font-weight: bold;">${shippingFee.toLocaleString('fr-FR')} XAF</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="text-transform: uppercase;">TVA / Tax (5%):</span>
                                <span style="font-weight: bold;">${taxAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAF</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; border-top: 1px solid #1f2937; padding-top: 4px; margin-top: 4px; font-size: 14px;">
                                <span style="font-weight: bold; text-transform: uppercase;">Total (TTC):</span>
                                <span style="font-weight: bold;">${totalWithTax.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XAF</span>
                            </div>
                        </div>
                      </div>

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