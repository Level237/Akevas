import{ useEffect } from 'react';
import { Outlet,useLocation } from 'react-router-dom';

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Option 1: Défilement simple au sommet de la page
    // window.scrollTo(0, 0);

    // Option 2: Défilement doux (smooth scroll)
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}, [pathname]);

  return (
    <div>
        
      {/* Vos éléments de layout (header, footer, etc.) */}
      <Outlet /> {/* Les routes enfants seront rendues ici */}
    </div>
  );
}