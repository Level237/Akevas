'use client'

import { Activity, Bell, Box, ChevronDown, Clock, DollarSign, Home, Package, Settings, Star, Truck, Users } from 'lucide-react'


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from '@/components/dashboard/delivery/mobile-nav'
import { Link } from 'react-router-dom'
import { OnlineStatusSwitch } from '@/components/dashboard/delivery/online-status-switch'



export default function DeliveryDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <MobileNav />
          <div className="flex items-center gap-2 font-semibold ml-4 lg:ml-0">
            <Truck className="h-6 w-6" />
            <span className="hidden md:inline">DeliveryPro</span>
          </div>
          <nav className="ml-8 hidden md:flex items-center gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
              Livraisons
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
              Pages
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
              Compte
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
              Contact
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <OnlineStatusSwitch />
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <img
                    src="/placeholder.svg"
                    height={32}
                    width={32}
                    alt="Avatar"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Thomas</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      thomas@delivery.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background overflow-y-auto">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2 text-secondary-foreground transition-all hover:text-primary" to="/">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" to="/">
              <Package className="h-4 w-4" />
              Livraisons
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" to="/">
              <Clock className="h-4 w-4" />
              Historique
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" to="/">
              <Activity className="h-4 w-4" />
              Performance
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" to="/">
              <DollarSign className="h-4 w-4" />
              Revenus
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" to="/">
              <Star className="h-4 w-4" />
              Évaluations
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" to="/">
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </nav>
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1 p-6 lg:ml-64 overflow-y-auto mt-16 lg:mt-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Bonjour, Thomas</h1>
              <p className="text-muted-foreground">Voici un aperçu de votre activité</p>
            </div>
            <Button>
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
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Package className="h-4 w-4 text-primary" />
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
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Package className="h-4 w-4 text-primary" />
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
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Package className="h-4 w-4 text-primary" />
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
        </main>
      </div>
    </div>
  )
}

