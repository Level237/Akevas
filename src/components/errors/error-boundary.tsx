import React, { useEffect, useState } from 'react';
import ErrorMessage from '../ui/error-message';
import Header from '../ui/header';
import { WifiOff } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Vous pouvez envoyer l'erreur à un service de logging ici
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue s'est produite";
      
      // Personnalisation des messages d'erreur selon le type d'erreur
      if (this.state.error?.message.includes('store is not defined')) {
        errorMessage = "Erreur de chargement des données de la boutique";
      } else if (this.state.error?.message.includes('Unexpected Application Error')) {
        errorMessage = "Une erreur inattendue s'est produite dans l'application";
      }

      return (
        <>
        
        <Header />
        <ErrorMessage 
          message={errorMessage}
          onRetry={() => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
          }}
       
       
        />
         </>
      );
    }

    return this.props.children;
  }
}

const NetworkBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasInternet, setHasInternet] = useState(true);
  const [checking, setChecking] = useState(false);

  // Fonction pour tester la connexion internet réelle
  const checkInternet = async () => {
    setChecking(true);
    try {
      // On ping un serveur fiable (Cloudflare ici, tu peux mettre ton backend)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      await fetch("https://1.1.1.1/cdn-cgi/trace", { signal: controller.signal });
      clearTimeout(timeout);
      setHasInternet(true);
    } catch {
      setHasInternet(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Vérifie à l'initialisation et à chaque changement d'état réseau
    checkInternet();
    const handleOnline = () => {
      setIsOnline(true);
      checkInternet();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setHasInternet(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Ping toutes les 15 secondes si online
    let interval: NodeJS.Timeout | null = null;
    if (isOnline) {
      interval = setInterval(checkInternet, 15000);
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (interval) clearInterval(interval);
    };
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#fff8f0] to-[#fff1e0] dark:from-[#2d1705] dark:to-[#1a0d03]">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-[#1a0d03] rounded-2xl shadow-[0_8px_30px_rgba(237,126,15,0.12)] dark:shadow-[0_8px_30px_rgba(237,126,15,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-8 rounded-full bg-[#fff8f0] dark:bg-[#2d1705] flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-[#ed7e0f]" />
            </div>
            <h2 className="text-3xl font-bold text-[#ed7e0f] mb-4">
              Pas de connexion internet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Veuillez vérifier votre connexion. La page se rechargera automatiquement dès que la connexion sera rétablie.
            </p>
            <div className="mt-8 flex space-x-2">
              <div className="w-3 h-3 bg-[#ed7e0f] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#ed7e0f] rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 bg-[#ed7e0f] rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isOnline && !hasInternet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#fff8f0] to-[#fff1e0] dark:from-[#2d1705] dark:to-[#1a0d03]">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-[#1a0d03] rounded-2xl shadow-[0_8px_30px_rgba(237,126,15,0.12)] dark:shadow-[0_8px_30px_rgba(237,126,15,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-8 rounded-full bg-[#fff8f0] dark:bg-[#2d1705] flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-[#ed7e0f]" />
            </div>
            <h2 className="text-3xl font-bold text-[#ed7e0f] mb-4">
              Connexion instable ou sans internet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Vous êtes connecté à un réseau (WiFi ou autre), mais il n'y a pas d'accès internet stable.<br />
              Merci de vérifier votre connexion ou de changer de réseau.
            </p>
            {checking && <div className="mt-4 text-[#ed7e0f]">Vérification de la connexion...</div>}
            <div className="mt-8 flex space-x-2">
              <div className="w-3 h-3 bg-[#ed7e0f] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#ed7e0f] rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 bg-[#ed7e0f] rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
export { NetworkBoundary };