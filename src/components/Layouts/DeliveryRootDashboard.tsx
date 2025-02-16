'use client'

import { Activity, Bell, Clock, DollarSign, Home, Package, Settings, Star, Truck} from 'lucide-react'


import { Button } from "@/components/ui/button"

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'



export default function DeliveryRootDashboard({ children }: { children: React.ReactNode }) {
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
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#ed7e0f]" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
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
            <Link className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2 text-[#ed7e0f] transition-all hover:text-[#ed7e0f]/90" to="/">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-[#ed7e0f]/90" to="/">
              <Package className="h-4 w-4" />
              Livraisons
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-[#ed7e0f]/90" to="/">
              <Clock className="h-4 w-4" />
              Historique
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-[#ed7e0f]/90" to="/">
              <Activity className="h-4 w-4" />
              Performance
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-[#ed7e0f]/90" to="/">
              <DollarSign className="h-4 w-4" />
              Revenus
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-[#ed7e0f]/90" to="/">
              <Star className="h-4 w-4" />
              Évaluations
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-[#ed7e0f]/90" to="/">
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </nav>
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1 p-6 lg:ml-64 overflow-y-auto mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}

