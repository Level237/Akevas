import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/formatDate"

interface User {
  id: string
  firstName: string
  email: string
  avatar: string,
  shop:{ shop_name:string | null,shop_profile:string | null},
  role: number
  created_at: string
}

interface RecentUsersProps {
  users: User[] | null
  title: string,
  isLoading:boolean | null
}

export function RecentUsers({ users, title,isLoading }: RecentUsersProps) {
  return (
    <Card>
      <CardHeader >
        <CardTitle className="flex justify-between items-center">{title} <Button className=" bg-transparent border-[1px] hover:bg-[#ed7e0f]/20 text-[#ed7e0f] border-[#ed7e0f]/90">Voir plus</Button></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          
          {isLoading &&
          <div className="flex justify-center items-center">
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
          </div>}
          {!isLoading && users?.map((user) => (
            <div key={user.id} className="flex items-center space-x-4">
              <Avatar>
                {user.role==2 && <AvatarImage src={user.shop.shop_profile || ""} />}
                
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{user.role!==2 && <h2>{user.firstName}</h2>} 
                {user.role===2 && <h2>{user.shop.shop_name}</h2>}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-sm text-muted-foreground">{formatDate(user.created_at)}</div>
            </div>
          ))}
          {!users && !isLoading && <div className="flex items-center justify-center">Aucun utilisateur ajouté</div>}
        </div>
      </CardContent>
    </Card>
  )
}

