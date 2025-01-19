"use client"

import { Activity, Clock, DollarSign, Home, Menu, Package, Settings, Star } from 'lucide-react'


import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from 'react-router-dom'

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <nav className="flex flex-col gap-4 pt-4">
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Home className="h-4 w-4" />
            Accueil
          </Link>
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Package className="h-4 w-4" />
            Livraisons
          </Link>
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" >
            <Clock className="h-4 w-4" />
            Historique
          </Link>
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" >
            <Activity className="h-4 w-4" />
            Performance
          </Link>
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" >
            <DollarSign className="h-4 w-4" />
            Revenus
          </Link>
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" >
            <Star className="h-4 w-4" />
            Évaluations
          </Link>
          <Link to={'/'} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Settings className="h-4 w-4" />
            Paramètres
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

