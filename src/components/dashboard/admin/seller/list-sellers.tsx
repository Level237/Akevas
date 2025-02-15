import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useListSellersQuery } from '@/services/adminService'
import { Seller } from '@/types/seller'
import { ExternalLink, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/formatDate'
import { Link } from 'react-router-dom'

interface ListSellersProps{
    shops:Seller[];
    isLoading:boolean
}
export default function ListSellers({shops,isLoading}:ListSellersProps) {
    
  return (
    <div className='p-12 max-sm:p-2'>
       <Table className='overflow-auto'>
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'origine</TableHead>
            <TableHead>Prioritaire</TableHead>
            <TableHead>Nombre de Products</TableHead>
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
              <TableCell>
                <CheckStateSeller state={shop.shop.state || null} />
              </TableCell>
              <TableCell> {formatDate(shop.created_at)}</TableCell>
              <TableCell className="text-right">
                <Link to={`/admin/shops/${shop.shop.shop_id}`}> <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                 
                  Visualiser
                </Button></Link>
               
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
    </div>
  )
}

export function ListSellersContainer() {
  const { data: { data: shops } = {}, isLoading } = useListSellersQuery('admin');
  
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
