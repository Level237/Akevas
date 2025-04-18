import { useEffect, useState } from "react";
import { useGetUserQuery, useStatePaymentMutation } from "@/services/auth";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import styled from "styled-components";
import logo from "@/assets/logo.png";
import { Check, Download, ShoppingBag } from "lucide-react";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

   @media (max-width: 768px) {
    padding:0
  }
`;
const SuccessCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Receipt = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 2rem;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #ed7e0f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin: 2rem auto;
  transition: background 0.2s ease;
  min-width: 200px;
  justify-content: center;

  &:hover {
    background: #d97100;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const HomeButton = styled(DownloadButton)`
  background: #4a5568;
  
  &:hover {
    background: #2d3748;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;
interface OrderDetails {
    orderId: string;
    orderDate: string;
    amount: number;
    shipping: string;
    address: string;
    products: Array<{
        name: string;
        quantity: number;
        price: number;
    }> | null;
    productId: string | null;
    quarter_delivery: string | null;
    quantity: number | null;
    name: string | null;
    price: number | null;
}
export default function SucessPaymentPage(){
    const params = new URLSearchParams(window.location.search)
  const source = params.get('source');
  const quarter = params.get('quarter');
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const name = params.get('name');
  const total = params.get('total');
  const price = params.get('price');
  const status=params.get('status');
  const shipping = params.get('shipping') || "";
  const address = params.get('address') || "";
  const [statePayment] = useStatePaymentMutation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const { data: user } = useGetUserQuery('Auth');
    const processed = params.get('processed');
  useEffect(() => {
    const handlePayment = async () => {
      if (status === 'complete') {
        try {
            let formData;
            if(source=="0"){
                formData = {
                    productId: productId,
                    quantity: quantity,
                    amount: total,
                    price: price,
                    quarter_delivery: quarter,
                    shipping: shipping,
                    address: address
                  };
            }else{
                formData = {
                    productsPayments: JSON.parse(sessionStorage.getItem('productsPayments') || '[]'),
                    amount: sessionStorage.getItem('total'),
                    quarter_delivery: quarter,
                    shipping: sessionStorage.getItem('shipping'),
                    address: address
                  }
            }
          
          if(!processed){  // Vérifie si la commande n'a pas déjà été traitée
            const response = await statePayment(formData);
            if (response.data.success) {
              // Ajouter le paramètre processed à l'URL
              params.set('processed', 'true');
              window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
              if(source=="0"){
              setOrderDetails({
                orderId: response.data.order.id,
                orderDate: new Date().toISOString(),
                price: total ? parseFloat(total) : 0,
                amount: price ? parseFloat(price) : 0,
                shipping: shipping.toString(),
                quarter_delivery: quarter,
                productId: productId,
                quantity: quantity ? parseInt(quantity) : null,
                name: name,
                address: address,
                products: null
              });
            }else{
                setOrderDetails({
                    orderId: response.data.order.id,
                    orderDate: new Date().toISOString(),
                    price: response.data.order.total ? response.data.order.total : null,
                    products:JSON.parse(sessionStorage.getItem('productsPayments') || '[]'),
                    shipping: response.data.order.fee_of_shipping ? response.data.order.fee_of_shipping : null,
                    quarter_delivery: quarter,
                    productId: productId,
                    amount: response.data.order.total ? response.data.order.total : null,
                    quantity: quantity ? parseInt(quantity) : null,
                    name: null,
                    address: address
                })
            }
        
        }
          }

        } catch (error) {
          console.error('Erreur lors du traitement de la commande:', error);
        }
      }
    };
   
    handlePayment();
    
  }, []);


  const downloadReceipt = async () => {
    setIsDownloading(true);
    const receipt = document.getElementById('receipt');
    if (receipt) {
        try {
            const canvas = await html2canvas(receipt, {
                scale: 2, // Augmente la qualité du rendu
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgWidth = 210;


            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            // Ajout d'une marge et centrage
            const margin = 10;
            const x = margin;
            const y = margin;
            const contentWidth = imgWidth - (2 * margin);
            const contentHeight = (contentWidth * canvas.height) / canvas.width;

            pdf.addImage(imgData, 'JPEG', x, y, contentWidth, contentHeight, undefined, 'FAST');
            pdf.save(`recu-commande-${orderDetails?.orderId}.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    }
};
if (!orderDetails) return <div>Chargement...</div>;
    return(
        <Container className=''>
        <SuccessCard>
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check size={32} className="text-green-500" />
                </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">Paiement réussi !</h1>
            <p className="text-gray-600">
                Merci pour votre commande. Un email de confirmation vous a été envoyé.
            </p>
            
        </SuccessCard>

        <Receipt id="receipt">
            <div className="flex  justify-between items-center  mb-8">
                <img src={logo} alt="Logo" className="h-12" />
                <div className="text-right">
                    <div className="font-bold">Reçu de paiement</div>
                    <div className="text-gray-600">#{orderDetails.orderId}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-bold mb-2">Informations client</h3>
                    <div className="text-gray-600">
                        <p className='max-sm:text-sm'>{user?.userName || user?.firstName} {user?.lastName}</p>
                        <p className='max-sm:text-sm'>{user?.email}</p>
                        <p className='max-sm:text-sm'>{user?.phone_number}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="font-bold mb-2">Détails de la commande</h3>
                    <div className="text-gray-600">
                        <p className='max-sm:text-sm'>Date: {new Date(orderDetails.orderDate).toLocaleDateString()}</p>
                        <p className='max-sm:text-sm'>Statut: Payé</p>
                        <p className='max-sm:text-sm'>Quartier de livraison: {orderDetails.quarter_delivery === "" ? "Dans les locaux akevas" : orderDetails.quarter_delivery}</p>
                        {orderDetails.address && <p className='max-sm:text-sm'>Adresse de livraison: {orderDetails.address}</p>}
                    </div>
                </div>
            </div>

            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Produit</th>
                        <th className="text-center py-2">Quantité</th>
                        <th className="text-right py-2">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.products && orderDetails.products.map((product, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-2">{product.name}</td>
                            <td className="text-center py-2">{product.quantity}</td>
                            <td className="text-right py-2">{product.price} XAF</td>
                        </tr>
                    ))}
                    {orderDetails.productId && orderDetails.quantity && orderDetails.name && (
                        <tr className="border-b">
                            <td className="py-2">{orderDetails.name}</td>
                            <td className="text-center py-2">{orderDetails.quantity}</td>
                            <td className="text-right py-2">{orderDetails.amount} XAF</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                    <span>Sous-total</span>
                    <span>{Number(orderDetails.amount) - Number(orderDetails.shipping)} XAF</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Frais de livraison</span>
                    <span>{orderDetails.shipping} XAF</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{orderDetails.price} XAF</span>
                </div>
            </div>
            <div className="flex justify-center">
                <QRCodeCanvas value={JSON.stringify(orderDetails)} />
            </div>
        </Receipt>

        <ButtonsContainer>
            <DownloadButton
                onClick={downloadReceipt}
                disabled={isDownloading}
            >
                {isDownloading ? (
                    <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Téléchargement...
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        Télécharger le reçu
                    </>
                )}
            </DownloadButton>

            <HomeButton as="a" href="/products">
                <ShoppingBag size={20} />
                Retour aux achats
            </HomeButton>
        </ButtonsContainer>
    </Container>
    )
}