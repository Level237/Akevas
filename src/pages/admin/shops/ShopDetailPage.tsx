import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, MapPin, Phone, Mail, Globe, Package, Users, DollarSign } from "lucide-react"


const shopData = {
    id: 1,
    name: "Tech Haven",
    owner: "Alice Johnson",
    email: "alice@techhaven.com",
    phone: "+1 234 567 8901",
    address: "123 Tech Street, Silicon Valley, CA 94024",
    website: "https://techhaven.com",
    description:
      "Tech Haven is your one-stop shop for all things tech. We offer a wide range of electronics, gadgets, and accessories for tech enthusiasts and professionals alike.",
    status: "pending",
    joinDate: "2023-06-15",
    productsCount: 150,
    ordersCount: 1200,
    revenue: 75000,
  }
export default function AdminShopDetailPage() {
  return (
    <main className="p-4 md:p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Shop Details</h1>
            <div className="space-x-2">
              <Button variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button variant="outline" className="bg-green-100 hover:bg-green-200 text-green-600">
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{shopData.name}</CardTitle>
                <CardDescription>Shop ID: {shopData.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${shopData.name}`} />
                    <AvatarFallback>{shopData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{shopData.owner}</h2>
                    <p className="text-sm text-gray-500">Shop Owner</p>
                    <Badge variant="outline" className="mt-2">
                      {shopData.status === "pending" ? "Pending Approval" : "Approved"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> {shopData.address}
                  </p>
                  <p className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> {shopData.phone}
                  </p>
                  <p className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> {shopData.email}
                  </p>
                  <p className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" /> {shopData.website}
                  </p>
                </div>
                <p className="mt-4">{shopData.description}</p>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Package className="mr-2 h-4 w-4" /> Products
                      </span>
                      <span className="font-semibold">{shopData.productsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Users className="mr-2 h-4 w-4" /> Orders
                      </span>
                      <span className="font-semibold">{shopData.ordersCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" /> Revenue
                      </span>
                      <span className="font-semibold">${shopData.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shop Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="products">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="products">Products</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="products">
                      <p className="text-sm text-gray-500">Recent products will be displayed here.</p>
                    </TabsContent>
                    <TabsContent value="orders">
                      <p className="text-sm text-gray-500">Recent orders will be displayed here.</p>
                    </TabsContent>
                    <TabsContent value="reviews">
                      <p className="text-sm text-gray-500">Customer reviews will be displayed here.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
  )
}
