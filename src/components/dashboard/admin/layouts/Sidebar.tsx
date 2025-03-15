import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Truck,
  Store,
  Users,
  ShoppingCart,
  BarChart2,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Star,
  Stars,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useLogoutMutation } from "@/services/auth"
import { logoutUser } from "@/lib/logout"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Truck, label: "Livreurs", href: "/admin/delivery" },
  { icon: Store, label: "Boutiques", href: "/admin/shops" },
  { icon: Users, label: "Clients", href: "/admin/customers" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { 
    icon: Star, 
    label: "Commentaires", 
    href: "#",
    subItems: [
      { label: "Produits", href: "/admin/reviews/products" },
      { label: "Boutiques", href: "/admin/reviews/shops" },
    ]
  },
  { icon: MessageCircle, label: "Feedbacks", href: "/admin/feedbacks" },
  { icon: HelpCircle, label: "Help", href: "#" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [logout] = useLogoutMutation()

  const { pathname } = useLocation()

  const toggleSubmenu = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const handleLogout = async () => {
    await logout('Auth');
    logoutUser()
  }
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed  top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-lg transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-[#ed7e0f]" />
              <span className="text-xl font-bold text-gray-900">Akevas</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
            {navItems.map((item) => (
              <div key={item.href}>
                <div
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    pathname === item.href
                      ? "bg-[#ed7e0f]/10 text-[#ed7e0f]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                  onClick={() => {
                    if (item.subItems) {
                      toggleSubmenu(item.href)
                    }
                  }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center space-x-3 flex-1"
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-[#ed7e0f]" : "text-gray-400")} />
                    <span>{item.label}</span>
                  </Link>
                  {item.subItems && (
                    expandedItems.includes(item.href) 
                      ? <ChevronUp className="h-4 w-4 text-gray-500" />
                      : <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                {item.subItems && expandedItems.includes(item.href) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === subItem.href
                            ? "bg-[#ed7e0f]/10 text-[#ed7e0f]"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        )}
                      >
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Deconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}

