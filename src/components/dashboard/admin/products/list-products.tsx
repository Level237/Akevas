import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2 } from 'lucide-react'
import { Product } from '@/types/products'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { useAdminListProductsQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
export default function ListProducts({products,isLoading}:{products:Product[],isLoading:boolean}) {
  if(isLoading){
    return <IsLoadingComponents isLoading={isLoading}/>
  }
  return (
    <div>
            <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium flex items-center gap-2"> <Avatar>
                <AvatarImage src={product.product_profile} />
                <AvatarFallback>{product.product_name.charAt(0)}</AvatarFallback>
              </Avatar> {product.product_name}</TableCell>
              <TableCell>{product.product_categories[0].category_name}</TableCell>
              <TableCell>${parseFloat(product.product_price).toFixed(2)}</TableCell>
              <TableCell>{product.product_quantity}</TableCell>
              <TableCell>
                <Badge  className={product.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{product.status ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ListProductsContainer(){
  const {data:{data:products}={},isLoading}=useAdminListProductsQuery('admin')
  console.log(products)
  return <ListProducts products={products} isLoading={isLoading}/>
}
