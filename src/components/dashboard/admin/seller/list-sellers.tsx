import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'origine</TableHead>
              <TableHead>Prioritaire</TableHead>
              <TableHead>Nombre de Produits</TableHead>
              <TableHead>Nombre de Coins</TableHead>
              <TableHead>Etat</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && shops?.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={shop.shop.shop_profile || ""} className="object-cover" />
                      <AvatarFallback className="text-sm font-medium">
                        <Store className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{shop.shop.shop_name}</span>
                      <span className="text-xs text-gray-500">{shop.firstName}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{shop.firstName}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{shop.shop.products_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{shop.shop.coins}</span>
                    <Coins className="w-4 h-4 text-[#ed7e0f]" />
                  </div>
                </TableCell>
                <TableCell>
                  <CheckStateSeller state={shop.shop.state || null} />
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-500">{formatDate(shop.created_at)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/shops/${shop.shop.shop_id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddCoins(shop.shop.shop_id || '', shop.shop.shop_name || '')}
                      className="h-8 w-8 text-[#ed7e0f] hover:text-[#ed7e0f] hover:bg-orange-50"
                    >
                      <Coins className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {!isLoading && shops?.map((shop) => (
          <Card key={shop.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Header with Avatar and Status */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={shop.shop.shop_profile || ""} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-medium">
                      <Store className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {shop.shop.shop_name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {shop.firstName}
                    </p>
                  </div>
                </div>
                <CheckStateSeller state={shop.shop.state || null} />
              </div>

              {/* Shop Information */}
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>Produits</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {shop.shop.products_count}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Coins className="h-4 w-4 text-[#ed7e0f]" />
                    <span>Coins</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {shop.shop.coins}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span>Créé le {formatDate(shop.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center gap-2">
                <Link to={`/admin/shops/${shop.shop.shop_id}`} className="flex-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir la boutique
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCoins(shop.shop.shop_id || '', shop.shop.shop_name || '')}
                  className="h-10 px-3 text-[#ed7e0f] border-orange-200 hover:bg-orange-50"
                >
                  <Coins className="h-4 w-4 mr-1" />
                  Ajouter
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
              <div className="grid gap-2">
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
  const { data: { data: shops } = {}, isLoading, error } = useListSellersQuery('admin');
  console.log(error)
  return <ListSellers shops={shops} isLoading={isLoading} />;
}

export function CheckStateSeller({ state }: { state: string | null }) {
  return (
    <Badge
      className={
        state === "1" ? "bg-green-100 text-green-700 hover:bg-green-200" : 
        state === "0" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : 
        "bg-red-100 text-red-700 hover:bg-red-200"
      }
    >
      {state === "1" && "Approuvé"}
      {state === "0" && "Non approuvé"}
      {state === "2" && "Rejeté"}
    </Badge>
  )
}
