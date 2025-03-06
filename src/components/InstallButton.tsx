import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInPwa, setIsInPwa] = useState(false);

    useEffect(() => {
        const checkIfInPwa = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isIosStandalone = (window.navigator as any).standalone;
            const isAndroidApp = document.referrer.includes('android-app://');
            setIsInPwa(isStandalone || isIosStandalone || isAndroidApp);
        };

        checkIfInPwa();

        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleChange = () => checkIfInPwa();

        if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
        } else if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        }

        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstalled(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

        const checkIfInstalled = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isIosStandalone = (window.navigator as any).standalone;
            const hasInstalledFlag = localStorage.getItem('appInstalled') === 'true';
            setIsInstalled(isStandalone || isIosStandalone || hasInstalledFlag);
        };

        checkIfInstalled();

        return () => {
            if (mediaQuery.removeListener) {
                mediaQuery.removeListener(handleChange);
            } else if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            }
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('Application installée avec succès');
                localStorage.setItem('appInstalled', 'true');
                setIsInstalled(true);
            }
        } catch (error) {
            console.error('Erreur lors de l\'installation:', error);
        }

        setDeferredPrompt(null);
    };

    const openInstalledApp = () => {
        // Tente d'ouvrir l'application en mode standalone
        const pwaUrl = window.location.origin; // URL de votre application
        window.open(pwaUrl, '_self'); // Ouvre l'application dans le même onglet
    };

    if (isInPwa) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#6e0a13] p-4 flex justify-between items-center z-50">
            <div className="text-white">
                <p className="font-medium">
                    {isInstalled ? "Accédez à l'application installée" : "Installez notre application"}
                </p>
                <p className="text-sm opacity-80">
                    {isInstalled ? "Ouvrir en plein écran" : "Accédez rapidement à nos services"}
                </p>
            </div>
            {isInstalled ? (
                <button
                    onClick={openInstalledApp}
                    className="bg-white text-[#6e0a13] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                    Voir l'application
                </button>
            ) : (
                <button
                    onClick={handleInstallClick}
                    className="bg-white text-[#6e0a13] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                    Installer
                </button>
            )}
        </div>
    );
};

export default InstallButton;
