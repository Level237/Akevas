import { Home, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween' }}
                        className="absolute top-0 left-0 bottom-0 w-64 bg-background"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <button onClick={onClose}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-1 p-4">
                            <Link className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2 text-[#ed7e0f] transition-all hover:text-[#ed7e0f]/90" to="/">
                                <Home className="h-4 w-4" />
                                Accueil
                            </Link>
                            {/* Copier les autres liens du sidebar desktop ici */}
                        </nav>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
} 