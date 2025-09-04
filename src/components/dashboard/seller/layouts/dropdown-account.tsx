import { motion, AnimatePresence } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"
import { Package, ChevronRight, LogOut, User, Store } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AsyncLink from "@/components/ui/AsyncLink"
import { useLogoutMutation } from "@/services/auth"
import { logoutUser } from "@/lib/logout"
import { Seller } from "@/types/seller"

const DropdownAccount = ({ children, sellerData }: { children: React.ReactNode, sellerData: Seller | null | undefined }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [logout] = useLogoutMutation()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleLogout = async () => {
        await logout('Auth');
        logoutUser()
    }

    const menuItems = [
        { icon: Store, text: "Tableau de bord", href: `/seller/dashboard`, disabled: !sellerData?.isSeller },
        { icon: Package, text: "Mes produits", href: "/seller/products", disabled: sellerData?.isSeller },
        { icon: Package, text: "Mes commandes", href: "/orders", disabled: sellerData?.isSeller },
    ]

    const settingsItems = [
        { icon: User, text: "Mon profil", href: "/account" },
    ]

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, 150) // Délai de 150ms pour éviter la fermeture accidentelle
    }

    // Nettoyer le timeout quand le composant se démonte
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    // Fermer le dropdown si on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative z-[999999]" ref={dropdownRef}>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Header avec infos boutique */}

                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ed7e0f] to-[#f19b45] flex items-center justify-center text-white font-semibold">
                                        {sellerData?.firstName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{sellerData?.shop?.shop_name}</p>
                                        <p className="text-xs text-gray-500">{sellerData?.email}</p>
                                    </div>
                                </div>
                                {sellerData?.isSeller == 1 && (
                                    <AsyncLink to={`/shop/${sellerData?.shop?.shop_id}`}>
                                        <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/80 text-sm">
                                            Voir ma boutique
                                        </Button>
                                    </AsyncLink>
                                )}
                            </div>

                            {/* Menu principal */}
                            <div className="py-2">
                                <div className="px-4 py-2 text-xs font-medium text-gray-500">
                                    Navigation
                                </div>
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <AsyncLink to={item.href} className={!item.disabled ? 'hidden' : ''}>
                                            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-4 w-4 text-gray-500" />
                                                    {item.text}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </AsyncLink>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Réglages */}
                            <div className="border-t border-gray-100 pt-2">
                                <div className="px-4 py-2 text-xs font-medium text-gray-500">
                                    Réglages
                                </div>
                                {settingsItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (menuItems.length + index) * 0.05 }}
                                    >
                                        <AsyncLink to={item.href}>
                                            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-4 w-4 text-gray-500" />
                                                    {item.text}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </AsyncLink>
                                    </motion.div>
                                ))}

                                {/* Déconnexion */}
                                <motion.button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (menuItems.length + settingsItems.length) * 0.05 }}
                                >
                                    <LogOut className="h-4 w-4 mr-3" />
                                    Se déconnecter
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

DropdownAccount.displayName = 'DropdownAccount';
export default React.memo(DropdownAccount);
