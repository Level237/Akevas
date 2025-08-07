import { useState } from 'react'
import { useGetUserQuery } from '@/services/auth'
import {
    Bell,
    CreditCard,
    Lock,
    Settings,
    ShoppingBag,
    User,
    Users,
    Building2,
    LayoutDashboard,
    Truck,
    Package,
    LogOut,
    Shield,
    Menu,
    X
} from 'lucide-react'
import { logoutUser } from '@/lib/logout'
import { useLogoutMutation } from '@/services/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AsyncLink from '@/components/ui/AsyncLink'

const AccountPage = () => {
    const { data: userData } = useGetUserQuery('Auth')
    console.log(userData)
    const [logout] = useLogoutMutation()
    const [activeTab, setActiveTab] = useState('account')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout('Auth')
        logoutUser()
    }

    const adminMenus = [
        {
            category: "Administration",
            items: [
                { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin/dashboard", description: "Vue d'ensemble de l'activité" },
                { icon: Users, label: "Utilisateurs", href: "/admin/users", description: "Gestion des comptes utilisateurs" },
                { icon: Building2, label: "Commerces", href: "/admin/shops", description: "Gestion des boutiques" },
                { icon: Truck, label: "Livreurs", href: "/admin/delivery", description: "Gestion des livreurs" },
                { icon: Package, label: "Commandes", href: "/admin/orders", description: "Suivi des commandes" },
            ]
        },
        {
            category: "Paramètres",
            items: [
                { icon: Shield, label: "Sécurité", href: "/admin/security", description: "Paramètres de sécurité" },
                { icon: Settings, label: "Configuration", href: "/admin/settings", description: "Configuration système" },
            ]
        }
    ]

    const userMenus = [
        {
            category: "Mon Compte",
            items: [
                { icon: User, label: "Profil", href: "/user/profile", description: "Gérer vos informations" },
                { icon: ShoppingBag, label: "Commandes", href: "/user/orders", description: "Historique des commandes" },
                { icon: Bell, label: "Notifications", href: "", description: "Centre de notifications" },
               
            ]
        },
        {
            category: "Sécurité",
            items: [
                { icon: Lock, label: "Mot de passe", href: "", description: "Modifier votre mot de passe" },
                { icon: Settings, label: "Préférences", href: "", description: "Paramètres du compte" },
            ]
        }
    ]

    const menus = userData?.role_id === 1 ? adminMenus : userMenus

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-[#ed7e0f] text-white">
                                    {userData?.userName?.charAt(0) || ''}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-xl font-semibold">{userData?.userName}</h1>
                                <p className="text-sm text-gray-500">
                                    {userData?.role_id === 1 ? "Administrateur" : "Utilisateur"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {menus.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {section.category}
                            </h2>
                            <div className="grid gap-4">
                                {section.items.map((item, itemIndex) => (
                                    <AsyncLink
                                        key={itemIndex}
                                        to={item.href}
                                        className={`group relative rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all ${activeTab === item.label.toLowerCase()
                                            ? 'ring-2 ring-[#ed7e0f]'
                                            : ''
                                            }`}
                                        OnClick={() => setActiveTab(item.label.toLowerCase())}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${activeTab === item.label.toLowerCase()
                                                ? 'bg-[#ed7e0f] text-white'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-[#ed7e0f]/10'
                                                }`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {item.label}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </AsyncLink>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Déconnexion */}
                    <div className="lg:col-span-3">
                        <button
                            onClick={handleLogout}
                            className="w-full mt-6 p-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage 