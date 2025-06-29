import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Search,
    Filter,
    Loader2,
} from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';
import { useGetOrdersQuery } from '@/services/auth';
import { useState } from 'react';

const OrdersPage = () => {
    const { data: orders, isLoading } = useGetOrdersQuery("Auth");
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    console.log(orders)
    
    // Fonction pour détecter si c'est une commande avec produits variés
    const isVariedOrder = (orderDetails: any[]) => {
        return orderDetails.some((detail: any) => detail.product_variation);
    };

    // Fonction pour obtenir l'image du produit (simple ou varié)
    const getProductImage = (orderDetails: any[]) => {
        if (isVariedOrder(orderDetails)) {
            // Pour les produits variés, prendre la première image de la variation
            const firstVariedDetail = orderDetails.find((detail: any) => detail.product_variation);
            return firstVariedDetail?.product_variation?.images?.[0]?.path || '';
        } else {
            // Pour les produits simples
            return orderDetails[0]?.product?.product_profile || '';
        }
    };

    // Fonction pour obtenir le nombre total d'articles
    const getTotalItems = (orderDetails: any[]) => {
        if (isVariedOrder(orderDetails)) {
            // Pour les produits variés, compter les variations
            return orderDetails.reduce((total: number, detail: any) => {
                return total + parseInt(detail.variation_quantity || 0);
            }, 0);
        } else {
            // Pour les produits simples
            return orderDetails.length;
        }
    };

    // Fonction pour obtenir les détails des produits
    const getProductDetails = (orderDetails: any[]) => {
        if (isVariedOrder(orderDetails)) {
            // Pour les produits variés
            const variedDetails = orderDetails.filter((detail: any) => detail.product_variation);
            return variedDetails.map((detail: any) => ({
                name: detail.product_variation?.product_name || 'Produit inconnu',
                color: detail.product_variation?.color?.name || '',
                quantity: detail.variation_quantity,
                price: detail.variation_price,
                image: detail.product_variation?.images?.[0]?.path || ''
            }));
        } else {
            // Pour les produits simples
            return orderDetails.map((detail: any) => ({
                name: detail.product?.name || 'Produit inconnu',
                quantity: detail.quantity || 1,
                price: detail.price || 0,
                image: detail.product?.product_profile || ''
            }));
        }
    };

    const getStatusBadgeColor = (status: string) => {
        const statusColors = {
            '0': 'bg-yellow-100 text-yellow-800',
            '1': 'bg-blue-100 text-blue-800',
            '2': 'bg-purple-100 text-purple-800',
            '3': 'bg-green-100 text-green-800',
            '4': 'bg-red-100 text-red-800',
        };
        return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status: string) => {
        const statusText = {
            '0': 'En attente',
            '1': 'En cours de livraison',
            '2': 'Livré',
            '3': 'Annulé',
        };
        return statusText[status as keyof typeof statusText] || 'Inconnu';
    };

    const filteredOrders = orders?.filter((order: any) => {
        const matchesSearch = order.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Mes Commandes</h1>
                    <Button variant="outline" asChild>
                        <AsyncLink to="/products">Continuer mes achats</AsyncLink>
                    </Button>
                </div>

                <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Rechercher une commande..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="0">En attente</SelectItem>
                                    <SelectItem value="1">Confirmé</SelectItem>
                                    <SelectItem value="2">En cours</SelectItem>
                                    <SelectItem value="3">Livré</SelectItem>
                                    <SelectItem value="4">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : filteredOrders?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mb-2" />
                                <p>Aucune commande trouvée</p>
                            </div>
                        ) : (
                            filteredOrders?.map((order: any) => {
                                const productDetails = getProductDetails(order.order_details);
                                const totalItems = getTotalItems(order.order_details);
                                const isVaried = isVariedOrder(order.order_details);
                                
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="w-20 h-20">
                                            <img
                                                src={getProductImage(order.order_details)}
                                                alt="Product"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">Commande #{order.id}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                                {isVaried && (
                                                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                                        Produits variés
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {totalItems} article(s) • {order.total_amount} XAF
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Commandé le {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                            {/* Affichage des détails des produits */}
                                            <div className="text-xs text-gray-600">
                                                {productDetails.slice(0, 2).map((product: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span>• {product.name}</span>
                                                        {product.color && (
                                                            <span className="text-purple-600">({product.color})</span>
                                                        )}
                                                        <span>x{product.quantity}</span>
                                                    </div>
                                                ))}
                                                {productDetails.length > 2 && (
                                                    <span className="text-gray-500">
                                                        +{productDetails.length - 2} autre(s) produit(s)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" asChild>
                                                <AsyncLink to={`/user/orders/${order.id}`}>
                                                    Voir détails
                                                </AsyncLink>
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default OrdersPage; 