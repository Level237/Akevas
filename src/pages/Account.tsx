import { useState } from 'react'
import TopBar from '@/components/ui/topBar'
import Header from '@/components/ui/header'
import MobileNav from '@/components/ui/mobile-nav'
import {
    User,
    MapPin,
    Phone,
    Mail,
    Settings,
    LogOut,
    Edit,
    Shield,
    Bell,
    Truck,
    Star,
    ChevronRight,
    Wallet,
    Clock,
    Award
} from 'lucide-react'

const Account = () => {
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+33 6 12 34 56 78',
        address: 'Paris, France',
        joinDate: 'Membre depuis Janvier 2024',
        avatar: '/path-to-avatar.jpg',
        rating: 4.8,
        totalDeliveries: 156,
        earnings: '1,250 €',
        status: 'Actif'
    }

    return (
        <div className="min-h-screen mb-20 bg-[#F8F9FC]">
            <TopBar />
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne de gauche - Profil */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="relative mb-4">
                                    <img
                                        src={user.avatar || 'https://via.placeholder.com/150'}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm"
                                    />
                                    <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                                        <Edit size={14} />
                                    </button>
                                </div>
                                <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">{user.joinDate}</p>
                                <div className="flex items-center justify-center mt-3">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="ml-1 text-gray-600">{user.rating}</span>
                                </div>
                            </div>

                            {/* Statistiques rapides */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <Truck className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                    <div className="text-lg font-semibold text-gray-800">
                                        {user.totalDeliveries}
                                    </div>
                                    <div className="text-xs text-gray-500">Livraisons</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <Wallet className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                    <div className="text-lg font-semibold text-gray-800">
                                        {user.earnings}
                                    </div>
                                    <div className="text-xs text-gray-500">Gains</div>
                                </div>
                            </div>

                            {/* Informations de contact */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{user.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne de droite - Menu et Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section Activités */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold">Activités récentes</h2>
                            </div>
                            <div className="divide-y">
                                <MenuItem
                                    icon={Clock}
                                    title="Livraisons en cours"
                                    subtitle="Voir vos livraisons actives"
                                    link="/active-deliveries"
                                />
                                <MenuItem
                                    icon={Truck}
                                    title="Historique des livraisons"
                                    subtitle="Consultez vos livraisons passées"
                                    link="/delivery-history"
                                />
                                <MenuItem
                                    icon={Award}
                                    title="Performances"
                                    subtitle="Vos statistiques et récompenses"
                                    link="/performance"
                                />
                            </div>
                        </div>

                        {/* Section Paramètres */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold">Paramètres</h2>
                            </div>
                            <div className="divide-y">
                                <MenuItem
                                    icon={User}
                                    title="Informations personnelles"
                                    subtitle="Modifier vos informations"
                                    link="/edit-profile"
                                />
                                <MenuItem
                                    icon={Bell}
                                    title="Notifications"
                                    subtitle="Gérer vos préférences"
                                    link="/notifications"
                                />
                                <MenuItem
                                    icon={Shield}
                                    title="Sécurité"
                                    subtitle="Mot de passe et authentification"
                                    link="/security"
                                />
                            </div>
                        </div>

                        {/* Bouton de déconnexion */}
                        <button className="w-full flex items-center justify-center gap-2 p-4 text-red-600 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>Se déconnecter</span>
                        </button>
                    </div>
                </div>
            </div>

            <MobileNav />
        </div>
    )
}

// Composant MenuItem réutilisable
const MenuItem = ({ icon: Icon, title, subtitle, link }: {
    icon: any,
    title: string,
    subtitle: string,
    link: string
}) => (
    <a href={link} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
                <h3 className="font-medium text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </a>
)

export default Account 