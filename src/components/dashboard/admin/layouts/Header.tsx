import { Search, Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetUserQuery } from "@/services/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Header() {
  const { data: userData } = useGetUserQuery('Auth')
  
  const [notifications] = useState([
    {
      id: 1,
      title: "Nouvelle commande",
      description: "Une nouvelle commande a été passée",
      time: "Il y a 5 minutes",
      unread: true
    },
    {
      id: 2,
      title: "Nouveau message",
      description: "Vous avez reçu un nouveau message",
      time: "Il y a 30 minutes",
      unread: true
    },
    // Ajoutez d'autres notifications si nécessaire
  ])

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-16 border-b bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="w-full max-w-[400px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-9 bg-white/50 border-gray-200 focus:border-[#ed7e0f] transition-all duration-200"
                placeholder="Rechercher..."
                type="search"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{notification.description}</span>
                  <span className="text-xs text-gray-400 mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {userData?.userName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{userData?.userName}</div>
                  <div className="text-xs text-gray-500">Administrateur</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

