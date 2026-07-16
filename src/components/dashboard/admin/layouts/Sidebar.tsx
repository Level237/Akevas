import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Truck,
  Store,
  Users,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  User,
  Map,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useLogoutMutation } from "@/services/auth"
import AsyncLink from "@/components/ui/AsyncLink"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Truck, label: "Livreurs", href: "/admin/delivery" },
  {
    icon: Store, label: "Boutiques", href: "#boutiques",
    subItems: [
      { label: "Listes", href: "/admin/shops" },
      { label: "Nouvelle boutique", href: "/admin/shop/new" },]
  },
  {
    icon: Store, label: "Categories", href: "#categories",
    subItems: [
      { label: "Listes", href: "/admin/categories" },
      { label: "Nouvelle categorie", href: "/admin/category/new" },]
  },
  { icon: Users, label: "Clients", href: "/admin/customers" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  {
    icon: Star,
    label: "Commentaires",
    href: "#com",
    subItems: [
      { label: "Produits", href: "/admin/reviews/products" },
      { label: "Boutiques", href: "/admin/reviews/shops" },
    ]
  },
  { icon: MessageCircle, label: "Feedbacks", href: "/admin/feedbacks" },
  { icon: Map, label: "Villes", href: "/admin/cities" },
  { icon: Map, label: "Quartiers", href: "/admin/quarters" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [logout, { isSuccess }] = useLogoutMutation();

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
  }

  useEffect(() => {
    if (isSuccess) {
      window.location.href = "/login"
    }
  }, [isSuccess]);
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
        <div className="flex flex-col h-full bg-white">
          <div className="flex items-center justify-center h-20 border-b border-gray-100">
            <AsyncLink to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 group">
              <div className="bg-[#ed7e0f]/10 p-2 rounded-xl group-hover:bg-[#ed7e0f]/20 transition-colors">
                <Package className="h-6 w-6 text-[#ed7e0f]" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Akevas</span>
            </AsyncLink>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
            {navItems.map((item) => (
              <div key={item.href}>
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
                    pathname === item.href
                      ? "bg-gradient-to-r from-[#ed7e0f]/10 to-transparent text-[#ed7e0f] shadow-sm ring-1 ring-[#ed7e0f]/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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
                      } else {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", pathname === item.href ? "text-[#ed7e0f]" : "text-gray-400")} />
                    <span>{item.label}</span>
                  </Link>
                  {item.subItems && (
                    expandedItems.includes(item.href)
                      ? <ChevronUp className={cn("h-4 w-4 transition-colors", pathname === item.href ? "text-[#ed7e0f]" : "text-gray-400")} />
                      : <ChevronDown className={cn("h-4 w-4 transition-colors", pathname === item.href ? "text-[#ed7e0f]" : "text-gray-400")} />
                  )}
                </div>
                {item.subItems && expandedItems.includes(item.href) && (
                  <div className="ml-4 mt-2 space-y-1 pl-4 border-l-2 border-gray-100 relative">
                    {item.subItems.map((subItem) => (
                      <AsyncLink
                        key={subItem.href}
                        to={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                          pathname === subItem.href
                            ? "bg-[#ed7e0f]/10 text-[#ed7e0f] font-semibold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full transition-colors", pathname === subItem.href ? "bg-[#ed7e0f]" : "bg-gray-300 group-hover:bg-gray-400")} />
                        <span>{subItem.label}</span>
                      </AsyncLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Onglet Compte en bas */}
          <div className="p-4 border-t border-gray-100 flex flex-col gap-2 bg-gray-50/30">
            <AsyncLink
              to="/admin/account"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                pathname === "/admin/account"
                  ? "bg-gradient-to-r from-[#ed7e0f]/10 to-transparent text-[#ed7e0f] shadow-sm ring-1 ring-[#ed7e0f]/20"
                  : "text-gray-700 hover:bg-white hover:shadow-sm hover:text-gray-900"
              )}
            >
              <User className={cn("h-5 w-5", pathname === "/admin/account" ? "text-[#ed7e0f]" : "text-gray-400")} />
              <span>Compte</span>
            </AsyncLink>
            <Button variant="outline" className="w-full justify-start px-4 py-5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" /> Deconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}

