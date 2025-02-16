'use client'

import { Box, ChevronDown, DollarSign, Package, Star,Users } from 'lucide-react'


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"




export default function DeliveryDashboard() {
  return (
    <>
    <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Bonjour, Thomas</h1>
              <p className="text-muted-foreground">Voici un aperçu de votre activité</p>
            </div>
            <Button className='bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 py-5'>
              Nouvelle livraison
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Livraisons Totales</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  +4% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234€</div>
                <p className="text-xs text-muted-foreground">
                  +10% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients Servis</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  +12% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">
                  Basé sur 127 évaluations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Deliveries */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Livraisons Récentes</CardTitle>
              <CardDescription>
                Vous avez effectué 12 livraisons aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Delivery Items */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#ed7e0f]/10 rounded-full">
                      <Package className="h-4 w-4 text-[#ed7e0f]" />
                    </div>
                    <div>
                      <p className="font-medium">Commande #2458</p>
                      <p className="text-sm text-muted-foreground">15 Rue de la Paix, Paris</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">14:30</p>
                    <p className="text-sm text-green-500">Livré</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#ed7e0f]/10 rounded-full">
                      <Package className="h-4 w-4 text-[#ed7e0f]" />
                    </div>
                    <div>
                      <p className="font-medium">Commande #2457</p>
                      <p className="text-sm text-muted-foreground">8 Avenue Montaigne, Paris</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">13:45</p>
                    <p className="text-sm text-green-500">Livré</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#ed7e0f]/10 rounded-full">
                      <Package className="h-4 w-4 text-[#ed7e0f]" />
                    </div>
                    <div>
                      <p className="font-medium">Commande #2456</p>
                      <p className="text-sm text-muted-foreground">22 Rue du Commerce, Paris</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">11:20</p>
                    <p className="text-sm text-green-500">Livré</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
    </>
  )
}

