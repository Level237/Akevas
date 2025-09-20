import React, { useEffect, useState } from 'react';
import ErrorMessage from '../ui/error-message';
import Header from '../ui/header';
import { WifiOff } from 'lucide-react';
import { useDispatch } from 'react-redux';

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
  

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // We don't reload the page. Instead, we let the app's components handle the recovery.
      // For example, you can dispatch an action to refetch data or simply let RTK Query's retry logic handle it.
      // A good practice would be to use a custom middleware in Redux to handle this.
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Use a state to track network status and potentially show an alert
  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#fff8f0] to-[#fff1e0] dark:from-[#2d1705] dark:to-[#1a0d03]">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-[#1a0d03] rounded-2xl shadow-[0_8px_30px_rgba(237,126,15,0.12)] dark:shadow-[0_8px_30px_rgba(237,126,15,0.08)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-8 rounded-full bg-[#fff8f0] dark:bg-[#2d1705] flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-[#ed7e0f]"/>
            </div>
            <h2 className="text-3xl font-bold text-[#ed7e0f] mb-4">
              Pas de connexion internet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Veuillez vérifier votre connexion. La page se mettra à jour automatiquement dès que la connexion sera rétablie.
            </p>
            {/* You can also add a manual retry button for the user */}
            <button
              onClick={() => window.location.reload()} // Optional: for a hard retry
              className="mt-4 px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#c96a0b] transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
export { NetworkBoundary };