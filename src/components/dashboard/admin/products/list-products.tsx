import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2,Package,Eye } from 'lucide-react'
import { Product } from '@/types/products'
import { Badge } from '@/components/ui/badge'
import { useAdminListProductsQuery } from '@/services/adminService'
import IsLoadingComponents from '@/components/ui/isLoadingComponents'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OptimizedImage from '@/components/OptimizedImage'
import { useNavigate } from 'react-router-dom'
export default function ListProducts({products,isLoading}:{products:Product[],isLoading:boolean}) {
  const navigate = useNavigate()
  console.log(products)
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
                  
          {products.map((product:any) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar>
                  {product.variations && product.variations.length > 0 && product.variations[0].images && product.variations[0].images.length > 0
                  ? <OptimizedImage
                    src={product.variations[0].images[0]}
                    alt={product.product_name}
                    className="h-full w-full"
                  />
                : 
                <AvatarImage
                src={product.product_profile}
              />
                
                  }
                  
                  <AvatarFallback>{product.product_name.charAt(0)}</AvatarFallback>
                </Avatar>
                {product.product_name}
                {product.variations && product.variations.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Variations</span>
                )}
              </TableCell>
              <TableCell>{product.product_categories[0].category_name}</TableCell>
              <TableCell>{product.variations && product.variations.length > 0 ? <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Varie</span> : parseFloat(product.product_price).toFixed(2) + "XAF" } </TableCell>
              <TableCell>{product.variations && product.variations.length > 0 ? <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Varie</span> : product.product_quantity}</TableCell>
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
                <Button onClick={()=>navigate(`/admin/products/${product.product_url}`)} variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isLoading && products?.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  )
}

export function ListProductsContainer(){
  const {data:{data:products}={},isLoading}=useAdminListProductsQuery('admin')
  console.log(products)
  return <ListProducts products={products} isLoading={isLoading}/>
}
