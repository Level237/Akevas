import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Store, ExternalLink } from "lucide-react"

const shops = [
  { id: 1, name: "Tech Haven", owner: "Alice Johnson", products: 150, status: "Active", rating: 4.5 },
  { id: 2, name: "Fashion Forward", owner: "Bob Smith", products: 200, status: "Active", rating: 4.2 },
  { id: 3, name: "Home Essentials", owner: "Carol Williams", products: 100, status: "Pending", rating: 0 },
  { id: 4, name: "Gourmet Delights", owner: "David Brown", products: 75, status: "Active", rating: 4.8 },
  { id: 5, name: "Outdoor Adventures", owner: "Eva Davis", products: 120, status: "Inactive", rating: 3.9 },
]

export default function AdminShopPage() {
  return (
    <main className="p-4 md:p-6 mt-16">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Shops</h1>
      <Button className="bg-[#ed7e0f] hover:bg-[#ed7e0f]/90">
        <Plus className="mr-2 h-4 w-4" /> Add Shop
      </Button>
    </div>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input className="pl-8" placeholder="Search shops..." />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${shop.name}`} />
                    <AvatarFallback>
                      <Store className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{shop.name}</span>
                </div>
              </TableCell>
              <TableCell>{shop.owner}</TableCell>
              <TableCell>{shop.products}</TableCell>
              <TableCell>
                <Badge
                  className={
                    shop.status === "Active" ? "bg-green-100 text-green-700" : shop.status === "Inactive" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                  }
                >
                  {shop.status}
                </Badge>
              </TableCell>
              <TableCell>{shop.rating > 0 ? `${shop.rating.toFixed(1)} / 5.0` : "N/A"}</TableCell>
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
    </div>
  </main>
  )
}
