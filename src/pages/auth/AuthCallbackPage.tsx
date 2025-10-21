// src/pages/AuthCallback.jsx

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { toast } from 'sonner';

export const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Traitement de la connexion...');
  const isProcessed = useRef(false);
  // NOTE : cookies n'a pas besoin d'être à l'extérieur
  const cookies = new Cookies(); 

  useEffect(() => {

    if (isProcessed.current) {
      return; 
    }
    // 1. Déplacer la lecture des paramètres à l'intérieur du useEffect
    const params = new URLSearchParams(location.search); // Utiliser location.search pour la cohérence
    const token = params.get('token');
    
    // Gérer les erreurs (ex: token non fourni)
    if (!token) {
      toast.error("Échec de la connexion via Google. Token manquant.", { position: "bottom-center" });
      setStatus('Redirection vers la connexion...');
      cookies.remove('accessToken', { path: '/' }); // S'assurer de nettoyer en cas d'échec
      const timer = setTimeout(() => navigate('/login', { replace: true }), 2000);
      isProcessed.current = true; // Marquer comme traité même si en erreur
      return () => clearTimeout(timer); 
    }
    
    // 2. Stockage du Token Passport (Maintenant, le code s'exécute une seule fois au montage)
    try {
      setStatus('Authentification réussie. Préparation de la session...');
      
      // Stocke le token d'accès. Le cookie est défini UNIQUEMENT si le token est présent.
      // ⚠️ Assurez-vous d'utiliser `secure: false` si vous êtes en HTTP local
      
          const isLocal = window.location.protocol === "http:";
    const cookieOptions = { 
        path: '/', 
        secure: !isLocal, // true si HTTPS, false si HTTP (pour localhost)
        maxAge: 3600 * 24 * 7 // IMPORTANT : Garder le cookie pendant 7 jours
    };

    // Stocke le token d'accès.
    cookies.set('accessToken', token, cookieOptions);
      
      isProcessed.current = true;
      // 3. Redirection vers la page d'authentification existante
      // (Après que le cookie a été écrit avec succès)
      setStatus('Validation finale de la session...');
      navigate('/authenticate', { replace: true });

    } catch (error) {
      console.error("Erreur lors du stockage du token:", error);
      toast.error("Erreur critique de session.", { position: "bottom-center" });
      // Nettoyer le cookie en cas d'erreur grave
      cookies.remove('accessToken', { path: '/' }); 
      isProcessed.current = true;
      navigate('/login', { replace: true });
    }
    
  }, [location, navigate,isProcessed.current]); // Dépendances inchangées

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