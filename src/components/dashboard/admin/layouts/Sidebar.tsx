

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
  { icon: Star, label: "Commentaires", href: "/admin/reviews" },
  { icon: MessageCircle, label: "Feedbacks", href: "/admin/feedbacks" },
  { icon: HelpCircle, label: "Help", href: "#" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logout] = useLogoutMutation()

  const { pathname } = useLocation()

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
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#ed7e0f]/10 text-[#ed7e0f]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-[#ed7e0f]" : "text-gray-400")} />
                <span>{item.label}</span>
              </Link>
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

