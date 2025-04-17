import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useListSellersQuery, useSendCoinsToShopMutation } from '@/services/adminService'
import { Seller } from '@/types/seller'
import { Coins, ExternalLink, Store, Plus } from 'lucide-react'
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

interface ListSellersProps{
    shops:Seller[];
    isLoading:boolean
}
export default function ListSellers({shops,isLoading}:ListSellersProps) {
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
      const response=await sendCoinsToShop({
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
    <div className='p-12 max-sm:p-2'>
       <Table className='overflow-auto'>
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
                <div className="flex items-center mt-6 space-x-3">
                  <Avatar>
                    <AvatarImage src={shop.shop.shop_profile || ""} />
                    <AvatarFallback>
                      <Store className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{shop.shop.shop_name}</span>
                </div>
              </TableCell>
              <TableCell>{shop.firstName}</TableCell>
              <TableCell>{shop.shop.products_count}</TableCell>
              <TableCell className="flex gap-2 mt-5 items-center">{shop.shop.coins} <Coins className="w-4 h-4 text-[#ed7e0f]"/></TableCell>
              <TableCell>
                <CheckStateSeller state={shop.shop.state || null} />
              </TableCell>
              <TableCell> {formatDate(shop.created_at)}</TableCell>
              <TableCell className="text-right flex items-center">
                <Link to={`/admin/shops/${shop.shop.shop_id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddCoins(shop.shop.shop_id || '', shop.shop.shop_name || '')}
                  className="text-[#ed7e0f] hover:text-[#ed7e0f] hover:bg-orange-50"
                >
                  <Coins className=" h-4 w-4" />
                  Add
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isLoading && shops?.length === 0 && (
        <div className="text-center py-12">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucune boutique trouvée</p>
        </div>
      )}
      {isLoading &&
          <div className="flex mt-6 justify-center items-center">
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
          </div>}

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
  const { data: { data: shops } = {}, isLoading,error } = useListSellersQuery('admin');
  console.log(error)
  return <ListSellers shops={shops} isLoading={isLoading} />;
}

export function CheckStateSeller({state}:{state:string | null}){

  return (
     <Badge
                  className={
                    state==="1" ? "bg-green-100 text-green-700" : state==="0" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                  }
                >
                  {state==="1" && "aprouvé"}
                  {state==="0" && "non approuvé"}
                  {state==="2" && "Rejeté"}
                </Badge>
  )
}
