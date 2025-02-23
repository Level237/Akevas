'use client'

import { useGetUserQuery } from '@/services/auth'
import { Activity, Clock, DollarSign, Home, Package, Settings, Star} from 'lucide-react'
import Header from '@/components/delivery/header'

import { Link } from 'react-router-dom'




export default function DeliveryRootDashboard({ children }: { children: React.ReactNode }) {
  const {data:userData}=useGetUserQuery('Auth')
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}

      <Header userData={userData}/>
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

