import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/services/auth'

import { User } from '@/types/user'
import { useDispatch } from 'react-redux'
import { LogOut } from 'lucide-react'
import { logoutUser } from '@/lib/logout'

export default function Header({ userData }: { userData: User | null | undefined }) {
  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    await logout('Auth');
    logoutUser()
  }
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
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
