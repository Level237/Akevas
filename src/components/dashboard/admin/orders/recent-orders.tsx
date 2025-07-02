import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AsyncLink from "@/components/ui/AsyncLink";
import { Loader2, Package, ArrowRight } from "lucide-react";
import { useAdminRecentOrdersQuery } from "@/services/adminService";
import { formatDate } from "@/lib/formatDate";

const getStatusBadgeColor = (status: string) => {
  const statusColors: Record<string, string> = {
    "0": "bg-yellow-100 text-yellow-800",
    "1": "bg-blue-100 text-blue-800",
    "2": "bg-green-100 text-green-800",
    "3": "bg-red-100 text-red-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const getStatusText = (status: string) => {
  const statusText: Record<string, string> = {
    "0": "En attente",
    "1": "En cours de livraison",
    "2": "Livré",
    "3": "Annulé",
  };
  return statusText[status] || "Inconnu";
};

export default function RecentOrdersAdmin() {
  const { data, isLoading } = useAdminRecentOrdersQuery("admin");

  // Afficher "Aucune commande récente" si aucune commande n'est présente
  const noOrders =
    (!isLoading && (!data || data.length === 0));

  return (
    <Card className="p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-xl font-semibold max-sm:text-md">Commandes récentes</h2>
        <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]" size="sm" asChild>
          <AsyncLink to="/admin/orders">Voir plus <ArrowRight /></AsyncLink>
        </Button>
      </div>
      <CardContent className="space-y-4 p-0">
        {isLoading && (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        {noOrders && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <Package className="w-12 h-12 text-gray-400" />
            <p className="text-lg max-sm:text-sm font-semibold text-gray-700">Aucune commande récente</p>
            <p className="text-sm max-sm:text-xs text-gray-500">Aucune commande n'a été passée récemment.</p>
          </div>
        )}
        {!isLoading && data && data.length > 0 && data.map((order: any) => {
          const firstProduct = order.order_details?.[0]?.product_variation;
          const productImage = firstProduct?.images?.[0]?.path;
          return (
            <div key={order.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {productImage ? (
                  <img src={productImage} alt={firstProduct?.product_name || 'Produit'} width={64} height={64} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Commande #{order.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>{getStatusText(order.status)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {order.itemsCount} article(s) • {order.total_amount} XAF
                </p>
                <div className="text-xs text-gray-600">
                  Client : <span className="font-semibold">{order.userName}</span> — {order.userPhone}
                </div>
                <div className="text-xs text-gray-600">
                  Passée {formatDate(order.created_at)}
                </div>
                <div className="text-xs text-gray-600">
                  Livraison : <span className="font-semibold">{order.emplacement || order.residence}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <AsyncLink to={`/admin/order/${order.id}`}>Détails</AsyncLink>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}