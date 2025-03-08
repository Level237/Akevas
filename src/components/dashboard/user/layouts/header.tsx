import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/services/auth'
import { User } from '@/types/user'
import { LogOut, Menu, Home, LayoutDashboard, ShoppingBag, User as UserIcon } from 'lucide-react'
import { logoutUser } from '@/lib/logout'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AsyncLink from '@/components/ui/AsyncLink'

export default function Header({ userData }: { userData: User | null | undefined }) {
  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    await logout('Auth');
    logoutUser()
  }

  const menuItems = [
    { href: '/', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { href: '/user/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/user/orders', label: 'Commandes', icon: <ShoppingBag className="w-4 h-4" /> },
    { href: '/account', label: 'Mon compte', icon: <UserIcon className="w-4 h-4" /> },
  ]

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#ed7e0f] text-white text-xl">
                {userData?.userName?.charAt(0) || ''}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Bonjour, {userData?.userName}</h1>
              <p className="text-gray-500 text-sm">Bienvenue sur votre espace personnel</p>
            </div>
          </div>

          {/* Menu de navigation desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <AsyncLink
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 text-gray-600 hover:text-[#ed7e0f] transition-colors"
              >
                {item.icon}
                {item.label}
              </AsyncLink>
            ))}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </nav>

          {/* Menu burger mobile */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh]">
              <nav className="flex flex-col gap-4 pt-4">
                {menuItems.map((item) => (
                  <AsyncLink
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-[#ed7e0f] transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </AsyncLink>
                ))}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-red-600 justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
