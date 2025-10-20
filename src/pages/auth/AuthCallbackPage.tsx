// src/pages/AuthCallback.jsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { toast } from 'sonner';

export const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Traitement de la connexion...');

  useEffect(() => {
    // 1. Analyser les paramètres d'URL (envoyés par l'API Laravel)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const roleId = params.get('role_id');
    
    // Gérer les erreurs (ex: token non fourni)
    if (!token) {
      toast.error("Échec de la connexion via Google.", { position: "bottom-center" });
      setStatus('Redirection vers la connexion...');
      // Redirige vers la page de login en cas d'erreur
      const timer = setTimeout(() => navigate('/login', { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
    
    // 2. Stockage du Token Passport
    try {
      setStatus('Authentification réussie. Préparation de la session...');
      const cookies = new Cookies();
      
      // Stocke le token d'accès dans les cookies pour qu'il soit lu par RTK Query ou votre logique de cookies
      cookies.set('accessToken', token, { path: '/', secure: true, maxAge: 3600 * 24 * 7 }); // Ex: 7 jours
      
      // Optionnel : stocker le rôle ou d'autres infos temporaires si nécessaire
      if (roleId) {
        switch (roleId) {
            case "1":
                navigate('/admin/dashboard');
                break;
            case "2":
                navigate('/seller/dashboard');
                break;
            case "3":
                navigate('/user/dashboard');
                break;
            case "4":
                navigate('/delivery/dashboard');
                break;
            default:
                // Cas par défaut si le rôle n'est pas reconnu
                navigate('/login');
                break;
        }
      }

      // 3. Redirection vers la page d'authentification existante
      // L'AuthenticatePage va lire le nouveau cookie 'accessToken' et déclencher useGetUserQuery.
      setStatus('Validation finale de la session...');
     

    } catch (error) {
      console.error("Erreur lors du stockage du token:", error);
      toast.error("Erreur critique de session.", { position: "bottom-center" });
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

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