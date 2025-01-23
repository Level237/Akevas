
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react"

const products = [
  { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 79.99, stock: 120, status: "In Stock" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 75, status: "Low Stock" },
  { id: 3, name: "Portable Charger", category: "Electronics", price: 49.99, stock: 200, status: "In Stock" },
  { id: 4, name: "Laptop Backpack", category: "Accessories", price: 59.99, stock: 85, status: "In Stock" },
  { id: 5, name: "Bluetooth Speaker", category: "Electronics", price: 89.99, stock: 60, status: "Low Stock" },
]

export default function AdminProductListPage() {
  return (
    <main className="p-4 md:p-6 mt-16">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>
    </div>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input className="pl-8" placeholder="Search products..." />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>
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
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.status === "In Stock" ? "success" : "warning"}>{product.status}</Badge>
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
  </main>
  )
}

