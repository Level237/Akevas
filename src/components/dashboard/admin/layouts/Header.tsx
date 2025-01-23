import { Search, Inbox, MessageCircle, Settings, Moon, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-16 border-b bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
      <div className="w-10">
      <Button
        variant="ghost"
        size="icon"
        className="fixed  top-4 left-4 z-50 md:hidden"
      
      >
         <Menu className="h-6 w-6" />
      </Button>
      </div>
        <div className="flex-1 flex items-center gap-4">
          <div className="w-full max-w-[400px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-9 bg-white transition-colors focus:bg-white/80"
                placeholder="Search..."
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center">
            {[
              { icon: Inbox, label: "Inbox" },
              { icon: MessageCircle, label: "Messages" },
              { icon: Settings, label: "Settings" },
              { icon: Moon, label: "Theme" },
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 pl-2 border-l">
            <Avatar className="transition-transform hover:scale-105">
              <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-01-23%2011-21-14-2WuCBSa9SifSu2WPzPOw6koFotgszu.png" />
              <AvatarFallback>WR</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="font-medium">William Robbie</div>
              <div className="text-xs text-gray-500">CEO & Founder</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

