import React from 'react';
import { useCurrentSellerQuery } from '@/services/sellerService';

import {
    Store,
    User,
    Rocket,
    Bell,
    CreditCard,
    HelpCircle,
    ChevronRight,
    LogOut,
    Star,
    Wallet,
    Clock,
    Shield
} from 'lucide-react';
import { useLogoutMutation } from '@/services/auth';
import AsyncLink from '@/components/ui/AsyncLink';
import MobileNav from '@/components/ui/mobile-nav';
import { logoutUser } from '@/lib/logout';



const AccountPage: React.FC = () => {
    const { data: { data: seller } = {}, isLoading } = useCurrentSellerQuery('seller');
    const [logout] = useLogoutMutation()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ed7e0f]" />
            </div>
        );
    }

    const handleLogout = async () => {
        await logout('Auth');
        logoutUser()
    }
    return (
        <div className="max-w-2xl mx-auto px-4 pb-20">
            {/* Header avec Boost Button */}
            <div className="bg-gradient-to-r from-[#ed7e0f] to-[#ff8f1f] p-6 rounded-b-3xl mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl max-sm:text-md font-bold text-white">Mon Compte</h1>
                    <AsyncLink
                        to="/seller/pro"
                        className="bg-white  text-[#ed7e0f] px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                        <Rocket size={20} />
                        Booster ma boutique
                    </AsyncLink>
                </div>

                {/* Profil Summary */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white overflow-hidden">
                        <img
                            src={seller?.shop?.shop_profile || '/default-avatar.png'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white">
                        <h2 className="font-semibold text-lg">{seller?.shop?.shop_name}</h2>
                        <p className="text-white/80">{seller?.email}</p>
                    </div>
                </div>
            </div>

            {/* Boutique Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <div className="text-2xl font-bold text-[#ed7e0f]">{seller?.shop?.products_count || 0}</div>
                    <div className="text-sm text-gray-600">Produits</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <div className="text-2xl font-bold text-[#ed7e0f]">{seller?.shop?.orders_count || 0}</div>
                    <div className="text-sm text-gray-600">Commandes</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <div className="text-2xl font-bold text-[#ed7e0f]">{seller?.shop?.rating || '0.0'}</div>
                    <div className="text-sm text-gray-600">Note</div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {/* Boutique */}
                <section className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Ma Boutique</h3>
                    <div className="space-y-4">
                        <AsyncLink to="/shop-settings" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Store className="text-[#ed7e0f]" size={20} />
                                <span>Paramètres de la boutique</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                        <AsyncLink to="/shop-hours" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Clock className="text-[#ed7e0f]" size={20} />
                                <span>Horaires d'ouverture</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                        <AsyncLink to="/shop-reviews" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Star className="text-[#ed7e0f]" size={20} />
                                <span>Avis clients</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                    </div>
                </section>

                {/* Compte */}
                <section className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Mon Compte</h3>
                    <div className="space-y-4">
                        <AsyncLink to="/profile-settings" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <User className="text-[#ed7e0f]" size={20} />
                                <span>Informations personnelles</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                        <AsyncLink to="/notifications" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bell className="text-[#ed7e0f]" size={20} />
                                <span>Notifications</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                        <AsyncLink to="/payment-methods" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-[#ed7e0f]" size={20} />
                                <span>Moyens de paiement</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                    </div>
                </section>

                {/* Finance */}
                <section className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Finances</h3>
                    <div className="space-y-4">
                        <AsyncLink to="/wallet" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Wallet className="text-[#ed7e0f]" size={20} />
                                <span>Mon portefeuille</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                        <AsyncLink to="/transactions" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Clock className="text-[#ed7e0f]" size={20} />
                                <span>Historique des transactions</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                    </div>
                </section>

                {/* Aide & Sécurité */}
                <section className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Aide & Sécurité</h3>
                    <div className="space-y-4">
                        <AsyncLink to="/help" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="text-[#ed7e0f]" size={20} />
                                <span>Centre d'aide</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                        <AsyncLink to="/security" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="text-[#ed7e0f]" size={20} />
                                <span>Sécurité du compte</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </AsyncLink>
                    </div>
                </section>

                {/* Déconnexion */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>

            {/* Navigation Mobile */}
            <MobileNav />
        </div>
    );
};

export default AccountPage; 