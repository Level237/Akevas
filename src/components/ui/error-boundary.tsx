import React from 'react';
import ErrorMessage from './error-message';
import Header from './header';

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

export default ErrorBoundary; 