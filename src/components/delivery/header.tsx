import { OnlineStatusSwitch } from '@/components/dashboard/delivery/online-status-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
import { Truck, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { User } from '@/types/user'
import { useLogoutMutation } from '@/services/auth'
import { logoutUser } from '@/lib/logout'
import favicon from "../../assets/favicon.png"
import AsyncLink from '../ui/AsyncLink'
export default function Header({ userData }: { userData: User }) {
  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    await logout('Auth')
    logoutUser()
  }
  return (
    <div className='fixed top-0 left-0 right-0 z-40'>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <MobileNav />
          <AsyncLink to="/">
            <div className="flex items-center gap-2 font-semibold ml-4 lg:ml-0">

              <img src={favicon} alt="favicon" className="h-12 w-12" />

              <span className="hidden md:inline">DeliveryPro</span>
            </div>
          </AsyncLink>
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
                    <p className="text-sm font-medium leading-none">{userData?.firstName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email}
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
                <DropdownMenuItem onClick={handleLogout}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  )
}
