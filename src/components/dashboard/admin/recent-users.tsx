import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "deliverer" | "seller"
  joinedAt: string
}

interface RecentUsersProps {
  users: User[]
  title: string
}

export function RecentUsers({ users, title }: RecentUsersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-sm text-muted-foreground">{new Date(user.joinedAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

