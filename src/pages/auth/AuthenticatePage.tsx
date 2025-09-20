import { useGetUserQuery } from "@/services/auth";
import { AppDispatch } from "@/store";
import { setUserRole } from "@/store/authSlice";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"

export const AuthenticatePage = () => {


     // Déclenche la requête pour obtenir les données de l'utilisateur
     const { data: userData, isLoading, isSuccess } = useGetUserQuery('Auth');
    
     const navigate = useNavigate();
     const dispatch = useDispatch();
 
     useEffect(() => {
         // La logique de redirection se déclenche UNIQUEMENT quand la requête est réussie et n'est plus en chargement
         if (!isLoading && isSuccess) {
             const userRole = userData?.role_id;
             
             // Stocke le rôle dans le store Redux et le cookie
             dispatch(setUserRole(userRole));
             
             // Redirection immédiate basée sur le rôle
             switch (userRole) {
                 case 1:
                     // window.location.href est lent, utiliser navigate à la place.
                     // navigate('/admin/dashboard'); 
                     // Pour le cas de l'admin, si la page est dans un contexte de gestion à part, une redirection hard-refresh peut être acceptable,
                     // mais il est préférable de rester dans le contexte React.
                     navigate('/admin/dashboard');
                     break;
                 case 2:
                     navigate('/seller/dashboard');
                     break;
                 case 3:
                     navigate('/user/dashboard');
                     break;
                 case 4:
                     navigate('/delivery/dashboard');
                     break;
                 default:
                     // Cas par défaut si le rôle n'est pas reconnu
                     navigate('/login');
                     break;
             }
         }
     }, [isLoading, isSuccess, userData, dispatch, navigate]); // Les dépendances de l'effet sont à jour
 
     // Affiche un spinner UNIQUEMENT tant que la requête est en cours
     if (isLoading) {
         return (
             <section className="h-screen w-full flex flex-col items-center justify-center">
                 <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                     <span className="sr-only">Chargement...</span>
                 </div>
             </section>
         );
     }
     
     // Si la requête a échoué, on peut rediriger vers la page de connexion
     if (!isLoading && !isSuccess) {
         navigate('/login', { replace: true });
     }
 
     // Un retour par défaut au cas où
     return null;
}