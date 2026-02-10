
import { Card } from '@/components/ui/card';
import { useShowOrderQuery } from '@/services/sellerService';
import IsLoadingComponents from '@/components/ui/isLoadingComponents';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, Phone, MapPin, Store } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AsyncLink from '@/components/ui/AsyncLink';


const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0 XAF';
    return `${numPrice.toLocaleString('fr-FR')} XAF`;
};

const getOrderItems = (order: any) => {
    const allOrderItems: any[] = [];
    // Ajouter les produits avec variation (orderVariations)
    if (order.orderVariations && order.orderVariations.length > 0) {
        order.orderVariations.forEach((item: any) => {
            // Cas 1: variation_attribute existe avec product_variation
            if (item.variation_attribute && item.variation_attribute.product_variation) {
                const variation = item.variation_attribute.product_variation;
                const attributeValue = item.variation_attribute.value;
                const attributeData = variation.attributes_variation?.[0]; // Access the first attribute for quantity and price

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    hex: variation.color?.hex || "",
                    size: attributeValue || '',
                    quantity: parseInt(attributeData?.quantity) || 0, // Use quantity from attributeData
                    price: parseFloat(attributeData?.price) || 0, // Use price from attributeData
                    image: variation.images?.[0]?.path || '',
                    total: (parseInt(attributeData?.quantity) || 0) * (parseFloat(attributeData?.price) || 0),
                    type: 'variation',
                    shop: variation.shop || null,
                    seller: variation.shop?.user || null
                });
            }
            // Cas 2: variation_attribute est null mais product_variation existe directement
            else if (item.product_variation) {
                const variation = item.product_variation;

                allOrderItems.push({
                    id: item.id,
                    name: variation.product_name || 'Produit inconnu',
                    color: variation.color?.name || '',
                    hex: variation.color?.hex || "",
                    size: '',
                    quantity: parseInt(item.variation_quantity), // Keep original quantity for this case if it applies
                    price: parseFloat(item.variation_price), // Keep original price for this case if it applies
                    image: variation.images?.[0]?.path || '',
                    total: parseInt(item.variation_quantity) * parseFloat(item.variation_price),
                    type: 'variation',
                    shop: variation.shop || null,
                    seller: variation.shop?.user || null
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
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    image: item.product?.product_profile || '',
                    total: parseInt(item.quantity) * parseFloat(item.price),
                    type: 'simple',
                    shop: item.product?.shop || null,
                    seller: item.product?.shop?.user || null
                });
            }
        });
    }

    return allOrderItems;
};

const TAX_RATE = 0.1925; // 19.25% TVA au Cameroun

const OrderDetailPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { data: orderData, isLoading, isError } = useShowOrderQuery(orderId);
    const getOrderStatus = (status: string) => {
        switch (status) {
            case "0":
                return {
                    icon: Clock,
                    title: 'En attente',
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                };
            case "1":
                return {
                    icon: Package,
                    title: 'En cours de livraison',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                };
            case "2":
                return {
                    icon: CheckCircle2,
                    title: 'Livré',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                };
            case "3":
                return {
                    icon: XCircle,
                    title: 'Annulé',
                    color: 'text-rose-600',
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-200',
                };
            default:
                return null;
        }
    };

    if (isLoading) {
        return <IsLoadingComponents isLoading={isLoading} />;
    }

    if (isError || !orderData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <XCircle className="w-16 h-16 text-rose-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
                <p className="text-gray-600">Impossible de récupérer les détails de la commande.</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux commandes
                </button>
            </div>
        );
    }

    const order = orderData;
    const status = getOrderStatus(order.status);
    const allOrderItems = getOrderItems(order);

    const subtotal = allOrderItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const totalWithTax = subtotal;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/orders')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Détails de la Commande #{order.id}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Summary Card */}
                <Card className="md:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${status?.bgColor}`}>
                                {status && <status.icon className={`w-6 h-6 ${status.color}`} />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Statut: {status?.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Passée le {format(new Date(order.created_at), 'PPP à HH:mm', { locale: fr })}
                                </p>
                            </div>
                        </div>
                        <span className="font-bold text-xl">{formatPrice(order.total_amount)}</span>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles Commandés ({allOrderItems.length})</h2>
                    <div className="space-y-4">
                        {allOrderItems.length > 0 ? (
                            allOrderItems.map((item: any) => (
                                <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <div className="text-sm text-gray-600">
                                            <p>Quantité: {item.quantity}</p>
                                            {item.color && <p>Couleur: {item.color}</p>}
                                            {item.size && <p>Taille: {item.size}</p>}
                                        </div>
                                        <p className="font-medium text-gray-800 mt-1">Total: {formatPrice(item.total)}</p>

                                        {/* Seller Info per item */}
                                        {item.shop && item.seller && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <img src={item.shop.shop_profile} alt={item.shop.shop_name} />
                                                    <AvatarFallback>{item.shop.shop_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <AsyncLink to={`/shop/${item.shop.shop_url}`} className="font-medium text-sm text-blue-600 hover:underline">
                                                        <div className="flex items-center gap-1">
                                                            <Store className="w-3 h-3" />
                                                            {item.shop.shop_name}
                                                        </div>
                                                    </AsyncLink>
                                                    <a href={`tel:${item.shop.phone}`} className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {item.shop.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-lg font-medium">Aucun article trouvé pour cette commande.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Delivery and Totals Card */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de Livraison</h2>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">Adresse</p>

                                    <p className="text-gray-600 max-sm:text-sm">{order.quarter_delivery ? order?.quarter_delivery : order?.emplacement}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">Durée Estimée</p>
                                    <p className="text-sm">{order.duration_of_delivery || 'Non spécifiée'}</p>
                                </div>
                            </div>

                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé des Totaux</h2>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Sous-total:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>


                            <div className="flex justify-between border-t border-dashed pt-4 mt-4 text-xl font-bold">
                                <span>Total (TTC):</span>
                                <span className="text-green-600">{formatPrice(totalWithTax)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
