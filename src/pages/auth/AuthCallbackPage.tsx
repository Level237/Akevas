// src/pages/AuthCallback.jsx

import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  // NOTE : cookies n'a pas besoin d'être à l'extérieur

  useEffect(() => {
    // Le backend a posé les cookies HttpOnly sur le domaine
    // On redirige immédiatement vers la page de validation
    // La redirection doit être immédiate car le cookie est déjà posé.
    navigate('/authenticate', { replace: true });
  }, [navigate]);

  // Affiche un loader pendant le traitement du token
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center">
      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
        <span className="sr-only">Chargement...</span>
      </div>
      <p className="mt-4 text-gray-700">{status}</p>
    </section>
  );
};