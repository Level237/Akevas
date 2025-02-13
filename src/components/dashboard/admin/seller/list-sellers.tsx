import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useListSellersQuery } from '@/services/adminService'
import { Seller } from '@/types/seller'
import { ExternalLink, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
            <TableHead>Owner</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
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
                <Badge
                  className={
                    shop.shop.status===true ? "bg-green-100 text-green-700" : !shop.shop.status ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                  }
                >
                  {shop.shop.status==true && "publié"}
                  {!shop.shop.status && "non publié"}
                </Badge>
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isLoading &&
          <div className="flex justify-center items-center">
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
