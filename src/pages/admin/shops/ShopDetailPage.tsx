import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Check, X, MapPin, Phone, Mail, Globe, Package, Users, DollarSign } from "lucide-react"
import dress from "../../../assets/dress.jpg"

const shopData = {
  id: 1,
  name: "Tech Haven",
  owner: "Alice Johnson",
  email: "alice@techhaven.com",
  phone: "+1 234 567 8901",
  address: "123 Tech Street, Silicon Valley, CA 94024",
  website: "https://techhaven.com",
  description:
    "Tech Haven est votre destination unique pour tout ce qui concerne la technologie. Nous proposons une large gamme d'électronique, de gadgets et d'accessoires pour les passionnés de technologie et les professionnels.",
  status: "pending",
  mainImage: dress,
  galleryImages: [dress, dress, dress, dress],
}
export default function AdminShopDetailPage() {
  return (
    <main className="p-4 md:p-6 mt-16">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Détails de la boutique</h1>
      <div className="space-x-2">
        <Button variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
          <X className="mr-2 h-4 w-4" /> Rejeter
        </Button>
        <Button variant="outline" className="bg-green-100 hover:bg-green-200 text-green-600">
          <Check className="mr-2 h-4 w-4" /> Approuver
        </Button>
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{shopData.name}</CardTitle>
          <CardDescription>ID de la boutique : {shopData.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <img
              src={shopData.mainImage || "/placeholder.svg"}
              alt={shopData.name}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {shopData.galleryImages.map((img, index) => (
              <img
                key={index}
                src={img || "/placeholder.svg"}
                alt={`${shopData.name} gallery image ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">À propos de {shopData.name}</h2>
            <p>{shopData.description}</p>
            <div className="grid gap-2">
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" /> {shopData.phone}
              </p>
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> {shopData.email}
              </p>
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> {shopData.address}
              </p>
              <p className="flex items-center">
                <Globe className="mr-2 h-4 w-4" /> {shopData.website}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du propriétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">{shopData.owner}</p>
              <p className="text-sm text-gray-500">{shopData.email}</p>
              <p className="text-sm text-gray-500">{shopData.phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statut de la boutique</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-yellow-600 bg-yellow-100">
              En attente d'approbation
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
  )
}
