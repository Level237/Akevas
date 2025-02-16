

import { MapPin, Package, Phone, User } from 'lucide-react'


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"




export default function DeliveriesPage() {
  return (

     

      <main className="p-6">
        <div className="grid gap-6">
          {/* Commande disponible */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Commande #2461 - 3,2 km
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-500">12€</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      Voir détails
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Détails de la commande #2461</DialogTitle>
                      <DialogDescription>
                        Restaurant: Le Petit Bistrot
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full">
                          <img
                            src="/placeholder.svg"
                            alt="Restaurant"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">Le Petit Bistrot</h3>
                          <p className="text-sm text-muted-foreground">
                            12 Rue de la Gastronomie
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>2.1 km jusqu'au restaurant</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Package className="h-4 w-4" />
                          <span>1.1 km jusqu'au client</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4" />
                          <span>Client: Marie D.</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>Contacter le restaurant</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Détails de la commande</h4>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                          <li>1x Steak-Frites</li>
                          <li>1x Salade César</li>
                          <li>2x Eau minérale</li>
                        </ul>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Refuser</Button>
                        <Button>Accepter</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <img
                    src="/placeholder.svg"
                    alt="Restaurant"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Le Petit Bistrot</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    12 Rue de la Gastronomie
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Autres commandes similaires */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Commande #2460 - 2,8 km
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-500">10€</span>
                <Button variant="default" size="sm">
                  Voir détails
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <img
                    src="/placeholder.svg"
                    alt="Restaurant"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sushi Master</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    8 Avenue des Sushis
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

  )
}

