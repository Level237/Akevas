import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInPwa, setIsInPwa] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    React.useEffect(() => {
        const checkIfInPwa = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isIosStandalone = (window.navigator as any).standalone;
            setIsInPwa(isStandalone || isIosStandalone);
        };

        checkIfInPwa();

        window.addEventListener('beforeinstallprompt', (e: Event) => {
            e.preventDefault();
            // Stocke l'événement pour une utilisation ultérieure
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstalled(false);
        });

        window.addEventListener('appinstalled', () => {
            // L'application a été installée avec succès
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', () => {});
            window.removeEventListener('appinstalled', () => {});
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            console.log('Pas de prompt d\'installation disponible');
            return;
        }

        try {
            // Déclenche l'invite d'installation
            await (deferredPrompt as BeforeInstallPromptEvent).prompt();
            
            // Attend la réponse de l'utilisateur
            const choiceResult = await (deferredPrompt as BeforeInstallPromptEvent).userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('Utilisateur a accepté l\'installation');
                setIsInstalled(true);
                setShowPrompt(false);
            } else {
                console.log('Utilisateur a refusé l\'installation');
            }
            
            // Réinitialise le prompt
            setDeferredPrompt(null);
        } catch (err) {
            console.error('Erreur lors de l\'installation:', err);
        }
    };

    // Ne montre pas le bouton si l'app est déjà installée ou si on est dans la PWA
    if (isInPwa || isInstalled || !deferredPrompt) return null;

    return (
        <>
            {/* Bouton flottant */}
            <motion.button
                whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -10, 10, -10, 0],
                    transition: {
                        duration: 0.3,
                        rotate: {
                            repeat: 0,
                            duration: 0.5
                        }
                    }
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPrompt(true)}
                className="fixed bottom-24 left-4 z-50 bg-[#6e0a13] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#8b0d19] flex items-center justify-center"
            >
                <motion.div
                    animate={{
                        y: [0, -3, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Download className="w-6 h-6" />
                </motion.div>
            </motion.button>

            {/* Modal d'installation */}
            <AnimatePresence>
                {showPrompt && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPrompt(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />

                        {/* Cart d'installation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-24 left-4 z-50 w-[280px]"
                        >
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-base font-medium text-gray-900">
                                            Installer l'application
                                        </h3>
                                        <button
                                            onClick={() => setShowPrompt(false)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-4">
                                        Profitez d'une meilleure expérience en installant notre application
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleInstallClick}
                                            className="flex-1 bg-[#ed7e0f] text-white px-4 py-2 text-sm rounded-xl font-medium hover:bg-[#ed7e0f]/90 transition-colors"
                                        >
                                            Installer
                                        </button>
                                        <button
                                            onClick={() => setShowPrompt(false)}
                                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Plus tard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default InstallButton;
