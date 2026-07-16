import { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useListSellersQuery, useSendCoinsToShopMutation } from '@/services/adminService'
import { Seller } from '@/types/seller'
import { Coins, ExternalLink, Store, Plus, User, Calendar, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/formatDate'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from '@/components/ui/card'

interface ListSellersProps {
  shops: Seller[];
  isLoading: boolean
}

export default function ListSellers({ shops, isLoading }: ListSellersProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState<{ id: string; name: string } | null>(null);
  const [coinsAmount, setCoinsAmount] = useState('');
  const [sendCoinsToShop] = useSendCoinsToShopMutation();

  const handleAddCoins = (shopId: string, shopName: string) => {
    setSelectedShop({ id: shopId, name: shopName });
    setShowModal(true);
  };

  const handleSubmitCoins = async () => {
    if (!selectedShop || !coinsAmount) return;

    try {
      const response = await sendCoinsToShop({
        shopId: selectedShop.id,
        coins: coinsAmount
      });
      console.log(response)
      setCoinsAmount('');
      setShowModal(false);
      setSelectedShop(null);
    } catch (error) {
      console.error('Erreur lors de l\'ajout des coins:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Responsive Modern Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!isLoading && shops?.map((shop) => (
          <Card key={shop.id} className="overflow-hidden border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Header with Avatar and Status */}
              <div className="p-5 flex items-start justify-between border-b border-gray-50/80 bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage
                      src={shop.shop.shop_profile || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-medium bg-gray-100 text-gray-500">
                      <Store className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-[#ed7e0f] transition-colors" title={shop.shop.shop_name}>
                      {shop.shop.shop_name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {shop.firstName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shop Information */}
              <div className="p-5 flex flex-col flex-grow space-y-4">
                <div className="flex items-center justify-between">
                  <CheckStateSeller state={shop.shop.state || null} />
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(shop.created_at)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center text-center group-hover:bg-gray-100/50 transition-colors">
                    <Package className="h-5 w-5 text-gray-400 mb-1.5" />
                    <span className="font-bold text-gray-900 text-lg leading-none">{shop.shop.products_count}</span>
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Produits</span>
                  </div>
                  <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50 flex flex-col items-center justify-center text-center group-hover:bg-orange-50 transition-colors">
                    <Coins className="h-5 w-5 text-[#ed7e0f] mb-1.5" />
                    <span className="font-bold text-gray-900 text-lg leading-none">{shop.shop.coins}</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#ed7e0f] font-semibold mt-1">Coins</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center gap-2 mt-auto">
                <Link to={`/admin/shops/${shop.shop.shop_id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 text-blue-600 bg-white border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Boutique
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCoins(shop.shop.shop_id || '', shop.shop.shop_name || '')}
                  className="h-9 px-4 text-[#ed7e0f] bg-white border-orange-100 hover:bg-orange-50 hover:border-orange-200 transition-colors shadow-sm font-medium"
                >
                  <Coins className="h-4 w-4 mr-1.5" />
                  Coins
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && shops?.length === 0 && (
        <div className="text-center py-12">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucune boutique trouvée</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex mt-6 justify-center items-center">
          <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Modal d'ajout de coins */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter des coins</DialogTitle>
            <DialogDescription>
              Ajoutez des coins à la boutique {selectedShop?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Coins className="h-12 w-12 text-[#ed7e0f]" />
              <div className="grid gap-2 flex-1">
                <Input
                  type="number"
                  placeholder="Nombre de coins à ajouter"
                  value={coinsAmount}
                  onChange={(e) => setCoinsAmount(e.target.value)}
                  className="w-full"
                  min="1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setCoinsAmount('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitCoins}
              className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90"
              disabled={!coinsAmount || parseInt(coinsAmount) <= 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter les coins
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function ListSellersContainer() {
  const { data: { data: shops } = {}, isLoading } = useListSellersQuery('admin');

  return <ListSellers shops={shops} isLoading={isLoading} />;
}

export function CheckStateSeller({ state }: { state: string | null }) {
  return (
    <Badge
      className={`shadow-sm border-0 font-medium ${state === "1" ? "bg-green-500 text-white hover:bg-green-600" :
          state === "0" ? "bg-orange-500 text-white hover:bg-orange-600" :
            "bg-red-500 text-white hover:bg-red-600"
        }`}
    >
      {state === "1" && "Approuvé"}
      {state === "0" && "Non approuvé"}
      {state === "2" && "Rejeté"}
    </Badge>
  )
}

